import React, { useState, useEffect } from 'react';
import { Sprout, BarChart3, Loader2, Info, ShieldCheck, Zap, TrendingUp, FlaskConical, AlertTriangle, Coins, Clock, Lightbulb, ClipboardList, ArrowRight } from 'lucide-react';
import { getNutrientAnalysisAdvice } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceInput } from './VoiceInput';

export const NutrientAnalyzer: React.FC<{ language?: 'en' | 'te' | 'hi' }> = ({ language: initialLanguage = 'en' }) => {
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
      const advice = await getNutrientAnalysisAdvice(cropName, language);
      setResult(advice);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const t = {
    en: {
      title: "Nutrition Analyzer",
      subtitle: "Expert Nutrition for Maximum Yield",
      formCrop: "Crop Name",
      getBtn: "Analyze",
      analyzing: "Analyzing...",
      crop: "Crop",
      nutrients: "Important Nutrients",
      role: "Nutrient Role",
      deficiency: "Deficiency Signs",
      plan: "Nutrition Plan",
      timing: "When to Apply",
      tips: "Healthy Crop Tips",
      yieldAdvice: "Yield Advice",
      placeholder: "e.g. Rice, Wheat"
    },
    te: {
      title: "పోషణ విశ్లేషణ",
      subtitle: "గరిష్ట దిగుబడి కోసం నిపుణుల పోషణ",
      formCrop: "పంట పేరు",
      getBtn: "విశ్లేషించు",
      analyzing: "విశ్లేషిస్తోంది...",
      crop: "పంట",
      nutrients: "ముఖ్యమైన పోషకాలు",
      role: "పోషక పాత్ర",
      deficiency: "లోపం సంకేతాలు",
      plan: "పోషణ ప్రణాళిక",
      timing: "ఎప్పుడు వేయాలి",
      tips: "ఆరోగ్యకరమైన పంట చిట్కాలు",
      yieldAdvice: "దిగుబడి సలహా",
      placeholder: "ఉదా. వరి, గోధుమ"
    },
    hi: {
      title: "पोषण विश्लेषक",
      subtitle: "अधिकतम उपज के लिए विशेषज्ञ पोषण",
      formCrop: "फसल का नाम",
      getBtn: "विश्लेषण करें",
      analyzing: "विश्लेषण कर रहा है...",
      crop: "फसल",
      nutrients: "महत्वपूर्ण पोषक तत्व",
      role: "पोषक तत्व की भूमिका",
      deficiency: "कमी के लक्षण",
      plan: "पोषण योजना",
      timing: "कब लागू करें",
      tips: "स्वस्थ फसल सुझाव",
      yieldAdvice: "उपज सलाह",
      placeholder: "जैसे चावल, गेहूं"
    }
  }[language];

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-white p-6 rounded-[2.5rem] card-shadow border border-stone-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <FlaskConical className="w-6 h-6" />
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
            {/* Main Analysis Card */}
            <div className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-stone-900">{t.title}</h3>
                <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {result.crop}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Sprout className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.nutrients}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{result.importantNutrients}</p>
                </div>
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.role}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{result.nutrientRole}</p>
                </div>
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.deficiency}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{result.deficiencySigns}</p>
                </div>
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <ClipboardList className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.plan}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{result.nutritionPlan}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.timing}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{result.whenToApply}</p>
                </div>
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.tips}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{result.healthyCropTips}</p>
                </div>
              </div>
            </div>

            {/* Yield Advice Card */}
            <div className="bg-emerald-500 p-8 rounded-[3rem] text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
                  <Coins className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.yieldAdvice}</h4>
                  <p className="text-sm font-bold leading-relaxed italic">"{result.yieldImprovementAdvice}"</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
