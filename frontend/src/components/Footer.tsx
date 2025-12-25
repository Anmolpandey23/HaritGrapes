import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full bg-primary text-white py-6 text-center font-logo tracking-wide z-0">
    <div>
      🌿 HaritGrapes — Cultivating Smart Vineyards with AI.
    </div>
    <div className="mt-2 text-sm text-accent/90 font-sans">
      &copy; {new Date().getFullYear()} HaritGrapes · Made by <span className="font-bold text-accent">Anmol Dinesh Pandey</span>
    </div>
  </footer>
);

export default Footer;
