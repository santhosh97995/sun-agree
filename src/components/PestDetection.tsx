import React, { useState, useRef, useEffect } from 'react';
import { Bug, Shield, Loader2, Sprout, AlertTriangle, Info, X, RefreshCw, Microscope, FlaskConical, Leaf, Activity, Zap, AlertCircle, ShieldCheck, CheckCircle2, ArrowRight, Upload } from 'lucide-react';
import { detectPestAndDisease } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { CameraInput } from './CameraInput';

const SeverityIndicator = ({ severity, language }: { severity: 'Low' | 'Medium' | 'High', language: 'en' | 'te' | 'hi' }) => {
  const labels = {
    en: { Low: 'Low', Medium: 'Medium', High: 'High', title: 'Severity' },
    te: { Low: 'తక్కువ', Medium: 'మధ్యస్థం', High: 'ఎక్కువ', title: 'తీవ్రత' },
    hi: { Low: 'कम', Medium: 'मध्यम', High: 'उच्च', title: 'तीव्रता' }
  }[language];

  const levels = [
    { label: labels.Low, color: 'bg-emerald-500', active: true },
    { label: labels.Medium, color: 'bg-orange-500', active: severity === 'Medium' || severity === 'High' },
    { label: labels.High, color: 'bg-red-500', active: severity === 'High' }
  ];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-400">
        <span>{labels.title}</span>
        <span className={
          severity === 'High' ? 'text-red-500' : 
          severity === 'Medium' ? 'text-orange-500' : 
          'text-emerald-500'
        }>{labels[severity]}</span>
      </div>
      <div className="flex gap-1 h-1.5">
        {levels.map((level, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-full transition-all duration-500 ${
              level.active ? level.color : 'bg-stone-100'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const getTypeIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('insect') || t.includes('pest')) return <Bug className="w-5 h-5" />;
  if (t.includes('fungal') || t.includes('fungus')) return <Microscope className="w-5 h-5" />;
  if (t.includes('viral') || t.includes('virus')) return <Activity className="w-5 h-5" />;
  if (t.includes('bacterial') || t.includes('bacteria')) return <FlaskConical className="w-5 h-5" />;
  if (t.includes('nutritional') || t.includes('deficiency')) return <Leaf className="w-5 h-5" />;
  return <AlertCircle className="w-5 h-5" />;
};

interface PestResult {
  name: string;
  type: string;
  confidence: string;
  symptoms: string;
  cause: string;
  chemicalTreatment: {
    pesticide: string;
    dosage: string;
    method: string;
  };
  organicTreatment: {
    solution: string;
    preparation: string;
  };
  fertilizerRecommendation: {
    type: string;
    quantity: string;
    purpose: string;
  };
  recoveryTips: string[];
  preventionTips: string[];
  severity: 'Low' | 'Medium' | 'High';
  representativeImages: string[];
}

export const PestDetection: React.FC<{ language?: 'en' | 'te' | 'hi' }> = ({ language: initialLanguage = 'en' }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PestResult | null>(null);
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>(initialLanguage);
  const [activeMethod, setActiveMethod] = useState<'camera' | 'upload'>('camera');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const t = {
    en: {
      title: "Pest Detection",
      subtitle: "AI-Powered Identification",
      scan: "Scan Pest",
      upload: "Upload Photo",
      analyzing: "Analyzing...",
      confidence: "Confidence",
      severity: "Severity",
      symptoms: "Symptoms",
      prevention: "Prevention",
      organic: "Organic",
      chemical: "Chemical",
      cause: "Cause",
      fertilizer: "Fertilizer",
      recovery: "Recovery Tips",
      readyDesc: "Point camera at pest or damage"
    },
    te: {
      title: "కీటకాల గుర్తింపు",
      subtitle: "AI ఆధారిత గుర్తింపు",
      scan: "స్కాన్ చేయండి",
      upload: "అప్‌లోడ్ చేయండి",
      analyzing: "విశ్లేషిస్తోంది...",
      confidence: "నమ్మకం",
      severity: "తీవ్రత",
      symptoms: "లక్షణాలు",
      prevention: "నివారణ",
      organic: "సేంద్రియ",
      chemical: "రసాయన",
      cause: "కారణం",
      fertilizer: "ఎరువులు",
      recovery: "కోలుకునే చిట్కాలు",
      readyDesc: "కీటకం లేదా నష్టం వైపు చూపండి"
    },
    hi: {
      title: "कीट पहचान",
      subtitle: "AI-संचालित पहचान",
      scan: "स्कैन करें",
      upload: "अपलोड करें",
      analyzing: "विश्लेषण...",
      confidence: "आत्मविश्वास",
      severity: "तीव्रता",
      symptoms: "लक्षण",
      prevention: "रोकथाम",
      organic: "जैविक",
      chemical: "रासायनिक",
      cause: "कारण",
      fertilizer: "उर्वरक",
      recovery: "रिकवरी टिप्स",
      readyDesc: "कीट या क्षति की ओर कैमरा करें"
    }
  }[language];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const detectPest = async () => {
    if (!image) return;
    setLoading(true);
    
    try {
      const base64Data = image.split(',')[1];
      const analysis = await detectPestAndDisease(base64Data, language);
      setResult(analysis);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-white p-6 rounded-[2.5rem] card-shadow border border-stone-100 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
              <Bug className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-stone-900">{t.title}</h3>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex bg-stone-50 p-1 rounded-xl border border-stone-100">
            <button 
              onClick={() => { setActiveMethod('camera'); setImage(null); }}
              className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${activeMethod === 'camera' ? 'bg-white text-orange-600 shadow-sm' : 'text-stone-400'}`}
            >
              CAMERA
            </button>
            <button 
              onClick={() => { setActiveMethod('upload'); }}
              className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${activeMethod === 'upload' ? 'bg-white text-orange-600 shadow-sm' : 'text-stone-400'}`}
            >
              UPLOAD
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="aspect-square bg-stone-50 rounded-[2rem] border-2 border-dashed border-stone-200 overflow-hidden relative group">
            {activeMethod === 'camera' && !image ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
                <CameraInput 
                  language={language} 
                  mode="capture"
                  onCapture={(base64) => setImage(base64)}
                  label={t.scan}
                />
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{t.readyDesc}</p>
              </div>
            ) : image ? (
              <div className="relative w-full h-full">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => { setImage(null); setResult(null); }}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-xl text-red-500 shadow-lg active:scale-95 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-stone-100/50 transition-all"
              >
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">{t.upload}</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          {image && (
            <button 
              onClick={detectPest}
              disabled={loading}
              className="w-full py-5 bg-orange-500 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-5 h-5" />}
              {loading ? t.analyzing : t.scan}
            </button>
          )}
        </div>
      </section>

      {/* Output Section */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Main Result Card */}
            <div className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    result.severity === 'High' ? 'bg-red-50 text-red-500' : 
                    result.severity === 'Medium' ? 'bg-orange-50 text-orange-500' : 
                    'bg-emerald-50 text-emerald-500'
                  }`}>
                    {getTypeIcon(result.type)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-stone-900 leading-tight">{result.name}</h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{result.type} • {result.confidence}</p>
                  </div>
                </div>
              </div>

              <SeverityIndicator severity={result.severity} language={language} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.symptoms}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{result.symptoms}</p>
                </div>
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.cause}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{result.cause}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                    <Sprout className="w-3 h-3" /> {t.organic}
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-emerald-900">{result.organicTreatment.solution}</p>
                    <p className="text-[10px] text-emerald-700 leading-relaxed italic">{result.organicTreatment.preparation}</p>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 rounded-[2.5rem] border border-blue-100 space-y-4">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3 h-3" /> {t.chemical}
                  </h4>
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-blue-900">{result.chemicalTreatment.pesticide}</p>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Dosage</p>
                        <p className="text-[10px] font-bold text-blue-800">{result.chemicalTreatment.dosage}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Method</p>
                        <p className="text-[10px] font-bold text-blue-800">{result.chemicalTreatment.method}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recovery & Prevention */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-orange-500 p-8 rounded-[3rem] text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
                <div className="relative z-10 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> {t.recovery}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {result.recoveryTips?.map((tip, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-bold italic">
                        <ArrowRight className="w-4 h-4 shrink-0" />
                        <span>"{tip}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 space-y-6">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> {t.prevention}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.preventionTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-stone-600 font-medium">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
