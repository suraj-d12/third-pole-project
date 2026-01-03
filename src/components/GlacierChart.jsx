import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { glacierData } from '../data/glacierData';

const GlacierChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={glacierData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="area" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
);

export default GlacierChart;

