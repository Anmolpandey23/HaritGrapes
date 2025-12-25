import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';
import { getUserProfile } from '../firebase/firestoreService';
import { motion } from "framer-motion";
import { FaUser, FaBell, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const glass = "bg-white bg-opacity-85 backdrop-blur-2xl shadow-[0_8px_32px_rgba(16,186,129,0.10)]"
const gradientBg = "bg-gradient-to-br from-green-100 via-green-50 to-blue-100"

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
    <div className={`flex flex-col min-h-screen ${gradientBg}`}>
      <Header />
      <main className="flex-1 max-w-lg mx-auto px-4 py-12 flex flex-col gap-10">
        <motion.div
          initial={{ y: 26, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className={`${glass} rounded-3xl shadow-2xl px-6 py-10 flex flex-col gap-8`}
        >
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-3xl font-black text-green-800 mb-5 tracking-tight"
          >
            Settings
          </motion.h1>
          {/* Account Section */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22, duration: 0.55 }}
          >
            <div className="text-lg font-extrabold text-green-900 mb-3">Account</div>
            <div
              className="flex items-center gap-4 bg-green-50 rounded-xl px-4 py-4 mb-2 shadow-md cursor-pointer hover:bg-green-100 transition"
              onClick={() => navigate("/profile")}
            >
              <span className="rounded-full bg-green-200 p-2 flex items-center justify-center shadow-sm">
                <FaUser size={26} className="text-green-800" />
              </span>
              <div>
                <div className="font-bold text-green-900 text-base">Profile</div>
                <div className="text-gray-600 text-sm">Manage your account information</div>
              </div>
            </div>
          </motion.div>
          {/* App Preferences Section */}
          <motion.div
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.52 }}
          >
            <div className="text-lg font-extrabold text-green-900 mb-3">App Preferences</div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 bg-green-50 rounded-xl px-4 py-4 shadow-md group">
                <span className="rounded-full bg-green-200 p-2 flex items-center justify-center shadow-sm group-hover:bg-green-300 transition">
                  <FaBell size={24} className="text-green-800" />
                </span>
                <div className="flex-1">
                  <div className="font-bold text-green-900">Notifications</div>
                  <div className="text-gray-600 text-sm">Get alerts for disease detection and yield updates</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-2">
                  <input type="checkbox" checked={notifications} onChange={handleNotifToggle} className="sr-only peer" />
                  <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-600 transition"></div>
                  <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition ${notifications ? "translate-x-4 bg-green-600" : ""}`}></div>
                </label>
              </div>
            </div>
          </motion.div>
          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.37, duration: 0.55 }}
          >
            <div className="text-lg font-extrabold text-green-900 mb-3 mt-2">Support</div>
            <div className="flex flex-col gap-3">
              {/* Help & FAQ: Navigates to SupportPage */}
              <div
                className="flex items-center gap-4 bg-green-50 rounded-xl px-4 py-4 shadow-md cursor-pointer hover:bg-green-100 transition"
                onClick={() => navigate("/support")}
              >
                <span className="rounded-full bg-green-200 p-2 flex items-center justify-center shadow-sm">
                  <FaQuestionCircle size={24} className="text-green-800" />
                </span>
                <div>
                  <div className="font-bold text-green-900">Help & FAQ</div>
                  <div className="text-gray-600 text-sm">Get help with using HaritGrapes</div>
                </div>
              </div>
              {/* About */}
              <div className="flex items-center gap-4 bg-green-50 rounded-xl px-4 py-4 shadow-md cursor-pointer hover:bg-green-100 transition">
                <span className="rounded-full bg-green-200 p-2 flex items-center justify-center shadow-sm">
                  <FaInfoCircle size={24} className="text-green-800" />
                </span>
                <div>
                  <div className="font-bold text-green-900">About</div>
                  <div className="text-gray-600 text-sm">HaritGrapes v1.0.0</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsPage;
