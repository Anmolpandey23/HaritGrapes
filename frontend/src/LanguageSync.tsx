import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { getUserProfile } from "./firebase/firestoreService";
import { auth } from "./firebase/firebaseConfig";
import { setRealtimeLanguage, SupportedLanguage } from "./utils/realtimeTranslate";

const LanguageSync = () => {
  const [user] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(profile => {
        const lang = (profile?.language as SupportedLanguage) || 'en';
        setRealtimeLanguage(lang);
      });
    }
  }, [user]);
  return null;
};


export default LanguageSync;
