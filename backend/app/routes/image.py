import json
import logging
import os
from datetime import datetime
from io import BytesIO
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
from sqlalchemy.orm import Session
from sqlalchemy import or_
from reportlab.lib import colors

from app.models.diagnosis import Diagnosis
from app.models.user import User
from app.schemas.image import DiagnosticoOut
from app.services.auth import get_current_user, get_db
from app.services.diagnosis import ajustar_diagnostico, guardar_diagnostico
from app.services.image import get_prediction_confidence, process_image

router = APIRouter(prefix="/api", tags=["image"])


@router.post(
    "/scan", response_model=DiagnosticoOut, summary="Analiza imagen de gallina y guarda diagnóstico"
)
async def scan_image(
    file: UploadFile = File(...),
    sintomas: str = Form("[]"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Procesa una imagen y genera un diagnóstico basado en la imagen y los síntomas reportados.
    """
    try:
        logging.info(f"Procesando imagen: {file.filename} para usuario {current_user.username}")

        # Procesar la imagen
        processed_image = await process_image(file)

        # Obtener predicción y nivel de confianza
        prediction, confidence = get_prediction_confidence(processed_image)

        # Convertir síntomas de string a lista
        sintomas_list = json.loads(sintomas)

        # Generar diagnóstico detallado
        diagnostico = ajustar_diagnostico(prediction, sintomas_list, confidence)

        # Guardar diagnóstico (ahora es asíncrono)
        saved_diagnosis = await guardar_diagnostico(
            db=db,
            user=current_user,
            resultado=diagnostico,
            archivo=file.filename,
            sintomas=sintomas_list,
        )

        # Retornar el diagnóstico guardado con los campos esperados por DiagnosticoOut
        return {
            "id": saved_diagnosis.id,
            "resultado": saved_diagnosis.resultado,
            "recomendacion": saved_diagnosis.recomendacion,
            "archivo": saved_diagnosis.archivo,
            "sintomas": saved_diagnosis.sintomas,
            "timestamp": saved_diagnosis.timestamp,
            "user_id": saved_diagnosis.user_id,
        }

    except Exception as e:
        logging.error(f"Error en /api/scan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error procesando la imagen: {str(e)}")


@router.get(
    "/analyses",
    response_model=list[DiagnosticoOut],
    summary="Historial de diagnósticos del usuario autenticado",
)
def obtener_historial(
    page: int = 1,
    limit: int = 10,
    fecha_inicio: Optional[datetime] = None,
    fecha_fin: Optional[datetime] = None,
    ordenar_por: str = "timestamp",
    orden: str = "desc",
    busqueda: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Obtiene el historial de diagnósticos con filtros y paginación.
    
    Parámetros:
    - page: Número de página (default: 1)
    - limit: Elementos por página (default: 10)
    - fecha_inicio: Filtrar desde esta fecha
    - fecha_fin: Filtrar hasta esta fecha
    - ordenar_por: Campo para ordenar (timestamp, resultado)
    - orden: Dirección del orden (asc, desc)
    - busqueda: Texto para buscar en resultados
    """
    try:
        logging.info(f"Obteniendo historial para usuario {current_user.username} - página {page}")

        # Calcular offset
        offset = (page - 1) * limit

        # Query base
        query = db.query(Diagnosis).filter(Diagnosis.user_id == current_user.id)

        # Aplicar filtros de fecha
        if fecha_inicio:
            query = query.filter(Diagnosis.timestamp >= fecha_inicio)
        if fecha_fin:
            query = query.filter(Diagnosis.timestamp <= fecha_fin)

        # Aplicar búsqueda
        if busqueda:
            query = query.filter(
                or_(
                    Diagnosis.resultado.ilike(f"%{busqueda}%"),
                    Diagnosis.recomendacion.ilike(f"%{busqueda}%"),
                    Diagnosis.sintomas.ilike(f"%{busqueda}%")
                )
            )

        # Aplicar ordenamiento
        if ordenar_por == "resultado":
            order_column = Diagnosis.resultado
        else:  # default: timestamp
            order_column = Diagnosis.timestamp

        if orden == "asc":
            query = query.order_by(order_column.asc())
        else:  # default: desc
            query = query.order_by(order_column.desc())

        # Obtener total de diagnósticos
        total = query.count()

        # Obtener diagnósticos paginados
        diagnósticos = query.offset(offset).limit(limit).all()

        logging.info(f"Encontrados {len(diagnósticos)} diagnósticos en la página {page}")

        return {
            "items": diagnósticos,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit,
        }
    except Exception as e:
        logging.error(f"Error obteniendo historial: {str(e)}")
        raise HTTPException(status_code=500, detail="Error obteniendo historial de diagnósticos")


@router.get("/analyses/{diagnosis_id}/pdf", summary="Descargar diagnóstico en PDF")
async def download_diagnosis_pdf(
    diagnosis_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """
    Genera y descarga un PDF con el diagnóstico detallado, incluyendo gráficos y estadísticas.
    """
    try:
        # Obtener el diagnóstico
        diagnosis = (
            db.query(Diagnosis)
            .filter(Diagnosis.id == diagnosis_id, Diagnosis.user_id == current_user.id)
            .first()
        )

        if not diagnosis:
            raise HTTPException(status_code=404, detail="Diagnóstico no encontrado")

        # Crear buffer para el PDF
        buffer = BytesIO()

        # Crear el PDF con márgenes personalizados
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )

        # Estilos personalizados
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "CustomTitle",
            parent=styles["Heading1"],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.HexColor("#2C3E50")
        )
        heading_style = ParagraphStyle(
            "CustomHeading",
            parent=styles["Heading2"],
            fontSize=16,
            spaceAfter=12,
            textColor=colors.HexColor("#34495E")
        )
        normal_style = ParagraphStyle(
            "CustomNormal",
            parent=styles["Normal"],
            fontSize=12,
            spaceAfter=8,
            textColor=colors.HexColor("#2C3E50")
        )

        story = []

        # Encabezado
        story.append(Paragraph("Diagnóstico de Gallina", title_style))
        story.append(Spacer(1, 20))

        # Información del diagnóstico
        story.append(Paragraph("Información General", heading_style))
        story.append(Paragraph(f"Fecha: {diagnosis.timestamp.strftime('%d/%m/%Y %H:%M')}", normal_style))
        story.append(Paragraph(f"ID de Diagnóstico: {diagnosis.id}", normal_style))
        story.append(Spacer(1, 20))

        # Resultado
        story.append(Paragraph("Diagnóstico", heading_style))
        story.append(Paragraph(diagnosis.resultado, normal_style))
        story.append(Spacer(1, 20))

        # Síntomas
        if diagnosis.sintomas:
            sintomas = json.loads(diagnosis.sintomas)
            if sintomas:
                story.append(Paragraph("Síntomas Reportados", heading_style))
                for sintoma in sintomas:
                    story.append(Paragraph(f"• {sintoma}", normal_style))
                story.append(Spacer(1, 20))

        # Recomendaciones
        story.append(Paragraph("Recomendaciones", heading_style))
        story.append(Paragraph(diagnosis.recomendacion, normal_style))
        story.append(Spacer(1, 20))

        # Metadata y estadísticas
        if diagnosis.diagnosis_metadata:
            metadata = json.loads(diagnosis.diagnosis_metadata)
            story.append(Paragraph("Información Adicional", heading_style))
            
            # Nivel de confianza con barra de progreso
            confianza = metadata.get('nivel_confianza', 0)
            story.append(Paragraph(f"Nivel de confianza: {confianza:.2%}", normal_style))
            
            # Severidad con indicador visual
            severidad = metadata.get('severidad', 'N/A')
            story.append(Paragraph(f"Severidad: {severidad}", normal_style))
            
            # Estadísticas si existen
            if 'estadisticas' in metadata:
                stats = metadata['estadisticas']
                story.append(Paragraph("Estadísticas:", normal_style))
                for key, value in stats.items():
                    story.append(Paragraph(f"• {key}: {value}", normal_style))

        # Pie de página
        story.append(Spacer(1, 30))
        story.append(Paragraph(
            f"Generado por FarmEye - {datetime.now().strftime('%d/%m/%Y %H:%M')}",
            ParagraphStyle(
                "Footer",
                parent=styles["Normal"],
                fontSize=8,
                textColor=colors.gray
            )
        ))

        # Construir el PDF
        doc.build(story)
        buffer.seek(0)

        # Generar nombre de archivo
        filename = f"diagnostico_{diagnosis_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"

        # Crear directorio temporal si no existe
        os.makedirs("temp_pdfs", exist_ok=True)
        filepath = os.path.join("temp_pdfs", filename)

        # Guardar PDF temporalmente
        with open(filepath, "wb") as f:
            f.write(buffer.getvalue())

        # Devolver el archivo
        return FileResponse(
            filepath,
            media_type="application/pdf",
            filename=filename,
            background=None
        )

    except Exception as e:
        logging.error(f"Error generando PDF: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generando el PDF del diagnóstico")
