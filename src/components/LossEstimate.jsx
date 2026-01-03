import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LossEstimateData from '../data/lossEstimateData';

const LossEstimateVisualization = () => {
  const [selectedYear, setSelectedYear] = useState(null);

  const handleBarClick = (data) => {
    setSelectedYear(data.activeLabel);
  };

  const colors = {
    'Cyclones': '#8884d8',
    'Heat Waves': '#ff7300',
    'Cold Waves': '#0088FE',
    'Flood': '#00C49F'
  };

  const formatINR = (value) => `₹${value.toFixed(2)} Cr`;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-3">Climate Disaster Impact in India (1995-2020)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={climateDisasterData} onClick={handleBarClick}>
          <XAxis dataKey="year" stroke="#fff" />
          <YAxis yAxisId="left" orientation="left" stroke="#fff" label={{ value: 'Number of Deaths', angle: -90, position: 'insideLeft', fill: '#fff' }} />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tickFormatter={formatINR} label={{ value: 'Cost in Crores (INR)', angle: 90, position: 'insideRight', fill: '#82ca9d' }} />
          <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
          <Legend />
          {Object.keys(colors).map((key) => (
            <Bar key={key} dataKey={key} fill={colors[key]} yAxisId="left" stackId="a" />
          ))}
          <Line type="monotone" dataKey="combinedCost" yAxisId="right" stroke="#82ca9d" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
      {selectedYear && (
        <div className="mt-4 p-4 bg-gray-700 rounded-md">
          <h4 className="text-lg font-semibold">Year {selectedYear} Details:</h4>
          <p>Total Deaths: {climateDisasterData.find(d => d.year === parseInt(selectedYear)).totalDeaths}</p>
          <p>Combined Cost: {formatINR(climateDisasterData.find(d => d.year === parseInt(selectedYear)).combinedCost)}</p>
          <div className="mt-2">
            {Object.keys(colors).map(disaster => (
              <p key={disaster} style={{color: colors[disaster]}}>
                {disaster}: {climateDisasterData.find(d => d.year === parseInt(selectedYear))[disaster]} deaths
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LossEstimateVisualization;
