from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Diagnosis(Base):
    __tablename__ = "diagnosis"

    id = Column(Integer, primary_key=True, index=True)
    resultado = Column(String)
    recomendacion = Column(Text)
    archivo = Column(String)
    sintomas = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    diagnosis_metadata = Column(Text)  # Campo para almacenar estadísticas y metadatos

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="diagnoses")
