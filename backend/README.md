# 🐔 FarmEye Backend

FarmEye es un sistema de backend desarrollado como parte de mi tesis de Ingeniería de Sistemas en la Universidad de Mendoza. Su objetivo es analizar imágenes de gallinas ponedoras para detectar signos clínicos de enfermedad visibles, utilizando procesamiento asincrónico, autenticación segura y arquitectura modular lista para integrar modelos de inteligencia artificial.

Este repositorio contiene la API principal del proyecto, desarrollada con **FastAPI**, y diseñada para escalar fácilmente en entornos distribuidos.

---

## 🛠️ Recomendaciones futuras

- Reemplazar `fake_user_db` por un sistema real de autenticación con **SQLAlchemy** y contraseñas encriptadas con **bcrypt**.
- Guardar `SECRET_KEY` y otras variables sensibles como **variables de entorno** en lugar de tenerlas hardcodeadas.
- Implementar configuración avanzada usando **Pydantic Settings** o **Dynaconf**, ideal para entornos de desarrollo, testing y producción.
- Desacoplar lógica en módulos más específicos, como `routes/`, `services/`, `schemas/`, para mayor escalabilidad y mantenibilidad.

## ⚙️ Tecnologías utilizadas

- **FastAPI** · Framework principal para la construcción de APIs web modernas y asincrónicas.
- **Python 3.10+** · Lenguaje de programación base del proyecto.
- **JWT (OAuth2)** · Autenticación segura mediante tokens.
- **BackgroundTasks** · Procesamiento en segundo plano de cargas de imágenes.
- **Logging** · Registro estructurado de eventos en archivos de log.
- **Docker (opcional)** · Preparado para contenedores y despliegue reproducible.
- **Pydantic** · Validación de datos y manejo de modelos.

## 📦 Instalación y ejecución

1. Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/farmeye_backend.git
cd farmeye_backend
```

2. Crea un entorno virtual:

```bash
python -m venv venv
source venv/bin/activate  # En Linux/macOS
venv\Scripts\activate   # En Windows
```

3. Instala las dependencias:

```bash
pip install -r requirements.txt
```

4. Ejecuta el servidor:

```bash
uvicorn app.main:app --reload
```

> Accede a la documentación interactiva de la API en `http://localhost:8000/docs`
