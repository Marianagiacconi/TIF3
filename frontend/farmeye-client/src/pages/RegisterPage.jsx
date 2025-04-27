// src/pages/RegisterPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [data, setData] = useState({
    username: '', password: '', full_name: '',
    email: '', telefono: '', direccion: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (res.ok) navigate('/login')
    else {
      const json = await res.json()
      setError(json.detail || 'Error al registrar')
    }
  }

  const fields = [
    { name: 'username', label: 'Usuario', type: 'text' },
    { name: 'password', label: 'Contraseña', type: 'password' },
    { name: 'full_name', label: 'Nombre completo', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'telefono', label: 'Teléfono', type: 'text' },
    { name: 'direccion', label: 'Dirección', type: 'text' },
  ]

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-primary-600 mb-6">
          Crear cuenta
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {f.label}
              </label>
              <input
                type={f.type}
                value={data[f.name]}
                onChange={e => setData({ ...data, [f.name]: e.target.value })}
                className="w-full border border-primary-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                required={f.name !== 'telefono' && f.name !== 'direccion'}
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-xl transition"
          >
            Registrarme
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tenés cuenta?{' '}
          <a href="/login" className="text-accent-500 hover:text-accent-600 font-semibold">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  )
}
