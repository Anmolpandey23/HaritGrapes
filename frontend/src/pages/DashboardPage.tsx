import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  GiGrapes, 
  GiFertilizerBag, 
  GiVineLeaf 
} from 'react-icons/gi';
import { 
  FaLeaf, 
  FaChartLine, 
  FaVideo, 
  FaArrowRight, 
  FaSparkles,
  FaShieldAlt
} from 'react-icons/fa6';
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

interface ActionCardProps {
  title: string;
  subtitle: string;
  tag: string;
  icon: React.ReactNode;
  iconBg: string;
  route: string;
  borderHover: string;
  glowColor: string;
  btnBg: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  subtitle,
  tag,
  icon,
  iconBg,
  route,
  borderHover,
  glowColor,
  btnBg
}) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      onClick={() => { window.location.href = route; }}
      className={`relative group cursor-pointer rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/80 p-6 shadow-md transition-all duration-300 hover:shadow-2xl ${borderHover} flex flex-col justify-between overflow-hidden`}
    >
      {/* Background glow highlight */}
      <div 
        className="absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-10 group-hover:opacity-25 transition-opacity blur-2xl pointer-events-none" 
        style={{ background: glowColor }}
      />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-13 h-13 p-3 rounded-2xl ${iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            {tag}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
        <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors flex items-center gap-1.5">
          Open Console
        </span>
        <div className={`w-8 h-8 rounded-full ${btnBg} text-white flex items-center justify-center text-xs group-hover:translate-x-1 transition-transform shadow-sm`}>
          <FaArrowRight />
        </div>
      </div>
    </motion.div>
  );
};

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  const [stats, setStats] = useState({
    totalScans: 0,
    healthy: 0,
    diseased: 0,
    avgYield: 0,
  });
  const [yieldHistory, setYieldHistory] = useState<{ timestamp: string; predictedYield: number }[]>([]);
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
      let yields: { timestamp: string; predictedYield: number }[] = [];
      try {
        yields = await fetchYieldFirestore(user.uid);
      } catch {
        const localArr = getYieldPredictionsLocal(user.uid);
        yields = localArr.map((pred: any) => ({
          timestamp: new Date(pred.timestamp).toLocaleDateString(),
          predictedYield: Number(pred.predictedYield)
        }));
      }
      setYieldHistory(yields);

      if (yields && yields.length > 0) {
        const total = yields.reduce((acc, y) => acc + (Number(y.predictedYield) || 0), 0);
        setStats(prev => ({ ...prev, avgYield: Math.round(total / yields.length) }));
      } else {
        setStats(prev => ({ ...prev, avgYield: 0 }));
      }
    };

    updateYieldStats();
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-stone-50 via-emerald-50/20 to-stone-100">
      <Header />
      
      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Welcome Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#6F2744] p-8 md:p-10 text-white shadow-xl mb-8"
        >
          {/* Subtle grape ambient particles */}
          <div className="absolute right-6 -bottom-8 opacity-15 text-9xl pointer-events-none select-none">
            🍇
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-3">
              <GiGrapes className="text-yellow-300" />
              Smart Viticulture Operations
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
              {t("welcome", { name: profile?.name || t("grower") })}
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Real-time telemetry, deep-learning foliage pathology, YOLOv5 bunch counting, and calibrated Niphad harvest forecasting for your vineyard.
            </p>
          </div>
        </motion.div>

        {/* Telemetry Stats Ribbon */}
        <DashboardStats {...stats} />

        {/* Action Suite Heading */}
        <div className="mt-10 mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <GiVineLeaf className="text-primary" />
              Vineyard Precision Command
            </h2>
            <p className="text-sm text-gray-500">Select an agronomic tool to begin diagnostics or harvest modeling.</p>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <ActionCard
            title="Grape Cluster Vision"
            subtitle="Automated YOLOv5 high-resolution grape bunch detection and cluster segmentation."
            tag="Vision AI"
            icon={<GiGrapes className="text-purple-600 text-2xl" />}
            iconBg="bg-purple-100"
            route="/cluster"
            borderHover="hover:border-purple-300"
            glowColor="#9333ea"
            btnBg="bg-purple-600"
          />

          <ActionCard
            title="Foliage Pathology Lab"
            subtitle="Diagnose Downey Mildew, Powdery Mildew, and Rot symptoms in real-time."
            tag="Health Scan"
            icon={<FaLeaf className="text-emerald-600 text-2xl" />}
            iconBg="bg-emerald-100"
            route="/disease-detection"
            borderHover="hover:border-emerald-300"
            glowColor="#059669"
            btnBg="bg-emerald-600"
          />

          <ActionCard
            title="Harvest Yield Forecaster"
            subtitle="Ensemble XGBoost prediction calibrated for Niphad & Nashik micro-climates."
            tag="Yield Forecast"
            icon={<FaChartLine className="text-amber-600 text-2xl" />}
            iconBg="bg-amber-100"
            route="/yield"
            borderHover="hover:border-amber-300"
            glowColor="#d97706"
            btnBg="bg-amber-600"
          />

          <ActionCard
            title="Precision Fertilizer Advisory"
            subtitle="Tailored nutritional chemistry and curative schedules tailored to diagnosed diseases."
            tag="Biochemistry"
            icon={<GiFertilizerBag className="text-teal-600 text-2xl" />}
            iconBg="bg-teal-100"
            route="/fertilizer"
            borderHover="hover:border-teal-300"
            glowColor="#0d9488"
            btnBg="bg-teal-600"
          />

          <ActionCard
            title="Viticulture Masterclass"
            subtitle="High-definition tutorials covering trellis pruning, cluster thinning, and irrigation."
            tag="Tutorials"
            icon={<FaVideo className="text-sky-600 text-2xl" />}
            iconBg="bg-sky-100"
            route="/learning-videos"
            borderHover="hover:border-sky-300"
            glowColor="#0284c7"
            btnBg="bg-sky-600"
          />

          {/* Average Yield Metric Banner */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-900 to-[#1B4332] text-white p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-emerald-700/30 text-8xl pointer-events-none">
              🍇
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-emerald-200">
                Average Vineyard Yield
              </span>
              <div className="mt-4">
                <div className="text-4xl font-extrabold text-white tracking-tight">
                  {stats.avgYield > 0 ? `${stats.avgYield} kg` : '—'}
                </div>
                <p className="text-xs text-emerald-200/80 mt-1">
                  {stats.avgYield > 0 ? 'Across recorded harvest predictions' : 'Run a yield simulation to populate telemetry'}
                </p>
              </div>
            </div>
            <button
              onClick={() => { window.location.href = "/yield"; }}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-accent text-gray-900 font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 shadow"
            >
              <span>Simulate New Harvest</span>
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>

        {/* Charts & Reports Section */}
        <div className="space-y-8 mt-4">
          <YieldChart yieldHistory={yieldHistory} />
          <ReportDownloader user={user} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;
