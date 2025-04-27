from sqlalchemy import create_engine
from app.models.user import Base

DATABASE_URL = "sqlite:///./farmeye.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

Base.metadata.create_all(bind=engine)

print("Base de datos y tabla 'users' creadas correctamente.")
