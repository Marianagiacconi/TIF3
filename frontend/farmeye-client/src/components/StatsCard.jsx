// src/components/StatsCard.jsx
export default function StatsCard({
    data = { total: 128, healthy: 100, mild: 15, severe: 13 },
  }) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Estadísticas</h2>
          <a href="/stats" className="text-sm text-gray-500 hover:underline">
            Ver más →
          </a>
        </div>
        <ul className="space-y-1 text-sm">
          <li>• Total: {data.total}</li>
          <li>• Saludables: {data.healthy}</li>
          <li>• Coriza leve: {data.mild}</li>
          <li>• Coriza grave: {data.severe}</li>
        </ul>
      </div>
    );
  }
  