import React, { useState, useEffect } from 'react';
import { 
  Camera, Upload, RefreshCw, CheckCircle2, AlertCircle, 
  Info, ShieldCheck, Zap, Leaf, Droplets, ArrowRight,
  Loader2, Maximize2, History as HistoryIcon, Trash2, TrendingUp,
  Bug, Microscope, Activity, FlaskConical, SlidersHorizontal, ChevronRight, X,
  Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { detectPlantDisease } from '../services/gemini';
import { VoiceInput } from './VoiceInput';

interface DiseaseResult {
  isValidPlant: boolean;
  errorMessage?: string;
  plantName: string;
  diseaseName: string;
  diseaseType: string;
  aboutDisease: string;
  symptoms: string[];
  prevention: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  fertilizerRecommendation: string;
  recoveryTips: string[];
  confidence: string;
  severity: 'Low' | 'Medium' | 'High';
  representativeImages: string[];
}

export const DiseaseDetection: React.FC<{ language?: 'en' | 'te' | 'hi' }> = ({ language: initialLanguage = 'en' }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>(initialLanguage);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const base64 = image.split(',')[1];
      const data = await detectPlantDisease(base64, language);
      
      if (!data.isValidPlant) {
        alert(data.errorMessage || "Not a plant leaf!");
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const t = {
    en: {
      title: "Disease Detection",
      subtitle: "AI-powered plant health diagnostics",
      upload: "Upload Photo",
      analyzeBtn: "Analyze",
      analyzing: "Analyzing...",
      result: "Detection Result",
      confidence: "Confidence",
      severity: "Severity",
      symptoms: "Symptoms",
      prevention: "Prevention",
      organic: "Organic Treatment",
      chemical: "Chemical Treatment",
      about: "About Disease",
      type: "Disease Type",
      fertilizer: "Fertilizer Recommendation",
      recovery: "Fast Recovery Tips",
      placeholder: "Upload a plant leaf photo"
    },
    te: {
      title: "వ్యాధి గుర్తింపు",
      subtitle: "AI ఆధారిత మొక్కల ఆరోగ్య నిర్ధారణ",
      upload: "ఫోటోను అప్‌లోడ్ చేయండి",
      analyzeBtn: "విశ్లేషించు",
      analyzing: "విశ్లేషిస్తోంది...",
      result: "గుర్తింపు ఫలితం",
      confidence: "నమ్మకం",
      severity: "తీవ్రత",
      symptoms: "లక్షణాలు",
      prevention: "నివారణ",
      organic: "సేంద్రియ చికిత్స",
      chemical: "రసాయన చికిత్స",
      about: "వ్యాధి గురించి",
      type: "వ్యాధి రకం",
      fertilizer: "ఎరువుల సిఫార్సు",
      recovery: "వేగంగా కోలుకోవడానికి చిట్కాలు",
      placeholder: "మొక్క ఆకు ఫోటోను అప్‌లోడ్ చేయండి"
    },
    hi: {
      title: "रोग पहचान",
      subtitle: "AI-संचालित पौधों के स्वास्थ्य का निदान",
      upload: "फोटो अपलोड करें",
      analyzeBtn: "विश्लेषण करें",
      analyzing: "विश्लेषण कर रहा है...",
      result: "पहचान परिणाम",
      confidence: "आत्मविश्वास",
      severity: "तीव्रता",
      symptoms: "लक्षण",
      prevention: "रोकथाम",
      organic: "जैविक उपचार",
      chemical: "रासायनिक उपचार",
      about: "रोग के बारे में",
      type: "रोग का प्रकार",
      fertilizer: "उर्वरक सिफारिश",
      recovery: "तेजी से ठीक होने के टिप्स",
      placeholder: "पौधे की पत्ती का फोटो अपलोड करें"
    }
  }[language];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-50 text-red-600 border-red-100';
      case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-white p-6 rounded-[2.5rem] card-shadow border border-stone-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-stone-900">{t.title}</h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{t.subtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.upload}</label>
            <div 
              onClick={() => document.getElementById('disease-upload')?.click()}
              className="w-full aspect-video bg-stone-50 border-2 border-dashed border-stone-200 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-stone-100 transition-all overflow-hidden relative"
            >
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-10 h-10 text-stone-300" />
                  <p className="text-xs font-bold text-stone-400">{t.placeholder}</p>
                </>
              )}
            </div>
            <input 
              id="disease-upload"
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading || !image}
            className="w-full py-5 bg-rose-500 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-5 h-5" />}
            {t.analyzeBtn}
          </button>
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
                <h3 className="text-2xl font-black text-stone-900">{result.diseaseName}</h3>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getSeverityColor(result.severity)}`}>
                  {result.severity} {t.severity}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-rose-600">
                    <Microscope className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.type}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{result.diseaseType}</p>
                </div>
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.about}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{result.aboutDisease}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 text-amber-500" /> {t.symptoms}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.symptoms.map((s, i) => (
                    <div key={i} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span className="text-xs text-stone-600">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <Leaf className="w-3 h-3 text-emerald-500" /> {t.organic}
                  </h4>
                  <ul className="space-y-2">
                    {result.organicTreatment.map((o, i) => (
                      <li key={i} className="text-xs text-stone-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3 text-rose-500" /> {t.chemical}
                  </h4>
                  <ul className="space-y-2">
                    {result.chemicalTreatment.map((c, i) => (
                      <li key={i} className="text-xs text-stone-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recovery Card */}
            <div className="bg-rose-500 p-8 rounded-[3rem] text-white shadow-xl shadow-rose-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.recovery}</h4>
                  <ul className="text-xs font-bold leading-relaxed list-disc list-inside">
                    {result.recoveryTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
