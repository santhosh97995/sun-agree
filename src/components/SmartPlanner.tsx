import React, { useState, useEffect } from 'react';
import { Calculator, Wallet, Loader2, Info, ShieldCheck, Zap, Sprout, Ruler, PieChart, TrendingUp, Shovel, FlaskConical, Droplets, Banknote, BarChart3 } from 'lucide-react';
import { getCombinedFarmPlan } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceInput } from './VoiceInput';

export const SmartPlanner: React.FC<{ language?: 'en' | 'te' | 'hi' }> = ({ language: initialLanguage = 'en' }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>(initialLanguage);
  const [cropName, setCropName] = useState('');
  const [fieldSize, setFieldSize] = useState('');

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cropName || !fieldSize) return;
    setLoading(true);

    try {
      const plan = await getCombinedFarmPlan(cropName, Number(fieldSize), language);
      setResult(plan);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const t = {
    en: {
      title: "Farm Planner",
      subtitle: "Combined resource & budget planning",
      formCrop: "Crop Name",
      formSize: "Field Size (Acres)",
      analyzeBtn: "Generate Plan",
      resources: "Required Resources",
      budget: "Estimated Budget",
      profit: "Profit Projection",
      tips: "Efficiency Tips",
      summary: "AI Summary",
      seeds: "Seeds",
      fertilizer: "Fertilizer",
      water: "Water",
      totalCost: "Total Cost",
      expectedRevenue: "Expected Revenue",
      placeholder: "e.g. Rice, Tomato"
    },
    te: {
      title: "ఫామ్ ప్లానర్",
      subtitle: "వనరులు & బడ్జెట్ ప్రణాళిక",
      formCrop: "పంట పేరు",
      formSize: "పొలం పరిమాణం (ఎకరాలు)",
      analyzeBtn: "ప్లాన్‌ను రూపొందించండి",
      resources: "అవసరమైన వనరులు",
      budget: "అంచనా బడ్జెట్",
      profit: "లాభాల అంచనా",
      tips: "సామర్థ్య చిట్కాలు",
      summary: "AI సారాంశం",
      seeds: "విత్తనాలు",
      fertilizer: "ఎరువులు",
      water: "నీరు",
      totalCost: "మొత్తం ఖర్చు",
      expectedRevenue: "ఆశించిన ఆదాయం",
      placeholder: "ఉదా. వరి, టమోటా"
    },
    hi: {
      title: "फार्म प्लानर",
      subtitle: "संसाधन और बजट योजना",
      formCrop: "फसल का नाम",
      formSize: "खेत का आकार (एकड़)",
      analyzeBtn: "योजना तैयार करें",
      resources: "आवश्यक संसाधन",
      budget: "अनुमानित बजट",
      profit: "लाभ का अनुमान",
      tips: "दक्षता सुझाव",
      summary: "AI सारांश",
      seeds: "बीज",
      fertilizer: "उर्वरक",
      water: "पानी",
      totalCost: "कुल लागत",
      expectedRevenue: "अपेक्षित राजस्व",
      placeholder: "जैसे चावल, टमाटर"
    }
  }[language];

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-white p-6 rounded-[2.5rem] card-shadow border border-stone-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <PieChart className="w-6 h-6" />
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
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.formSize}</label>
            <input 
              type="number"
              value={fieldSize}
              onChange={(e) => setFieldSize(e.target.value)}
              placeholder="e.g. 5"
              className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm transition-all"
            />
          </div>

          <button 
            onClick={() => handleSubmit()}
            disabled={loading || !cropName || !fieldSize}
            className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
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
            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-[2rem] card-shadow border border-stone-100 space-y-2">
                <div className="flex items-center gap-2 text-amber-600">
                  <Shovel className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.seeds}</span>
                </div>
                <p className="text-lg font-black text-stone-900">✨ {result.resources.seeds}</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] card-shadow border border-stone-100 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600">
                  <FlaskConical className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.fertilizer}</span>
                </div>
                <p className="text-lg font-black text-stone-900">🧪 {result.resources.fertilizer}</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] card-shadow border border-stone-100 space-y-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <Droplets className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.water}</span>
                </div>
                <p className="text-lg font-black text-stone-900">💧 {result.resources.water}</p>
              </div>
            </div>

            {/* Budget Card */}
            <div className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 space-y-6">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Banknote className="w-3 h-3 text-amber-500" /> {t.budget}
              </h3>
              <div className="space-y-3">
                {result.budget.map((item: any, i: number) => (
                  <div key={i} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
                    <div>
                      <p className="font-black text-stone-900">💰 {item.item}</p>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">📝 {item.description}</p>
                    </div>
                    <p className="text-sm font-black text-amber-600">₹{item.cost.toLocaleString()}</p>
                  </div>
                ))}
                <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{t.totalCost}</p>
                  <p className="text-lg font-black text-stone-900">💵 ₹{result.totalEstimatedCost.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Profit Card */}
            <div className="bg-emerald-600 p-8 rounded-[3rem] text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.profit}</h4>
                  <p className="text-xs font-bold leading-relaxed">📈 {t.expectedRevenue}: {result.expectedRevenue}</p>
                  <p className="text-xs font-bold leading-relaxed mt-1 italic">💰 {result.profitProjection}</p>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 space-y-6">
              <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3 text-amber-500" /> {t.tips}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.efficiencyTips.map((tip: string, i: number) => (
                  <div key={i} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-xs text-stone-600">💡 {tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-stone-900 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.summary}</h4>
                  <p className="text-xs font-bold leading-relaxed italic">🤖 {result.summary}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
