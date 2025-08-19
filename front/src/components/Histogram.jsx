import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Constantes
const MONTHS = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Juil',
  'Août', 'Sep', 'Oct', 'Nov', 'Déc',
];
const COLORS = {
  contraventions: 'rgba(54, 162, 235, 0.6)',
  delits: 'rgba(255, 159, 64, 0.6)',
  crimes: 'rgba(255, 99, 132, 0.6)',
};

const HistogramPage = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);
  const [chartType, setChartType] = useState('bar'); // Nouvelle state pour le type de graphique
  const [data, setData] = useState({
    labels: MONTHS,
    datasets: [
      { label: 'Contraventions', data: Array(12).fill(0), backgroundColor: COLORS.contraventions },
      { label: 'Délits', data: Array(12).fill(0), backgroundColor: COLORS.delits },
      { label: 'Crimes', data: Array(12).fill(0), backgroundColor: COLORS.crimes },
    ],
  });

  const fetchStatistics = async () => {
    if (!year || !month) {
      setError('Veuillez sélectionner une année et un mois.');
      return;
    }

    setLoading(true);
    setError(null);
    setNoData(false);

    try {
      const response = await fetch(
        `http://localhost:8081/statistiques/qualification_rate?annee=${year}&mois=${month}`
      );

      if (response.status === 404) {
        setNoData(true); // Pas de données disponibles
        return;
      }

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const result = await response.json();

      if (result.length === 0) {
        setNoData(true); // Aucune donnée dans le tableau
        return;
      }

      // Préparer les données pour le graphique
      const processedData = {
        labels: MONTHS,
        datasets: [
          { label: 'Contraventions', data: Array(12).fill(0), backgroundColor: COLORS.contraventions },
          { label: 'Délits', data: Array(12).fill(0), backgroundColor: COLORS.delits },
          { label: 'Crimes', data: Array(12).fill(0), backgroundColor: COLORS.crimes },
        ],
      };

      result.forEach((item) => {
        const monthIndex = item.month - 1;
        if (item.qualification === 'Contravention') processedData.datasets[0].data[monthIndex] = Math.round(item.count);
        if (item.qualification === 'Délit') processedData.datasets[1].data[monthIndex] = Math.round(item.count);
        if (item.qualification === 'Crime') processedData.datasets[2].data[monthIndex] = Math.round(item.count);
      });

      setData(processedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculer le total pour chaque type de qualification pour le graphique en camembert
  const getPieChartData = () => {
    const contraventionsTotal = data.datasets[0].data.reduce((a, b) => a + b, 0);
    const delitsTotal = data.datasets[1].data.reduce((a, b) => a + b, 0);
    const crimesTotal = data.datasets[2].data.reduce((a, b) => a + b, 0);

    return [
      { name: 'Contraventions', value: contraventionsTotal, fill: COLORS.contraventions },
      { name: 'Délits', value: delitsTotal, fill: COLORS.delits },
      { name: 'Crimes', value: crimesTotal, fill: COLORS.crimes },
    ];
  };

  useEffect(() => {
    if (year && month) {
      fetchStatistics();
    }
  }, [year, month]);

  return (
    <div className="container mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg border border-gray-300">
      <h1 className="text-center text-3xl font-bold mb-4">
        Statistiques des procès-verbaux  aux archives selon la qualification
      </h1>

      {/* Sélection de l'année et du mois */}
      <div className="flex space-x-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Année
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 rounded w-full"
            min="2000"
            max={new Date().getFullYear()}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mois
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="" disabled>
              Sélectionner un mois
            </option>
            {MONTHS.map((monthName, index) => (
              <option key={index} value={index + 1}>
                {monthName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de graphique
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="bar">Histogramme</option>
            <option value="pie">Camembert</option>
          </select>
        </div>
      </div>

      {/* États : Chargement, Erreur ou Pas de données */}
      {loading && (
        <div className="text-center text-xl text-gray-600 animate-pulse">
          Chargement...
        </div>
      )}

      {error && (
        <div className="text-center mt-4 bg-red-100 text-red-800 p-4 rounded">
          <p>Erreur : {error}</p>
        </div>
      )}

      {noData && (
        <div className="text-center mt-4 bg-yellow-100 text-yellow-800 p-4 rounded">
          <p>
            Aucune donnée trouvée pour l'année {year} et le mois {MONTHS[month - 1]}.
          </p>
        </div>
      )}

      {/* Graphique */}
      {!loading && !error && !noData && (
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'bar' ? (
            <BarChart
              data={data.labels.map((label, index) => ({
                name: label,
                Contraventions: data.datasets[0].data[index],
                Délits: data.datasets[1].data[index],
                Crimes: data.datasets[2].data[index],
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Contraventions"
                fill={COLORS.contraventions}
                stackId="a"
              />
              <Bar dataKey="Délits" fill={COLORS.delits} stackId="a" />
              <Bar dataKey="Crimes" fill={COLORS.crimes} stackId="a" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={getPieChartData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {getPieChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      )}
      
    </div>
  );
};

export default HistogramPage;