import React from 'react';

type DashboardStatsProps = {
  totalScans: number;
  healthy: number;
  diseased: number;
  avgYield: number;
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ totalScans, healthy, diseased, avgYield }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div className="flex flex-col bg-white shadow-lg rounded-lg px-6 py-5 items-center">
      <span className="text-2xl text-primary font-bold">{totalScans}</span>
      <span className="text-sm text-gray-600">Total Scans</span>
    </div>
    <div className="flex flex-col bg-white shadow-lg rounded-lg px-6 py-5 items-center">
      <span className="text-2xl text-green-600 font-bold">{healthy}</span>
      <span className="text-sm text-gray-600">Healthy</span>
    </div>
    <div className="flex flex-col bg-white shadow-lg rounded-lg px-6 py-5 items-center">
      <span className="text-2xl text-red-600 font-bold">{diseased}</span>
      <span className="text-sm text-gray-600">Diseased</span>
    </div>
    <div className="flex flex-col bg-white shadow-lg rounded-lg px-6 py-5 items-center">
      <span className="text-2xl text-purple-600 font-bold">{avgYield.toFixed(1)}kg</span>
      <span className="text-sm text-gray-600">Avg Yield</span>
    </div>
  </div>
);

export default DashboardStats;
