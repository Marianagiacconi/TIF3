from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AnalisisResultado(BaseModel):
    """Modelo para resultados rápidos de análisis sin guardar en BD"""

    resultado: str
    confianza: float
    archivo: str
    timestamp: datetime


class DiagnosticoOut(BaseModel):
    """Modelo para diagnósticos guardados en BD"""

    id: int
    resultado: str
    recomendacion: str
    archivo: str
    sintomas: str
    timestamp: datetime
    user_id: int

    model_config = ConfigDict(from_attributes=True)
