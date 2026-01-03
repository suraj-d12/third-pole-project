import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { weatherData } from '../data/weatherData';

const PrecipitationChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={weatherData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="precipitation" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
);

export default PrecipitationChart;

