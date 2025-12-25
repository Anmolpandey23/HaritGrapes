import React, { useEffect } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../firebase/firestoreService";
import { AuthCard } from "../components/AuthCard";
import { motion } from "framer-motion";

const SignupPage: React.FC = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.user) {
      getUserProfile(user.user.uid).then(profile => {
        if (profile) {
          alert("Account already exists. Please log in instead.");
          navigate("/login");
        } else {
          navigate("/profileform");
        }
      });
    }
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-accent/30 to-primary/20">
      {/* animated grapes left */}
      <motion.div
        className="pointer-events-none absolute left-8 top-1/4 z-0 text-9xl opacity-10"
        animate={{ y: [0, -20, 20, 0], scale: [1, 1.08, 0.95, 1] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "loop" }}
      >🍇</motion.div>
      {/* animated grapes right */}
      <motion.div
        className="pointer-events-none absolute right-8 bottom-1/4 z-0 text-8xl opacity-10"
        animate={{ y: [0, 18, -18, 0], rotate: [0, 7, -7, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "loop" }}
      >🍇</motion.div>
      <AuthCard
        title={
          <>
            <span className="block text-2xl text-accent font-bold mb-1">No account?</span>
            <span className="block">
              <span className="text-4xl mr-2">🍇</span>
              <span>Sign Up to <span className="text-accent">HaritGrapes</span></span>
            </span>
            <span className="block text-gray-500 mt-3 text-base font-normal">
              Get started in seconds with Google.<br />
              Enjoy a smarter, easier vineyard.
            </span>
          </>
        }
        buttonText="Sign up with Google"
        onClick={() => signInWithGoogle()}
        loading={loading}
        error={error?.message}
      />
    </div>
  );
};

export default SignupPage;
