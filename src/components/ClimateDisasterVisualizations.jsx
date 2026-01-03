import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, ComposedChart, Area, CartesianGrid } from 'recharts';
import { heatWaveData, coldWaveData, disasterData, stateWiseDisasterData } from '../data/climateDisasterData';

const COLORS = ['#38bdf8', '#22d3ee', '#f97316', '#818cf8'];

const ChartWrapper = ({ children, title }) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-primary pl-4">{title}</h2>
    <div className="bg-gray-800/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
      {children}
    </div>
  </div>
);

const ClimateDisasterVisualizations = () => {
  return (
    <div className="text-white mt-16">
      <h1 className="text-3xl font-bold mb-8 font-heading text-center">Climate Disaster Analysis (State-wise)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartWrapper title="Heat Wave Deaths by State">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={heatWaveData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <XAxis type="number" tick={{ fill: '#94a3b8' }} />
              <YAxis dataKey="state" type="category" tick={{ fill: '#f1f5f9', fontSize: 12 }} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} cursor={{ fill: 'transparent' }} />
              <Bar dataKey="deaths" fill="#f97316" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper title="Cold Wave Deaths by State">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={coldWaveData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <XAxis type="number" tick={{ fill: '#94a3b8' }} />
              <YAxis dataKey="state" type="category" tick={{ fill: '#f1f5f9', fontSize: 12 }} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} cursor={{ fill: 'transparent' }} />
              <Bar dataKey="deaths" fill="#38bdf8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        <ChartWrapper title="Human Life Loss Distribution">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={disasterData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {disasterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper title="State-wise Disaster Distribution">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              layout="vertical"
              data={stateWiseDisasterData}
              margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
            >
              <CartesianGrid stroke="#334155" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#94a3b8' }} />
              <YAxis dataKey="state" type="category" scale="band" tick={{ fill: '#f1f5f9', fontSize: 12 }} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              <Legend />
              <Area dataKey="flood" fill="#38bdf8" stroke="#38bdf8" fillOpacity={0.3} />
              <Bar dataKey="heatWaves" barSize={20} fill="#f97316" radius={[0, 4, 4, 0]} />
              <Bar dataKey="cyclones" barSize={20} fill="#22d3ee" radius={[0, 4, 4, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>
    </div>
  );
};
export default ClimateDisasterVisualizations;
