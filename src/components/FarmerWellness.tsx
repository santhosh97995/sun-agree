import React, { useState, useEffect } from 'react';
import { Calendar, Heart, AlertTriangle, Lightbulb, Clock, Sun, Moon, Coffee, Shield, Brain, Loader2, Info, Zap, Stethoscope, Activity, Thermometer, Droplets, Apple, TrendingUp, BarChart3 } from 'lucide-react';
import { getFarmerWellnessAdvice } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

export const FarmerWellness: React.FC<{ language?: 'en' | 'te' | 'hi' }> = ({ language: initialLanguage = 'en' }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>(initialLanguage);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const advice = await getFarmerWellnessAdvice(language);
      setResult(advice);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const t = {
    en: {
      title: "Wellness Hub",
      subtitle: "Daily health & safety guide for farmers",
      generateBtn: "Analyze",
      timetable: "Daily Timetable",
      healthGuidance: "Health & Safety",
      farmingSolutions: "Farming Solutions",
      dailyTips: "Health Tips",
      safetySuggestions: "Safety Tips",
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      night: "Night",
      problemLabel: "Problem",
      solutionLabel: "Solution"
    },
    te: {
      title: "సంక్షేమ కేంద్రం",
      subtitle: "రైతుల కోసం రోజువారీ ఆరోగ్య & భద్రతా గైడ్",
      generateBtn: "విశ్లేషించు",
      timetable: "రోజువారీ టైమ్‌టేబుల్",
      healthGuidance: "ఆరోగ్యం & భద్రత",
      farmingSolutions: "వ్యవసాయ పరిష్కారాలు",
      dailyTips: "ఆరోగ్య చిట్కాలు",
      safetySuggestions: "భద్రతా చిట్కాలు",
      morning: "ఉదయం",
      afternoon: "మధ్యాహ్నం",
      evening: "సాయంత్రం",
      night: "రాత్రి",
      problemLabel: "సమస్య",
      solutionLabel: "పరిష్కారం"
    },
    hi: {
      title: "कल्याण केंद्र",
      subtitle: "किसानों के लिए दैनिक स्वास्थ्य और सुरक्षा गाइड",
      generateBtn: "विश्लेषण करें",
      timetable: "दैनिक समय सारणी",
      healthGuidance: "स्वास्थ्य और सुरक्षा",
      farmingSolutions: "खेती के समाधान",
      dailyTips: "स्वास्थ्य सुझाव",
      safetySuggestions: "सुरक्षा सुझाव",
      morning: "सुबह",
      afternoon: "दोपहर",
      evening: "शाम",
      night: "रात",
      problemLabel: "समस्या",
      solutionLabel: "समाधान"
    }
  }[language];

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-white p-6 rounded-[2.5rem] card-shadow border border-stone-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-stone-900">{t.title}</h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{t.subtitle}</p>
          </div>
        </div>

        <button 
          onClick={fetchAdvice}
          disabled={loading}
          className="w-full py-5 bg-rose-500 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-5 h-5" />}
          {t.generateBtn}
        </button>
      </section>

      {/* Output Section */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Health Tips Scroll */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {result.dailyHealthTips.map((tip: string, i: number) => (
                <div key={i} className="min-w-[280px] bg-white p-5 rounded-[2rem] card-shadow border border-stone-100 snap-center flex gap-3 items-start">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 shrink-0">
                    <Apple className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">{t.dailyTips}</p>
                    <p className="text-xs text-stone-600 leading-relaxed">🍎 {tip}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Timetable Card */}
            <div className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 space-y-8">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3 text-rose-500" /> {t.timetable}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'morning', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50', label: t.morning },
                  { key: 'afternoon', icon: Coffee, color: 'text-orange-500', bg: 'bg-orange-50', label: t.afternoon },
                  { key: 'evening', icon: Sun, color: 'text-indigo-500', bg: 'bg-indigo-50', label: t.evening },
                  { key: 'night', icon: Moon, color: 'text-purple-500', bg: 'bg-purple-50', label: t.night }
                ].map((item) => (
                  <div key={item.key} className="p-5 bg-stone-50 rounded-3xl border border-stone-100 flex items-center gap-4">
                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center ${item.color} shrink-0`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.label}</p>
                      <p className="text-xs text-stone-600">🕒 {result.timetable[item.key]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Guidance */}
            <div className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 space-y-6">
              <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-3 h-3 text-rose-500" /> {t.healthGuidance}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.healthGuidance.map((item: any, i: number) => (
                  <div key={i} className="p-5 bg-stone-50 rounded-3xl border border-stone-100 flex gap-4 items-center">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shrink-0 shadow-sm">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-stone-900 text-xs">{item.category}</h4>
                      <p className="text-stone-500 text-[10px] leading-relaxed mt-0.5">🛡️ {item.advice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions Card */}
            <div className="bg-stone-900 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
                  <Lightbulb className="w-3 h-3" /> {t.farmingSolutions}
                </h4>
                <div className="space-y-4">
                  {result.farmingSolutions.map((item: any, i: number) => (
                    <div key={i} className="space-y-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-xs font-black text-amber-500">⚠️ {t.problemLabel}: {item.problem}</p>
                      <p className="text-xs text-stone-300">✅ {t.solutionLabel}: {item.solution}</p>
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
