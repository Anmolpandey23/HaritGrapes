import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';
import { saveFertilizerResult } from '../firebase/firestoreService';

// CHANGE THIS TO MATCH YOUR API PORT!
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
        console.log('✅ Fertilizer Flask API Connected');
      })
      .catch(() => {
        setApiStatus('offline');
        console.log('❌ Fertilizer Flask API Offline');
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
      setMessage('Fertilizer already recommended for this disease.');
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

  // Card for showing a single recommendation
  const RecCard = ({ rec, isLatest }: { rec: any; isLatest: boolean }) => (
    <div
      className={`relative mb-4 p-6 bg-white border-2 border-green-200 rounded-2xl shadow transition duration-300
        ${isLatest ? 'ring-2 ring-green-400' : ''}
        hover:shadow-lg hover:scale-[1.025]`}
      style={{ animation: isLatest ? 'popin 0.3s' : undefined }}
    >
      <div className="absolute -top-3 right-3 text-green-600 font-bold">
        {isLatest && <span className="animate-bounce">✨</span>}
      </div>
      <div className="text-xl font-bold text-green-700 mb-2">{rec.fertilizer}</div>
      <div className="mb-2"><span className="font-semibold text-gray-700">Dosage:</span> {rec.dosage}</div>
      <div className="mb-2"><span className="font-semibold text-gray-700">Advice:</span> <span className="ml-1 text-green-700">{rec.advice}</span></div>
      {rec.application && (
        <div className="mb-2 text-sm bg-blue-50 p-2 rounded border-l-4 border-blue-400">
          <span className="font-semibold text-blue-800">📋 Application:</span>
          <span className="ml-1 text-blue-700">{rec.application}</span>
        </div>
      )}
      <div className="text-xs text-gray-400 mt-2">
        {new Date(rec.timestamp).toLocaleString()}
        {rec.model_output !== undefined && (
          <span className="ml-2 text-green-600 font-semibold">(AI Output: {rec.model_output})</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-4 py-8 flex flex-col">
        <h1 className="text-3xl font-bold text-primary mb-4">Fertilizer Recommendation</h1>
        <div className={`mb-3 text-sm px-3 py-2 rounded font-semibold ${
          apiStatus === 'online' ? 'bg-green-100 text-green-700' :
          apiStatus === 'offline' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {apiStatus === 'online' && 'AI Model Connected'}
          {apiStatus === 'offline' && '❌ AI Model Offline - Start fertilizer_api.py'}
          {apiStatus === 'checking' && '⏳ Checking AI Model...'}
        </div>
        <div className="mb-2 font-semibold text-primary">
          Latest Detected Disease: <span className="text-grape">{detectedDisease ?? 'None'}</span>
        </div>
        {message && (
          <div className="text-green-600 text-md my-2 bg-green-50 p-2 rounded font-bold">{message}</div>
        )}
        {loading && <div className="text-md text-gray-700 mt-2 animate-pulse">🤖 Getting AI recommendation...</div>}
        {error && <div className="text-red-600 text-sm my-2 bg-red-50 p-2 rounded">❌ {error}</div>}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Your Recommendations:</h2>
          {recommendations.length === 0 ? (
            <div className="text-lg text-gray-600 mb-6">
              No recommendations yet. Detect a disease!
            </div>
          ) : (
            recommendations
              .filter(rec => rec.disease === detectedDisease)
              .map((rec, idx) => (
                <RecCard key={idx} rec={rec} isLatest={true} />
              ))
          )}
        </div>
        <button
          className="mt-8 bg-red-600 text-white py-2 px-6 rounded font-bold transition-all duration-200 shadow-lg hover:bg-red-700 hover:scale-105"
          onClick={handleClear}
        >
          Clear Recommendations
        </button>
      </main>
      <Footer />
      <style>{`
        @keyframes popin {
          0%{transform:scale(.7);opacity:.2}
          85%{transform:scale(1.06);}
          100%{transform:scale(1);opacity:1}
        }
      `}</style>
    </div>
  );
};

export default FertilizerPage;
