import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import i18n from "../i18n";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी (Hindi)" },
  { value: "mr", label: "मराठी (Marathi)" },
];

const ProfileForm: React.FC<{ editing?: boolean }> = ({ editing = false }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // For editing: load existing data
  useEffect(() => {
    if (editing && auth.currentUser) {
      const fetchProfile = async () => {
        const docRef = doc(db, "users", auth.currentUser!.uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setName(data.name || "");
          setPhone(data.phone || "");
          setLanguage(data.language || "en");
        }
      };
      fetchProfile();
    }
  }, [editing]);

  const handleContinue = async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid), {
        name,
        phone,
        language,
        email: user.email,
        uid: user.uid,
      }, { merge: true }); // Merge for edit/upsert support

      i18n.changeLanguage(language); // Change language instantly
      localStorage.setItem("app_lang", language);
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 32 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50"
    >
      <motion.form
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.65, type: "spring" }}
        className="bg-white rounded-2xl shadow-xl px-12 pt-10 pb-8 w-full max-w-sm flex flex-col gap-8 border border-gray-200"
        onSubmit={e => { e.preventDefault(); handleContinue(); }}
      >
        <div className="text-2xl font-bold text-center text-accent tracking-tight mb-0">
          {editing ? "Edit Profile" : "Complete Your Profile"}
        </div>

        <input
          className="w-full p-3 border border-gray-200 rounded-xl outline-accent text-lg font-medium transition focus:border-accent mb-2"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <input
          className="w-full p-3 border border-gray-200 rounded-xl outline-accent text-lg font-medium transition focus:border-accent mb-2"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          type="tel"
          pattern="[0-9]*"
          required
        />

        <select
          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-lg font-medium mb-4"
          value={language}
          onChange={e => setLanguage(e.target.value)}
          required
        >
          <option value="" disabled>Select language</option>
          {LANGUAGES.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
          className="w-full bg-accent text-white font-bold py-3 rounded-xl shadow hover:bg-accent/90 text-lg tracking-wide transition"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : (editing ? "Save Changes" : "Continue")}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default ProfileForm;
