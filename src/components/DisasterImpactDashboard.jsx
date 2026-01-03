import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { disasterData, economicData } from '../data/DisasterDashboardData';

const themeColors = {
  primary: '#38bdf8',
  secondary: '#22d3ee',
  accent: '#f97316',
  grid: '#334155',
  text: '#f1f5f9',
  colors: {
    'Flood': '#0ea5e9',      // Sky 500
    'Storm': '#8b5cf6',      // Violet 500
    'Earthquake': '#f97316', // Orange 500
    'Other': '#64748b'       // Slate 500
  }
};

const processData = () => {
  const years = Array.from({ length: 2024 - 1980 + 1 }, (_, i) => 1980 + i);

  return years.map(year => {
    const yearDisasters = disasterData.filter(d => d.Year === year);
    const yearEconomic = economicData.find(d => d.Year === year);

    const deathsByType = {
      'Flood': yearDisasters.filter(d => d["Disaster Type"] === "Flood").reduce((sum, d) => sum + d["Total Deaths"], 0),
      'Storm': yearDisasters.filter(d => d["Disaster Type"] === "Storm").reduce((sum, d) => sum + d["Total Deaths"], 0),
      'Earthquake': yearDisasters.filter(d => d["Disaster Type"] === "Earthquake").reduce((sum, d) => sum + d["Total Deaths"], 0),
      'Other': yearDisasters.filter(d => !["Flood", "Storm", "Earthquake"].includes(d["Disaster Type"])).reduce((sum, d) => sum + d["Total Deaths"], 0)
    };

    return {
      year,
      ...deathsByType,
      combinedCost: yearEconomic ? yearEconomic["Total Adjusted Damage"] / 10000000 : 0, // Convert to crores
      totalDeaths: Object.values(deathsByType).reduce((a, b) => a + b, 0)
    };
  });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-white/10 p-3 rounded shadow-xl">
        <p className="text-gray-300 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name === 'combinedCost' ? `₹${entry.value.toFixed(2)} Cr` : entry.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const DisasterImpactDashboard = () => {
  const [data] = useState(processData());
  const [selectedYear, setSelectedYear] = useState(null);

  const handleBarClick = (data) => {
    setSelectedYear(data.activeLabel);
  };

  const formatINR = (value) => `₹${value.toFixed(0)}Cr`;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Climate Disaster Impact (1995-2023)</h2>
        <p className="text-gray-400 text-sm">Lives lost and economic damage analysis</p>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} onClick={handleBarClick}>
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
            <XAxis dataKey="year" stroke={themeColors.text} tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke={themeColors.text}
              label={{ value: 'Deaths', angle: -90, position: 'insideLeft', fill: themeColors.text }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={themeColors.secondary}
              tickFormatter={formatINR}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {Object.keys(themeColors.colors).map((key) => (
              <Bar key={key} dataKey={key} fill={themeColors.colors[key]} yAxisId="left" stackId="a" />
            ))}
            <Line
              type="monotone"
              dataKey="combinedCost"
              yAxisId="right"
              stroke={themeColors.secondary}
              strokeWidth={3}
              dot={false}
              name="Economic Cost"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {selectedYear && (
        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg animate-fade-in">
          <h3 className="text-lg font-bold text-white mb-2">Year {selectedYear} Breakdown</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400 block">Economic Cost</span>
              <span className="text-secondary font-bold text-lg">
                {formatINR(data.find(d => d.year === parseInt(selectedYear)).combinedCost)}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block">Total Deaths</span>
              <span className="text-white font-bold text-lg">
                {data.find(d => d.year === parseInt(selectedYear)).totalDeaths}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterImpactDashboard;
