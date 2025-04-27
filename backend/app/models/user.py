from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base 

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String, nullable=False)
    disabled = Column(Boolean, default=False)
    email = Column(String, unique=True, index=True)
    telefono = Column(String)
    direccion = Column(String)
    rol = Column(String, default="usuario")

    diagnosticos = relationship("Diagnosis", back_populates="user", cascade="all, delete-orphan")

from app.models.diagnosis import Diagnosis  
