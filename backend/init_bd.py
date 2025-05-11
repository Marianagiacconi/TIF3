from sqlalchemy import create_engine
from app.core.database import Base
from app.models.user import User
from app.models.diagnosis import Diagnosis
from app.models.refresh_token import RefreshToken
import os

DATABASE_URL = "sqlite:///./app.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Eliminar la base de datos existente si existe
if os.path.exists("app.db"):
    os.remove("app.db")
    print("Base de datos anterior eliminada.")

# Crear todas las tablas
Base.metadata.create_all(bind=engine)

print("Base de datos y tablas creadas correctamente.")
