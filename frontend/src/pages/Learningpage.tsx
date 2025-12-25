import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
}

const LearningPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Sample video data - replace with your actual video links
  const videos: Video[] = [
    {
      id: '1',
      title: 'Grape Cultivation Basics',
      description: 'Learn the fundamentals of grape cultivation, from soil preparation to planting techniques.',
      category: 'Cultivation',
      thumbnail: '🌱',
      videoUrl: 'https://www.youtube.com/embed/hQCCHRZV0Lk',
      duration: '53:18'
    },
    {
      id: '2',
      title: 'How to Spray Fertilizer Correctly',
      description: 'Step-by-step guide on proper fertilizer application techniques for optimal grape growth.',
      category: 'Fertilizer',
      thumbnail: '💧',
      videoUrl: 'https://www.youtube.com/embed/iD1KXN_sB34',
      duration: '8:21'
    },
    {
      id: '3',
      title: 'Identifying Grape Diseases',
      description: 'Recognize common grape diseases and learn early detection methods.',
      category: 'Disease Management',
      thumbnail: '🔬',
      videoUrl: 'https://www.youtube.com/embed/nhYOm9QIb_Y',
      duration: '27:14'
    },
    {
      id: '4',
      title: 'Powdery Mildew Treatment',
      description: 'Effective treatment methods for powdery mildew in grape vineyards.',
      category: 'Disease Management',
      thumbnail: '🦠',
      videoUrl: 'https://www.youtube.com/embed/IfwojJr-ZGQ',
      duration: '3:37'
    },
    {
      id: '5',
      title: 'Pruning Techniques for Grapes',
      description: 'Master the art of grape pruning for better yield and quality.',
      category: 'Cultivation',
      thumbnail: '✂️',
      videoUrl: 'https://www.youtube.com/embed/1zFP3x3gD-k',
      duration: '6:16'
    },
    {
      id: '6',
      title: 'Organic Pest Control',
      description: 'Natural and organic methods to control pests in grape vineyards.',
      category: 'Pest Control',
      thumbnail: '🐛',
      videoUrl: 'https://www.youtube.com/embed/SlfQxmhX-Gk',
      duration: '20:55'
    },
    {
      id: '7',
      title: 'Irrigation Best Practices',
      description: 'Optimize water usage and irrigation schedules for grape cultivation.',
      category: 'Cultivation',
      thumbnail: '💦',
      videoUrl: 'https://www.youtube.com/embed/4gQT8RddiN0',
      duration: '12:00'
    },
    {
      id: '8',
      title: 'Harvesting at the Right Time',
      description: 'Learn when and how to harvest grapes for maximum quality.',
      category: 'Harvesting',
      thumbnail: '🍇',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID_8',
      duration: '13:10'
    }
  ];

  const categories = ['All', 'Cultivation', 'Fertilizer', 'Disease Management', 'Pest Control', 'Harvesting'];

  const filteredVideos = selectedCategory === 'All' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  const VideoCard = ({ video }: { video: Video }) => (
    <div
      onClick={() => setSelectedVideo(video)}
      className="bg-white rounded-2xl shadow-lg p-5 cursor-pointer transition-all duration-300 
        hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-green-400 group"
    >
      <div className="text-6xl mb-3 text-center group-hover:scale-110 transition-transform duration-300">
        {video.thumbnail}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{video.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
          {video.category}
        </span>
        <span className="text-xs text-gray-500">{video.duration}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-green-700 mb-3 flex items-center justify-center gap-3">
            <span className="text-5xl">🎓</span>
            Learning Center
            <span className="text-5xl">🎓</span>
          </h1>
          <p className="text-lg text-gray-600">
            Master grape cultivation with our expert video tutorials
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-md
                ${selectedCategory === cat 
                  ? 'bg-green-600 text-white scale-105 shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-green-100 hover:scale-105'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {filteredVideos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {/* Video Modal/Player */}
        {selectedVideo && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={() => setSelectedVideo(null)}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 animate-slideUp"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedVideo.title}</h2>
                  <p className="text-gray-600">{selectedVideo.description}</p>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-500 hover:text-red-600 text-3xl font-bold transition"
                >
                  ×
                </button>
              </div>
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                  {selectedVideo.category}
                </span>
                <span className="text-gray-500">{selectedVideo.duration}</span>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default LearningPage;
