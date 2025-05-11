from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Configuración de la base de datos
    DATABASE_URL: str = "sqlite:///./app.db"

    # Configuración de seguridad
    SECRET_KEY: str = "tu_clave_secreta_aqui"  # Cambiar en producción
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Configuración del modelo
    MODEL_PATH: str = str(Path(__file__).parent / "models" / "keras_model.h5")
    CLASS_NAMES: list[str] = ["Sanas", "Coriza", "Gumboro", "Newcastle", "Bronquitis"]

    # Agregado para OpenRouter
    OPENROUTER_API_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()

# Exportar variables directamente para compatibilidad
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
DATABASE_URL = settings.DATABASE_URL
MODEL_PATH = settings.MODEL_PATH
CLASS_NAMES = settings.CLASS_NAMES
