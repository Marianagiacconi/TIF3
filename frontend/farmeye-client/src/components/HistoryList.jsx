import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function HistoryList() {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/historial', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setHistory(json);
    })();
  }, [token]);

  return (
    <div className="space-y-4">
      {history.map((d, i) => (
        <div key={i} className="border p-4 rounded">
          <div className="font-semibold">
            {new Date(d.timestamp).toLocaleString()}
          </div>
          <div>{d.resultado}</div>
          <div className="italic text-sm">{d.recomendacion}</div>
          <img
            src={d.archivo}
            alt="diagnostic"
            className="mt-2 max-w-full rounded"
          />
        </div>
      ))}
    </div>
  );
}
