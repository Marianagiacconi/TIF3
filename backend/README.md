# 🐔 FarmEye Backend

Diagnóstico inteligente de salud de gallinas ponedoras a partir de imágenes y síntomas, con recomendaciones expertas generadas por IA.

## 🚀 Descripción
Este backend permite:
- Registro y autenticación de usuarios.
- Análisis de imágenes de gallinas para diagnóstico automático.
- Recomendaciones veterinarias generadas por IA (OpenRouter/Mistral-7B).
- Historial de diagnósticos y descarga de reportes en PDF.
- Actualización de perfil y cambio de contraseña.
- API documentada y testeada profesionalmente.

## 🛠️ Instalación

### Opción 1: Instalación Local
1. Clona el repositorio y entra al directorio:
   ```bash
   git clone <repo_url>
   cd backend
   ```
2. Crea un entorno virtual e instala dependencias:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Crea un archivo `.env` con tu clave de OpenRouter:
   ```env
   OPENROUTER_API_KEY=sk-xxxxxx
   ```
4. Inicializa la base de datos (opcional):
   ```bash
   python app/init_db.py
   ```
5. Ejecuta el servidor:
   ```bash
   uvicorn app.main:app --reload
   ```

### Opción 2: Usando Docker (Recomendado)
1. Asegúrate de tener Docker y Docker Compose instalados.
2. Crea un archivo `.env` con tu clave de OpenRouter:
   ```env
   OPENROUTER_API_KEY=sk-xxxxxx
   ```
3. Construye y ejecuta los contenedores:
   ```bash
   docker-compose up --build
   ```
   La aplicación estará disponible en `http://localhost:8000`

## 📚 Uso de la API
- Documentación interactiva: [http://localhost:8000/docs](http://localhost:8000/docs)
- Redoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Endpoints principales
- `POST /auth/register` — Registro de usuario
- `POST /auth/login` — Login y obtención de tokens
- `POST /api/scan` — Analizar imagen y síntomas
- `GET /api/analyses` — Historial paginado
- `GET /api/analyses/{id}/pdf` — Descargar diagnóstico en PDF
- `PUT /auth/users/me` — Actualizar perfil
- `POST /auth/change-password` — Cambiar contraseña

### Ejemplo de análisis de imagen
```bash
curl -X POST "http://localhost:8000/api/scan" \
  -H "Authorization: Bearer <token>" \
  -F "file=@ruta/a/imagen.jpg" \
  -F "sintomas=[\"fiebre\",\"fatiga\"]"
```

## 🧪 Tests y chequeos de calidad
- Ejecuta todos los tests y chequeos:
  ```bash
  ./scripts/check.sh
  ```
- Tests unitarios y de integración con pytest.
- Chequeo de formato (black), imports (isort), estilo (flake8) y tipos (mypy).

## 📁 Estructura del proyecto
- `app/` — Código principal (modelos, rutas, servicios)
- `tests/` — Tests automáticos
- `scripts/` — Utilidades y chequeos
- `requirements.txt` — Dependencias
- `Dockerfile` — Configuración de Docker
- `docker-compose.yml` — Orquestación de servicios

## 👨‍💻 Créditos
Desarrollado por Marian y colaboradores.

---
¡Contribuciones y sugerencias son bienvenidas!
