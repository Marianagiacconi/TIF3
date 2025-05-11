from fastapi import status


def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpass123",
            "full_name": "New User",
            "telefono": "987654321",
            "direccion": "New Address",
        },
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "new@example.com"
    assert "id" in data


def test_register_duplicate_username(client, test_user):
    response = client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "another@example.com",
            "password": "newpass123",
            "full_name": "Another User",
            "telefono": "987654321",
            "direccion": "New Address",
        },
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_login_success(client, test_user):
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpass123"})
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, test_user):
    response = client.post("/auth/login", data={"username": "testuser", "password": "wrongpass"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_refresh_token(client, test_user):
    # Primero login para obtener refresh token
    login_response = client.post(
        "/auth/login", data={"username": "testuser", "password": "testpass123"}
    )
    refresh_token = login_response.json()["refresh_token"]

    # Usar refresh token
    response = client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_get_current_user(authorized_client, test_user):
    response = authorized_client.get("/auth/users/me")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["username"] == test_user.username
    assert data["email"] == test_user.email


def test_update_profile(authorized_client, test_user):
    response = authorized_client.put(
        "/auth/users/me",
        json={
            "full_name": "Updated Name",
            "email": "updated@example.com",
            "telefono": "999999999",
            "direccion": "Updated Address",
        },
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["full_name"] == "Updated Name"
    assert data["email"] == "updated@example.com"
    assert data["telefono"] == "999999999"
    assert data["direccion"] == "Updated Address"


def test_change_password(authorized_client, test_user):
    response = authorized_client.post(
        "/auth/change-password", json={"old_password": "testpass123", "new_password": "newpass123"}
    )
    assert response.status_code == status.HTTP_200_OK

    # Verificar que el nuevo password funciona
    login_response = authorized_client.post(
        "/auth/login", data={"username": "testuser", "password": "newpass123"}
    )
    assert login_response.status_code == status.HTTP_200_OK
