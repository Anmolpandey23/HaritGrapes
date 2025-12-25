import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { updateUserProfile } from '../firebase/firestoreService';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' }
];

const LanguageSelect: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const setLanguage = async (lang: string) => {
    if (!user) return;
    await updateUserProfile(user.uid, { language: lang });
    localStorage.setItem('language', lang);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-gray-100 rounded-xl shadow px-8 py-10 flex flex-col gap-6 items-center">
        <h2 className="text-2xl font-bold text-grape mb-4">Select Language</h2>
        <div className="flex gap-6">
          {languages.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className="px-8 py-3 rounded bg-primary text-accent font-semibold text-xl hover:bg-accent hover:text-primary shadow transition"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;
