import React, { useState } from 'react';
import styled from 'styled-components';

const SYMPTOMS = [
  'Dificultad respiratoria',
  'Estornudos',
  'Edema facial',
  'Pérdida de apetito',
  'Paleza de cresta y barbilla',
  'Plumas erizadas',
  'Letargo',
  'Diarrea',
  'Tos',
  'Ojos llorosos',
  'Secreción nasal',
];

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

const Title = styled.h2`
  font-family: 'DM Sans', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const Input = styled.input`
  width: 100%;
  border: 1.5px solid #E6E6E6;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  font-family: 'DM Sans', sans-serif;
  margin-bottom: 0;
  &:focus { outline: 2px solid #569B94; }
`;

const SymptomList = styled.ul`
  background: #F6F6F6;
  border-radius: 12px;
  border: 1px solid #E6E6E6;
  margin: 0;
  padding: 0;
  max-height: 140px;
  overflow-y: auto;
`;

const SymptomItem = styled.li`
  list-style: none;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 15px;
  color: #333;
  font-family: 'DM Sans', sans-serif;
  &:hover { background: #EEF7E8; }
`;

const SelectedSymptoms = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

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
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #B94A48;
  font-size: 16px;
  cursor: pointer;
  margin-left: 2px;
`;

const AnalyzeButton = styled.button`
  width: 100%;
  height: 48px;
  background: #569B94;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 18px;
  margin-top: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(86, 155, 148, 0.10);
  transition: background 0.2s;
  &:hover { background: #4A8A84; }
  &:disabled { background: #B3D1CD; cursor: not-allowed; }
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  background: #EEF7E8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 70%;
    height: 70%;
    object-fit: contain;
  }
`;

export default function SymptomSelector({ selected = [], onChange, onAnalyze, onBack }) {
  const [input, setInput] = useState('');

  const filtered = SYMPTOMS.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !selected.includes(s)
  );

  const handleAdd = (symptom) => {
    onChange([...selected, symptom]);
    setInput('');
  };

  const handleRemove = (symptom) => {
    onChange(selected.filter((s) => s !== symptom));
  };

  return (
    <Container>
      <Card>
        <Header>
          <BackButton onClick={onBack}>← Volver</BackButton>
          <Logo>
            <img src="/images/icono.png" alt="Farm Eye Icon" />
          </Logo>
        </Header>
        <Title>Selecciona síntomas</Title>
        <Input
          type="text"
          placeholder="Buscar síntoma..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        {filtered.length > 0 && (
          <SymptomList>
            {filtered.map((symptom) => (
              <SymptomItem key={symptom} onClick={() => handleAdd(symptom)}>
                {symptom}
              </SymptomItem>
            ))}
          </SymptomList>
        )}
        {selected.length > 0 && (
          <SelectedSymptoms>
            {selected.map((symptom) => (
              <SymptomTag key={symptom}>
                {symptom}
                <RemoveButton onClick={() => handleRemove(symptom)} title="Quitar síntoma">×</RemoveButton>
              </SymptomTag>
            ))}
          </SelectedSymptoms>
        )}
        <AnalyzeButton
          onClick={() => onAnalyze(selected)}
          disabled={selected.length === 0}
        >
          Analizar
        </AnalyzeButton>
      </Card>
    </Container>
  );
} 