import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';
import { saveFertilizerResult } from '../firebase/firestoreService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiFertilizerBag, 
  GiVineLeaf, 
  GiWaterDrop,
  GiPlantRoots 
} from 'react-icons/gi';
import { 
  FaFlask, 
  FaTriangleExclamation, 
  FaCircleCheck, 
  FaClock, 
  FaTrashCan,
  FaArrowRight,
  FaShieldVirus
} from 'react-icons/fa6';

const FERTILIZER_API_BASE = import.meta.env.VITE_API_URL || "http://localhost:7000";

const FertilizerPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [detectedDisease, setDetectedDisease] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Health-check endpoint
  useEffect(() => {
    fetch(`${FERTILIZER_API_BASE}/health`)
      .then(res => res.json())
      .then(() => {
        setApiStatus('online');
      })
      .catch(() => {
        setApiStatus('offline');
      });
  }, []);

  // Load detected disease and recommendations from localStorage
  useEffect(() => {
    if (!user) return;
    const disease = localStorage.getItem(`latest_detected_disease_${user.uid}`);
    setDetectedDisease(disease ?? null);
    const stored = localStorage.getItem(`fertilizer_recommendations_${user.uid}`);
    if (stored) setRecommendations(JSON.parse(stored));
  }, [user]);

  // Fetch recommendation when detectedDisease changes
  useEffect(() => {
    if (!user || !detectedDisease || apiStatus !== 'online') return;
    setLoading(false);
    setError('');
    setMessage('');
    const stored = localStorage.getItem(`fertilizer_recommendations_${user.uid}`);
    let parsed = stored ? JSON.parse(stored) : [];
    const already = parsed.find((rec: any) => rec.disease === detectedDisease);
    if (already) {
      setRecommendations(parsed);
      setMessage('Fertilizer schedule already formulated for this pathology.');
      return;
    }
    const fetchRecommendation = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${FERTILIZER_API_BASE}/recommend-fertilizer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ disease: detectedDisease })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Prediction failed');
        }
        const result = await response.json();
        const resObj = {
          ...result,
          disease: detectedDisease,
          timestamp: new Date().toISOString()
        };
        const updated = [...parsed, resObj];
        setRecommendations(updated);
        localStorage.setItem(
          `fertilizer_recommendations_${user.uid}`,
          JSON.stringify(updated)
        );
        await saveFertilizerResult(user.uid, resObj);
      } catch (e: any) {
        setError(e.message || 'Failed to get recommendation');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendation();
  }, [user, detectedDisease, apiStatus]);

  const handleClear = () => {
    setRecommendations([]);
    localStorage.removeItem(`fertilizer_recommendations_${user?.uid}`);
    setMessage('');
  };

  const RecCard = ({ rec, isLatest }: { rec: any; isLatest: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-3xl bg-white/95 backdrop-blur-xl border p-6 sm:p-7 shadow-md mb-6 transition-all duration-300 ${
        isLatest ? 'border-emerald-300 ring-2 ring-emerald-400/20 shadow-lg' : 'border-gray-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1.5">
            <GiFertilizerBag className="text-emerald-600" />
            Curative Nutrient Formulation
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            {rec.fertilizer}
          </h3>
        </div>

        {rec.disease && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-stone-100 text-gray-700">
            <FaShieldVirus className="text-rose-500" />
            Target: {rec.disease}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
            <GiWaterDrop className="text-emerald-600" />
            Prescribed Dosage
          </div>
          <div className="text-base font-semibold text-emerald-950">
            {rec.dosage}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 flex items-center gap-1.5">
            <FaFlask className="text-purple-600" />
            Biochemical Action
          </div>
          <div className="text-sm text-gray-800">
            {rec.advice}
          </div>
        </div>
      </div>

      {rec.application && (
        <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-1 flex items-center gap-1.5">
            <FaClock className="text-sky-600" />
            Application Method & Canopy Timing
          </div>
          <div className="text-sm text-sky-950 leading-relaxed">
            {rec.application}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-400">
        <span>Formulated on {new Date(rec.timestamp).toLocaleString()}</span>
        {rec.model_output !== undefined && (
          <span className="font-semibold text-emerald-600">Model Output Class: {rec.model_output}</span>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-stone-50 via-emerald-50/20 to-stone-100">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <GiPlantRoots className="text-emerald-700" />
              Nutritional Biochemistry
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Precision Fertilizer Advisory
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Curated agronomic nutrients and biological fungicides tailored to diagnosed vineyard pathogens.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`flex h-3 w-3 relative ${apiStatus === 'online' ? '' : 'opacity-70'}`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                apiStatus === 'online' ? 'bg-emerald-400' : 'bg-rose-400'
              } opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                apiStatus === 'online' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}></span>
            </span>
            <span className="text-xs font-medium text-gray-600">
              {apiStatus === 'online' ? 'Decision Tree Advisory Online' : 'Checking Model Connectivity...'}
            </span>
          </div>
        </div>

        {/* Pathology Context Banner */}
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/80 p-6 sm:p-7 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Active Diagnostic Target
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-gray-900">
                  {detectedDisease ? detectedDisease : 'No Active Disease Diagnosis'}
                </span>
                {detectedDisease && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    Symptomatic
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {detectedDisease 
                  ? 'Our biochemical model correlates this pathogen with specific active foliar solutions.'
                  : 'Run a leaf pathology scan in Disease Detection to auto-generate personalized treatments.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!detectedDisease && (
                <button
                  onClick={() => { window.location.href = '/disease-detection'; }}
                  className="py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-800 transition flex items-center gap-2 shadow"
                >
                  <GiVineLeaf />
                  <span>Scan Foliage First</span>
                </button>
              )}
              {recommendations.length > 0 && (
                <button
                  onClick={handleClear}
                  className="py-2.5 px-4 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <FaTrashCan className="text-rose-500 text-xs" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status / Loading alerts */}
        {message && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 font-medium">
            <FaCircleCheck className="text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {loading && (
          <div className="mb-6 p-6 rounded-3xl bg-white/80 border border-emerald-200 shadow-sm flex items-center justify-center gap-3 text-emerald-800 font-semibold animate-pulse">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Evaluating Decision Tree Model for Curative Formulation...</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <FaTriangleExclamation />
            <span>{error}</span>
          </div>
        )}

        {/* Recommendations List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2">
            <GiVineLeaf className="text-primary" />
            Formulated Recommendations
          </h2>

          {recommendations.length === 0 ? (
            <div className="rounded-3xl bg-white/70 border border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
              <GiFertilizerBag className="text-6xl text-gray-300 mb-3 animate-grape-float" />
              <h3 className="text-lg font-bold text-gray-700">No active fertilizer schedules</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-1 mb-6">
                Perform a grape leaf scan in Disease Detection, and the system will automatically dispatch the agronomic cure here.
              </p>
              <button
                onClick={() => { window.location.href = '/disease-detection'; }}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-[#1B4332] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md flex items-center gap-2"
              >
                <span>Go to Foliage Diagnostics</span>
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations
                .filter(rec => !detectedDisease || rec.disease === detectedDisease)
                .map((rec, idx) => (
                  <RecCard key={idx} rec={rec} isLatest={idx === recommendations.length - 1} />
                ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FertilizerPage;
