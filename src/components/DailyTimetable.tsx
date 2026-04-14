import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, Loader2, Info, ShieldCheck, Zap, ListTodo, AlertTriangle, TrendingUp, Sprout, ArrowRight } from 'lucide-react';
import { getCropTimetable } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceInput } from './VoiceInput';

export const DailyTimetable: React.FC<{ language?: 'en' | 'te' | 'hi' }> = ({ language: initialLanguage = 'en' }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>(initialLanguage);
  const [cropName, setCropName] = useState('');

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cropName) return;
    setLoading(true);

    try {
      const timetable = await getCropTimetable(cropName, language);
      setResult(timetable);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const t = {
    en: {
      title: "Crop Timetable",
      subtitle: "Full schedule from sowing to harvest",
      formCrop: "Crop Name",
      analyzeBtn: "Analyze",
      timetable: "Full Timetable",
      tips: "Tips",
      warnings: "Warnings",
      profit: "Profit Advice",
      stage: "Stage",
      time: "Time",
      work: "Work",
      placeholder: "e.g. Rice, Tomato"
    },
    te: {
      title: "పంట టైమ్‌టేబుల్",
      subtitle: "విత్తడం నుండి కోత వరకు పూర్తి షెడ్యూల్",
      formCrop: "పంట పేరు",
      analyzeBtn: "విశ్లేషించు",
      timetable: "పూర్తి టైమ్‌టేబుల్",
      tips: "చిట్కాలు",
      warnings: "హెచ్చరికలు",
      profit: "లాభాల సలహా",
      stage: "దశ",
      time: "సమయం",
      work: "పని",
      placeholder: "ఉదా. వరి, టమోటా"
    },
    hi: {
      title: "फसल समय सारणी",
      subtitle: "बुवाई से कटाई तक का पूरा कार्यक्रम",
      formCrop: "फसल का नाम",
      analyzeBtn: "विश्लेषण करें",
      timetable: "पूर्ण समय सारणी",
      tips: "सुझाव",
      warnings: "चेतावनियाँ",
      profit: "लाभ सलाह",
      stage: "चरण",
      time: "समय",
      work: "कार्य",
      placeholder: "जैसे चावल, टमाटर"
    }
  }[language];

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-white p-6 rounded-[2.5rem] card-shadow border border-stone-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-agri-soft rounded-2xl flex items-center justify-center text-agri-green">
            <Calendar className="w-6 h-6" />
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
              className="w-full bg-stone-50 border border-stone-100 p-5 rounded-3xl text-stone-900 outline-none focus:ring-2 focus:ring-agri-green/20 font-bold text-lg transition-all"
              defaultValue={cropName}
            />
          </div>

          <button 
            onClick={() => handleSubmit()}
            disabled={loading || !cropName}
            className="w-full py-5 bg-agri-green text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-agri-green/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
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
                <h3 className="text-2xl font-black text-stone-900">{result.cropName}</h3>
                <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Good Status
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3 h-3 text-agri-green" /> {t.timetable}
                </h4>
                <div className="space-y-3">
                  {result.timetable.map((item: any, i: number) => (
                    <div key={i} className="p-5 bg-stone-50 rounded-[2rem] border border-stone-100 flex gap-4">
                      <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-agri-green shadow-sm shrink-0">
                        <span className="text-xs font-black">{i + 1}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-stone-900">{item.stage}</p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{item.time}</p>
                        <p className="text-xs text-stone-600 leading-relaxed mt-2">{item.work}</p>
                      </div>
                    </div>
                  ))}
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
                  {result.tips.map((tip: string, i: number) => (
                    <li key={i} className="text-xs text-emerald-800 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-[2.5rem] border border-red-100 space-y-4">
                <h4 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" /> {t.warnings}
                </h4>
                <ul className="space-y-2">
                  {result.warnings.map((warning: string, i: number) => (
                    <li key={i} className="text-xs text-red-800 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 shrink-0" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Profit Card */}
            <div className="bg-agri-green p-8 rounded-[3rem] text-white shadow-xl shadow-agri-green/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.profit}</h4>
                  <p className="text-sm font-bold leading-relaxed italic">"{result.profitAdvice}"</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
