import React from "react";
import { motion } from "framer-motion";

export const AuthCard: React.FC<{
  title: React.ReactNode;
  buttonText: string;
  onClick: () => void;
  loading?: boolean;
  error?: string | null;
  logoSrc?: string;
}> = ({
  title,
  buttonText,
  onClick,
  loading,
  error,
  logoSrc = "https://em-content.zobj.net/source/apple/354/grapes_1f347.png"
}) => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-accent/20 via-white to-primary/10">
    <motion.div
      initial={{ opacity: 0, scale: 0.93, y: 45 }}
      animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.85 } }}
      className="rounded-3xl bg-white/95 px-10 py-12 shadow-2xl flex flex-col items-center border-2 border-accent/10 relative min-w-[350px] max-w-full"
      style={{
        boxShadow: "0 12px 36px #DED36D44, 0 2px 8px #6f274499"
      }}
    >
      <motion.img
        src={logoSrc}
        alt="Grapes"
        className="w-14 h-14 mb-5"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.13, 1], rotate: [0, -10, 8, 0], transition: { duration: 2, repeat: Infinity, repeatType: "mirror" } }}
      />
      <h2 className="text-3xl font-black text-grape mb-8 text-center leading-tight drop-shadow">
        {title}
      </h2>
      <motion.button
        type="button"
        className="flex items-center gap-4 px-8 py-4 rounded-xl bg-accent/80 font-bold text-primary shadow-lg text-xl hover:bg-primary hover:text-accent hover:scale-105 transition border-2 border-accent"
        whileHover={{ scale: 1.07, borderColor: "#DED36D" }}
        whileTap={{ scale: 0.97 }}
        disabled={loading}
        onClick={onClick}
      >
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google"
          className="w-7 h-7"
        />
        {loading ? "Processing..." : buttonText}
      </motion.button>
      {error &&
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-lg mt-4 px-4 py-2 font-semibold rounded-xl bg-red-100 shadow"
        >
          {error}
        </motion.div>
      }
      <div className="mt-7 text-center text-sm text-gray-500">
        <span className="font-bold text-accent">100% Secure</span> — Powered by AI for Smart Vineyards
      </div>
    </motion.div>
  </div>
);
