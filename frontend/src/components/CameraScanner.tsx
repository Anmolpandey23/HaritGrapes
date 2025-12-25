import React, { useRef, useState } from 'react';

interface CameraScannerProps {
  onCapture: (file: File) => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture }) => {
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setError('');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      }
    } catch (err) {
      setError('Camera not accessible.');
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);
        canvasRef.current.toBlob(blob => {
          if (blob) {
            onCapture(new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' }));
          }
        }, 'image/jpeg');
      }
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      {!streaming &&
        <button type="button" onClick={startCamera} className="px-6 py-2 bg-grape text-white rounded font-bold mb-2">
          Start Camera
        </button>
      }
      {streaming && (
        <div className="flex flex-col items-center gap-2">
          <video ref={videoRef} autoPlay playsInline width={320} height={240} className="rounded shadow" />
          <button type="button" onClick={captureImage} className="bg-accent text-primary font-bold px-4 py-2 rounded">
            Capture Photo
          </button>
          <button onClick={stopCamera} className="text-sm text-gray-700 underline">Stop</button>
          <canvas ref={canvasRef} width={320} height={240} className="hidden" />
        </div>
      )}
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  );
};

export default CameraScanner;
