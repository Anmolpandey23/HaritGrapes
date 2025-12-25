import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DashboardStats from '../components/DashboardStats';
import ReportDownloader from '../components/ReportDownloader';
import YieldChart from '../components/YieldChart';
import { getUserProfile } from '../firebase/firestoreService';
import { db, auth } from '../firebase/firebaseConfig';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

// Helper for fetching scan results from Firestore
async function fetchScanResults(userId: string) {
  const q = query(collection(db, 'users', userId, 'scans'), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data());
}

// Helper for Firestore yield records
async function fetchYieldFirestore(userId: string) {
  const q = query(collection(db, 'users', userId, 'yield'), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({
    timestamp: new Date(doc.data().timestamp).toLocaleDateString(),
    predictedYield: doc.data().predictedYield
  })).reverse();
}

// Helper for yield predictions from localStorage
function getYieldPredictionsLocal(userId: string) {
  const raw = localStorage.getItem(`yield_predictions_${userId}`);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  const [stats, setStats] = useState({
    totalScans: 0,
    healthy: 0,
    diseased: 0,
    avgYield: 0,
  });
  const [yieldHistory, setYieldHistory] = useState<{ timestamp: string, predictedYield: number }[]>([]);
  const [profile, setProfile] = useState<{ name?: string } | null>(() => {
    const cachedName = localStorage.getItem("grape_profile_name");
    return cachedName ? { name: cachedName } : null;
  });

  useEffect(() => {
    if (!user) return;

    // 1. SCANS
    fetchScanResults(user.uid).then(scans => {
      const totalScans = scans.length;
      const healthy = scans.filter(scan => scan.disease === 'Healthy Leaves').length;
      const diseased = totalScans - healthy;

      setStats(prev => ({
        ...prev,
        totalScans,
        healthy,
        diseased
      }));
    });

    // 2. User profile
    getUserProfile(user.uid).then(p => {
      setProfile(p);
      if (p?.name) localStorage.setItem("grape_profile_name", p.name);
    });

    // 3. YIELD - Try Firestore, fallback to localStorage, always update stats.avgYield
    const updateYieldStats = async () => {
      let yields: { timestamp: string, predictedYield: number }[] = [];
      try {
        yields = await fetchYieldFirestore(user.uid);
      } catch {
        // fallback
        const localArr = getYieldPredictionsLocal(user.uid);
        yields = localArr.map((pred: any) => ({
          timestamp: new Date(pred.timestamp).toLocaleDateString(),
          predictedYield: Number(pred.predictedYield)
        }));
      }
      setYieldHistory(yields);

      // Calculate average yield for dashboard
      if (yields && yields.length > 0) {
        const total = yields.reduce((acc, y) => acc + (Number(y.predictedYield) || 0), 0);
        setStats(prev =>
          ({ ...prev, avgYield: Math.round(total / yields.length) })
        );
      } else {
        setStats(prev => ({ ...prev, avgYield: 0 }));
      }
    };

    updateYieldStats();
  }, [user]);

  if (!user) return null;

  // Card wrapper (with animation)
  const CardFrame: React.FC<{ children: React.ReactNode; buttonText: string; onButton?: () => void; icon?: React.ReactNode; accent?: string; }> = ({
    children, buttonText, onButton, icon, accent
  }) => (
    <div
      className={`
        bg-white border-2 ${accent || "border-gray-300"} rounded-2xl shadow-lg px-7 py-6 mx-auto w-full
        transition-all duration-300 flex flex-col items-center relative group cursor-pointer animate-pop
        hover:scale-105 hover:border-opacity-70 hover:shadow-2xl
      `}
      style={{ maxWidth: 340, minHeight: 190, margin: "0 1rem" }}
    >
      {icon && <div className="absolute left-5 top-4 text-3xl">{icon}</div>}
      {children}
      <button
        className={`
          mt-5 px-5 py-2 text-white font-bold rounded transition shadow
          ${accent || "bg-primary"} hover:brightness-110 hover:scale-105`}
        style={{ background: accent }}
        onClick={e => { e.stopPropagation(); onButton && onButton(); }}
      >
        {buttonText}
      </button>
    </div>
  );


  // Cards
  const goTo = (route: string) => { window.location.href = route; };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-6">
        <h1 className="text-3xl md:text-4xl font-bold mt-4 text-primary mb-4 flex items-center gap-2 mx-auto text-center">
          {t("welcome", { name: profile?.name || t("grower") })}
        </h1>
        <DashboardStats {...stats} />
        <div className="flex flex-col items-center justify-center w-full mb-10">
          <div className="flex flex-wrap justify-center gap-10 w-full" style={{ marginTop: 24 }}>
            <CardFrame
              onButton={() => goTo("/cluster")}
              icon={<span>🍇</span>}
              buttonText="Go to Cluster Detection"
              accent="linear-gradient(90deg,#9f7aea 60%,#805ad5 100%)"
            >
              <div className="text-lg font-bold text-purple-800 mb-1 text-center">
                Cluster Count
              </div>
              <div className="text-md text-purple-700 text-center">
                Automated cluster segment counting with AI.
              </div>
            </CardFrame>
            <CardFrame
              onButton={() => goTo("/disease-detection")}
              icon={<span>🦠</span>}
              buttonText="Go to Disease Detection"
              accent="linear-gradient(90deg,#48bb78 60%,#38a169 100%)"
            >
              <div className="text-lg font-bold text-green-800 mb-1 text-center">
                Disease Detection
              </div>
              <div className="text-md text-green-700 text-center">
                Diagnose your grape leaves instantly.
              </div>
            </CardFrame>
            <CardFrame
              onButton={() => goTo("/learning-videos")}
              icon={<span className="text-blue-500">🎬</span>}
              buttonText="Go to Learning"
              accent="linear-gradient(90deg,#0ea5e9 60%,#3b82f6 100%)"
            >
              <div className="text-lg font-bold text-blue-800 mb-1 text-center">
                Video Learning
                <span className="inline-block text-lg text-yellow-400 animate-bounce ml-2">✨</span>
              </div>
              <div className="text-md text-blue-700 text-center">
                Learn spraying fertilizer, best practices & more!
              </div>
            </CardFrame>
          </div>
        </div>
        {/* Display average yield at dashboard-level */}
        <div className="mx-auto w-full max-w-md mt-4 mb-6 px-4">
          <div className="bg-green-100 border border-green-400 rounded-xl p-6 flex flex-col items-center">
            <div className="text-xl font-bold text-green-800 mb-1">Average Yield</div>
            <div className={`text-3xl font-extrabold ${stats.avgYield ? 'text-green-700' : 'text-gray-400'}`}>{stats.avgYield > 0 ? `${stats.avgYield} kg` : 'No yield predictions yet'}</div>
          </div>
        </div>

        <YieldChart yieldHistory={yieldHistory} />
        <ReportDownloader user={user} />
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
