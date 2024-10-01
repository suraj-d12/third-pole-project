import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { disasterData, economicData } from '../data/climateDisasterData';

const processData = () => {
  const years = Array.from({ length: 29 }, (_, i) => 1995 + i);
  
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

const DisasterImpactDashboard = () => {
  const [data] = useState(processData());
  const [selectedYear, setSelectedYear] = useState(null);

  const handleBarClick = (data) => {
    setSelectedYear(data.activeLabel);
  };

  const colors = {
    'Flood': '#00C49F',
    'Storm': '#8884d8',
    'Earthquake': '#ff7300',
    'Other': '#0088FE'
  };

  const formatINR = (value) => `₹${value.toFixed(2)} Cr`;

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-800 text-white">
      <CardHeader>
        <h2 className="text-2xl font-bold">Climate Disaster Impact in India (1995-2023)</h2>
        <p>Tracking lives lost and economic damage from multiple disaster types</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data} onClick={handleBarClick}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" stroke="#fff" />
            <YAxis yAxisId="left" orientation="left" stroke="#fff" label={{ value: 'Number of Deaths', angle: -90, position: 'insideLeft', fill: '#fff' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tickFormatter={formatINR} label={{ value: 'Cost in Crores (INR)', angle: 90, position: 'insideRight', fill: '#82ca9d' }} />
            <Tooltip 
              formatter={(value, name, props) => [name === 'combinedCost' ? formatINR(value) : value, name]}
              contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            {Object.keys(colors).map((key) => (
              <Bar key={key} dataKey={key} fill={colors[key]} yAxisId="left" stackId="a" />
            ))}
            <Line type="monotone" dataKey="combinedCost" yAxisId="right" stroke="#82ca9d" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
        {selectedYear && (
          <div className="mt-4 p-4 bg-gray-700 rounded-md">
            <h3 className="text-lg font-semibold">Year {selectedYear} Details:</h3>
            <p>Total Deaths: {data.find(d => d.year === parseInt(selectedYear)).totalDeaths}</p>
            <p>Combined Cost: {formatINR(data.find(d => d.year === parseInt(selectedYear)).combinedCost)}</p>
            <div className="mt-2">
              {Object.keys(colors).map(disaster => (
                <p key={disaster} style={{color: colors[disaster]}}>
                  {disaster}: {data.find(d => d.year === parseInt(selectedYear))[disaster]} deaths
                </p>
              ))}
            </div>
          </div>
        )}
        <p className="mt-4 text-sm text-gray-400">
          This visualization shows the impact of multiple climate disasters in India from 1995 to 2023. 
          The stacked bars represent lives lost due to different disaster types, while the green line shows the actual economic damage.
          Click on a year to see detailed information.
        </p>
      </CardContent>
    </Card>
  );
};

export default DisasterImpactDashboard;


