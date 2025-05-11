import os

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.services.auth import get_current_user, get_db
from app.services.diagnosis import ajustar_diagnostico, guardar_diagnostico, recomendacion_local

load_dotenv()
router = APIRouter()


class LLMInput(BaseModel):
    diagnostico: str
    sintomas: list[str]
    archivo: str


# OpenRouter fallback
async def recomendacion_llm(prompt: str) -> str | None:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return None

    try:
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
                "https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]

    except Exception as e:
        print(f"⚠️ Error con OpenRouter: {e}")
        return None


@router.post("/recomendar")
async def recomendar(data: LLMInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # Diagnóstico ajustado
    resultado_final = ajustar_diagnostico(data.diagnostico, data.sintomas)
    recomendacion = recomendacion_local(resultado_final)

    # Prompt para IA extendida
    prompt = f"""Sos un veterinario especializado en aves con 50 años de experiencia.
Diagnóstico: {resultado_final}
Síntomas observados: {", ".join(data.sintomas)}.
Edad y condiciones no especificadas.

Brindá una recomendación clara con tono amable: tratamiento, aislamiento, ambiente y prevención."""

    extendida = await recomendacion_llm(prompt)
    if extendida:
        recomendacion = extendida

    diagnostico = guardar_diagnostico(
        db=db,
        user=user,
        resultado=resultado_final,
        recomendacion=recomendacion,
        archivo=data.archivo,
        sintomas=data.sintomas,
    )

    return {
        "resultado": diagnostico.resultado,
        "recomendacion": diagnostico.recomendacion,
        "archivo": diagnostico.archivo,
        "sintomas": diagnostico.sintomas,
        "timestamp": diagnostico.timestamp,
    }
