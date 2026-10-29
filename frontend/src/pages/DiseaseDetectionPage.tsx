import React, { useRef, useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CameraScanner from '../components/CameraScanner';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from "react-i18next";
import { auth } from '../firebase/firebaseConfig';
import * as tf from '@tensorflow/tfjs';
import { saveScanResult } from '../firebase/firestoreService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiGrapes, 
  GiVineLeaf, 
  GiFertilizerBag 
} from 'react-icons/gi';
import { 
  FaLeaf, 
  FaCamera, 
  FaUpload, 
  FaTrashCan, 
  FaShieldVirus, 
  FaCircleCheck, 
  FaTriangleExclamation,
  FaArrowRight,
  FaFlask
} from 'react-icons/fa6';

const CLASS_NAMES = [
  'Bacterial Rot',
  'Downey Mildew',
  'Healthy Leaves',
  'Powdery Mildew'
];

const DiseaseDetectionPage: React.FC = () => {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<{ disease: string; confidence: number; advice?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);

  // Use user.uid as key prefix for privacy & fertilizer communication
  const getKey = (base: string) => `${base}_${user?.uid ?? 'unknown'}`;

  useEffect(() => {
    if (!user) return;
    const savedUrl = localStorage.getItem(getKey('diseaseImageUrl'));
    if (savedUrl) setImageUrl(savedUrl);
    else setImageUrl(null);
    const savedResult = localStorage.getItem(getKey('diseaseResult'));
    if (savedResult) setResult(JSON.parse(savedResult));
    else setResult(null);
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setResult(null);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target) {
          setImageUrl(ev.target.result as string);
          localStorage.setItem(getKey('diseaseImageUrl'), ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (file: File) => {
    setSelectedImage(file);
    setResult(null);
    setShowCamera(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target) {
        setImageUrl(ev.target.result as string);
        localStorage.setItem(getKey('diseaseImageUrl'), ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLocalPredict = async () => {
    if (!imageUrl) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      if (!imageRef.current) return;
      const model = await tf.loadLayersModel('/tfjs_model/model.json');
      const img = tf.browser.fromPixels(imageRef.current)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255))
        .expandDims(0);
      const prediction = model.predict(img) as tf.Tensor;
      const probs = prediction.dataSync();
      const idx = prediction.argMax(-1).dataSync()[0];
      const resObj = {
        disease: CLASS_NAMES[idx],
        confidence: probs[idx],
      };
      setResult(resObj);
      localStorage.setItem(getKey('diseaseResult'), JSON.stringify(resObj));
      // For FertilizerPage: store detected disease in a dedicated key
      localStorage.setItem(`latest_detected_disease_${user?.uid}`, resObj.disease);
      if (user) {
        await saveScanResult(user.uid, {
          ...resObj,
          timestamp: new Date().toISOString()
        });
      }
    } catch (e: any) {
      setError(e.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImageUrl(null);
    setSelectedImage(null);
    setResult(null);
    localStorage.removeItem(getKey('diseaseImageUrl'));
    localStorage.removeItem(getKey('diseaseResult'));
    localStorage.removeItem(`latest_detected_disease_${user?.uid}`);
  };

  const handleGoToFertilizer = () => {
    window.location.href = "/fertilizer";
  };

  const isHealthy = result?.disease === 'Healthy Leaves';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-stone-50 via-emerald-50/20 to-stone-100">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <GiVineLeaf className="text-emerald-700" />
              Pathology Vision Suite
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Grape Foliage Diagnostics
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Detect fungal pathogens, mildew spores, and leaf lesions using on-device neural network inference.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-gray-500">
              TensorFlow Model v1.2 Active
            </span>
          </div>
        </div>

        {/* Input & Scanner Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-10">
          {/* Upload Dropzone Card */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FaUpload className="text-primary text-sm" />
              Leaf Specimen Acquisition
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Capture or upload a clear, high-resolution photo of a single grape leaf under natural daylight.
            </p>

            <div 
              onClick={() => fileInput.current?.click()}
              className="group cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-500 bg-stone-50/50 hover:bg-emerald-50/40 p-8 flex flex-col items-center justify-center transition-all duration-200 text-center relative overflow-hidden"
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInput}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-3 shadow-inner">
                <FaLeaf />
              </div>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-emerald-800">
                Click to browse grape leaf photo
              </span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 15MB</span>
            </div>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">{t('or')}</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <button
              onClick={() => setShowCamera(!showCamera)}
              className="w-full py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-sm"
            >
              <FaCamera className="text-emerald-600" />
              <span>{showCamera ? 'Close Camera Scanner' : 'Open Field Camera Scanner'}</span>
            </button>

            {showCamera && (
              <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <CameraScanner onCapture={handleCameraCapture} />
              </div>
            )}
          </div>

          {/* Specimen Preview & Analysis Console */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaFlask className="text-purple-600 text-sm" />
                  Specimen Analysis
                </h2>
                {imageUrl && (
                  <button
                    onClick={handleClear}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition"
                  >
                    <FaTrashCan className="text-[11px]" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {imageUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-black/5 aspect-square max-h-[300px] flex items-center justify-center">
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt={t('selected')}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  {loading && <div className="laser-scanner-line" />}
                  {loading && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4">
                      <div className="w-10 h-10 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <span className="font-bold text-sm tracking-wide">Scanning Pathological Markers...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-stone-50/60 aspect-square max-h-[300px] flex flex-col items-center justify-center text-center p-6 text-gray-400">
                  <GiVineLeaf className="text-5xl text-gray-300 mb-2 animate-grape-float" />
                  <span className="text-sm font-medium">No specimen selected</span>
                  <span className="text-xs text-gray-400 mt-1">Upload an image to trigger leaf pathology scan</span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={handleLocalPredict}
                disabled={!imageUrl || loading}
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  !imageUrl || loading
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-gradient-to-r from-emerald-600 to-[#1B4332] hover:brightness-110 hover:shadow-xl active:scale-[0.99]'
                }`}
              >
                <FaShieldVirus className="text-base" />
                <span>{loading ? t('analyzing') : 'Execute Foliage Diagnostics'}</span>
              </button>
              
              {error && (
                <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <FaTriangleExclamation />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Diagnosis Results Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`rounded-3xl p-6 sm:p-8 shadow-xl border ${
                isHealthy
                  ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border-emerald-300'
                  : 'bg-gradient-to-br from-rose-50 via-white to-amber-50/40 border-rose-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {isHealthy ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                        <FaCircleCheck className="text-emerald-600" />
                        Healthy Specimen
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
                        <FaTriangleExclamation className="text-rose-600" />
                        Pathogen Detected
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${isHealthy ? 'text-emerald-900' : 'text-rose-950'}`}>
                    {result.disease}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 max-w-xl">
                    {isHealthy
                      ? 'The examined grape foliage demonstrates vigorous cellular chlorophyll integrity with zero detectable mildew sporulation or bacterial necrosis.'
                      : `Symptomatic markers for ${result.disease} were detected across leaf surfaces. Immediate targeted fungicide or bio-nutrient intervention is recommended.`}
                  </p>

                  {/* Confidence Progress Bar */}
                  <div className="mt-4 max-w-md">
                    <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                      <span>Model Confidence Score</span>
                      <span>{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(5, result.confidence * 100))}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${isHealthy ? 'bg-emerald-600' : 'bg-rose-600'}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[220px]">
                  <button
                    onClick={handleGoToFertilizer}
                    className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-700 to-[#1B4332] text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <GiFertilizerBag className="text-lg text-yellow-300" />
                    <span>View Treatment Plan</span>
                    <FaArrowRight className="text-xs" />
                  </button>

                  <button
                    onClick={handleClear}
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 font-semibold text-xs transition"
                  >
                    Discard & Retest
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default DiseaseDetectionPage;
