import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

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

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: formData.username,
          password: formData.password
        })
      });
      if (res.ok) {
        const data = await res.json();
        login(data.access_token, data.refresh_token);
        navigate('/dashboard');
      } else {
        const data = await res.json();
        setError(data.detail || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Header>
          <Logo>
            <img src="/images/icono.png" alt="Farm Eye Logo" />
          </Logo>
          <Title>Iniciar Sesión</Title>
        </Header>
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:12}}>
          <Input
            label="Usuario"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </SubmitButton>
        </form>
        <LoginLink>
          ¿No tienes una cuenta?
          <Link to="/register">Regístrate aquí</Link>
        </LoginLink>
      </Card>
    </Container>
  );
}