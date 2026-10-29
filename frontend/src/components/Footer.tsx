import React from 'react';
import { GiGrapes } from 'react-icons/gi';
import { FaHeart } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="w-full bg-[#1B4332] text-white border-t border-emerald-800/40 pt-8 pb-6 px-4 sm:px-6 relative z-0">
    {/* Main Top Section: Branding and Navigation */}
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-emerald-800/40">
      {/* Brand Logo & Tagline */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl shadow-inner text-yellow-300">
          <GiGrapes />
        </div>
        <div>
          <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5 font-logo">
            Harit<span className="text-accent">Grapes</span>
          </span>
          <p className="text-xs text-emerald-200/80">
            Intelligent Vineyard Intelligence · YOLOv5 & XGBoost Architecture
          </p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-100/90 font-medium">
        <Link to="/disease-detection" className="hover:text-accent transition-colors">Disease Detection</Link>
        <Link to="/cluster" className="hover:text-accent transition-colors">Cluster Count</Link>
        <Link to="/yield" className="hover:text-accent transition-colors">Yield Forecast</Link>
        <Link to="/fertilizer" className="hover:text-accent transition-colors">Fertilizer Advisory</Link>
        <Link to="/settings" className="hover:text-accent transition-colors">Settings</Link>
      </div>
    </div>

    {/* Very Bottom Section: Full-Width, Clean, Centered with LogicLords */}
    <div className="max-w-6xl mx-auto pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-emerald-200/80 text-center">
      <div className="whitespace-nowrap">
        &copy; 2026 HaritGrapes. All rights reserved.
      </div>
      <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-100">
        <span>Crafted with</span>
        <FaHeart className="text-rose-400 text-xs inline mx-0.5 animate-pulse" />
        <span>by <strong className="text-accent font-bold tracking-wide">LogicLords</strong></span>
      </div>
    </div>
  </footer>
);

export default Footer;
