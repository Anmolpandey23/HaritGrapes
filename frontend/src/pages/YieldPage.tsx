import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';
import { saveYieldResult } from '../firebase/firestoreService';

const YIELD_API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:7000"}/predict-yield`;

const defaultFeatureValues = [0, 0, 0, 0, 0, 0, 0];

const YieldPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [clusterInfo, setClusterInfo] = useState<{ individual: Array<any>, total: number } | null>(null);
  const [predictions, setPredictions] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Load cluster and previous predictions from localStorage
  useEffect(() => {
    if (!user) return;
    const data = localStorage.getItem(`cluster_results_${user.uid}`);
    if (data) setClusterInfo(JSON.parse(data));
    const prev = localStorage.getItem(`yield_predictions_${user.uid}`);
    if (prev) setPredictions(JSON.parse(prev));
  }, [user]);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (!user || !clusterInfo || clusterInfo.total == null) return;
      setLoading(false);
      setError('');
      setMessage('');
      const prev = localStorage.getItem(`yield_predictions_${user.uid}`);
      let parsed = prev ? JSON.parse(prev) : [];
      const already = parsed.find((p: any) => Number(p.clusters) === Number(clusterInfo.total));
      if (already) {
        setPredictions(parsed);
        setMessage(`Yield already predicted for cluster count ${clusterInfo.total}.`);
        return;
      }
      setLoading(true);
      try {
        const features = [...defaultFeatureValues];
        features[5] = clusterInfo.total;
        const response = await fetch(YIELD_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ features }),
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Prediction failed');
        }
        const result = await response.json();
        const yieldValue = Number(result.predicted_yield);
        const resObj = {
          predictedYield: Math.round(yieldValue),
          advice: yieldValue >= 1000 ? 'Excellent potential yield.' : 'Consider crop improvement.',
          clusters: clusterInfo.total,
          timestamp: new Date().toISOString()
        };
        const updated = [...parsed, resObj];
        setPredictions(updated);
        localStorage.setItem(
          `yield_predictions_${user.uid}`,
          JSON.stringify(updated)
        );
        await saveYieldResult(user.uid, resObj);
      } catch (e: any) {
        setError(e.message || 'Prediction failed');
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
    // eslint-disable-next-line
  }, [user, clusterInfo]);

  const handleClear = () => {
    setPredictions([]);
    localStorage.removeItem(`yield_predictions_${user?.uid}`);
    setMessage('');
  };

  const handleDelete = (idx: number) => {
    const next = predictions.slice();
    next.splice(idx, 1);
    setPredictions(next);
    if (user) localStorage.setItem(`yield_predictions_${user.uid}`, JSON.stringify(next));
  };

  const YieldCard = ({ pred, isLatest }: { pred: any, isLatest: boolean }) => (
    <div
      className={`relative mb-4 p-6 bg-white/90 border-2 border-green-200 rounded-2xl shadow-lg transition-all duration-300
        ${isLatest ? "animate-pop ring-2 ring-green-400" : ""}
        hover:shadow-2xl hover:scale-[1.025]`}
      style={{ animation: isLatest ? "popin 0.3s" : undefined }}
    >
      <div className="absolute -top-3 right-3 text-green-600 text-base font-bold">
        {isLatest && <span className="animate-bounce">✨</span>}
      </div>
      <div className="text-xl font-bold text-green-700 mb-1">
        {pred.predictedYield} kg
      </div>
      <div className="mb-1"><span className="font-semibold text-gray-700">Clusters:</span> {pred.clusters}</div>
      <div className="mb-1">
        <span className="font-semibold text-gray-700">Advice:</span>
        <span className="ml-1 text-green-700">{pred.advice}</span>
      </div>
      <div className="text-xs text-gray-400">{new Date(pred.timestamp).toLocaleString()}</div>
      <button
        className="absolute top-3 right-7 text-red-500 font-bold underline text-sm"
        onClick={() => handleDelete(predictions.indexOf(pred))}
        title="Delete"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-4 py-8 flex flex-col">
        <h1 className="text-3xl font-bold text-primary mb-4">Yield Prediction</h1>
        <div className="mb-2 font-semibold text-primary">
          Latest Total Cluster Count: <span className="text-grape">{clusterInfo?.total ?? 'None'}</span>
        </div>
        {message && (
          <div className="text-green-600 text-md my-2 bg-green-50 p-2 rounded font-bold">{message}</div>
        )}
        {loading && <div className="text-md text-gray-700 mt-2">Calculating...</div>}
        {error && <div className="text-red-600 text-sm my-2">{error}</div>}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Your Yield Predictions:</h2>
          {predictions.length === 0 ? (
            <div className="text-lg text-gray-600 mb-6">No yield predictions yet.</div>
          ) : (
            predictions.map((pred, idx) => (
              <YieldCard key={idx} pred={pred} isLatest={idx === predictions.length - 1} />
            ))
          )}
        </div>
        <button
          className="mt-8 bg-red-600 text-white py-2 px-6 rounded font-bold transition-all duration-200 shadow-lg hover:bg-red-700 hover:scale-105"
          onClick={handleClear}
        >
          Clear Predictions
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

export default YieldPage;
