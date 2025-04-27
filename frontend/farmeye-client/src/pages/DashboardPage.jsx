// src/pages/DashboardPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnalyzeForm from '../components/AnalyzeForm'
import HistoryList from '../components/HistoryList'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { token, logout } = useAuth()
  const [result, setResult] = useState(null)

  if (!token) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-primary-50 p-4">
      <div className="container mx-auto flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary-600">Dashboard</h1>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="text-accent-500 hover:text-accent-600 font-semibold"
        >
          Logout
        </button>
      </div>
      <div className="container mx-auto grid gap-8 lg:grid-cols-2">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">
            Subir imagen y síntomas
          </h2>
          <AnalyzeForm onResult={setResult} />
          {result && (
            <pre className="bg-gray-100 p-4 rounded-xl mt-4">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">
            Historial de diagnósticos
          </h2>
          <HistoryList />
        </div>
      </div>
    </div>
  )
}
