import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, ComposedChart, Area, CartesianGrid } from 'recharts';
import { heatWaveData, coldWaveData, disasterData, stateWiseDisasterData } from '../data/climateDisasterData';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const ChartWrapper = ({ children, title }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
    {children}
  </div>
);

const ClimateDisasterVisualizations = () => {
	return (
  <div className="p-8 bg-gray-900 text-white">
    <h1 className="text-2xl font-bold mb-8">Climate Disaster Visualizations (1995-2020)</h1>

    <ChartWrapper title="Heat Wave Deaths by State">
      <ResponsiveContainer width="100%" height={600}>
        <BarChart data={heatWaveData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <XAxis type="number" tick={{fill: 'white'}} />
          <YAxis dataKey="state" type="category" tick={{fill: 'white'}} width={100} />
          <Tooltip contentStyle={{backgroundColor: '#333'}} />
          <Bar dataKey="deaths" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>

    <ChartWrapper title="Cold Wave Deaths by State">
      <ResponsiveContainer width="100%" height={600}>
        <BarChart data={coldWaveData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <XAxis type="number" tick={{fill: 'white'}} />
          <YAxis dataKey="state" type="category" tick={{fill: 'white'}} width={100} />
          <Tooltip contentStyle={{backgroundColor: '#333'}} />
          <Bar dataKey="deaths" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>

    <ChartWrapper title="Human Life Loss by Climatic Disasters">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={disasterData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {disasterData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{backgroundColor: '#333'}} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>

    <ChartWrapper title="State-wise Distribution of Deaths by Climatic Disasters">
      <ResponsiveContainer width="100%" height={800}>
        <ComposedChart
          layout="vertical"
          data={stateWiseDisasterData}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 100,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis type="number" tick={{fill: 'white'}} />
          <YAxis dataKey="state" type="category" scale="band" tick={{fill: 'white'}} width={100} />
          <Tooltip contentStyle={{backgroundColor: '#333'}} />
          <Legend />
          <Area dataKey="flood" fill="#8884d8" stroke="#8884d8" />
          <Bar dataKey="coldWaves" barSize={20} fill="#413ea0" />
          <Bar dataKey="heatWaves" barSize={20} fill="#ff7300" />
          <Bar dataKey="cyclones" barSize={20} fill="#82ca9d" />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  </div>
);

export default ClimateDisasterVisualizations;
