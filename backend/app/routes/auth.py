import bcrypt
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.models.user import User
from app.services.auth import authenticate_user, create_access_token, get_current_user, get_db
from app.schemas.auth import RegisterRequest, Token, UserOut
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()
@router.post("/auth", summary="Obtener token de autenticación", response_model=Token)
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=401, detail="Nombre de usuario o contraseña incorrectos")
    expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user.username},
        expires_delta=expires
    )
    # Seteamos la cookie HTTP-only para envíos automáticos
    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        samesite="lax"
    )
    return {"access_token": token, "token_type": "bearer"}


@router.post("/register", response_model=Token)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # Verificar si ya existe
    existing_user = db.query(User).filter(User.username == data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El usuario ya existe")

    hashed_password = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    new_user = User(
        username=data.username,
        full_name=data.full_name,
        hashed_password=hashed_password,
        email=data.email,
        telefono=data.telefono,
        direccion=data.direccion,
        rol=data.rol
    )
    db.add(new_user)
    db.commit()

    access_token = create_access_token(data={"sub": data.username})
    return {"access_token": access_token, "token_type": "bearer"}
@router.get("/me", response_model=UserOut, summary="Obtener datos del usuario autenticado")
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user
