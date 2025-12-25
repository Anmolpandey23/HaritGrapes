import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';
import LandingPage from '../pages/LandingPage';
import SignupPage from '../pages/SignupPage';
import LoginPage from '../pages/LoginPage';
import LanguageSelect from '../pages/LanguageSelect';
import DashboardPage from '../pages/DashboardPage';
import ProfileForm from '../components/ProfileForm';
import ProfilePage from '../pages/ProfilePage';
import DiseaseDetectionPage from '../pages/DiseaseDetectionPage';
import ClusterPage from '../pages/ClusterPage';
import YieldPage from '../pages/YieldPage';
import FertilizerPage from '../pages/FertilizerPage';
import SettingsPage from '../pages/SettingsPage';
import SupportPage from '../pages/SupportPage';
import LearningPage from '../pages/Learningpage';
import NotFound from '../pages/NotFound';

// Enhanced Loading Component
const LoadingScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🍇</span>
        </div>
      </div>
      <p className="text-lg font-semibold text-gray-700 animate-pulse">Loading...</p>
    </div>
  </div>
);

// Protected Route Component with enhanced UX
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  // Show loading screen while checking auth state
  if (loading) return <LoadingScreen />;

  // Handle authentication errors
  if (error) {
    console.error('Authentication error:', error);
    return <Navigate to="/login" replace />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

// Public Route - redirects to dashboard if already logged in
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <LoadingScreen />;

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRouter: React.FC = () => (
  <Routes>
    {/* Public Routes - redirect to dashboard if logged in */}
    <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

    {/* Protected Routes - require authentication */}
    <Route path="/language" element={<ProtectedRoute><LanguageSelect /></ProtectedRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/profileform" element={<ProtectedRoute><ProfileForm /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    <Route path="/disease-detection" element={<ProtectedRoute><DiseaseDetectionPage /></ProtectedRoute>} />
    <Route path="/cluster" element={<ProtectedRoute><ClusterPage /></ProtectedRoute>} />
    <Route path="/yield" element={<ProtectedRoute><YieldPage /></ProtectedRoute>} />
    <Route path="/fertilizer" element={<ProtectedRoute><FertilizerPage /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
    <Route path="/learning-videos" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />

    {/* Semi-public route - accessible but better UX when logged in */}
    <Route path="/support" element={<SupportPage />} />

    {/* 404 Not Found - catch all unmatched routes */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;
