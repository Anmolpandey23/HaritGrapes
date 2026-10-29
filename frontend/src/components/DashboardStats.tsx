import React from 'react';
import { GiGrapes, GiPlantRoots } from 'react-icons/gi';
import { FaLeaf, FaExclamationTriangle } from 'react-icons/fa';

type DashboardStatsProps = {
  totalScans: number;
  healthy: number;
  diseased: number;
  avgYield: number;
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ totalScans, healthy, diseased, avgYield }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    {/* Total Scans */}
    <div className="flex flex-col bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-2xl p-5 shadow-lg shadow-emerald-950/5 hover:-translate-y-1 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Scans</span>
        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-primary text-base">
          <FaLeaf />
        </div>
      </div>
      <span className="text-2xl sm:text-3xl text-gray-900 font-black">{totalScans}</span>
      <span className="text-[11px] text-emerald-700 font-semibold mt-1">Canopy & leaf diagnostic checks</span>
    </div>

    {/* Healthy */}
    <div className="flex flex-col bg-white/95 backdrop-blur-xl border border-green-100 rounded-2xl p-5 shadow-lg shadow-emerald-950/5 hover:-translate-y-1 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Healthy Foliage</span>
        <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-600 text-base">
          <GiPlantRoots />
        </div>
      </div>
      <span className="text-2xl sm:text-3xl text-green-600 font-black">{healthy}</span>
      <span className="text-[11px] text-green-700 font-semibold mt-1">Clean berry & leaf samples</span>
    </div>

    {/* Diseased */}
    <div className="flex flex-col bg-white/95 backdrop-blur-xl border border-red-100 rounded-2xl p-5 shadow-lg shadow-emerald-950/5 hover:-translate-y-1 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pathology Alerts</span>
        <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-500 text-base">
          <FaExclamationTriangle />
        </div>
      </div>
      <span className="text-2xl sm:text-3xl text-red-600 font-black">{diseased}</span>
      <span className="text-[11px] text-red-700 font-semibold mt-1">Mildew or rot symptoms flagged</span>
    </div>

    {/* Avg Yield */}
    <div className="flex flex-col bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl p-5 shadow-lg shadow-purple-950/5 hover:-translate-y-1 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Projected Yield</span>
        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-grape text-lg">
          <GiGrapes />
        </div>
      </div>
      <span className="text-2xl sm:text-3xl text-purple-900 font-black">
        {avgYield > 0 ? `${avgYield.toLocaleString()}` : '—'}
        <span className="text-sm font-bold text-purple-700 ml-1">kg/acre</span>
      </span>
      <span className="text-[11px] text-purple-700 font-semibold mt-1">Niphad viticulture forecast</span>
    </div>
  </div>
);

export default DashboardStats;

