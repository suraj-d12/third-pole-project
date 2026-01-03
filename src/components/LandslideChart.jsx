import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { landslideData } from '../data/landslideData';

const LandslideChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={landslideData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="deaths" stroke="#ff7300" />
    </LineChart>
  </ResponsiveContainer>
);

export default LandslideChart;

