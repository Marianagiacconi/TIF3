// src/components/HomeScreen.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function HomeScreen() {
  return (
  <div className="relative h-screen bg-black text-white">
  <img 
    src="/images/chickeneye.jpg"
    alt="Gallina"
    className="absolute inset-0 w-full h-full object-cover"
  />

  <header className="absolute top-0 left-0 right-0 bg-gray-900 bg-opacity-80 flex justify-between items-center px-6 py-4 z-10">
    <h1 className="text-xl font-bold">FarmEye</h1>
    <nav className="space-x-4">
      <Link to="/login" className="text-white hover:underline">Iniciar sesión</Link>
      <Link to="/register" className="text-white hover:underline">Registrarme</Link>
    </nav>
  </header>

  <main className="relative z-10 flex items-center justify-center h-full px-6">
    <div className="bg-white bg-opacity-90 rounded-lg p-6 max-w-md text-black">
      <h2 className="text-2xl font-semibold mb-2">Detecta enfermedades en tus gallinas</h2>
      <p className="text-sm text-white">Subí una foto y recibí un diagnóstico con inteligencia artificial en segundos.</p>
    </div>
  </main>

  <footer className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-80 text-center text-white text-xs py-2 z-10">
    © 2025 FarmEye. Todos los derechos reservados.
  </footer>
</div>

  );
}
