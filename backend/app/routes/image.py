from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks, HTTPException, Depends
from sqlalchemy.orm import Session
import os, shutil, time, json, logging, random

from app.schemas.image import AnalisisResultado
from app.services.diagnosis import guardar_diagnostico, ajustar_diagnostico
from app.services.auth import get_current_user, get_db
from app.models.user import User
from fastapi import Depends
from sqlalchemy.orm import Session
from typing import List
from app.models.diagnosis import Diagnosis
from app.schemas.image import DiagnosticoOut


router = APIRouter()

os.makedirs("temp_images", exist_ok=True)

@router.post("/analizar-imagen", response_model=AnalisisResultado, summary="Analizar imagen de gallina para detectar enfermedad")
async def analizar_imagen(
    file: UploadFile = File(...),
    sintomas: str = Form("[]"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    try:
        # Guardar imagen
        timestamp = int(time.time())
        image_path = f"temp_images/{timestamp}_{file.filename}"
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Simulación IA (reemplazar con modelo real en el futuro)
        prediccion_ia = random.choice([
            "Sana",
            "Sospechosa (coriza)",
            "Sospechosa (deshidratación)",
            "Sospechosa (viruela aviar)",
            "Sospechosa (lesión dérmica)"
        ])

        # Decodificar síntomas
        lista_sintomas = json.loads(sintomas)

        # Ajustar el diagnóstico
        resultado_final = ajustar_diagnostico(prediccion_ia, lista_sintomas)

        # Guardar todo en la base de datos
        diagnostico = guardar_diagnostico(
            db=db,
            user=current_user,
            resultado=resultado_final,
            archivo=image_path,
            sintomas=lista_sintomas
        )

        return {
            "resultado": diagnostico.resultado,
            "archivo": diagnostico.archivo,
            "recomendacion": diagnostico.recomendacion
        }

    except Exception as e:
        logging.error(f"Error al analizar imagen: {str(e)}")
        raise HTTPException(status_code=500, detail="Error procesando la imagen.")

@router.get("/historial", response_model=List[DiagnosticoOut], summary="Ver historial de diagnósticos del usuario")
def obtener_historial(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    historial = db.query(Diagnosis).filter(Diagnosis.user_id == current_user.id).order_by(Diagnosis.timestamp.desc()).all()
    return historial
