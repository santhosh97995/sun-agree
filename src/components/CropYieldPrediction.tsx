import React, { useState, useEffect } from 'react';
import { Sprout, BarChart3, Loader2, Info, ShieldCheck, Zap, TrendingUp, Droplets, FlaskConical, Bug, Stethoscope, AlertTriangle, Coins, ArrowRight } from 'lucide-react';
import { getYieldProtectionAdvice } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceInput } from './VoiceInput';

export const CropYieldPrediction: React.FC<{ language?: 'en' | 'te' | 'hi' }> = ({ language: initialLanguage = 'en' }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>(initialLanguage);
  const [cropName, setCropName] = useState('');
  const [mode, setMode] = useState('3R');

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cropName) return;
    setLoading(true);

    try {
      const advice = await getYieldProtectionAdvice(cropName, mode, language);
      setResult(advice);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const t = {
    en: {
      title: "Yield Prediction",
      subtitle: "AI-Powered Harvest Security",
      formCrop: "Crop Name",
      formMode: "Select Mode",
      modeOptions: {
        "1R": "1R: Basic Advice",
        "2R": "2R: Detailed Practices",
        "3R": "3R: Full Smart Prediction"
      },
      getBtn: "Analyze",
      prediction: "Yield Prediction",
      level: "Yield Level",
      water: "Water Protection",
      fertilizer: "Fertilizer Plan",
      pest: "Pest Control",
      disease: "Disease Protection",
      risks: "Risks",
      profit: "Profit Tips",
      placeholder: "e.g. Rice, Wheat"
    },
    te: {
      title: "దిగుబడి అంచనా",
      subtitle: "AI-ఆధారిత పంట భద్రత",
      formCrop: "పంట పేరు",
      formMode: "మోడ్‌ను ఎంచుకోండి",
      modeOptions: {
        "1R": "1R: ప్రాథమిక సలహా",
        "2R": "2R: వివరణాత్మక పద్ధతులు",
        "3R": "3R: పూర్తి స్మార్ట్ అంచనా"
      },
      getBtn: "విశ్లేషించు",
      prediction: "దిగుబడి అంచనా",
      level: "దిగుబడి స్థాయి",
      water: "నీటి రక్షణ",
      fertilizer: "ఎరువుల ప్రణాళిక",
      pest: "తెగుళ్ల నియంత్రణ",
      disease: "వ్యాధి రక్షణ",
      risks: "ప్రమాదాలు",
      profit: "లాభ చిట్కాలు",
      placeholder: "ఉదా. వరి, గోధుమ"
    },
    hi: {
      title: "उपज भविष्यवाणी",
      subtitle: "AI-संचालित फसल सुरक्षा",
      formCrop: "फसल का नाम",
      formMode: "मोड चुनें",
      modeOptions: {
        "1R": "1R: बुनियादी सलाह",
        "2R": "2R: विस्तृत पद्धतियां",
        "3R": "3R: पूर्ण स्मार्ट भविष्यवाणी"
      },
      getBtn: "विश्लेषण करें",
      prediction: "उपज भविष्यवाणी",
      level: "उपज स्तर",
      water: "जल सुरक्षा",
      fertilizer: "उर्वरक योजना",
      pest: "कीट नियंत्रण",
      disease: "रोग सुरक्षा",
      risks: "जोखिम",
      profit: "लाभ सुझाव",
      placeholder: "जैसे चावल, गेहूं"
    }
  }[language];

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-white p-6 rounded-[2.5rem] card-shadow border border-stone-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-stone-900">{t.title}</h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{t.subtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.formCrop}</label>
            <VoiceInput 
              onResult={(val) => setCropName(val)}
              placeholder={t.placeholder}
              className="w-full bg-stone-50 border border-stone-100 p-5 rounded-3xl text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-lg transition-all"
              defaultValue={cropName}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.formMode}</label>
            <select 
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full bg-stone-50 border border-stone-100 p-5 rounded-3xl text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-lg transition-all appearance-none"
            >
              <option value="1R">{t.modeOptions["1R"]}</option>
              <option value="2R">{t.modeOptions["2R"]}</option>
              <option value="3R">{t.modeOptions["3R"]}</option>
            </select>
          </div>

          <button 
            onClick={() => handleSubmit()}
            disabled={loading || !cropName}
            className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-5 h-5" />}
            {t.getBtn}
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
            {/* Main Prediction Card */}
            <div className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-stone-900">{t.prediction}</h3>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  result.yieldLevel === 'High' ? 'bg-emerald-50 text-emerald-600' : 
                  result.yieldLevel === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                }`}>
                  {result.yieldLevel} Yield
                </div>
              </div>

              <div className="p-8 bg-stone-900 rounded-[2.5rem] text-white flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
                <TrendingUp className="w-10 h-10 text-emerald-400" />
                <p className="text-2xl font-black leading-tight">{result.yieldPrediction}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Droplets className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.water}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{result.waterProtection}</p>
                </div>
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600">
                    <FlaskConical className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.fertilizer}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{result.fertilizerPlan}</p>
                </div>
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Bug className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.pest}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{result.pestControl}</p>
                </div>
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Stethoscope className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.disease}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{result.diseaseProtection}</p>
                </div>
              </div>
            </div>

            {/* Risks & Profit Tips */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-red-50 p-6 rounded-[2.5rem] border border-red-100 space-y-4">
                <h4 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" /> {t.risks}
                </h4>
                <p className="text-xs text-red-800 leading-relaxed font-medium italic">"{result.risks}"</p>
              </div>

              <div className="bg-emerald-500 p-8 rounded-[3rem] text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
                    <Coins className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.profit}</h4>
                    <p className="text-sm font-bold leading-relaxed italic">"{result.profitTips}"</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
