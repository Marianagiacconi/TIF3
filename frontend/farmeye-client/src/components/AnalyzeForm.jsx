import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AnalyzeForm({ onResult }) {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [sintomas, setSintomas] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'sintomas',
      JSON.stringify(sintomas.split(',').map((s) => s.trim()))
    );

    const res = await fetch('/api/analizar-imagen', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const json = await res.json();
    onResult(json);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <textarea
        placeholder="Comma-separated symptoms"
        value={sintomas}
        onChange={(e) => setSintomas(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Analyze
      </button>
    </form>
  );
}
