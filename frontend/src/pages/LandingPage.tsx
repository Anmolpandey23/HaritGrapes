import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Use .mp4 for best compatibility, unless you are SURE about .mov
const VIDEO_SRC = '/vineyard.mp4';

export default function LandingPage() {
  const navigate = useNavigate();

  const processSteps = [
    {
      icon: "📷",
      title: "Upload Grape Images",
      desc: "Start by uploading leaf or vineyard images from your phone or camera.",
      color: "border-green-200 text-green-700"
    },
    {
      icon: "🦠",
      title: "AI Disease Detection",
      desc: "Our AI scans and detects grape leaf diseases instantly.",
      color: "border-green-300 text-green-800"
    },
    {
      icon: "🍇",
      title: "Cluster Counting",
      desc: "The system counts grape clusters for growth tracking.",
      color: "border-accent text-accent"
    },
    {
      icon: "📈",
      title: "Yield & Fertilizer AI",
      desc: "Get yield prediction and fertilizer advice tailored to your farm.",
      color: "border-grape text-grape"
    },
  ];
  
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", duration: 0.7, delay: 0.38 + i * 0.6 }
    }),
  };
  
  return (
    <main className="relative min-h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header />
      {/* Background video layer */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <video 
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover brightness-60"
          src={VIDEO_SRC}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-gray-900/50 to-accent/30"></div>
      </div>
      {/* Foreground content */}
      <section className="relative z-10 w-full flex flex-col items-center px-4 pt-28 pb-12">
        {/* Inspirational Quote */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, type: "spring" }}
          className="mb-8 max-w-3xl text-center"
        >
          <span className="block text-3xl md:text-4xl lg:text-5xl font-bold text-accent drop-shadow sm:mb-2">
            Empowering Grape Growers with Smart AI for Healthy, Sustainable Vineyards.
          </span>
        </motion.div>
        
        {/* Action Buttons */}
        <motion.div
          className="flex gap-6 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 rounded-full bg-accent text-primary font-bold text-lg shadow-lg hover:bg-primary hover:text-accent hover:scale-105 transition"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 rounded-full bg-primary text-accent font-bold text-lg shadow-lg hover:bg-accent hover:text-primary hover:scale-105 transition"
          >
            Login
          </button>
        </motion.div>

        {/* About Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
          className="w-full max-w-3xl bg-white/90 backdrop-blur rounded-3xl shadow-xl p-9 md:p-14 mb-14"
        >
          <h2 className="font-extrabold text-3xl md:text-4xl mb-3">
            About <span className="text-accent">HaritGrapes</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-3 font-semibold">
            HaritGrapes is an innovative agritech platform designed specifically for vineyard owners and grape farmers in India.
          </p>
          <p className="mb-3 text-gray-800">
            <span className="font-bold text-primary">Our Mission:</span> Harness the power of AI and precision agriculture to maximize grape yield, improve disease management, and support sustainable farming.  
            We help you detect leaf diseases, count grape clusters, predict yields, and get AI-powered fertilizer recommendations — all through a simple, mobile-friendly dashboard.
          </p>
          <p className="mb-1 text-gray-800">
            With HaritGrapes, make informed decisions and grow better, healthier grapes with less effort.
          </p>
        </motion.div>
    
        <motion.div
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl mx-auto flex flex-col items-center gap-8"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: -30, scale: 0.97 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.8 } }
            }}
            initial="hidden"
            animate="visible"
            className="text-3xl md:text-4xl font-black text-white drop-shadow-2xl bg-grape/90 px-8 py-4 rounded-2xl inline-block border-2 border-white/30 shadow-2xl tracking-wider mb-2 mt-2"
          >
            How It Works
          </motion.h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full px-2">
            {processSteps.map((step, i) => (
              <React.Fragment key={i}>
                <motion.div
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{
                    scale: 1.08,
                    y: -6,
                    boxShadow: "0 4px 32px #DED36D80",
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  whileTap={{ scale: 0.96 }}
                  className={`flex-1 flex flex-col items-center p-6 bg-white/95 rounded-2xl shadow-2xl border-2 min-w-[200px] max-w-xs cursor-pointer ${step.color}`}
                >
                  <motion.span
                    className="text-4xl mb-3"
                    animate={{ y: [0, -7, 0], scale: [1, 1.18, 1] }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.4 }}
                  >
                    {step.icon}
                  </motion.span>
                  <span className="text-xl font-bold mb-1">{step.title}</span>
                  <span className="text-gray-700 text-base text-center">{step.desc}</span>
                </motion.div>
                {i < processSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -18 }}
                    animate={{
                      opacity: [0, 1, 0.7, 1],
                      x: [0, 12, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      delay: 0.8 + (i + 1) * 0.6,
                      duration: 1.15,
                      repeat: Infinity,
                      repeatType: "mirror"
                    }}
                    className="hidden md:flex items-center justify-center text-4xl text-accent font-black px-1 select-none drop-shadow-xl"
                  >
                    →
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
