import React, { useRef, useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CameraScanner from '../components/CameraScanner';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from "react-i18next";
import { auth } from '../firebase/firebaseConfig';
import * as tf from '@tensorflow/tfjs';
import { saveScanResult } from '../firebase/firestoreService';

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

  // Use user.uid as key prefix for privacy & fertilizer communication
  const getKey = (base: string) => `${base}_${user?.uid ?? 'unknown'}`;

  useEffect(() => {
    // On user change or first load, grab only this user's image and result
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
    // Also clear communication to fertilizer page
    localStorage.removeItem(`latest_detected_disease_${user?.uid}`);
  };

  // ADD this: handler for navigation
  const handleGoToFertilizer = () => {
    window.location.href = "/fertilizer";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-4 py-8 flex flex-col">
        <h1 className="text-3xl font-bold text-primary mb-4">{t('diseasedetection')}</h1>
        <div className="flex flex-col gap-5 bg-white rounded-lg shadow px-6 py-8 mb-4">
          <label className="font-semibold mb-2 text-grape">{t('upload_image')}</label>
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={handleFileChange}
            className="mb-2"
          />
          <div className="text-center text-gray-500 mt-1 mb-1">{t('or')}</div>
          <CameraScanner onCapture={handleCameraCapture} />
        </div>
        {imageUrl && (
          <div className="mb-4 flex flex-col items-center bg-accent/20 rounded p-3 shadow">
            <img
              ref={imageRef}
              src={imageUrl}
              alt={t('selected')}
              className="w-64 rounded shadow"
              style={{ display: 'block' }}
              width={224}
              height={224}
              crossOrigin="anonymous"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleLocalPredict}
                disabled={loading}
                className={`px-6 py-2 bg-primary text-accent rounded font-bold ${loading && 'opacity-60'}`}
              >
                {loading ? t('analyzing') : t('predict_disease')}
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-700"
              >
                {t('clear') || 'Clear'}
              </button>
            </div>
          </div>
        )}
        {error && (
          <div className="text-red-600 text-sm my-2">{error}</div>
        )}
        {/* SHOW result and navigation button to FertilizerPage */}
        {result && (
          <div>
            <div className="border mt-6 p-6 bg-white rounded shadow-lg">
              <h2 className="text-2xl font-bold text-primary mb-2">{t('result')}</h2>
              <div className="mb-2">{t('disease')}: <span className="font-bold">{result.disease}</span></div>
              <div className="mb-2">{t('confidence')}: <span className="font-bold">{(result.confidence * 100).toFixed(1)}%</span></div>
            </div>
            <button
              onClick={handleGoToFertilizer}
              className="mt-6 px-8 py-2 bg-green-600 text-white rounded font-bold"
            >
              Go to Fertilizer Recommendation
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};


export default DiseaseDetectionPage;
