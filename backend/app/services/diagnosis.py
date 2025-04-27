from datetime import datetime

from app.models.diagnosis import Diagnosis


def ajustar_diagnostico(prediccion_ia: str, sintomas: list[str]) -> str:
    sintomas = [s.lower() for s in sintomas]

    if "secreción nasal" in sintomas and "ojos hinchados" in sintomas:
        return "Sospechosa (coriza)"
    
    if "cresta flácida" in sintomas and prediccion_ia == "Sana":
        return "Sospechosa (deshidratación)"
    
    if any("costra" in s for s in sintomas):
        return "Sospechosa (viruela aviar)"
    
    return prediccion_ia

def generar_recomendacion(resultado: str) -> str:
    recomendaciones = {
        "Sana": "No se detectan signos visibles. Continuar con monitoreo preventivo.",
        "Sospechosa (coriza)": "Separar la gallina y consultar al veterinario. Desinfectar comederos.",
        "Sospechosa (viruela aviar)": "Aplicar antiséptico en las lesiones. Aislar y vacunar si es necesario.",
        "Sospechosa (deshidratación)": "Ofrecer suero y sombra. Verificar acceso al agua limpia y fresca.",
        "Sospechosa (lesión dérmica)": "Desinfectar heridas y revisar si hay picoteo por estrés o sobrepoblación.",
    }
    return recomendaciones.get(resultado, "Revisión veterinaria recomendada.")
def guardar_diagnostico(db, user, resultado: str, archivo: str, sintomas: list[str]):
    recomendacion = generar_recomendacion(resultado)
    diagnostico = Diagnosis(
        resultado=resultado,
        recomendacion=recomendacion,
        archivo=archivo,
        sintomas=", ".join(sintomas),
        user_id=user.id,
        timestamp=datetime.utcnow()
    )
    db.add(diagnostico)
    db.commit()
    return diagnostico
