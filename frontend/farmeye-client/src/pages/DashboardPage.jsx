// src/pages/DashboardPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #F6F6F6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 8px;
`

const CardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 900px;
  @media (min-width: 900px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`

const Card = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(86, 155, 148, 0.10);
  padding: 28px 20px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: stretch;
  min-width: 260px;
  max-width: 400px;
  animation: fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1) both;
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px);}
    to { opacity: 1; transform: none;}
  }
`

const CardTitle = styled.h2`
  font-family: 'DM Sans', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
`

const ImagePreview = styled.img`
  width: 100%;
  max-height: 180px;
  object-fit: contain;
  border-radius: 16px;
  background: #F6F6F6;
  margin-bottom: 8px;
`

const FileInput = styled.input`
  display: none;
`

const FileLabel = styled.label`
  background: #EEF7E8;
  color: #569B94;
  border-radius: 10px;
  padding: 10px 18px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
  margin-bottom: 8px;
  transition: background 0.2s;
  &:hover { background: #E5F0DD; }
`

const SymptomList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`

const SymptomTag = styled.span`
  background: #EEF7E8;
  color: #569B94;
  border-radius: 16px;
  padding: 6px 14px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
`

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #B94A48;
  font-size: 16px;
  cursor: pointer;
  margin-left: 2px;
`

const AnalyzeButton = styled.button`
  width: 100%;
  height: 48px;
  background: linear-gradient(90deg, #6CB7A1 0%, #569B94 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 18px;
  margin-top: 18px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(86, 155, 148, 0.10);
  transition: background 0.2s, box-shadow 0.2s, transform 0.12s;
  &:hover {
    background: linear-gradient(90deg, #569B94 0%, #4A8A84 100%);
    box-shadow: 0 6px 24px rgba(86, 155, 148, 0.18);
    transform: scale(1.04);
  }
  &:active {
    transform: scale(0.98);
  }
  &:disabled {
    background: #B3D1CD;
    cursor: not-allowed;
    opacity: 0.7;
  }
`

const SYMPTOMS = [
  'Dificultad respiratoria', 'Estornudos', 'Edema facial', 'Pérdida de apetito',
  'Paleza de cresta y barbilla', 'Plumas erizadas', 'Letargo', 'Diarrea',
  'Tos', 'Ojos llorosos', 'Secreción nasal',
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [image, setImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [symptoms, setSymptoms] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  React.useEffect(() => {
    if (!token) navigate('/login')
  }, [token, navigate])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))
      setImageFile(file)
    }
  }

  const handleAddSymptom = (symptom) => {
    setSymptoms([...symptoms, symptom])
    setInput('')
  }

  const handleRemoveSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom))
  }

  const handleAnalyze = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      symptoms.forEach(s => formData.append('sintomas[]', s))
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      if (!response.ok) throw new Error('Error en el análisis')
      const data = await response.json()
      navigate('/resultado', { state: { analysis: data, image, symptoms } })
    } catch (err) {
      alert('Error al analizar: ' + (err.message || 'Error de red'))
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSymptoms = SYMPTOMS.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !symptoms.includes(s)
  )

  return (
    <DashboardContainer>
      <CardsWrapper>
        {/* Bloque de imagen/cámara */}
        <Card>
          <CardTitle>Imagen de la gallina</CardTitle>
          {image && <ImagePreview src={image} alt="Gallina" />}
          <FileLabel htmlFor="file-input">
            {image ? 'Cambiar imagen' : 'Subir o tomar foto'}
          </FileLabel>
          <FileInput
            id="file-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
          />
        </Card>

        {/* Bloque de selector de síntomas */}
        <Card>
          <CardTitle>Síntomas observados</CardTitle>
          <input
            type="text"
            placeholder="Buscar síntoma..."
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              width: '100%',
              border: '1.5px solid #E6E6E6',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '16px',
              fontFamily: 'DM Sans, sans-serif',
              marginBottom: '0.5rem'
            }}
          />
          {filteredSymptoms.length > 0 && (
            <div style={{
              background: '#F6F6F6',
              borderRadius: '12px',
              border: '1px solid #E6E6E6',
              maxHeight: '140px',
              overflowY: 'auto',
              marginBottom: '8px'
            }}>
              {filteredSymptoms.map((symptom) => (
                <div
                  key={symptom}
                  style={{
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    color: '#333',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                  onClick={() => handleAddSymptom(symptom)}
                >
                  {symptom}
                </div>
              ))}
            </div>
          )}
          {symptoms.length > 0 && (
            <SymptomList>
              {symptoms.map((symptom) => (
                <SymptomTag key={symptom}>
                  {symptom}
                  <RemoveButton onClick={() => handleRemoveSymptom(symptom)} title="Quitar síntoma">×</RemoveButton>
                </SymptomTag>
              ))}
            </SymptomList>
          )}
        </Card>
      </CardsWrapper>
      <AnalyzeButton
        onClick={handleAnalyze}
        disabled={!image || symptoms.length === 0 || isLoading}
        style={{ maxWidth: 400, marginTop: 32 }}
      >
        {isLoading ? 'Analizando...' : 'Analizar'}
      </AnalyzeButton>
    </DashboardContainer>
  )
}
