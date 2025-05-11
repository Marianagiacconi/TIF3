import React, { useRef, useState } from 'react';
import Button from '../ui/Button';

export default function CameraCapture({ onCapture }) {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black bg-opacity-70 relative">
      <div className="absolute top-4 left-4">
        {/* Aquí podrías poner un botón de cerrar o volver si lo necesitas */}
      </div>
      <div className="w-full max-w-xs mx-auto flex flex-col items-center gap-6">
        <h2 className="text-white text-xl font-semibold mt-8 mb-4">Capturar gallina</h2>
        {!image ? (
          <>
            <label className="flex flex-col items-center justify-center w-40 h-40 bg-white bg-opacity-20 rounded-full border-4 border-white cursor-pointer">
              <span className="text-white text-4xl">📷</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <Button variant="primary" size="lg" className="w-full" type="button" onClick={() => fileInputRef.current.click()}>
              Abrir cámara o galería
            </Button>
          </>
        ) : (
          <>
            <img src={image} alt="Preview" className="w-64 h-64 object-contain rounded-2xl shadow-lg bg-white" />
            <div className="flex gap-4 w-full">
              <Button variant="secondary" size="md" className="flex-1" type="button" onClick={() => setImage(null)}>
                Cambiar foto
              </Button>
              <Button variant="primary" size="md" className="flex-1" type="button" onClick={() => onCapture(image)}>
                Continuar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 