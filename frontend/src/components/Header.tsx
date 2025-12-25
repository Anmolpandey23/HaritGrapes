import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/dashboard", label: t("dashboard") },
    { to: "/disease-detection", label: t("diseasedetection") },
    { to: "/cluster", label: t("clustercount") },
    { to: "/settings", label: t("settings") }
  ];

  const handleLogout = async () => {
    await auth.signOut();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="w-full bg-primary text-white shadow-md px-6 py-3 flex items-center justify-between z-20 relative">
      <Link to="/" className="text-2xl font-logo tracking-wide flex items-center gap-2 hover:opacity-95">
        <span className="ml-2 text-3xl animate-bounce">🌿</span>
        <span className="font-extrabold tracking-widest">HaritGrapes</span>
      </Link>
      {/* Desktop nav only ≥1024px */}
      <nav className="hidden lg:flex items-center gap-6 text-lg">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`hover:underline ${location.pathname === link.to ? 'underline font-bold' : ''}`}
          >
            {link.label}
          </Link>
        ))}
        {user && (
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 rounded font-semibold bg-grape hover:bg-accent text-white shadow hover:scale-105 active:scale-95 transition"
          >
            {t("logout")}
          </button>
        )}
      </nav>
      {/* Hamburger (shown <lg) */}
      <button
        className="block lg:hidden text-white focus:outline-none"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        <FaBars size={28} />
      </button>
      {/* Mobile/tablet drawer (<1024px) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-4/5 max-w-xs bg-white text-primary flex flex-col p-8 gap-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-7">
              <span className="font-extrabold text-xl tracking-widest">Menu</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <FaTimes size={26} />
              </button>
            </div>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="py-2 px-1 rounded text-lg font-semibold hover:bg-accent hover:text-white transition"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="py-2 rounded font-semibold bg-grape hover:bg-accent text-white shadow"
              >
                {t("logout")}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
