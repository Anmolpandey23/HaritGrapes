import React, { useEffect, useState } from "react";
import i18n from '../i18n';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import { getUserProfile, updateUserProfile } from "../firebase/firestoreService";
import { motion } from "framer-motion";
import { FaUserCircle, FaEdit, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी (Hindi)" },
  { value: "mr", label: "मराठी (Marathi)" }
];

const glass = "bg-white bg-opacity-90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(54,135,89,0.15)]"
const gradientBg = "bg-gradient-to-br from-green-100 via-blue-50 to-fuchsia-100"

const ProfilePage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(data => {
        setProfile(data);
        setName(data?.name ?? "");
        setPhone(data?.phone ?? "");
        setLanguage(data?.language ?? "en");
      });
    }
  }, [user, editing]);

  const saveProfile = async () => {
    if (user) {
      await updateUserProfile(user.uid, {
        name,
        phone,
        language,
        email: user.email,
        photoURL: user.photoURL   // always keep Google photo as default
      });
      i18n.changeLanguage(language);
      localStorage.setItem("app_lang", language);
      setMessage("Profile updated!");
      setTimeout(() => setMessage(""), 800);
      setEditing(false);
      setTimeout(() => navigate("/settings"), 850);
    }
  };

  if (!user) return null;

  // Use Google/Firebase Auth photo if available, else fallback to generated avatar.
  const displayPhotoUrl =
    user.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || user.displayName || user.email || "User")}`;

  return (
    <div className={`min-h-screen flex items-center justify-center ${gradientBg}`}>
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200, duration: 0.9 }}
        className={`rounded-3xl px-10 py-11 max-w-md w-full flex flex-col gap-7 relative border-2 border-green-300/40 ${glass}`}
        style={{ boxShadow: "0 4px 28px rgba(54,135,89,0.18), 0 0 0 10px #a7f3d0a2" }}
      >
        {!editing ? (
          <>
            <motion.div
              initial={{ rotate: -8, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
              className="flex flex-col items-center mb-3"
            >
              <div className="relative mb-2">
                <motion.img
                  src={displayPhotoUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-green-200 shadow-md mx-auto"
                  initial={{ scale: 0.7, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                />
              </div>
              <h2 className="text-3xl font-extrabold text-green-900 tracking-wide">Your Profile</h2>
            </motion.div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-1 text-lg">
                <span className="font-bold">Full Name:</span>
                <span className="text-gray-900">{profile?.name || <span className="text-pink-400">—</span>}</span>
              </div>
              <div className="flex gap-1 text-lg">
                <span className="font-bold">Phone:</span>
                <span className="text-gray-900">{profile?.phone || <span className="text-pink-400">—</span>}</span>
              </div>
              <div className="flex gap-1 text-lg">
                <span className="font-bold">Language:</span>
                <span className="text-gray-900 capitalize">{profile?.language || <span className="text-pink-400">—</span>}</span>
              </div>
              <div className="flex gap-1 text-lg">
                <span className="font-bold">Email:</span>
                <span className="text-gray-900">{user.email}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.08, backgroundColor: "#22c55e" }}
              transition={{ type: "spring", bounce: 0.35 }}
              className="mt-6 px-6 py-3 rounded-xl bg-green-600 text-white font-extrabold text-lg shadow-md flex items-center gap-2 hover:bg-green-800 transition-all"
              onClick={() => setEditing(true)}
            >
              <FaEdit size={21} /> Edit Profile
            </motion.button>
            {message && <div className="text-green-600 font-semibold mt-3 text-center">{message}</div>}
          </>
        ) : (
          <motion.form
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-5"
            onSubmit={e => { e.preventDefault(); saveProfile(); }}
          >
            <div className="flex flex-col items-center mb-2">
              <div className="relative mb-2">
                <img
                  src={displayPhotoUrl}
                  alt="Your profile"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-green-100 shadow"
                />
              </div>
              <span className="text-2xl font-extrabold text-green-900">Edit Profile</span>
              <span className="text-sm text-green-800 font-semibold mt-2">
                Profile photo comes from your Google account.
              </span>
            </div>
            <label className="font-bold text-gray-700 text-md">Full Name</label>
            <input
              className="w-full px-5 py-2 border rounded-xl shadow focus:border-green-700 focus:ring-2 focus:ring-green-100 transition"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <label className="font-bold text-gray-700 text-md">Phone Number</label>
            <input
              className="w-full px-5 py-2 border rounded-xl shadow focus:border-green-700 focus:ring-2 focus:ring-green-100 transition"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              type="tel"
              pattern="[0-9]*"
              required
            />
            <label className="font-bold text-gray-700 text-md">Language</label>
            <select
              className="w-full px-5 py-2 border rounded-xl shadow focus:border-green-700 focus:ring-2 focus:ring-green-100 transition"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              required
            >
              {LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
            <label className="font-bold text-gray-700 text-md">Email</label>
            <input
              className="w-full px-5 py-2 border rounded-xl bg-gray-100 shadow mb-2"
              value={user.email || ""}
              disabled
            />
            <div className="flex gap-2 mt-3">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.07, backgroundColor: "#059669" }}
                className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-green-800 transition-all"
              >
                <FaSave size={19} /> Save
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, backgroundColor: "#d1fae5" }}
                className="flex-1 py-3 rounded-xl bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 shadow transition"
                onClick={() => setEditing(false)}
              >
                Cancel
              </motion.button>
            </div>
            {message && <div className="text-green-600 font-semibold mt-2 text-center">{message}</div>}
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
