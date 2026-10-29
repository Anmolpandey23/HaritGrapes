import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { GiGrapes } from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

  // Nav links: Disease Detection, Cluster Count, Settings
  const navLinks = [
    { to: "/disease-detection", label: t("nav_disease", { defaultValue: "Disease Detection" }) },
    { to: "/cluster", label: t("nav_cluster", { defaultValue: "Cluster Count" }) },
    { to: "/settings", label: t("nav_settings", { defaultValue: "Settings" }) }
  ];


  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.error("Sign out error:", e);
    }
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#2D6A4F]/95 border-b border-emerald-400/20 shadow-xl shadow-emerald-950/15 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        {/* Left: Brand Logo with Animated Grape Icon */}
        <Link to="/" className="group flex items-center gap-2.5 z-10">
          <motion.div
            whileHover={{ scale: 1.15, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent via-emerald-300 to-white flex items-center justify-center shadow-lg shadow-accent/25 text-grape text-2xl"
          >
            <GiGrapes className="transform group-hover:scale-110 transition-transform" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-extrabold tracking-wider text-white font-logo flex items-center gap-1.5">
              Harit<span className="text-accent drop-shadow-sm">Grapes</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-emerald-200 -mt-1 hidden sm:block">
              Viticulture AI Platform
            </span>
          </div>
        </Link>

        {/* Center: Navigation Buttons Perfectly Centered in Header */}
        <nav className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2 z-10 notranslate" translate="no">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                translate="no"
                className={`notranslate relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                    ? 'text-white font-bold'
                    : 'text-emerald-100/90 hover:text-white hover:bg-white/10'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-grape/80 to-purple-800/80 rounded-xl -z-10 shadow-md border border-purple-400/30"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="notranslate" translate="no">{link.label}</span>
              </Link>
            );
          })}
        </nav>


        {/* Right: Language Selector + User Badge & Logout OR Sign In & Get Started */}
        <div className="hidden lg:flex items-center gap-3 z-10">
          <LanguageSelector variant="header" />

          {user ? (
            <>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-900/60 text-emerald-200 border border-emerald-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5"></span>
                {user.displayName || user.email?.split('@')[0] || t('grower', { defaultValue: 'Grower' })}
              </span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-grape hover:bg-grape/80 text-white shadow-md shadow-grape/30 border border-pink-400/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FaSignOutAlt className="text-xs" />
                <span>{t('nav_logout', { defaultValue: 'Logout' })}</span>
              </motion.button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-bold text-emerald-100 hover:text-white hover:bg-white/10 transition"
              >
                {t('nav_signin', { defaultValue: 'Sign In' })}
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl text-sm font-bold bg-accent text-emerald-950 hover:bg-yellow-300 shadow-md shadow-accent/20 transition"
              >
                {t('nav_getstarted', { defaultValue: 'Get Started' })}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center gap-2 z-10">
          <LanguageSelector variant="header" />
          <button
            className="p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none transition cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-emerald-400/20 bg-emerald-950/95 backdrop-blur-2xl px-6 py-6 space-y-2.5 shadow-2xl"
          >
            {navLinks.map(link => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  translate="no"
                  className={`notranslate block px-4 py-3 rounded-xl text-base font-semibold transition ${isActive
                      ? 'bg-grape text-white font-bold shadow-md'
                      : 'text-emerald-100 hover:bg-white/10'
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="notranslate" translate="no">{link.label}</span>
                </Link>
              );
            })}


            <div className="pt-3 border-t border-emerald-400/20">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl font-bold bg-grape text-white shadow-md text-center flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt />
                  <span>{t('nav_logout', { defaultValue: 'Logout' })}</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 py-2.5 text-center rounded-xl bg-white/10 text-white font-bold"
                  >
                    {t('nav_signin', { defaultValue: 'Sign In' })}
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 py-2.5 text-center rounded-xl bg-accent text-emerald-950 font-bold"
                  >
                    {t('nav_getstarted', { defaultValue: 'Get Started' })}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
