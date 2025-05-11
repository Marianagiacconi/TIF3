import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 pt-4 pb-2">
          <img src="/images/logo192.png" alt="Farm Eye Logo" className="w-10 h-10" />
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/login')}
              className="rounded-full px-5 py-1.5 text-base font-semibold border border-gray-400 bg-white text-gray-800 shadow-sm hover:bg-gray-100 transition-all"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="rounded-full px-5 py-1.5 text-base font-semibold bg-[#6CB7A1] text-white shadow-sm hover:bg-[#4e8c7a] transition-all"
            >
              Register
            </button>
          </div>
        </div>
        {/* Imagen y título */}
        <div className="relative w-full">
          <img
            src="/images/chickeneye.png"
            alt="Gallina"
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white bg-opacity-90 border border-gray-300 rounded-md px-4 py-2 shadow text-center w-11/12 max-w-[340px]">
            <h1 className="text-lg font-semibold text-gray-900">
              Tecnología al servicio de la salud avícola
            </h1>
          </div>
        </div>
        {/* Footer */}
        <div className="flex flex-col items-center px-4 pt-6 pb-4 gap-2">
          <div className="font-semibold text-center text-xs mb-1">© 2025 Farm Eye. Todos los derechos reservados.</div>
          <div className="flex gap-4 mb-1">
            <a href="#"><img src="/images/icono.png" alt="Instagram" className="w-6 h-6" /></a>
            <a href="#"><img src="/images/icono.png" alt="YouTube" className="w-6 h-6" /></a>
            <a href="#"><img src="/images/icono.png" alt="LinkedIn" className="w-6 h-6" /></a>
          </div>
          <div className="flex gap-4 font-semibold text-xs">
            <a href="#" className="underline">Términos</a>
            <span>|</span>
            <a href="#" className="underline">Privacidad</a>
            <span>|</span>
            <a href="#" className="underline">Soporte</a>
          </div>
        </div>
      </div>
    </div>
  );
}
