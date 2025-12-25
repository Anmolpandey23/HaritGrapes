import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  route: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, route, icon }) => (
  <motion.div
    whileHover={{ scale: 1.06 }}
    whileTap={{ scale: 0.96 }}
    className="group bg-white rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center text-center gap-3 border border-gray-100"
  >
    <div className="text-4xl mb-2 text-primary drop-shadow">{icon}</div>
    <div className="text-xl font-bold mb-1">{title}</div>
    <div className="mb-3 text-gray-600">{description}</div>
    <Link to={route} className="mt-auto px-4 py-2 rounded bg-accent text-primary font-semibold transition-colors group-hover:bg-primary group-hover:text-accent">
      Go to {title}
    </Link>
  </motion.div>
);

export default FeatureCard;
