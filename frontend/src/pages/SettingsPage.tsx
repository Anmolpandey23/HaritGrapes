import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';
import { getUserProfile } from '../firebase/firestoreService';
import { motion } from "framer-motion";
import { FaUser, FaBell, FaCircleQuestion, FaCircleInfo, FaShieldHalved, FaGlobe } from 'react-icons/fa6';
import { GiGrapes, GiVineLeaf } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '../components/LanguageSelector';


const SettingsPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [notifications, setNotifications] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(() => {
        setNotifications(localStorage.getItem('notifications') !== 'false');
      });
    }
  }, [user]);

  const handleNotifToggle = () => {
    setNotifications(val => {
      localStorage.setItem('notifications', (!val).toString());
      return !val;
    });
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-stone-50 via-emerald-50/20 to-stone-100">
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-4 sm:px-6 py-10 w-full">
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/80 p-6 sm:p-8 shadow-xl flex flex-col gap-6"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1">
                <GiVineLeaf className="text-emerald-700" />
                Grower Preferences
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Vineyard Settings
              </h1>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl shadow-inner">
              <GiGrapes />
            </div>
          </div>

          {/* Account Section */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">
              Account Management
            </span>
            <div className="space-y-3">
              <div
                className="group flex items-center gap-4 bg-stone-50/70 hover:bg-emerald-50/50 border border-gray-200/80 hover:border-emerald-300 rounded-2xl p-4 cursor-pointer transition-all duration-200 shadow-sm"
                onClick={() => navigate("/profile")}
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg group-hover:scale-105 transition-transform shadow-sm">
                  <FaUser />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 group-hover:text-primary transition-colors text-sm">
                    Grower Profile
                  </div>
                  <div className="text-gray-500 text-xs">
                    Update contact information and name
                  </div>
                </div>
              </div>

              {/* Real-time Language Selector Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/70 border border-gray-200/80 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg shadow-sm">
                    <FaGlobe />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">Real-time Language / भाषा</div>
                    <div className="text-gray-500 text-xs">Switch between English (Default), हिन्दी, and मराठी</div>
                  </div>
                </div>
                <LanguageSelector variant="inline" />
              </div>
            </div>
          </div>


          {/* App Preferences Section */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">
              Telemetry & Alerts
            </span>
            <div className="flex items-center justify-between bg-stone-50/70 border border-gray-200/80 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg shadow-sm">
                  <FaBell />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Automated Alerts</div>
                  <div className="text-gray-500 text-xs">Push updates when disease thresholds trigger</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications} 
                  onChange={handleNotifToggle} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition-colors"></div>
                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications ? "translate-x-5" : ""}`}></div>
              </label>
            </div>
          </div>

          {/* Support Section */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">
              Knowledge & Diagnostics
            </span>
            <div className="space-y-3">
              <div
                className="group flex items-center gap-4 bg-stone-50/70 hover:bg-emerald-50/50 border border-gray-200/80 hover:border-emerald-300 rounded-2xl p-4 cursor-pointer transition-all duration-200 shadow-sm"
                onClick={() => navigate("/support")}
              >
                <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-lg group-hover:scale-105 transition-transform shadow-sm">
                  <FaCircleQuestion />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 group-hover:text-primary transition-colors text-sm">
                    Help Center & Agronomy FAQs
                  </div>
                  <div className="text-gray-500 text-xs">
                    Get answers about ML models, crop privacy, and accuracy
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-stone-50/70 border border-gray-200/80 rounded-2xl p-4 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center text-lg shadow-sm">
                  <FaShieldHalved />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">HaritGrapes AI Suite</div>
                  <div className="text-gray-500 text-xs">v2.4.0 · YOLOv5 & XGBoost Niphad Calibration</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsPage;
