from app.core.database import Base, engine

# Si necesitas inicializar la base de datos, puedes hacerlo aquí
# Base.metadata.create_all(bind=engine)


def init_db():
    # Eliminar todas las tablas existentes
    Base.metadata.drop_all(bind=engine)

    # Crear todas las tablas
    Base.metadata.create_all(bind=engine)

    print("Base de datos inicializada correctamente")


if __name__ == "__main__":
    init_db()
