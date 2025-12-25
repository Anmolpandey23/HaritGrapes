import React, { useState } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { createUserProfile } from "../firebase/firestoreService";
import { motion, AnimatePresence } from "framer-motion";

// Demo logo or replace with yours
const LOGO_SRC = "haritgrapes.png";

// Grapes background!
const AnimatedGrapes = () => (
  <motion.div
    className="pointer-events-none select-none fixed left-2 top-1/4 z-0 text-8xl opacity-15"
    animate={{ y: [0, 28, -28, 0], rotate: [0, -13, 13, 0] }}
    transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
  >🍇</motion.div>
);

const AnimatedGrapes2 = () => (
  <motion.div
    className="pointer-events-none select-none fixed right-2 bottom-1/4 z-0 text-8xl opacity-10"
    animate={{ y: [0, -22, 22, 0], rotate: [0, 10, -10, 0] }}
    transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
  >🍇</motion.div>
);

const AuthPage: React.FC = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const [ripple, setRipple] = useState(false);
  const [shake, setShake] = useState(false); // Triggers card shake on error
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && user.user) {
      setSuccess(true);
      setTimeout(() => {
        const { uid, displayName, email, photoURL } = user.user;
        createUserProfile(uid, {
          name: displayName,
          email,
          photoURL,
          language: "en",
          createdAt: new Date().toISOString()
        })
        .then(() => {
          localStorage.setItem("user", JSON.stringify(user.user));
          setSuccess(false);
          navigate("/entry");
        })
        .catch((err) => {
          setSuccess(false);
          alert("Error creating user profile: " + (err?.message || "Unknown error"));
          // force navigation even on error for now:
          navigate("/entry");
        });
      }, 1100);
    }
  }, [user, navigate]);
  
  

  React.useEffect(() => {
    if (error) {
      setShake(true);
      setTimeout(() => setShake(false), 700);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-white to-primary/10 flex items-center justify-center relative overflow-hidden">
      {/* Animated grapes chill in the corners */}
      <AnimatedGrapes />
      <AnimatedGrapes2 />

      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.04, opacity: 1 }}
              transition={{ type: "spring", stiffness: 80, damping:12 }}
              className="bg-white/90 backdrop-blur-lg border-2 border-accent text-primary rounded-full shadow-2xl px-12 py-12 flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 1.1, rotate: 0 }}
                animate={{
                  scale: [1, 1.25, 1],
                  rotate: [0, 7, -7, 0],
                  transition: { duration: 0.8 }
                }}
                className="text-7xl mb-4"
              >✅</motion.div>
              <div className="font-bold text-2xl">Signed in!</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Card */}
      <motion.div
        className={`relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl px-10 py-12 flex flex-col items-center gap-9 border-2 border-transparent ${
          shake ? "animate-shake" : ""
        }`}
        style={{
          boxShadow: "0 12px 36px #DED36D44, 0 2px 8px #6f274499"
        }}
        initial={{ opacity: 0, scale: 0.9, y: 56 }}
        animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.85 } }}
      >
        {/* Reusable: bounce logo */}
        <motion.img
          src={LOGO_SRC}
          alt="HaritGrapes logo"
          className="w-16 h-16 mb-1 drop-shadow"
          animate={{ scale: [1, 1.18, 1], y: [0, -8, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 2.2,
            ease: "easeInOut"
          }}
        />

        {/* Title */}
        <motion.h2
          className="text-3xl font-black text-grape text-center mb-3 leading-tight"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.03 }}
          transition={{ delay: 0.15, duration: 0.65, type: "spring" }}
        >
          Sign In to <span className="text-accent">HaritGrapes</span>
        </motion.h2>

        {/* Google Sign In */}
        <motion.button
          type="button"
          className={`relative flex items-center gap-4 px-8 py-4 rounded-xl bg-accent font-bold text-primary shadow-lg focus:outline-none text-xl hover:scale-105 hover:shadow-2xl hover:border-primary border-2 transition-all overflow-hidden`}
          whileHover={{ scale: 1.09, borderColor: "#3E7C17", boxShadow: "0 0 14px #3E7C17CC" }}
          whileTap={{ scale: 0.95 }}
          style={{ outline: "none" }}
          disabled={loading}
          onClick={() => {
            setRipple(true);
            signInWithGoogle();
            setTimeout(() => setRipple(false), 420);
          }}
        >
          {/* Ripple */}
          {ripple && (
            <span className="absolute left-1/2 top-1/2 w-44 h-44 -translate-x-1/2 -translate-y-1/2 bg-primary/15 rounded-full animate-ping pointer-events-none"></span>
          )}
          {/* Google Icon */}
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-7 h-7"
          />
          <span className="relative z-10">
            {loading ? (
              <span className="flex items-center gap-2 font-sans">
                Signing in...
                <svg className="animate-spin h-5 w-5 ml-1 text-primary" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#3E7C17" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="#DED36D" d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z"/>
                </svg>
              </span>
            ) : (
              <span>Sign in with Google</span>
            )}
          </span>
        </motion.button>

        {/* Error feedback */}
        {error && (
          <motion.div
            role="alert"
            className="text-red-600 text-lg mt-1 px-4 py-2 font-semibold rounded-xl bg-red-50 shadow animate-pulse"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.39 }}
          >
            {error.message}
          </motion.div>
        )}

        {/* Security badge */}
        <motion.div
          className="mt-1 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.88 }}
        >
          <span className="font-bold text-accent">100% Secure</span> &mdash; Powered by AI for Smart Vineyards
        </motion.div>
      </motion.div>
      {/* ... */}
      <style>
        {`
          .animate-shake {
            animation: shake 0.60s cubic-bezier(.36,.07,.19,.97) both;
          }
          @keyframes shake {
            10%, 90% { transform: translate3d(-2px, 0, 0); }
            20%, 80% { transform: translate3d(4px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-8px, 0, 0); }
            40%, 60% { transform: translate3d(8px, 0, 0); }
          }
        `}
      </style>
    </div>
  );
};

export default AuthPage;
