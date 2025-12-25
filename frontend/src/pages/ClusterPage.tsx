import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CameraScanner from '../components/CameraScanner';
import { useTranslation } from "react-i18next";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';

const CLUSTER_API_URL = "http://localhost:7000/predict-cluster";

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

  // Restore from localStorage
  useEffect(() => {
    if (user) {
      const imgsKey = `cluster_images_${user.uid}`;
      const resultsKey = `cluster_results_${user.uid}`;
      const imgs = localStorage.getItem(imgsKey);
      const res = localStorage.getItem(resultsKey);
      if (imgs) {
        const imgsParsed: PersistedImage[] = JSON.parse(imgs);
        setImageUrls(imgsParsed.map(i => i.dataUrl));
        // Cannot restore as File objects, but DataURLs suffice for display & resending
      }
      if (res) {
        const parsed = JSON.parse(res);
        if (Array.isArray(parsed.individual)) {
          setResults(parsed.individual);
          setTotalClusters(parsed.total ?? null);
        }
      }
    }
  }, [user]);

  // Save images to localStorage on change
  useEffect(() => {
    if (user && imageUrls.length > 0) {
      const imgsKey = `cluster_images_${user.uid}`;
      // Save imageUrls as [{name, dataUrl}]
      const metaArr: PersistedImage[] = selectedImages.map((img, i) => ({
        name: img.name,
        dataUrl: imageUrls[i]
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
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const urls = await Promise.all(files.map(fileToDataUrl));
      setSelectedImages(prev => [...prev, ...files]);
      setImageUrls(prev => [...prev, ...urls]);
    }
  };

  const handleCameraCapture = async (file: File) => {
    const url = await fileToDataUrl(file);
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-4 py-8 flex flex-col">
        <h1 className="text-3xl font-bold text-primary mb-4">{t('Cluster Counting')}</h1>
        <div className="flex flex-col gap-5 bg-white rounded-lg shadow px-6 py-8 mb-4">
          <label className="font-semibold mb-2 text-grape">{t('Upload Images or Use Camera')}</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="mb-2"
            disabled={loading}
          />
          <div className="text-center text-gray-500 mt-1 mb-1">{t('or')}</div>
          <CameraScanner onCapture={handleCameraCapture} />
        </div>
        {imageUrls.length > 0 && (
          <div className="mb-4 bg-accent/20 rounded p-3 shadow">
            <div className="flex flex-col items-center">
              <button
                onClick={handlePredictAll}
                disabled={loading}
                className="mb-4 px-6 py-2 bg-primary text-accent rounded font-bold"
              >
                {loading ? 'Analyzing...' : 'Predict Clusters for All'}
              </button>
              <button
                onClick={handleClearAll}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1">
              {imageUrls.map((url, idx) => (
                <div className="my-4 border p-2 rounded bg-white shadow" key={url}>
                  <div className="flex items-center gap-4">
                    <img
                      src={url}
                      alt={`Selected ${idx + 1}`}
                      className="w-32 rounded shadow"
                    />
                    <div>
                      <div className="font-bold text-primary">{selectedImages[idx]?.name || `Image ${idx+1}`}</div>
                      {results[idx] && (
                        <div>
                          Cluster Count: <span className="font-bold">{results[idx].clusterCount}</span>
                        </div>
                      )}
                      <button
                        className="text-red-500 font-bold"
                        onClick={() => handleDelete(idx)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {error && (
          <div className="text-red-600 text-sm my-2">{error}</div>
        )}
        {totalClusters !== null && (
          <div className="border mt-4 p-3 bg-white rounded shadow-lg text-xl font-bold text-primary">
            Total Cluster Count (All Images): <span className="text-grape">{totalClusters}</span>
          </div>
        )}
        {results.length > 0 && (
          <button
            onClick={handleGoToYield}
            className="mt-6 px-8 py-2 bg-green-600 text-white rounded font-bold"
          >
            Go to Yield Prediction
          </button>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ClusterPage;
