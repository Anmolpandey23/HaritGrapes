import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';
import { saveYieldResult } from '../firebase/firestoreService';
import { motion } from 'framer-motion';
import { GiGrapes } from 'react-icons/gi';
import { FaTemperatureHigh, FaTint, FaCloudRain, FaWind, FaSun } from 'react-icons/fa';

const YIELD_API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:7000"}/predict-yield`;

interface YieldFormState {
  temperature_C: string;
  humidity_pct: string;
  rainfall_mm: string;
  wind_speed_mps: string;
  uv_index: string;
  cluster_count_per_acre: string;
  avg_cluster_weight_g: string;
}

interface PredictionRecord {
  predictedYield: number;
  unit: string;
  advice: string;
  clustersPerAcre?: number;
  clusters?: number;
  clusterWeightG?: number;
  weatherSummary?: {
    temp: number;
    humidity: number;
    rain: number;
    wind: number;
    uv: number;
  };
  timestamp: string;
}

const initialFormState: YieldFormState = {
  temperature_C: '',
  humidity_pct: '',
  rainfall_mm: '',
  wind_speed_mps: '',
  uv_index: '',
  cluster_count_per_acre: '',
  avg_cluster_weight_g: ''
};

const YieldPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState<YieldFormState>(initialFormState);
  const [clusterInfo, setClusterInfo] = useState<{ individual: Array<any>; total: number } | null>(null);
  const [predictions, setPredictions] = useState<Array<PredictionRecord>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latestResult, setLatestResult] = useState<PredictionRecord | null>(null);

  // Vineyard calculator helper state
  const [showCalculator, setShowCalculator] = useState(false);
  const [vinesPerAcre, setVinesPerAcre] = useState<string>(''); // driven by user input, e.g. 600
  const [clustersPerVine, setClustersPerVine] = useState<string>('');

  // Restore cluster data and previous predictions from localStorage
  useEffect(() => {
    if (!user) return;
    const clusterData = localStorage.getItem(`cluster_results_${user.uid}`);
    if (clusterData) {
      try {
        const parsed = JSON.parse(clusterData);
        setClusterInfo(parsed);
        if (parsed.total) {
          setClustersPerVine(String(parsed.total));
        }
      } catch (err) {
        console.error('Failed to parse cluster info:', err);
      }
    }

    const prevPredictions = localStorage.getItem(`yield_predictions_${user.uid}`);
    if (prevPredictions) {
      try {
        setPredictions(JSON.parse(prevPredictions));
      } catch (err) {
        console.error('Failed to parse previous predictions:', err);
      }
    }
  }, [user]);

  const handleInputChange = (field: keyof YieldFormState, value: string) => {
    setError('');
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const applyCalculatedClusters = () => {
    const vines = parseFloat(vinesPerAcre);
    const clusters = parseFloat(clustersPerVine);
    if (!isNaN(vines) && !isNaN(clusters) && vines > 0 && clusters > 0) {
      const calculated = Math.round(vines * clusters);
      setFormData(prev => ({ ...prev, cluster_count_per_acre: String(calculated) }));
      setShowCalculator(false);
    }
  };

  const validateForm = (): number[] | null => {
    const {
      temperature_C,
      humidity_pct,
      rainfall_mm,
      wind_speed_mps,
      uv_index,
      cluster_count_per_acre,
      avg_cluster_weight_g
    } = formData;

    if (
      !temperature_C ||
      !humidity_pct ||
      !rainfall_mm ||
      !wind_speed_mps ||
      !uv_index ||
      !cluster_count_per_acre ||
      !avg_cluster_weight_g
    ) {
      setError('Please fill in all 7 weather and crop features before predicting.');
      return null;
    }

    const temp = parseFloat(temperature_C);
    const hum = parseFloat(humidity_pct);
    const rain = parseFloat(rainfall_mm);
    const wind = parseFloat(wind_speed_mps);
    const uv = parseFloat(uv_index);
    const clusters = parseFloat(cluster_count_per_acre);
    const weight = parseFloat(avg_cluster_weight_g);

    if (
      [temp, hum, rain, wind, uv, clusters, weight].some(v => isNaN(v) || !isFinite(v))
    ) {
      setError('All 7 values must be valid finite numbers.');
      return null;
    }

    if (hum < 0 || hum > 100) {
      setError('Humidity must be between 0% and 100%.');
      return null;
    }
    if (rain < 0) {
      setError('Rainfall cannot be negative.');
      return null;
    }
    if (wind < 0) {
      setError('Wind speed cannot be negative.');
      return null;
    }
    if (uv < 0) {
      setError('UV index cannot be negative.');
      return null;
    }
    if (clusters <= 0) {
      setError('Cluster count per acre must be greater than zero.');
      return null;
    }
    if (weight <= 0) {
      setError('Average cluster weight must be greater than zero.');
      return null;
    }

    return [temp, hum, rain, wind, uv, clusters, weight];
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    const validatedFeatures = validateForm();
    if (!validatedFeatures) return;

    setLoading(true);
    setLatestResult(null);

    try {
      const response = await fetch(YIELD_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: validatedFeatures }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${response.status})`);
      }

      const result = await response.json();
      const yieldVal = Number(result.predicted_yield);
      if (isNaN(yieldVal)) {
        throw new Error('Received non-numeric prediction from backend.');
      }

      const adviceText =
        yieldVal >= 5000
          ? 'High yield projected. Ensure balanced potassium and canopy management.'
          : yieldVal >= 3000
          ? 'Normal commercial yield projected for Niphad region.'
          : 'Lower yield projected. Consider nutritional review and irrigation adjustments.';

      const record: PredictionRecord = {
        predictedYield: Math.round(yieldVal * 100) / 100,
        unit: 'kg/acre',
        advice: adviceText,
        clustersPerAcre: validatedFeatures[5],
        clusterWeightG: validatedFeatures[6],
        weatherSummary: {
          temp: validatedFeatures[0],
          humidity: validatedFeatures[1],
          rain: validatedFeatures[2],
          wind: validatedFeatures[3],
          uv: validatedFeatures[4]
        },
        timestamp: new Date().toISOString()
      };

      setLatestResult(record);
      const updated = [record, ...predictions];
      setPredictions(updated);

      if (user) {
        localStorage.setItem(`yield_predictions_${user.uid}`, JSON.stringify(updated));
        await saveYieldResult(user.uid, record).catch(err =>
          console.warn('Could not save to Firestore:', err)
        );
      }
    } catch (err: any) {
      setError(err.message || 'Yield prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPredictions([]);
    setLatestResult(null);
    if (user) {
      localStorage.removeItem(`yield_predictions_${user.uid}`);
    }
  };

  const handleDelete = (idx: number) => {
    const next = predictions.slice();
    next.splice(idx, 1);
    setPredictions(next);
    if (user) {
      localStorage.setItem(`yield_predictions_${user.uid}`, JSON.stringify(next));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-emerald-50/20 to-purple-50/20">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 flex flex-col w-full">
        {/* Title & Badge */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-300">
            <GiGrapes className="text-base text-grape" />
            <span>Niphad Viticulture Model (2025 Web Edition)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Grape Yield Prediction
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto">
            Input micro-climatic readings and vineyard canopy parameters to predict commercial harvest yield per acre.
          </p>
        </div>

        {/* Cluster Scan Reference Callout */}
        {clusterInfo && clusterInfo.total != null && (
          <div className="mb-6 p-4 sm:p-5 bg-purple-50/80 backdrop-blur-md border border-purple-200 rounded-2xl shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  Image Scan Reference
                </span>
                <p className="text-sm text-purple-950 font-bold mt-1.5 flex items-center gap-1.5">
                  <GiGrapes className="text-lg text-grape" />
                  <span>Latest scan detected <strong>{clusterInfo.total} clusters</strong> in sample images.</span>
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  Commercial vineyards in Maharashtra typically have 8,000–15,000 mature clusters per acre. Use the estimator to scale up:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCalculator(!showCalculator)}
                className="text-xs font-bold text-purple-800 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-xl transition whitespace-nowrap ml-2"
              >
                {showCalculator ? 'Hide Estimator' : 'Per-Acre Estimator'}
              </button>
            </div>

            {/* Optional Calculator */}
            {showCalculator && (
              <div className="mt-4 pt-4 border-t border-purple-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Vines / Acre</label>
                  <input
                    type="number"
                    value={vinesPerAcre}
                    onChange={e => setVinesPerAcre(e.target.value)}
                    placeholder="e.g. 600"
                    className="w-full text-xs px-3 py-2 border rounded-xl mt-1 bg-white focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Clusters / Vine</label>
                  <input
                    type="number"
                    value={clustersPerVine}
                    onChange={e => setClustersPerVine(e.target.value)}
                    placeholder="e.g. 60"
                    className="w-full text-xs px-3 py-2 border rounded-xl mt-1 bg-white focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={applyCalculatedClusters}
                    className="w-full text-xs bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 px-3 rounded-xl shadow transition"
                  >
                    Apply to Form
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Prediction Form */}
        <form onSubmit={handlePredict} className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 mb-8 transition-all">
          <h2 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            <span>1. Meteorological Weather Readings</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <FaTemperatureHigh className="text-orange-500" />
                <span>Temperature (°C)</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.temperature_C}
                onChange={e => handleInputChange('temperature_C', e.target.value)}
                placeholder="e.g. 30.5"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Seasonal mean canopy temperature</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <FaTint className="text-blue-500" />
                <span>Relative Humidity (%)</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                value={formData.humidity_pct}
                onChange={e => handleInputChange('humidity_pct', e.target.value)}
                placeholder="e.g. 62.0"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Atmospheric relative humidity</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <FaCloudRain className="text-indigo-500" />
                <span>Rainfall (mm)</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={formData.rainfall_mm}
                onChange={e => handleInputChange('rainfall_mm', e.target.value)}
                placeholder="e.g. 15.0"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Seasonal precipitation depth</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <FaWind className="text-teal-500" />
                <span>Wind Speed (m/s)</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={formData.wind_speed_mps}
                onChange={e => handleInputChange('wind_speed_mps', e.target.value)}
                placeholder="e.g. 2.8"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Mean wind velocity</span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <FaSun className="text-amber-500" />
                <span>Solar UV Index</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={formData.uv_index}
                onChange={e => handleInputChange('uv_index', e.target.value)}
                placeholder="e.g. 6.5"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Solar ultraviolet radiation index</span>
            </div>
          </div>

          <h2 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2 pt-4 border-t border-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
            <span>2. Crop & Canopy Parameters</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <GiGrapes className="text-grape" />
                <span>Cluster Count (per acre)</span>
              </label>
              <input
                type="number"
                step="1"
                min="1"
                required
                value={formData.cluster_count_per_acre}
                onChange={e => handleInputChange('cluster_count_per_acre', e.target.value)}
                placeholder="e.g. 11000 (calibrated 8,000–15,000)"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Total bunches per acre</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <GiGrapes className="text-emerald-600" />
                <span>Avg Cluster Weight (grams)</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                required
                value={formData.avg_cluster_weight_g}
                onChange={e => handleInputChange('avg_cluster_weight_g', e.target.value)}
                placeholder="e.g. 350.0 (calibrated 200–500g)"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Average mature bunch weight</span>
            </div>

            {((formData.cluster_count_per_acre && parseFloat(formData.cluster_count_per_acre) < 8000) ||
              (formData.avg_cluster_weight_g && parseFloat(formData.avg_cluster_weight_g) < 200)) && (
              <div className="sm:col-span-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <strong>Model Calibrated Range Note:</strong> The XGBoost model is calibrated for commercial vineyard ranges (~8,000–15,000 clusters/acre and bunch weights of ~200–500g). Inputs below these ranges fall below the lowest tree split boundaries, causing the model to output its base floor value (~1,850–2,060 kg/acre).
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-6 bg-gradient-to-r from-primary to-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
              loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Calculating Forecast...</span>
              </>
            ) : (
              <span>Predict Harvest Yield</span>
            )}
          </button>
        </form>

        {/* Latest Prediction Card */}
        {latestResult && (
          <div className="mb-8 p-6 sm:p-8 bg-gradient-to-br from-[#1E5128] via-[#2D6A4F] to-[#1B4332] text-white rounded-3xl shadow-2xl border border-emerald-400/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-accent bg-white/10 px-3 py-1 rounded-full border border-white/20">
                ⭐ Forecasted Harvest Yield
              </span>
              <span className="text-xs text-emerald-200">
                {new Date(latestResult.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-black text-accent my-2 tracking-tight">
              {latestResult.predictedYield.toLocaleString()} <span className="text-2xl text-white font-bold">{latestResult.unit}</span>
            </div>
            <p className="text-sm sm:text-base text-emerald-100 font-medium mb-4 leading-relaxed">
              {latestResult.advice}
            </p>
            <div className="text-xs text-emerald-200/90 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-emerald-500/30">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">Clusters: <strong className="text-white block">{latestResult.clustersPerAcre?.toLocaleString() ?? latestResult.clusters ?? '—'} /acre</strong></div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">Bunch Wt: <strong className="text-white block">{latestResult.clusterWeightG ?? '—'} g</strong></div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">Temperature: <strong className="text-white block">{latestResult.weatherSummary?.temp ?? '—'} °C</strong></div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">Humidity: <strong className="text-white block">{latestResult.weatherSummary?.humidity ?? '—'}%</strong></div>
            </div>
          </div>
        )}

        {/* Historical Predictions */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Prediction History</h2>
            {predictions.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-600 hover:text-red-800 font-semibold underline"
              >
                Clear History
              </button>
            )}
          </div>

          {predictions.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">
              No yield predictions recorded yet. Fill in the form above to generate your first forecast.
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.map((pred, idx) => (
                <div
                  key={idx}
                  className="relative p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="absolute top-4 right-4 text-xs text-gray-400 hover:text-red-600 font-medium"
                    title="Delete record"
                  >
                    Delete
                  </button>
                  <div className="text-xl font-bold text-green-700">
                    {pred.predictedYield.toLocaleString()} {pred.unit || 'kg/acre'}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {new Date(pred.timestamp).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Advice:</span> {pred.advice}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">Inputs:</span> {pred.clustersPerAcre?.toLocaleString() ?? pred.clusters ?? '—'} clusters/acre
                    {pred.clusterWeightG ? ` • ${pred.clusterWeightG}g avg bunch` : ''}
                    {pred.weatherSummary ? ` • ${pred.weatherSummary.temp}°C, ${pred.weatherSummary.humidity}% hum` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default YieldPage;
