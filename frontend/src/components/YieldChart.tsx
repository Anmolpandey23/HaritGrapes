import React from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { GiGrapes } from 'react-icons/gi';
import { FaChartLine, FaChartSimple } from 'react-icons/fa6';

type YieldChartProps = {
  yieldHistory: { timestamp: string; predictedYield: number }[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-gray-800 text-xs">
        <p className="font-bold text-emerald-400 mb-1">{label}</p>
        <p className="flex items-center gap-1.5">
          <GiGrapes className="text-purple-400" />
          <span>Predicted Yield: </span>
          <span className="font-extrabold text-amber-300">{payload[0].value} kg</span>
        </p>
      </div>
    );
  }
  return null;
};

const YieldChart: React.FC<YieldChartProps> = ({ yieldHistory }) => {
  const hasData = yieldHistory && yieldHistory.length > 0;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Area Line Trend Chart */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 text-sm">
              <FaChartLine />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">Yield Trajectory</h4>
              <p className="text-xs text-gray-400">Historical forecast trend per test run</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
            {yieldHistory.length} Cycles
          </span>
        </div>

        {hasData ? (
          <div className="h-[240px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="yieldGreenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="kg" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="predictedYield" 
                  stroke="#2D6A4F" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#yieldGreenGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[240px] flex flex-col items-center justify-center text-center text-gray-400 bg-stone-50/50 rounded-2xl border border-dashed border-gray-200 p-6">
            <GiGrapes className="text-4xl text-gray-300 mb-2" />
            <p className="text-xs font-medium">No harvest records yet</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Predictions will chart here automatically</p>
          </div>
        )}
      </div>

      {/* Bar Distribution Chart */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-800 text-sm">
              <FaChartSimple />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">Harvest Magnitude</h4>
              <p className="text-xs text-gray-400">Yield output comparisons</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
            Niphad Scale
          </span>
        </div>

        {hasData ? (
          <div className="h-[240px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="kg" />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="predictedYield" 
                  fill="#6F2744" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[240px] flex flex-col items-center justify-center text-center text-gray-400 bg-stone-50/50 rounded-2xl border border-dashed border-gray-200 p-6">
            <FaChartSimple className="text-4xl text-gray-300 mb-2" />
            <p className="text-xs font-medium">No distribution data</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Execute a simulation in Yield Predictor</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YieldChart;
