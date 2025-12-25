import React from 'react';
import { LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type YieldChartProps = {
  yieldHistory: { timestamp: string; predictedYield: number }[];
};

const YieldChart: React.FC<YieldChartProps> = ({ yieldHistory }) => (
  <div className="w-full flex flex-col md:flex-row gap-8">
    <div className="w-full md:w-1/2 bg-white rounded-lg shadow px-3 py-4">
      <h4 className="font-bold mb-2 text-grape">Yield Trend</h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={yieldHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="predictedYield" stroke="#3E7C17" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="w-full md:w-1/2 bg-white rounded-lg shadow px-3 py-4">
      <h4 className="font-bold mb-2 text-grape">Yield Distribution</h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={yieldHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="predictedYield" fill="#DED36D" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default YieldChart;
