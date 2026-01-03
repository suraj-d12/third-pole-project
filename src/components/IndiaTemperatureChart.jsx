import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { indiaTemperatureData } from '../data/temperatureData'; // Assuming temperature data is in a separate file

const IndiaTemperatureChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={indiaTemperatureData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis domain={[25, 27]} />
      <Tooltip />
      <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
);

export default IndiaTemperatureChart;

