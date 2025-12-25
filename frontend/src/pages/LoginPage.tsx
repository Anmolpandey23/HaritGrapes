import React, { useEffect } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../firebase/firestoreService";
import { AuthCard } from "../components/AuthCard";
import { motion } from "framer-motion";

const LoginPage: React.FC = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.user) {
      getUserProfile(user.user.uid).then(profile => {
        if (profile) {
          navigate("/dashboard");
        } else {
          alert("No account found. Please sign up first.");
          navigate("/signup");
        }
      });
    }
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-accent/20 to-primary/10">
      {/* animated grapes right */}
      <motion.div
        className="pointer-events-none absolute right-8 top-1/4 z-0 text-9xl opacity-10"
        animate={{ y: [0, 27, -27, 0], rotate: [0, 6, -6, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, repeatType: "loop" }}
      >🍇</motion.div>
      {/* animated grapes left */}
      <motion.div
        className="pointer-events-none absolute left-8 bottom-1/5 z-0 text-8xl opacity-10"
        animate={{ y: [0, -16, 16, 0], rotate: [0, 11, -8, 0] }}
        transition={{ duration: 9, repeat: Infinity, repeatType: "loop" }}
      >🍇</motion.div>
      <AuthCard
        title={
          <>
            <span className="block text-4xl font-black">
              Login to <span className="text-accent">HaritGrapes</span>
            </span>
            <span className="block text-gray-500 text-base mt-3 font-normal">
              Returning user? Welcome back!<br />
              Sign in fast and manage your vineyard!
            </span>
          </>
        }
        buttonText="Sign in with Google"
        onClick={() => signInWithGoogle()}
        loading={loading}
        error={error?.message}
      />
    </div>
  );
};

export default LoginPage;
