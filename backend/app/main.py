from fastapi import FastAPI
from app.routes import image, auth
import logging
import os
import app.models
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, image

# Crear carpetas necesarias
os.makedirs("logs", exist_ok=True)

# Configuración de logging
logging.basicConfig(
    filename="logs/backend.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

app = FastAPI(
    title="FarmEye Backend",
    description="API para analizar imágenes de gallinas y detectar enfermedades visibles.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],  # o '*' si prefieres durante desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(image.router)
