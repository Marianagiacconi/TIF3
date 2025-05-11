import React from 'react';
import styled from 'styled-components';

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
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(86, 155, 148, 0.08);
  padding: 32px 20px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: stretch;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled.button`
  background: #EEF7E8;
  color: #569B94;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #E5F0DD; }
`;

const Title = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #569B94;
`;

const Image = styled.img`
  width: 100%;
  height: 160px;
  object-fit: contain;
  border-radius: 16px;
  background: #F6F6F6;
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4A8A84;
  font-weight: 700;
  font-size: 16px;
  font-family: 'DM Sans', sans-serif;
`;

const Section = styled.div`
  margin-bottom: 8px;
`;

const SectionTitle = styled.h3`
  font-family: 'DM Sans', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
`;

const SectionText = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  color: #666;
  margin: 0 0 4px 0;
`;

const Recommendations = styled.ol`
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  color: #666;
  margin: 0 0 4px 0;
  padding-left: 18px;
`;

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

const InfoBlock = styled.div`
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  color: #333;
`;

const InfoLabel = styled.span`
  display: block;
  font-weight: 600;
  color: #666;
`;

const InfoValue = styled.span`
  display: block;
  font-weight: 700;
  color: #569B94;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background: ${({ primary }) => (primary ? '#569B94' : '#EEF7E8')};
  color: ${({ primary }) => (primary ? '#fff' : '#569B94')};
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(86, 155, 148, 0.10);
  transition: background 0.2s;
  &:hover {
    background: ${({ primary }) => (primary ? '#4A8A84' : '#E5F0DD')};
  }
`;

export default function AnalysisResult({ image, symptoms, analysis, onBack }) {
  if (!analysis) return null;
  return (
    <Container>
      <Card>
        <Header>
          <BackButton onClick={onBack}>← Volver</BackButton>
          <Title>Gallina Analizada</Title>
        </Header>
        {image && (
          <Image src={image} alt="Gallina analizada" />
        )}
        <Status>
          <span>✔</span> Gallina Analizada
        </Status>
        <Section>
          <SectionTitle>Descripción</SectionTitle>
          <SectionText>{analysis.description}</SectionText>
        </Section>
        <Section>
          <SectionTitle>Recomendación:</SectionTitle>
          <Recommendations>
            {analysis.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </Recommendations>
        </Section>
        <InfoRow>
          <InfoBlock>
            <InfoLabel>Estado:</InfoLabel>
            <InfoValue>{analysis.state}</InfoValue>
          </InfoBlock>
          <InfoBlock>
            <InfoLabel>Confianza:</InfoLabel>
            <InfoValue>{analysis.confidence}%</InfoValue>
          </InfoBlock>
        </InfoRow>
        <ButtonRow>
          <ActionButton onClick={() => window.print()}>Descargar</ActionButton>
          <ActionButton
            primary
            onClick={() =>
              navigator.share
                ? navigator.share({ title: 'Gallina Analizada', text: analysis.description })
                : alert('Función no soportada')
            }
          >
            Compartir
          </ActionButton>
        </ButtonRow>
      </Card>
    </Container>
  );
} 