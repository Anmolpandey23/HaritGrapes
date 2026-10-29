import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CameraScanner from '../components/CameraScanner';
import { useTranslation } from "react-i18next";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';
import { GiGrapes } from 'react-icons/gi';

const CLUSTER_API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:7000"}/predict-cluster`;


interface PersistedImage {
  name: string;
  dataUrl: string;
}

const ClusterPage: React.FC = () => {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [results, setResults] = useState<Array<{fileName: string, clusterCount: number}>>([]);
  const [totalClusters, setTotalClusters] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isRestoredSession, setIsRestoredSession] = useState(false);

  // Restore from localStorage
  useEffect(() => {
    if (user) {
      const imgsKey = `cluster_images_${user.uid}`;
      const resultsKey = `cluster_results_${user.uid}`;
      const imgs = localStorage.getItem(imgsKey);
      const res = localStorage.getItem(resultsKey);
      if (imgs) {
        try {
          const imgsParsed: PersistedImage[] = JSON.parse(imgs);
          setImageUrls(imgsParsed.map(i => i.dataUrl));
          setIsRestoredSession(true);
        } catch (e) {
          console.error("Failed to parse stored cluster images:", e);
        }
      }
      if (res) {
        try {
          const parsed = JSON.parse(res);
          if (Array.isArray(parsed.individual)) {
            setResults(parsed.individual);
            setTotalClusters(parsed.total ?? null);
          }
        } catch (e) {
          console.error("Failed to parse stored cluster results:", e);
        }
      }
    }
  }, [user]);

  // Save images to localStorage on change
  useEffect(() => {
    if (user && imageUrls.length > 0) {
      const imgsKey = `cluster_images_${user.uid}`;
      const metaArr: PersistedImage[] = imageUrls.map((url, i) => ({
        name: selectedImages[i]?.name || `saved_image_${i + 1}.jpg`,
        dataUrl: url
      }));
      localStorage.setItem(imgsKey, JSON.stringify(metaArr));
    } else if (user) {
      localStorage.removeItem(`cluster_images_${user.uid}`);
    }
  }, [selectedImages, imageUrls, user]);

  // Helper to read files to DataURL
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const urls = await Promise.all(files.map(fileToDataUrl));
      // Invalidate existing predictions so stale results are not mixed with newly added images
      setResults([]);
      setTotalClusters(null);
      setIsRestoredSession(false);
      setSelectedImages(prev => [...prev, ...files]);
      setImageUrls(prev => [...prev, ...urls]);
    }
  };

  const handleCameraCapture = async (file: File) => {
    setError('');
    const url = await fileToDataUrl(file);
    // Invalidate existing predictions when a new picture is snapped
    setResults([]);
    setTotalClusters(null);
    setIsRestoredSession(false);
    setSelectedImages(prev => [...prev, file]);
    setImageUrls(prev => [...prev, url]);
  };

  const handlePredictAll = async () => {
    if (!user || imageUrls.length === 0) return;
    setLoading(true);
    setError('');
    setResults([]);
    setTotalClusters(null);
    try {
      let sum = 0;
      const newResults: Array<{fileName: string, clusterCount: number}> = [];
      for (let i = 0; i < imageUrls.length; i++) {
        // We reconstruct a Blob from the DataURL to resend
        const res = await fetch(imageUrls[i]);
        const blob = await res.blob();
        const formData = new FormData();
        formData.append("image", new File([blob], selectedImages[i]?.name || `uploaded_${i}.jpg`));
        const response = await fetch(CLUSTER_API_URL, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`Backend error: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        const count = Number(result.prediction);
        newResults.push({
          fileName: selectedImages[i]?.name || `image_${i}`,
          clusterCount: count
        });
        sum += count;
      }
      setResults(newResults);
      setTotalClusters(sum);
      localStorage.setItem(
        `cluster_results_${user?.uid}`,
        JSON.stringify({
          individual: newResults,
          total: sum
        })
      );
    } catch (e: any) {
      setError(e.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (index: number) => {
    const newImgs = [...selectedImages];
    const newUrls = [...imageUrls];
    const newResults = [...results];
    newImgs.splice(index, 1);
    newUrls.splice(index, 1);
    newResults.splice(index, 1);
    setSelectedImages(newImgs);
    setImageUrls(newUrls);
    setResults(newResults);
    const sum = newResults.reduce((acc, item) => acc + item.clusterCount, 0);
    setTotalClusters(newResults.length ? sum : null);
    if (user) {
      localStorage.setItem(
        `cluster_results_${user.uid}`,
        JSON.stringify({
          individual: newResults,
          total: sum
        })
      );
      const imgsKey = `cluster_images_${user.uid}`;
      const metaArr: PersistedImage[] = newImgs.map((img, i) => ({
        name: img.name,
        dataUrl: newUrls[i]
      }));
      if (metaArr.length)
        localStorage.setItem(imgsKey, JSON.stringify(metaArr));
      else
        localStorage.removeItem(imgsKey);
    }
  };

  const handleClearAll = () => {
    setSelectedImages([]);
    setImageUrls([]);
    setResults([]);
    setTotalClusters(null);
    if (user) {
      localStorage.removeItem(`cluster_results_${user.uid}`);
      localStorage.removeItem(`cluster_images_${user.uid}`);
    }
  };

  const handleGoToYield = () => {
    window.location.href = "/yield";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-emerald-50/20 to-purple-50/20">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 flex flex-col w-full">
        {/* Page Title & Viticulture Badge */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-grape text-xs font-bold uppercase tracking-wider mb-2 border border-purple-200">
            <GiGrapes className="text-base" />
            <span>YOLOv5 Grape Vision Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Grape Cluster Counting
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto">
            Upload vineyard canopy photographs to automatically count visible berry bunches and estimate vine crop load.
          </p>
        </div>

        {/* Upload Station Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-6 transition-all">
          <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span>Upload Canopy Photos or Use Live Camera</span>
          </label>
          <div className="flex flex-col gap-4">
            <div className="relative border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors bg-emerald-50/30">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                id="cluster-file-upload"
              />
              <div className="flex flex-col items-center pointer-events-none">
                <span className="text-4xl mb-2">📸</span>
                <span className="text-sm font-bold text-emerald-900">
                  Tap to browse or drop canopy photos here
                </span>
                <span className="text-xs text-emerald-700/80 mt-1">
                  Supports JPEG, PNG • Multiple photos allowed
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="text-xs font-bold uppercase text-gray-400">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <CameraScanner onCapture={handleCameraCapture} />
          </div>
        </div>

        {/* Cached Session Notice */}
        {isRestoredSession && totalClusters !== null && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex justify-between items-center shadow-sm">
            <span>
              ℹ️ <strong>Restored session:</strong> Displaying cached counts from your previous scan. Tap <strong>Predict Clusters for All</strong> to re-run on current images.
            </span>
            <button
              onClick={() => setIsRestoredSession(false)}
              className="text-amber-950 font-bold ml-3 underline hover:text-amber-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Selected Images Section */}
        {imageUrls.length > 0 && (
          <div className="mb-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-gray-900 text-base">Selected Photos</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {imageUrls.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearAll}
                  disabled={loading}
                  className="px-3 py-1.5 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg font-semibold transition"
                >
                  Clear All
                </button>
                <button
                  onClick={handlePredictAll}
                  disabled={loading}
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <span>Predict Clusters for All</span>
                  )}
                </button>
              </div>
            </div>

            {/* List of Image Cards */}
            <div className="space-y-4">
              {imageUrls.map((url, idx) => (
                <div
                  key={url}
                  className="relative p-4 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-4"
                >
                  <div className="relative w-36 h-28 rounded-xl overflow-hidden bg-black flex-shrink-0 shadow-inner">
                    <img
                      src={url}
                      alt={`Selected ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {loading && (
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-xs flex items-center justify-center">
                        <div className="w-full h-1 bg-accent shadow-[0_0_8px_#DED36D] animate-pulse"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-gray-900 text-sm truncate max-w-xs">
                        {selectedImages[idx]?.name || `Canopy Image ${idx + 1}`}
                      </div>
                      {results[idx] ? (
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                          <GiGrapes className="text-base text-grape" />
                          <span>{results[idx].clusterCount} Grape Clusters Detected</span>
                        </div>
                      ) : (
                        <div className="mt-2 text-xs text-amber-600 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>Pending analysis (click Predict above)</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-200/60 flex justify-end">
                      <button
                        className="text-xs text-red-500 hover:text-red-700 font-semibold"
                        onClick={() => handleDelete(idx)}
                        disabled={loading}
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            {error}
          </div>
        )}

        {/* Total Cluster Summary Hero */}
        {totalClusters !== null && (
          <div className="mb-6 p-6 bg-gradient-to-r from-emerald-900 via-primary to-emerald-800 text-white rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-200 tracking-wider">
                Total Detected Across All Sample Photos
              </span>
              <div className="text-3xl sm:text-4xl font-black text-accent mt-1 flex items-center gap-2">
                <GiGrapes className="text-4xl text-white" />
                <span>{totalClusters} Clusters</span>
              </div>
            </div>
            <button
              onClick={handleGoToYield}
              className="px-6 py-3 rounded-xl bg-accent text-emerald-950 font-extrabold text-sm shadow-lg hover:bg-yellow-300 transition-all flex items-center gap-2"
            >
              <span>Transfer to Yield Predictor</span>
              <span>→</span>
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ClusterPage;
