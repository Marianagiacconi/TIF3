import json
import os
from collections import Counter
from datetime import datetime
from typing import Any, Dict, List

import httpx
from dotenv import load_dotenv

from app.models.diagnosis import Diagnosis

load_dotenv()

# Base de conocimiento de síntomas y recomendaciones
SYMPTOM_DATABASE = {
    "fiebre": {
        "severity": "alta",
        "recommendations": [
            "Mantener reposo",
            "Hidratación abundante",
            "Control de temperatura cada 4 horas",
        ],
        "related_symptoms": ["escalofríos", "sudoración", "dolor muscular"],
    },
    "dolor de cabeza": {
        "severity": "media",
        "recommendations": [
            "Evitar luces brillantes",
            "Descansar en ambiente tranquilo",
            "Control de estrés",
        ],
        "related_symptoms": ["náuseas", "sensibilidad a la luz", "fatiga"],
    },
    "fatiga": {
        "severity": "media",
        "recommendations": ["Descanso adecuado", "Alimentación balanceada", "Ejercicio moderado"],
        "related_symptoms": ["debilidad", "dificultad para concentrarse", "somnolencia"],
    },
}


async def recomendacion_openrouter(diagnostico: str, sintomas: List[str]) -> str:
    """
    Obtiene recomendaciones detalladas de OpenRouter usando Mistral-7B.
    """
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return None

    try:
        prompt = (
            f"Eres un veterinario especializado en aves de corral con 30 años de experiencia, "
            f"especialmente en gallinas ponedoras. Tu objetivo es proporcionar recomendaciones "
            f"precisas y prácticas para el manejo de la salud de las gallinas.\n\nDiagnóstico actual: "
            f"{diagnostico}\nSíntomas reportados: {', '.join(sintomas) if sintomas else 'No se reportaron síntomas específicos'}\n\n"
            "Por favor, proporciona una respuesta estructurada en los siguientes puntos:\n\n"
            "1. EVALUACIÓN DEL ESTADO:\n   - Interpretación del diagnóstico y nivel de confianza\n   - Análisis de los síntomas reportados\n   - Estado general de la gallina\n\n"
            "2. RECOMENDACIONES INMEDIATAS:\n   - Tratamiento específico (si es necesario)\n   - Aislamiento o medidas de cuarentena\n   - Ajustes en el ambiente (temperatura ideal: 20-25°C, humedad: 60-70%)\n\n"
            "3. MANEJO DEL AMBIENTE:\n   - Condiciones óptimas del gallinero\n   - Ventilación y limpieza\n   - Espacio y densidad de población\n\n"
            "4. NUTRICIÓN Y SUPLEMENTOS:\n   - Ajustes en la dieta\n   - Suplementos recomendados\n   - Agua y acceso a alimento\n\n"
            "5. PREVENCIÓN Y MONITOREO:\n   - Medidas preventivas específicas\n   - Frecuencia de revisión\n   - Vacunación (si aplica)\n\n"
            "6. SEÑALES DE ALERTA:\n   - Síntomas que requieren atención inmediata\n   - Cuándo contactar al veterinario\n   - Indicadores de mejora o empeoramiento\n\n"
            "Responde de manera profesional pero accesible, usando lenguaje claro y conciso. "
            "Enfócate en recomendaciones prácticas y específicas para gallinas ponedoras."
        )

        headers = {
            "Authorization": f"Bearer {api_key}",
            "HTTP-Referer": "http://localhost:8000",
            "X-Title": "farmeye",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "mistralai/mistral-7b-instruct",
            "messages": [{"role": "user", "content": prompt}],
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]

    except Exception as e:
        print(f"⚠️ Error con OpenRouter: {e}")
        return None


def analizar_sintomas(sintomas: List[str]) -> Dict[str, Any]:
    """
    Analiza los síntomas y genera estadísticas y recomendaciones.

    Args:
        sintomas: Lista de síntomas reportados

    Returns:
        Dict con análisis detallado de síntomas
    """
    if not sintomas:
        return {
            "severity": "baja",
            "recommendations": ["Mantener monitoreo regular"],
            "statistics": {},
        }

    # Contar frecuencia de síntomas
    symptom_counter = Counter(sintomas)

    # Analizar severidad
    severities = [SYMPTOM_DATABASE.get(s, {}).get("severity", "baja") for s in sintomas]
    severity_counts = Counter(severities)
    max_severity = max(severity_counts.items(), key=lambda x: x[1])[0]

    # Recolectar recomendaciones
    all_recommendations = []
    for symptom in sintomas:
        if symptom in SYMPTOM_DATABASE:
            all_recommendations.extend(SYMPTOM_DATABASE[symptom]["recommendations"])

    # Eliminar recomendaciones duplicadas
    unique_recommendations = list(dict.fromkeys(all_recommendations))

    # Calcular estadísticas
    total_symptoms = len(sintomas)
    symptom_frequency = {s: count / total_symptoms for s, count in symptom_counter.items()}

    return {
        "severity": max_severity,
        "recommendations": unique_recommendations,
        "statistics": {
            "total_symptoms": total_symptoms,
            "symptom_frequency": symptom_frequency,
            "severity_distribution": dict(severity_counts),
        },
    }


def ajustar_diagnostico(clase: str, sintomas: List[str], confianza: float = 0.0) -> Dict[str, Any]:
    """
    Ajusta el diagnóstico basado en la clase predicha, síntomas y nivel de confianza.

    Args:
        clase: La clase predicha por el modelo
        sintomas: Lista de síntomas reportados
        confianza: Nivel de confianza de la predicción (0-1)

    Returns:
        Dict con diagnóstico detallado
    """
    # Analizar síntomas
    analisis = analizar_sintomas(sintomas)

    # Generar diagnóstico base
    diagnostico_base = f"{clase} - Nivel de confianza: {confianza:.2%}"

    # Añadir síntomas si existen
    if sintomas:
        sintomas_str = ", ".join(sintomas)
        diagnostico_base += f" - Síntomas reportados: {sintomas_str}"

    return {
        "diagnostico": diagnostico_base,
        "nivel_confianza": confianza,
        "severidad": analisis["severity"],
        "recomendaciones": analisis["recommendations"],
        "estadisticas": analisis["statistics"],
    }


async def guardar_diagnostico(
    *,
    db,
    user,
    resultado: Dict[str, Any],
    archivo: str,
    sintomas: List[str],
    recomendacion: str = None,
):
    """
    Guarda un diagnóstico en la base de datos con información detallada.

    Args:
        db: sesión de la base de datos
        user: usuario autenticado
        resultado: diagnóstico detallado
        archivo: nombre del archivo procesado
        sintomas: lista de síntomas
        recomendacion: recomendación personalizada

    Returns:
        instancia de Diagnosis guardada
    """
    # Obtener recomendación de OpenRouter
    diagnostico_texto = resultado["diagnostico"]
    recomendacion_ia = await recomendacion_openrouter(diagnostico_texto, sintomas)

    # Si no hay recomendación de IA, usar las recomendaciones locales
    if not recomendacion_ia:
        recomendacion_ia = "\n".join(resultado["recomendaciones"])

    diagnostico = Diagnosis(
        resultado=resultado["diagnostico"],
        archivo=archivo,
        sintomas=json.dumps(sintomas),
        recomendacion=recomendacion or recomendacion_ia,
        user_id=user.id,
        timestamp=datetime.utcnow(),
        diagnosis_metadata=json.dumps(
            {
                "nivel_confianza": resultado["nivel_confianza"],
                "severidad": resultado["severidad"],
                "estadisticas": resultado["estadisticas"],
            }
        ),
    )
    db.add(diagnostico)
    db.commit()
    return diagnostico


def obtener_estadisticas_usuario(db, user_id: int) -> Dict[str, Any]:
    """
    Obtiene estadísticas de diagnósticos para un usuario.

    Args:
        db: sesión de la base de datos
        user_id: ID del usuario

    Returns:
        Dict con estadísticas de diagnósticos
    """
    diagnosticos = db.query(Diagnosis).filter(Diagnosis.user_id == user_id).all()

    if not diagnosticos:
        return {"total_diagnosticos": 0, "tendencias": {}, "sintomas_comunes": []}

    # Analizar tendencias
    clases = [d.resultado.split(" - ")[0] for d in diagnosticos]
    clase_counter = Counter(clases)

    # Analizar síntomas
    todos_sintomas = []
    for d in diagnosticos:
        if d.sintomas:
            try:
                sintomas = json.loads(d.sintomas)
                todos_sintomas.extend(sintomas)
            except Exception:
                continue

    sintoma_counter = Counter(todos_sintomas)

    return {
        "total_diagnosticos": len(diagnosticos),
        "tendencias": dict(clase_counter),
        "sintomas_comunes": [
            {"sintoma": s, "frecuencia": c} for s, c in sintoma_counter.most_common(5)
        ],
    }
