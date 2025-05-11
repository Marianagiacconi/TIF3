import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  height: 64px;
  border-bottom: 1px solid #E6E6E6;

  @media (max-width: 600px) {
    height: 56px;
    padding: 0 8px;
  }
`;

const Logo = styled.div`
  width: 44px;
  height: 44px;
  background: #EEF7E8;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 70%;
    height: 70%;
    object-fit: contain;
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const HeaderButton = styled.button`
  padding: 7px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.3s ease;
`;

const SignInButton = styled(HeaderButton)`
  background: #EEF7E8;
  color: #569B94;
  &:hover {
    background: #E5F0DD;
  }
`;

const RegisterButton = styled(HeaderButton)`
  background: #569B94;
  color: #fff;
  &:hover {
    background: #4A8A84;
  }
`;

const MainImage = styled.div`
  width: 100vw;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F6F6F6;
  margin-top: 64px;
  margin-bottom: 0;
  @media (max-width: 600px) {
    height: 140px;
    margin-top: 56px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Content = styled.div`
  width: 100vw;
  max-width: 440px;
  margin: 0 auto;
  padding: 24px 12px 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  @media (max-width: 600px) {
    padding: 16px 4px 4px 4px;
  }
`;

const Title = styled.h1`
  font-family: 'DM Sans', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 26px;
  line-height: 1.1;
  text-align: center;
  color: #333;
  margin-bottom: 12px;
  @media (max-width: 600px) {
    font-size: 22px;
    margin-bottom: 8px;
  }
`;

const Subtitle = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 1.3;
  text-align: center;
  color: #666;
  margin-bottom: 20px;
  padding: 0 4px;
`;

const Footer = styled.footer`
  width: 100vw;
  background: #fff;
  padding: 16px 0 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #E6E6E6;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 18px;
  a {
    color: #666;
    transition: color 0.3s ease;
    font-size: 18px;
    &:hover {
      color: #333;
    }
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #666;
  a {
    text-decoration: underline;
    color: #666;
    &:hover {
      color: #333;
    }
  }
`;

const Copyright = styled.div`
  font-size: 11px;
  color: #666;
`;

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Container>
      <Header>
        <Logo>
          <img src="/images/icono.png" alt="Farm Eye Icon" />
        </Logo>
        <HeaderButtons>
          <SignInButton onClick={handleLogin}>
            Iniciar Sesión
          </SignInButton>
          <RegisterButton onClick={handleRegister}>
            Registrarse
          </RegisterButton>
        </HeaderButtons>
      </Header>

      <MainImage>
        <img src="/images/chickeneye.png" alt="Gallina" />
      </MainImage>

      <Content>
        <Title>Bienvenido a Farm Eye</Title>
        <Subtitle>
          Tu asistente inteligente para el análisis y cuidado de tus gallinas
        </Subtitle>
      </Content>

      <Footer>
        <SocialLinks>
          <a href="#" aria-label="X">X</a>
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="YouTube">YouTube</a>
          <a href="#" aria-label="LinkedIn">LinkedIn</a>
        </SocialLinks>
        <FooterLinks>
          <a href="#">Términos</a>
          <span>|</span>
          <a href="#">Privacidad</a>
          <span>|</span>
          <a href="#">Soporte</a>
        </FooterLinks>
        <Copyright>
          © 2025 Farm Eye. Todos los derechos reservados.
        </Copyright>
      </Footer>
    </Container>
  );
}
