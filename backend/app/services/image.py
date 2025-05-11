import io
import logging

import numpy as np
from fastapi import UploadFile
from keras.models import load_model
from PIL import Image, ImageOps

from app.config import CLASS_NAMES, MODEL_PATH

# Cargar el modelo una sola vez
model = None


def get_model():
    global model
    if model is None:
        try:
            model = load_model(MODEL_PATH, compile=False)
            logging.info("Modelo cargado exitosamente")
        except Exception as e:
            logging.error(f"Error al cargar el modelo: {str(e)}")
            raise
    return model


async def process_image(file: UploadFile) -> np.ndarray:
    """
    Procesa una imagen para el modelo.

    Args:
        file: Archivo de imagen subido

    Returns:
        np.ndarray: Imagen procesada
    """
    try:
        # Leer y preprocesar imagen
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = ImageOps.fit(image, (224, 224), Image.Resampling.LANCZOS)
        image_array = np.asarray(image).astype(np.float32) / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        return image_array

    except Exception as e:
        logging.error(f"Error procesando imagen: {str(e)}")
        raise


def get_prediction_confidence(processed_image: np.ndarray) -> tuple[str, float]:
    """
    Obtiene la predicción y nivel de confianza del modelo.

    Args:
        processed_image: Imagen procesada

    Returns:
        tuple: (clase_predicha, nivel_confianza)
    """
    try:
        # Obtener predicción
        model = get_model()
        prediction = model.predict(
            processed_image, verbose=0
        )  # Añadido verbose=0 para reducir logs
        index = np.argmax(prediction)
        clase = CLASS_NAMES[index]
        confianza = float(prediction[0][index])

        logging.info(f"Predicción: {clase} ({round(confianza*100,2)}%)")

        return clase, confianza

    except Exception as e:
        logging.error(f"Error en predicción: {str(e)}")
        raise
