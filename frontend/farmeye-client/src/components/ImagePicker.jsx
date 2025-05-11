// src/components/ImagePicker.jsx
import { useRef } from 'react';

export default function ImagePicker({ onImageSelected }) {
  const cameraRef = useRef();
  const fileRef   = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) onImageSelected(file);
    e.target.value = null; // reset para poder seleccionar el mismo fichero otra vez
  };

  return (
    <div className="flex gap-4 justify-center">
      {/* Botón cámara */}
      <button
        type="button"
        onClick={() => cameraRef.current.click()}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        📷 Tomar foto
      </button>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />

      {/* Botón subida */}
      <button
        type="button"
        onClick={() => fileRef.current.click()}
        className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
      >
        📁 Subir imagen
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
