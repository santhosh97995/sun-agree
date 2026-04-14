import React, { useState, useEffect } from 'react';
import { Calculator, Shovel, Droplets, FlaskConical, Loader2, Info, ArrowRight, Languages, ShieldCheck } from 'lucide-react';
import { getStructuredAdvice } from '../services/gemini';
import { Type } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceInput } from './VoiceInput';

type Language = 'en' | 'te' | 'hi';

interface GuideContent {
  title: string;
  description: string;
  useful: string;
  howTo: string[];
  inputs: string;
  action: string;
}

const CONTENT: Record<Language, GuideContent> = {
  en: {
    title: "Resource Calculator",
    description: "Calculate the exact amount of seeds, fertilizer, and water needed for your field.",
    useful: "Helps you save money by avoiding waste and ensures your crops get exactly what they need to grow healthy.",
    howTo: [
      "Enter your field size in acres.",
      "Type the name of the crop you are planting.",
      "Click 'Calculate' to see the results."
    ],
    inputs: "Field Size (Acres), Crop Type",
    action: "Start Calculation"
  },
  te: {
    title: "వనరుల కాలిక్యులేటర్",
    description: "మీ పొలానికి అవసరమైన విత్తనాలు, ఎరువులు మరియు నీటి ఖచ్చితమైన పరిమాణాన్ని లెక్కించండి.",
    useful: "వృధాను నివారించడం ద్వారా డబ్బు ఆదా చేయడంలో మీకు సహాయపడుతుంది మరియు మీ పంటలు ఆరోగ్యంగా పెరగడానికి అవసరమైన వాటిని ఖచ్చితంగా పొందేలా చేస్తుంది.",
    howTo: [
      "ఎకరాలలో మీ పొలం పరిమాణాన్ని నమోదు చేయండి.",
      "మీరు నాటుతున్న పంట పేరును టైప్ చేయండి.",
      "ఫలితాలను చూడటానికి 'లెక్కించు' క్లిక్ చేయండి."
    ],
    inputs: "పొలం పరిమాణం (ఎకరాలు), పంట రకం",
    action: "గణనను ప్రారంభించండి"
  },
  hi: {
    title: "संसाधन कैलकुलेटर",
    description: "अपने खेत के लिए आवश्यक बीज, उर्वरक और पानी की सही मात्रा की गणना करें।",
    useful: "अपव्यय से बचकर पैसे बचाने में आपकी मदद करता है और यह सुनिश्चित करता है कि आपकी फसलों को स्वस्थ बढ़ने के लिए वही मिले जो उन्हें चाहिए।",
    howTo: [
      "एकड़ में अपने खेत का आकार दर्ज करें।",
      "उस फसल का नाम टाइप करें जिसे आप लगा रहे हैं।",
      "परिणाम देखने के लिए 'गणना करें' पर क्लिक करें।"
    ],
    inputs: "खेत का आकार (एकड़), फसल का प्रकार",
    action: "गणना शुरू करें"
  }
};

export const ResourceCalculator: React.FC<{ language?: 'en' | 'te' | 'hi' }> = ({ language: initialLanguage = 'en' }) => {
  const [showGuide, setShowGuide] = useState(true);
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const t = {
    en: {
      title: "Resource Calculator",
      description: "Optimize your inputs for maximum efficiency and sustainability.",
      fieldSize: "Field Size (Acres)",
      cropType: "Crop Type",
      calculateBtn: "Calculate Resources",
      seedsRequired: "Seeds Required",
      fertilizer: "Fertilizer",
      waterEstimate: "Water Estimate",
      aiAdvice: "AI Resource Advice",
      summary: "Summary",
      breakdown: "Detailed Breakdown",
      placeholders: { size: "e.g. 5.5", crop: "e.g. Rice" }
    },
    te: {
      title: "వనరుల కాలిక్యులేటర్",
      description: "గరిష్ట సామర్థ్యం మరియు స్థిరత్వం కోసం మీ ఇన్‌పుట్‌లను ఆప్టిమైజ్ చేయండి.",
      fieldSize: "పొలం పరిమాణం (ఎకరాలు)",
      cropType: "పంట రకం",
      calculateBtn: "వనరులను లెక్కించండి",
      seedsRequired: "అవసరమైన విత్తనాలు",
      fertilizer: "ఎరువులు",
      waterEstimate: "నీటి అంచనా",
      aiAdvice: "AI వనరుల సలహా",
      summary: "సారాంశం",
      breakdown: "వివరణాత్మక విభజన",
      placeholders: { size: "ఉదా: 5.5", crop: "ఉదా: వరి" }
    },
    hi: {
      title: "संसाधन कैलकुलेटर",
      description: "अधिकतम दक्षता और स्थिरता के लिए अपने इनपुट को अनुकूलित करें।",
      fieldSize: "खेत का आकार (एकड़)",
      cropType: "फसल का प्रकार",
      calculateBtn: "संसाधनों की गणना करें",
      seedsRequired: "आवश्यक बीज",
      fertilizer: "उर्वरक",
      waterEstimate: "पानी का अनुमान",
      aiAdvice: "AI संसाधन सलाह",
      summary: "सारांश",
      breakdown: "विस्तृत विवरण",
      placeholders: { size: "जैसे: 5.5", crop: "जैसे: चावल" }
    }
  }[language];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const prompt = `Calculate farming resources for:
        Field Size: ${data.size} acres
        Crop Type: ${data.cropType}
        Provide required seeds (kg), fertilizer (kg), and water (liters) with a detailed breakdown.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          seeds: { type: Type.STRING },
          fertilizer: { type: Type.STRING },
          water: { type: Type.STRING },
          breakdown: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          summary: { type: Type.STRING }
        },
        required: ["seeds", "fertilizer", "water", "breakdown", "summary"]
      };

      const advice = await getStructuredAdvice(prompt, schema, language);
      setResult(advice);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (showGuide) {
    const content = CONTENT[language];
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-6 bg-stone-900 rounded-[2rem] text-white shadow-2xl border border-white/10"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{content.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-white/10 rounded-xl p-1 border border-white/10">
              <button onClick={() => setLanguage('en')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${language === 'en' ? 'bg-emerald-500 text-white shadow-lg' : 'text-stone-400 hover:text-white'}`}>EN</button>
              <button onClick={() => setLanguage('te')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${language === 'te' ? 'bg-emerald-500 text-white shadow-lg' : 'text-stone-400 hover:text-white'}`}>తెలుగు</button>
              <button onClick={() => setLanguage('hi')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${language === 'hi' ? 'bg-emerald-500 text-white shadow-lg' : 'text-stone-400 hover:text-white'}`}>हिंदी</button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-3 text-emerald-400">
              <Info className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-wider text-xs">What This Tool Does</h3>
            </div>
            <p className="text-stone-300 leading-relaxed">{content.description}</p>
          </section>

          <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-3 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-wider text-xs">Why It Is Useful</h3>
            </div>
            <p className="text-stone-300 leading-relaxed">{content.useful}</p>
          </section>

          <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-4 text-blue-400">
              <ArrowRight className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-wider text-xs">How To Use</h3>
            </div>
            <ul className="space-y-3">
              {content.howTo.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-stone-300">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="font-bold uppercase tracking-wider text-xs text-stone-500 mb-2">Inputs Needed</h3>
            <p className="text-stone-300 font-medium">{content.inputs}</p>
          </section>

          <button
            onClick={() => setShowGuide(false)}
            className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3 group"
          >
            {content.action}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative h-64 rounded-[2.5rem] overflow-hidden group shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000" 
          alt="Resources" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent flex flex-col justify-end p-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
              <Calculator className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">
              {t.title}
            </h2>
          </div>
          <p className="text-stone-200 text-lg max-w-xl leading-relaxed">
            {t.description}
          </p>
        </div>
        <button 
          onClick={() => setShowGuide(true)}
          className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white border border-white/20 transition-all"
        >
          <Info className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-sm font-bold text-stone-500 uppercase tracking-widest ml-1">
            {t.fieldSize}
          </label>
          <VoiceInput 
            name="size" 
            type="number" 
            required 
            className="w-full p-5 rounded-2xl bg-stone-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all text-lg font-medium" 
            placeholder={t.placeholders.size} 
            onResult={() => {}}
          />
        </div>
        <div className="space-y-3">
          <label className="text-sm font-bold text-stone-500 uppercase tracking-widest ml-1">
            {t.cropType}
          </label>
          <VoiceInput 
            name="cropType" 
            required 
            className="w-full p-5 rounded-2xl bg-stone-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all text-lg font-medium" 
            placeholder={t.placeholders.crop} 
            onResult={() => {}}
          />
        </div>
        <button
          disabled={loading}
          className="md:col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-6 rounded-[2rem] text-xl transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-xl shadow-emerald-600/20 group"
        >
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <>
              <Calculator className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span>{t.calculateBtn}</span>
            </>
          )}
        </button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-lg text-center group hover:border-emerald-500 transition-all">
                <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-600 mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Shovel className="w-10 h-10" />
                </div>
                <p className="text-sm text-stone-400 uppercase font-black tracking-widest mb-2">
                  {t.seedsRequired}
                </p>
                <p className="text-3xl font-black text-stone-900">🌱 {t.seedsRequired}: {result.seeds}</p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-lg text-center group hover:border-emerald-500 transition-all">
                <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-10 h-10" />
                </div>
                <p className="text-sm text-stone-400 uppercase font-black tracking-widest mb-2">
                  {t.fertilizer}
                </p>
                <p className="text-3xl font-black text-stone-900">🧪 {t.fertilizer}: {result.fertilizer}</p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-lg text-center group hover:border-emerald-500 transition-all">
                <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Droplets className="w-10 h-10" />
                </div>
                <p className="text-sm text-stone-400 uppercase font-black tracking-widest mb-2">
                  {t.waterEstimate}
                </p>
                <p className="text-3xl font-black text-stone-900">💧 {t.waterEstimate}: {result.water}</p>
              </div>
            </div>

            <div className="bg-stone-900 p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Calculator className="w-48 h-48 text-white" />
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white/10 rounded-2xl text-white">
                  <Calculator className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-black text-white tracking-tight">
                  {t.aiAdvice}
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">{t.summary}</p>
                  <p className="text-stone-300 text-lg leading-relaxed">📝 {t.summary}: {result.summary}</p>
                </div>
                <div className="space-y-4">
                  <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">{t.breakdown}</p>
                  <ul className="space-y-4">
                    {result.breakdown.map((item: string, i: number) => (
                      <li key={i} className="text-stone-300 text-sm flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400 border border-emerald-500/20">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">📊 {t.breakdown}: {item}</span>
                      </li>
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
