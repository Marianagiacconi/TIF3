import logging
import traceback
from datetime import timedelta

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.config import settings
from app.core.database import get_db
from app.models.refresh_token import RefreshToken
from app.models.user import User as UserModel
from app.schemas.auth import RefreshRequest, Token, UserCreate, UserOut
from app.services.auth import authenticate_user, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    Registra un nuevo usuario.
    """
    try:
        # Verificar si el usuario ya existe
        db_user = db.query(UserModel).filter(UserModel.username == user.username).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El nombre de usuario ya está en uso",
            )

        # Verificar si el email ya está en uso
        db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="El email ya está en uso"
            )

        # Hashear la contraseña
        hashed_password = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())

        # Crear nuevo usuario
        user_data = user.dict()
        user_data.pop("password")  # Remover la contraseña sin hashear
        user_data["hashed_password"] = hashed_password.decode(
            "utf-8"
        )  # Añadir la contraseña hasheada

        new_user = UserModel(**user_data)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        logging.info(f"Usuario registrado exitosamente: {new_user.username}")
        return new_user

    except HTTPException as he:
        raise he
    except Exception as e:
        error_msg = f"Error en registro: {str(e)}\n{traceback.format_exc()}"
        logging.error(error_msg)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_msg)


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Autentica un usuario y devuelve un token de acceso (formulario OAuth2).
    """
    try:
        user = authenticate_user(form_data.username, form_data.password, db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        # Crear refresh token
        refresh_token = RefreshToken(user_id=user.id)
        db.add(refresh_token)
        db.commit()

        logging.info(f"Login exitoso para usuario: {user.username}")
        return {
            "access_token": access_token,
            "refresh_token": str(refresh_token.token),
            "token_type": "bearer",
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        error_msg = f"Error en login: {str(e)}\n{traceback.format_exc()}"
        logging.error(error_msg)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_msg)


@router.post("/login/json", response_model=Token)
async def login_json(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Autentica un usuario y devuelve un token de acceso (JSON).
    """
    try:
        user = authenticate_user(login_data.username, login_data.password, db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        # Crear refresh token
        refresh_token = RefreshToken(user_id=user.id)
        db.add(refresh_token)
        db.commit()

        logging.info(f"Login exitoso para usuario: {user.username}")
        return {
            "access_token": access_token,
            "refresh_token": str(refresh_token.token),
            "token_type": "bearer",
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        error_msg = f"Error en login: {str(e)}\n{traceback.format_exc()}"
        logging.error(error_msg)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_msg)


@router.post("/refresh", response_model=Token)
def refresh_token(body: RefreshRequest, db: Session = Depends(get_db)):
    try:
        logging.info("Intento de refresh token")

        # Validate refresh token
        token_row = db.query(RefreshToken).filter_by(token=body.refresh_token).first()
        if not token_row:
            logging.warning("Refresh token inválido")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token inválido"
            )

        # Create new access token
        new_access = create_access_token(
            {"sub": token_row.user.username},
            timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        logging.info(f"Token refrescado exitosamente para usuario: {token_row.user.username}")
        return {
            "access_token": new_access,
            "refresh_token": body.refresh_token,
            "token_type": "bearer",
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        error_msg = f"Error en refresh token: {str(e)}\n{traceback.format_exc()}"
        logging.error(error_msg)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_msg)


@router.get("/me", response_model=UserOut)
def me(current_user: UserModel = Depends(get_current_user)):
    try:
        logging.info(f"Obteniendo datos de usuario: {current_user.username}")
        return current_user
    except HTTPException as he:
        raise he
    except Exception as e:
        error_msg = f"Error obteniendo datos de usuario: {str(e)}\n{traceback.format_exc()}"
        logging.error(error_msg)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_msg)


class UpdateProfileRequest(BaseModel):
    full_name: str
    email: EmailStr
    telefono: str
    direccion: str


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str


@router.put("/users/me", response_model=UserOut)
def update_profile(
    profile: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    """
    Actualiza el perfil del usuario autenticado.
    """
    try:
        # Obtener el usuario actual de la base de datos
        db_user = db.query(UserModel).filter(UserModel.id == current_user.id).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado"
            )

        # Verificar si el email ya está en uso por otro usuario
        if profile.email != db_user.email:
            existing_user = (
                db.query(UserModel)
                .filter(UserModel.email == profile.email, UserModel.id != db_user.id)
                .first()
            )
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail="El email ya está en uso"
                )

        # Actualizar datos
        db_user.full_name = profile.full_name
        db_user.email = profile.email
        db_user.telefono = profile.telefono
        db_user.direccion = profile.direccion

        db.commit()
        db.refresh(db_user)

        logging.info(f"Perfil actualizado para usuario: {db_user.username}")
        return db_user

    except HTTPException as he:
        raise he
    except Exception as e:
        error_msg = f"Error actualizando perfil: {str(e)}\n{traceback.format_exc()}"
        logging.error(error_msg)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_msg)


@router.post("/change-password")
def change_password(
    password_data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    """
    Cambia la contraseña del usuario autenticado.
    """
    try:
        # Verificar contraseña actual
        if not bcrypt.checkpw(
            password_data.old_password.encode("utf-8"), current_user.hashed_password.encode("utf-8")
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Contraseña actual incorrecta"
            )

        # Hashear nueva contraseña
        new_hashed_password = bcrypt.hashpw(
            password_data.new_password.encode("utf-8"), bcrypt.gensalt()
        )

        # Actualizar contraseña
        current_user.hashed_password = new_hashed_password.decode("utf-8")
        db.commit()

        logging.info(f"Contraseña actualizada para usuario: {current_user.username}")
        return {"message": "Contraseña actualizada exitosamente"}

    except HTTPException as he:
        raise he
    except Exception as e:
        error_msg = f"Error cambiando contraseña: {str(e)}\n{traceback.format_exc()}"
        logging.error(error_msg)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_msg)
