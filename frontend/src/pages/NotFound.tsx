import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiGrapes, GiVineLeaf } from 'react-icons/gi';
import { FaArrowLeft } from 'react-icons/fa6';

const NotFound: React.FC = () => (
  <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-stone-50 via-emerald-50/20 to-stone-100 p-6 text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/80 p-8 shadow-xl flex flex-col items-center"
    >
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="text-7xl mb-4"
      >
        🍇
      </motion.div>
      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-100 text-rose-800 mb-3">
        404 — Path Not In Vineyard
      </span>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
        Harvest Block Not Found
      </h1>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        The trellis or viticulture page you are attempting to inspect does not exist in this vineyard plot.
      </p>
      <Link 
        to="/" 
        className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-700 to-[#1B4332] text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
      >
        <FaArrowLeft className="text-xs" />
        <span>Return to HaritGrapes Home</span>
      </Link>
    </motion.div>
  </main>
);

export default NotFound;
