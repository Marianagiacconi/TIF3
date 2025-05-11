// src/pages/RegisterPage.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import Input from '../components/ui/Input'

const Container = styled.div`
  min-height: 100vh;
  background: #F6F6F6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 8px;
`;

const Card = styled.div`
  width: 80vw;
  height: 60vh;
  max-width: 400px;
  max-height: 600px;
  min-width: 260px;
  min-height: 340px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(86, 155, 148, 0.10);
  padding: 32px 20px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: stretch;
  justify-content: center;
  animation: fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1) both;
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px);}
    to { opacity: 1; transform: none;}
  }
  @media (max-width: 600px) {
    width: 98vw;
    height: auto;
    min-height: unset;
    max-height: unset;
    padding: 20px 6px 16px 6px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
`;

const Logo = styled.div`
  width: 56px;
  height: 56px;
  background: #EEF7E8;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  img {
    width: 70%;
    height: 70%;
    object-fit: contain;
  }
`;

const Title = styled.h1`
  font-family: 'DM Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
  text-align: center;
`;

const ErrorMsg = styled.div`
  color: #B94A48;
  background: #FDECEA;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  text-align: center;
  margin-bottom: 4px;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 48px;
  background: linear-gradient(90deg, #6CB7A1 0%, #569B94 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 18px;
  margin-top: 8px;
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
    animation: pulse 1.2s infinite;
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 #6CB7A133; }
    70% { box-shadow: 0 0 0 10px #6CB7A100; }
    100% { box-shadow: 0 0 0 0 #6CB7A100; }
  }
`;

const LoginLink = styled.div`
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #666;
  a {
    color: #569B94;
    font-weight: 700;
    text-decoration: none;
    position: relative;
    transition: color 0.2s;
    &:hover {
      color: #4A8A84;
    }
    &:after {
      content: '';
      display: block;
      width: 0;
      height: 2px;
      background: #6CB7A1;
      transition: width .3s;
      position: absolute;
      left: 0; bottom: -2px;
    }
    &:hover:after {
      width: 100%;
    }
  }
`;

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone) {
  return /^\d{8,}$/.test(phone)
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    full_name: '',
    telefono: '',
    direccion: ''
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setFieldErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const validateFields = () => {
    const errors = {}
    if (!formData.username.trim()) errors.username = 'El usuario es obligatorio'
    if (!formData.full_name.trim()) errors.full_name = 'El nombre completo es obligatorio'
    if (!formData.direccion.trim()) errors.direccion = 'La dirección es obligatoria'
    if (!validateEmail(formData.email)) errors.email = 'El email no es válido'
    if (!validatePhone(formData.telefono)) errors.telefono = 'El teléfono debe tener al menos 8 dígitos y solo números'
    if (formData.password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres'
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const errors = validateFields()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          full_name: formData.full_name,
          telefono: formData.telefono,
          direccion: formData.direccion
        })
      })
      if (res.ok) {
        navigate('/login')
      } else {
        const data = await res.json()
        setError(data.detail || 'Error al registrar usuario')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Card>
        <Header>
          <Logo>
            <img src="/images/icono.png" alt="Farm Eye Logo" />
          </Logo>
          <Title>Crear Cuenta</Title>
        </Header>
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:12}}>
          <Input
            label="Usuario"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            error={fieldErrors.username}
          />
          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={fieldErrors.email}
          />
          <Input
            label="Nombre completo"
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            error={fieldErrors.full_name}
          />
          <Input
            label="Teléfono"
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            error={fieldErrors.telefono}
          />
          <Input
            label="Dirección"
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            error={fieldErrors.direccion}
          />
          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            error={fieldErrors.password}
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={fieldErrors.confirmPassword}
          />
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </SubmitButton>
        </form>
        <LoginLink>
          ¿Ya tienes una cuenta?
          <Link to="/login">Inicia sesión aquí</Link>
        </LoginLink>
      </Card>
    </Container>
  )
}
