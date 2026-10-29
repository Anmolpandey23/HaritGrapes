import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  GiGrapes, 
  GiVineLeaf, 
  GiPlantRoots, 
  GiFertilizerBag 
} from 'react-icons/gi';
import { 
  FaCamera, 
  FaLeaf, 
  FaChartLine, 
  FaCircleCheck, 
  FaArrowRight,
  FaShieldHalved
} from 'react-icons/fa6';

export default function LandingPage() {
  const navigate = useNavigate();

  const workflowSteps = [
    {
      step: "01",
      icon: <FaCamera className="text-emerald-400 text-2xl" />,
      iconBg: "bg-emerald-900/60 border-emerald-500/30",
      title: "Canopy Acquisition",
      desc: "Snap foliage or cluster photographs directly from your vineyard trellis rows.",
      badge: "Vision Input"
    },
    {
      step: "02",
      icon: <FaLeaf className="text-green-400 text-2xl" />,
      iconBg: "bg-green-950/60 border-green-500/30",
      title: "Pathology Diagnosis",
      desc: "Neural network detects Downey Mildew, Powdery Mildew, & Black Rot in milliseconds.",
      badge: "Deep Learning"
    },
    {
      step: "03",
      icon: <GiGrapes className="text-purple-300 text-2xl" />,
      iconBg: "bg-purple-950/60 border-purple-500/30",
      title: "YOLOv5 Bunch Tally",
      desc: "Automatic cluster bounding boxes isolate berry bunches to quantify vine density.",
      badge: "Cluster Vision"
    },
    {
      step: "04",
      icon: <FaChartLine className="text-amber-300 text-2xl" />,
      iconBg: "bg-amber-950/60 border-amber-500/30",
      title: "Harvest Forecasting",
      desc: "Calibrated Niphad & Nashik weather models predict kilograms per acre yield.",
      badge: "XGBoost 2025"
    },
  ];

  const grapeVarieties = [
    { name: "Thompson Seedless", type: "Table Grape", region: "Nashik / Niphad", brix: "18-20° Brix" },
    { name: "Sharad Seedless", type: "Black Table", region: "Sangli / Solapur", brix: "19-21° Brix" },
    { name: "Flame Seedless", type: "Red Table", region: "Dindori", brix: "17-19° Brix" },
    { name: "Cabernet Sauvignon", type: "Wine Grape", region: "Nashik Valley", brix: "22-24° Brix" },
  ];

  return (
    <main className="relative min-h-screen flex flex-col bg-[#081C15] text-white overflow-hidden">
      <Header />

      {/* Background Video Layer with Rich Grape Viticulture Tint */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <video 
          ref={(el) => {
            if (el) {
              el.muted = true;
              el.play().catch(() => {});
            }
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover brightness-[0.55] contrast-[1.1] scale-105"
        >
          <source src="/vineyard.mp4" type="video/mp4" />
          <source src="/vineyard.mov" type="video/quicktime" />
        </video>
        {/* Multilayered Grape-Wine & Deep Emerald Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#081C15]/80 via-[#1B4332]/40 to-[#081C15]/95"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(111,39,68,0.35),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,106,79,0.4),transparent_50%)]"></div>
      </div>

      {/* Foreground Hero & Features */}
      <section className="relative z-10 w-full flex flex-col items-center px-4 sm:px-6 pt-20 pb-20 max-w-7xl mx-auto">
        {/* Floating Vineyard Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#1B4332]/80 backdrop-blur-xl border border-emerald-400/40 shadow-2xl text-emerald-100 text-xs sm:text-sm font-bold tracking-wide"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
          </span>
          <span className="flex items-center gap-1.5">
            <GiGrapes className="text-accent text-base" />
            AI Precision Viticulture for Indian Vineyards
          </span>
        </motion.div>

        {/* Hero Title with Viticulture Gold Glow */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8 max-w-4xl text-center px-2"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] drop-shadow-2xl">
            Cultivating Smarter Vineyards with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-emerald-300 drop-shadow">
              Grape-Trained AI
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg md:text-xl text-emerald-100/90 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow">
            From foliage mildew pathology to YOLOv5 bunch counting and Niphad micro-climate yield forecasting — tailored specifically for vineyard growers.
          </p>
        </motion.div>
        
        {/* Action Buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(222, 211, 109, 0.45)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/cluster')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-accent via-yellow-400 to-accent text-emerald-950 font-black text-sm sm:text-base shadow-xl flex items-center gap-2 group transition cursor-pointer"
          >
            <GiGrapes className="text-lg text-emerald-950" />
            <span>Launch Cluster Counting</span>
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/yield')}
            className="px-8 py-4 rounded-2xl bg-[#1B4332]/70 backdrop-blur-xl border border-emerald-400/40 text-emerald-100 font-bold text-sm sm:text-base shadow-xl hover:bg-[#1B4332] hover:text-white transition cursor-pointer flex items-center gap-2"
          >
            <FaChartLine className="text-accent" />
            <span>Forecast Harvest Yield</span>
          </motion.button>
        </motion.div>

        {/* Live Vineyard Agronomic Stats Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {[
            { label: "Cluster Detection", value: "YOLOv5 ONNX", sub: "640x640 High-Res Neural Net", icon: <GiGrapes className="text-accent" /> },
            { label: "Yield Engine", value: "366 Trees", sub: "XGBoost 2025 Harvest Model", icon: <FaChartLine className="text-emerald-400" /> },
            { label: "Pathology Scans", value: "4 Pathogens", sub: "Downy / Powdery / Black Rot", icon: <FaLeaf className="text-green-400" /> },
            { label: "Calibration Region", value: "Niphad, Nashik", sub: "Indian Grape Capital", icon: <GiVineLeaf className="text-accent" /> },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-3xl bg-[#0F2D22]/80 backdrop-blur-xl border border-emerald-500/25 text-white shadow-xl hover:border-accent/40 hover:bg-[#153D2E]/90 transition-all text-center flex flex-col items-center justify-center relative overflow-hidden group"
            >
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div className="text-xl sm:text-2xl font-black text-accent tracking-tight drop-shadow-sm">{stat.value}</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">{stat.label}</div>
              <div className="text-[11px] text-emerald-300/80 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* About HaritGrapes — Elevated Viticulture Glassmorphism Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8, type: "spring" }}
          className="w-full max-w-5xl bg-gradient-to-br from-[#0F2D22]/90 via-[#153A2C]/85 to-[#24131E]/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 sm:p-12 mb-20 border border-emerald-400/25 relative overflow-hidden"
        >
          {/* Ambient Viticulture Glows */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-purple-600/15 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/60 border border-purple-400/30 text-purple-200 text-xs font-bold uppercase tracking-wider mb-3">
                <GiGrapes className="text-accent text-sm" />
                <span>Specialized Viticulture Agritech</span>
              </div>
              <h2 className="font-black text-3xl sm:text-4xl text-white tracking-tight mb-4">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-300">HaritGrapes</span>
              </h2>
              <p className="text-base sm:text-lg text-emerald-100/90 font-medium mb-6 leading-relaxed">
                HaritGrapes is an AI-first viticulture intelligence platform engineered specifically for vineyard growers, grape exporters, and agronomists across Maharashtra and India.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-black/25 border border-emerald-500/20">
                  <div className="flex items-center gap-2 font-bold text-accent text-sm mb-1">
                    <FaCircleCheck className="text-emerald-400" />
                    <span>Early Pathology</span>
                  </div>
                  <p className="text-xs text-emerald-200/80 leading-relaxed">
                    Identify downy mildew, powdery mildew, and rot symptoms before spore dissemination.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/25 border border-emerald-500/20">
                  <div className="flex items-center gap-2 font-bold text-accent text-sm mb-1">
                    <FaCircleCheck className="text-emerald-400" />
                    <span>Cluster Vision</span>
                  </div>
                  <p className="text-xs text-emerald-200/80 leading-relaxed">
                    Automated YOLOv5 model tallies berry bunches without tedious manual sampling.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/25 border border-emerald-500/20">
                  <div className="flex items-center gap-2 font-bold text-accent text-sm mb-1">
                    <FaCircleCheck className="text-emerald-400" />
                    <span>Niphad Yield Model</span>
                  </div>
                  <p className="text-xs text-emerald-200/80 leading-relaxed">
                    Ensemble XGBoost models calibrate against Nashik climate indicators to predict kg output.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
    
        {/* The Vineyard Workflow — 4 Perfectly Balanced Steps */}
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-10 mb-20">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-accent bg-[#1B4332]/80 px-4 py-1.5 rounded-full border border-emerald-400/30">
              The Vineyard Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-xl mt-3 tracking-tight">
              How HaritGrapes Works
            </h2>
            <p className="text-sm sm:text-base text-emerald-200/80 mt-2 max-w-xl mx-auto">
              Four streamlined steps from canopy photo capture to actionable harvest yield intelligence.
            </p>
          </div>

          {/* Balanced 4-Column Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {workflowSteps.map((step, i) => (
              <motion.div
                key={i}
                whileHover={{
                  scale: 1.03,
                  y: -6,
                  transition: { type: "spring", stiffness: 350 }
                }}
                className="flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b from-[#0F2D22]/85 to-[#091F17]/90 backdrop-blur-xl border border-emerald-500/25 shadow-xl hover:border-accent/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${step.iconBg} border flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                      {step.icon}
                    </div>
                    <span className="text-2xl font-black text-emerald-500/40 group-hover:text-accent transition-colors">
                      {step.step}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-2 inline-block">
                    {step.badge}
                  </span>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-emerald-800/40 flex items-center justify-between text-xs font-semibold text-emerald-300">
                  <span>Vineyard Station</span>
                  <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform text-accent" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Supported Grape Cultivars Section */}
        <div className="w-full max-w-5xl rounded-3xl bg-[#0F2D22]/60 backdrop-blur-xl border border-emerald-500/20 p-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
            <GiVineLeaf className="text-accent" />
            Calibrated for Key Indian Cultivars
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mb-6">
            Supported Vineyard Varieties
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {grapeVarieties.map((v, i) => (
              <div key={i} className="p-4 rounded-2xl bg-black/30 border border-emerald-500/15 text-left">
                <div className="text-sm font-bold text-white">{v.name}</div>
                <div className="text-xs text-accent font-medium mt-0.5">{v.type}</div>
                <div className="text-[11px] text-emerald-300/70 mt-1">{v.region}</div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1">{v.brix}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
