from pathlib import Path

import pytest
from fastapi import status


@pytest.fixture
def test_image():
    # Crear una imagen de prueba
    image_path = Path("temp_images/test_image.jpg")
    image_path.parent.mkdir(exist_ok=True)

    # Crear una imagen simple de 100x100 píxeles
    from PIL import Image

    img = Image.new("RGB", (100, 100), color="white")
    img.save(image_path)

    yield str(image_path)

    # Limpiar después de la prueba
    if image_path.exists():
        image_path.unlink()


def test_scan_image(authorized_client, test_image):
    with open(test_image, "rb") as f:
        response = authorized_client.post(
            "/api/scan",
            files={"file": ("test_image.jpg", f, "image/jpeg")},
            data={"sintomas": ["[]"]},
        )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "id" in data
    assert "resultado" in data
    assert "recomendacion" in data
    assert "filename" in data
    assert "sintomas" in data
    assert "timestamp" in data
    assert "user_id" in data


def test_scan_image_no_file(authorized_client):
    response = authorized_client.post("/api/scan", files={}, data={"sintomas": ["[]"]})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_scan_image_invalid_file(authorized_client):
    response = authorized_client.post(
        "/api/scan",
        files={"file": ("test.txt", b"not an image", "text/plain")},
        data={"sintomas": ["[]"]},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_get_analyses(authorized_client, test_user):
    response = authorized_client.get("/api/analyses")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "total" in data
    assert "page" in data
    assert "limit" in data
    assert "total_pages" in data
    assert "items" in data


def test_get_analyses_pagination(authorized_client):
    # Probar diferentes páginas y límites
    response = authorized_client.get("/api/analyses?page=1&limit=5")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data["items"]) <= 5


def test_get_analysis_detail(authorized_client, test_user):
    # Primero crear un análisis
    with open("temp_images/test_image.jpg", "rb") as f:
        scan_response = authorized_client.post(
            "/api/scan",
            files={"file": ("test_image.jpg", f, "image/jpeg")},
            data={"sintomas": ["[]"]},
        )

    analysis_id = scan_response.json()["id"]

    # Obtener detalles del análisis
    response = authorized_client.get(f"/api/analyses/{analysis_id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == analysis_id
    assert "resultado" in data
    assert "recomendacion" in data
    assert "filename" in data
    assert "sintomas" in data
    assert "timestamp" in data
    assert "user_id" in data


def test_get_analysis_pdf(authorized_client, test_user):
    # Primero crear un análisis
    with open("temp_images/test_image.jpg", "rb") as f:
        scan_response = authorized_client.post(
            "/api/scan",
            files={"file": ("test_image.jpg", f, "image/jpeg")},
            data={"sintomas": ["[]"]},
        )

    analysis_id = scan_response.json()["id"]

    # Obtener PDF del análisis
    response = authorized_client.get(f"/api/analyses/{analysis_id}/pdf")
    assert response.status_code == status.HTTP_200_OK
    assert response.headers["content-type"] == "application/pdf"
    assert "attachment" in response.headers["content-disposition"]


def test_get_nonexistent_analysis(authorized_client):
    response = authorized_client.get("/api/analyses/99999")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_analysis_unauthorized(client):
    response = client.get("/api/analyses/1")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
