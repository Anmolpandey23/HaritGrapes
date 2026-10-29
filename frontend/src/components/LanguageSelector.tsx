import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SUPPORTED_LANGUAGES,
  getCurrentLanguage,
  setRealtimeLanguage,
  SupportedLanguage
} from '../utils/realtimeTranslate';
import { FaGlobe, FaChevronDown, FaCheck } from 'react-icons/fa6';

interface LanguageSelectorProps {
  variant?: 'header' | 'inline' | 'compact';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(getCurrentLanguage());
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync state when language changes anywhere in the app
  useEffect(() => {
    const handleLangChange = (e: any) => {
      if (e.detail?.lang) {
        setCurrentLang(e.detail.lang);
      } else {
        setCurrentLang(getCurrentLanguage());
      }
    };

    window.addEventListener('app_language_changed', handleLangChange);
    window.addEventListener('storage', handleLangChange);

    return () => {
      window.removeEventListener('app_language_changed', handleLangChange);
      window.removeEventListener('storage', handleLangChange);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const activeOption = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const handleSelect = (langCode: SupportedLanguage) => {
    setCurrentLang(langCode);
    setRealtimeLanguage(langCode);
    setIsOpen(false);
  };

  // Inline Segmented Mode (great for forms and settings)
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/20 border border-emerald-500/20 backdrop-blur-md">
        {SUPPORTED_LANGUAGES.map(lang => {
          const isActive = lang.code === currentLang;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${isActive ? 'text-emerald-950 font-black' : 'text-emerald-200 hover:text-white'
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeInlineLangPill"
                  className="absolute inset-0 bg-accent rounded-xl shadow-md -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <span>{lang.flag}</span>
              <span>{lang.nativeLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Header Dropdown Mode
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-emerald-400/30 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-md transition-all cursor-pointer"
        aria-label="Select Language"
      >
        <FaGlobe className="text-accent text-sm animate-spin-slow" />
        <span className="hidden sm:inline">{activeOption.flag}</span>
        <span className="tracking-wide">{activeOption.nativeLabel}</span>
        <FaChevronDown className={`text-[10px] text-emerald-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#0F2D22]/95 backdrop-blur-2xl border border-emerald-400/40 shadow-2xl p-1.5 z-50 text-white space-y-1"
          >
            <div className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-extrabold text-emerald-400/80 border-b border-emerald-500/20 mb-1">
              Language / भाषा / भाषा
            </div>

            {SUPPORTED_LANGUAGES.map(lang => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${isSelected
                      ? 'bg-gradient-to-r from-accent via-yellow-300 to-accent text-emerald-950 font-black shadow-md'
                      : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <div className="flex flex-col text-left">
                      <span>{lang.nativeLabel}</span>
                      <span className={`text-[9px] ${isSelected ? 'text-emerald-900 font-bold' : 'text-emerald-300/70'}`}>
                        {lang.label} {lang.code === 'en' ? '(Default)' : ''}
                      </span>
                    </div>
                  </div>
                  {isSelected && <FaCheck className="text-emerald-950 text-xs" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
