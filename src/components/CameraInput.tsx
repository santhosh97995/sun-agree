import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, AlertCircle, Loader2, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { detectAnything } from '../services/gemini';

interface CameraInputProps {
  language: 'en' | 'te' | 'hi';
  onDetected?: (data: any) => void;
  onCapture?: (base64: string) => void;
  label?: string;
  mode?: 'detect' | 'capture';
}

export const CameraInput: React.FC<CameraInputProps> = ({ language, onDetected, onCapture, label, mode = 'detect' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = {
    en: {
      scan: "Scan with Camera",
      capture: "Capture & Analyze",
      captureOnly: "Capture Photo",
      cameraError: "Camera Access Required",
      cameraInstructions: "Please click the lock icon in your browser's address bar and set Camera to 'Allow' to use this feature.",
      tryAgain: "Try Again",
      analyzing: "AI is analyzing...",
      close: "Close"
    },
    te: {
      scan: "కెమెరాతో స్కాన్ చేయండి",
      capture: "క్యాప్చర్ & విశ్లేషించండి",
      captureOnly: "ఫోటో తీయండి",
      cameraError: "కెమెరా యాక్సెస్ అవసరం",
      cameraInstructions: "ఈ ఫీచర్‌ని ఉపయోగించడానికి దయచేసి మీ బ్రౌజర్ అడ్రస్ బార్‌లోని లాక్ ఐకాన్‌పై క్లిక్ చేసి, కెమెరాను 'అనుమతించు' (Allow) కి సెట్ చేయండి.",
      tryAgain: "మళ్ళీ ప్రయత్నించండి",
      analyzing: "AI విశ్లేషిస్తోంది...",
      close: "మూసివేయి"
    },
    hi: {
      scan: "कैमरे से स्कैन करें",
      capture: "कैप्चर और विश्लेषण करें",
      captureOnly: "फोटो खींचें",
      cameraError: "कैमरा एक्सेस आवश्यक है",
      cameraInstructions: "इस सुविधा का उपयोग करने के लिए कृपया अपने ब्राउज़र के एड्रेस बार में लॉक आइकन पर क्लिक करें और कैमरा को 'अनुमति दें' (Allow) पर सेट करें।",
      tryAgain: "पुनः प्रयास करें",
      analyzing: "AI विश्लेषण कर रहा है...",
      close: "बंद करें"
    }
  }[language];

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      const isPermissionError = 
        err.name === 'NotAllowedError' || 
        err.name === 'PermissionDeniedError' || 
        err.message?.toLowerCase().includes('permission denied') ||
        err.message?.toLowerCase().includes('notallowederror');

      if (isPermissionError) {
        setCameraError(t.cameraInstructions);
      } else {
        setCameraError(err.message || t.cameraError);
      }
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const captureAndAnalyze = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        
        if (mode === 'capture' && onCapture) {
          onCapture(dataUrl);
          setIsOpen(false);
          return;
        }

        if (onDetected) {
          setIsAnalyzing(true);
          try {
            const base64 = dataUrl.split(',')[1];
            const data = await detectAnything(base64, language);
            onDetected(data);
            setIsOpen(false);
          } catch (err) {
            console.error("Analysis error:", err);
          } finally {
            setIsAnalyzing(false);
          }
        }
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-neon-green/10 hover:bg-neon-green/20 text-neon-green rounded-lg border border-neon-green/20 transition-all text-[10px] font-bold uppercase tracking-wider"
      >
        <Camera className="w-3.5 h-3.5" />
        {label || t.scan}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-stone-900 rounded-[32px] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neon-green/20 rounded-xl">
                    <Camera className="w-5 h-5 text-neon-green" />
                  </div>
                  <h3 className="text-white font-bold">{t.scan}</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-xl text-stone-400 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-[4/3] relative bg-black">
                {isCameraActive ? (
                  <>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 pointer-events-none border-2 border-neon-green/30 m-8 rounded-3xl">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-neon-green" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-neon-green" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-neon-green" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-neon-green" />
                    </div>
                  </>
                ) : cameraError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h3 className="text-white font-bold text-lg mb-2">{t.cameraError}</h3>
                    <p className="text-stone-400 text-sm mb-6 leading-relaxed">{cameraError}</p>
                    <button 
                      onClick={() => { setCameraError(null); startCamera(); }}
                      className="px-8 py-3 bg-neon-green text-black rounded-xl font-bold flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {t.tryAgain}
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-neon-green animate-spin" />
                  </div>
                )}

                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-neon-green animate-spin mb-4" />
                    <p className="text-neon-green font-bold animate-pulse">{t.analyzing}</p>
                  </div>
                )}
              </div>

              <div className="p-6">
                <button
                  disabled={!isCameraActive || isAnalyzing}
                  onClick={captureAndAnalyze}
                  className="w-full py-4 bg-neon-green text-black rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(0,255,136,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  {mode === 'capture' ? t.captureOnly : t.capture}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
};
