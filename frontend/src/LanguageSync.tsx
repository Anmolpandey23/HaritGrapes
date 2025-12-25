// src/LanguageSync.tsx
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { getUserProfile } from "./firebase/firestoreService";
import i18n from "./i18n";
import { auth } from "./firebase/firebaseConfig";

const LanguageSync = () => {
  const [user] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(profile => {
        const lang = profile?.language || 'en';
        i18n.changeLanguage(lang);
        localStorage.setItem("app_lang", lang);
      });
    }
  }, [user]);
  return null;
};

export default LanguageSync;
