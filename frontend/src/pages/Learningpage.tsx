import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { GiGrapes, GiVineLeaf, GiWaterDrop, GiPruningShears, GiPlantRoots } from 'react-icons/gi';
import { FaPlay, FaXmark, FaClock, FaBookOpen } from 'react-icons/fa6';

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailIcon: string;
  videoUrl: string;
  duration: string;
}

const LearningPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const videos: Video[] = [
    {
      id: '1',
      title: 'Grape Cultivation Basics & Soil Bed Preparation',
      description: 'Master the fundamentals of vineyard establishment, vine row spacing, and deep soil aerification.',
      category: 'Cultivation',
      thumbnailIcon: '🌱',
      videoUrl: 'https://www.youtube.com/embed/hQCCHRZV0Lk',
      duration: '53:18'
    },
    {
      id: '2',
      title: 'Optimal Foliar Fertilizer Spray Techniques',
      description: 'Step-by-step masterclass on micronutrient timing, nozzle calibration, and canopy absorption.',
      category: 'Fertilizer',
      thumbnailIcon: '💧',
      videoUrl: 'https://www.youtube.com/embed/iD1KXN_sB34',
      duration: '8:21'
    },
    {
      id: '3',
      title: 'Early Detection of Grape Pathogens & Leaf Spots',
      description: 'Diagnostic visual cues to catch Downy Mildew, Powdery Mildew, and Anthracnose before spread.',
      category: 'Disease Management',
      thumbnailIcon: '🔬',
      videoUrl: 'https://www.youtube.com/embed/nhYOm9QIb_Y',
      duration: '27:14'
    },
    {
      id: '4',
      title: 'Powdery Mildew Treatment & Organic Sulfur Sprays',
      description: 'Proven curative protocols, bio-fungicides, and systemic canopy management for clean grape skins.',
      category: 'Disease Management',
      thumbnailIcon: '🛡️',
      videoUrl: 'https://www.youtube.com/embed/IfwojJr-ZGQ',
      duration: '3:37'
    },
    {
      id: '5',
      title: 'Cane Pruning & Spur Training for High Yield',
      description: 'Pruning principles to regulate cluster load, maximize sunlight exposure, and prevent congestion.',
      category: 'Cultivation',
      thumbnailIcon: '✂️',
      videoUrl: 'https://www.youtube.com/embed/1zFP3x3gD-k',
      duration: '6:16'
    },
    {
      id: '6',
      title: 'Organic Pest Control & Mite Suppression',
      description: 'Integrated pest management (IPM), pheromone traps, and predatory mites in grape vineyards.',
      category: 'Pest Control',
      thumbnailIcon: '🐞',
      videoUrl: 'https://www.youtube.com/embed/SlfQxmhX-Gk',
      duration: '20:55'
    },
    {
      id: '7',
      title: 'Drip Irrigation & Regulated Deficit Management',
      description: 'Water scheduling techniques to optimize sugar brix concentration and cluster berry sizing.',
      category: 'Cultivation',
      thumbnailIcon: '💦',
      videoUrl: 'https://www.youtube.com/embed/4gQT8RddiN0',
      duration: '12:00'
    },
    {
      id: '8',
      title: 'Grape Harvesting Timing & Brix Refractometry',
      description: 'Determine the exact picking window for table and wine grapes using acid-to-sugar ratio testing.',
      category: 'Harvesting',
      thumbnailIcon: '🍇',
      videoUrl: 'https://www.youtube.com/embed/hQCCHRZV0Lk',
      duration: '13:10'
    }
  ];

  const categories = ['All', 'Cultivation', 'Fertilizer', 'Disease Management', 'Pest Control', 'Harvesting'];

  const filteredVideos = selectedCategory === 'All' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-stone-50 via-emerald-50/20 to-stone-100">
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <GiGrapes className="text-purple-700" />
            Viticulture Video Academy
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-3">
            Grape Grower Knowledge Base
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Curated field video guides on canopy architecture, precision nutrition, disease suppression, and harvest timing.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white/80 text-gray-700 hover:bg-emerald-50 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Video Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
        >
          {filteredVideos.map(video => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="cursor-pointer rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/80 p-5 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between group overflow-hidden"
            >
              <div>
                <div className="relative rounded-2xl bg-gradient-to-br from-emerald-50 to-stone-100 h-36 flex items-center justify-center mb-4 overflow-hidden border border-gray-100">
                  <span className="text-5xl group-hover:scale-125 transition-transform duration-300">
                    {video.thumbnailIcon}
                  </span>
                  
                  {/* Play overlay button */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <FaPlay className="ml-1 text-sm text-yellow-300" />
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-semibold flex items-center gap-1 backdrop-blur-sm">
                    <FaClock className="text-[10px]" />
                    {video.duration}
                  </span>
                </div>

                <div className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-2">
                  {video.category}
                </div>

                <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">
                  {video.title}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                  {video.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Watch Masterclass</span>
                <FaPlay className="text-[10px] text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Video Player Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 overflow-hidden border border-gray-100"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 mb-2 inline-block">
                      {selectedVideo.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {selectedVideo.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 max-w-xl">
                      {selectedVideo.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
                  >
                    <FaXmark className="text-lg" />
                  </button>
                </div>

                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-inner">
                  <iframe
                    src={selectedVideo.videoUrl}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default LearningPage;
