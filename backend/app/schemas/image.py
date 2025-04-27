from datetime import datetime
from pydantic import BaseModel

class AnalisisResultado(BaseModel):
    resultado: str
    archivo: str

class DiagnosticoOut(BaseModel):
    resultado: str
    recomendacion: str
    archivo: str
    sintomas: str
    timestamp: datetime
