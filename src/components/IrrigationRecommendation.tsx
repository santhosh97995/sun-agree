import React, { useState, useEffect } from 'react';
import { Droplets, CloudRain, Loader2, Info, ShieldCheck, Zap, Calculator, MapPin, Waves, AlertTriangle, Clock, Droplet, ArrowRight } from 'lucide-react';
import { getIrrigationAdvice } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceInput } from './VoiceInput';

export const IrrigationRecommendation: React.FC<{ language?: 'en' | 'te' | 'hi' }> = ({ language: initialLanguage = 'en' }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>(initialLanguage);
  const [cropName, setCropName] = useState('');
  const [location, setLocation] = useState('');
  const [waterAvailability, setWaterAvailability] = useState('Medium');

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cropName || !location) return;
    setLoading(true);

    try {
      const advice = await getIrrigationAdvice({ crop: cropName, location, waterAvailability }, language);
      setResult(advice);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const t = {
    en: {
      title: "Smart Irrigation",
      subtitle: "Precision Water Management",
      formCrop: "Crop Name",
      formLocation: "Location",
      formWater: "Water Availability",
      waterOptions: { High: "High", Medium: "Medium", Low: "Low" },
      getBtn: "Analyze",
      recommendation: "Irrigation Plan",
      schedule: "Water Schedule",
      timing: "Best Time",
      frequency: "Frequency",
      method: "Best Method",
      tips: "Saving Tips",
      warning: "Warning",
      placeholderCrop: "e.g. Rice, Cotton",
      placeholderLoc: "e.g. Guntur, AP"
    },
    te: {
      title: "స్మార్ట్ నీటిపారుదల",
      subtitle: "ఖచ్చితమైన నీటి నిర్వహణ",
      formCrop: "పంట పేరు",
      formLocation: "ప్రాంతం",
      formWater: "నీటి లభ్యత",
      waterOptions: { High: "ఎక్కువ", Medium: "మధ్యస్థం", Low: "తక్కువ" },
      getBtn: "విశ్లేషించు",
      recommendation: "నీటిపారుదల ప్రణాళిక",
      schedule: "నీటి షెడ్యూల్",
      timing: "ఉత్తమ సమయం",
      frequency: "ఫ్రీక్వెన్సీ",
      method: "ఉత్తమ పద్ధతి",
      tips: "ఆదా చిట్కాలు",
      warning: "హెచ్చరిక",
      placeholderCrop: "ఉదా. వరి, పత్తి",
      placeholderLoc: "ఉదా. గుంటూరు, ఏపీ"
    },
    hi: {
      title: "स्मार्ट सिंचाई",
      subtitle: "सटीक जल प्रबंधन",
      formCrop: "फसल का नाम",
      formLocation: "स्थान",
      formWater: "पानी की उपलब्धता",
      waterOptions: { High: "अधिक", Medium: "मध्यम", Low: "कम" },
      getBtn: "विश्लेषण करें",
      recommendation: "सिंचाई योजना",
      schedule: "जल कार्यक्रम",
      timing: "सबसे अच्छा समय",
      frequency: "आवृत्ति",
      method: "सर्वोत्तम विधि",
      tips: "बचत सुझाव",
      warning: "चेतावनी",
      placeholderCrop: "जैसे चावल, कपास",
      placeholderLoc: "जैसे गुंटूर, एपी"
    }
  }[language];

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-white p-6 rounded-[2.5rem] card-shadow border border-stone-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-stone-900">{t.title}</h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{t.subtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.formCrop}</label>
              <VoiceInput 
                onResult={(val) => setCropName(val)}
                placeholder={t.placeholderCrop}
                className="w-full bg-stone-50 border border-stone-100 p-5 rounded-3xl text-stone-900 outline-none focus:ring-2 focus:ring-cyan-500/20 font-bold text-lg transition-all"
                defaultValue={cropName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.formLocation}</label>
              <VoiceInput 
                onResult={(val) => setLocation(val)}
                placeholder={t.placeholderLoc}
                className="w-full bg-stone-50 border border-stone-100 p-5 rounded-3xl text-stone-900 outline-none focus:ring-2 focus:ring-cyan-500/20 font-bold text-lg transition-all"
                defaultValue={location}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.formWater}</label>
            <select 
              value={waterAvailability}
              onChange={(e) => setWaterAvailability(e.target.value)}
              className="w-full bg-stone-50 border border-stone-100 p-5 rounded-3xl text-stone-900 outline-none focus:ring-2 focus:ring-cyan-500/20 font-bold text-lg transition-all appearance-none"
            >
              <option value="High">{t.waterOptions.High}</option>
              <option value="Medium">{t.waterOptions.Medium}</option>
              <option value="Low">{t.waterOptions.Low}</option>
            </select>
          </div>

          <button 
            onClick={() => handleSubmit()}
            disabled={loading || !cropName || !location}
            className="w-full py-5 bg-cyan-500 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
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
            {/* Main Result Card */}
            <div className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-stone-900">{t.recommendation}</h3>
                <div className="px-4 py-1.5 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Optimal Plan
                </div>
              </div>

              <div className="p-6 bg-cyan-50 rounded-[2.5rem] border border-cyan-100">
                <p className="text-lg font-bold text-cyan-900 leading-relaxed italic">"{result.recommendation}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3 text-cyan-500" /> {t.schedule}
                  </h4>
                  <div className="space-y-3">
                    <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{t.timing}</p>
                      <p className="text-sm font-bold text-stone-900">{result.schedule.time}</p>
                    </div>
                    <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{t.frequency}</p>
                      <p className="text-sm font-bold text-stone-900">{result.schedule.frequency}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <Waves className="w-3 h-3 text-cyan-500" /> {t.method}
                  </h4>
                  <div className="p-8 bg-stone-900 rounded-[2.5rem] text-white flex flex-col items-center justify-center text-center gap-3">
                    <Droplet className="w-8 h-8 text-cyan-400" />
                    <p className="text-xl font-black">{result.bestMethod}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips & Warnings */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 space-y-4">
                <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-3 h-3" /> {t.tips}
                </h4>
                <ul className="space-y-2">
                  {result.waterSavingTips.map((tip: string, i: number) => (
                    <li key={i} className="text-xs text-emerald-800 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-[2.5rem] border border-red-100 space-y-4">
                <h4 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" /> {t.warning}
                </h4>
                <div className="p-4 bg-white/50 rounded-2xl">
                  <p className="text-xs text-red-800 leading-relaxed font-medium italic">"{result.warning}"</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
