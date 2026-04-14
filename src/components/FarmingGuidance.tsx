import React, { useState, useEffect } from 'react';
import { BookOpen, Sprout, Droplets, FlaskConical, Bug, Timer, TrendingUp, Loader2, Info, ShieldCheck, Zap, Search, AlertCircle, CheckCircle2, Tractor } from 'lucide-react';
import { getStructuredAdvice } from '../services/gemini';
import { Type } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceInput } from './VoiceInput';

export const FarmingGuidance: React.FC<{ language?: 'en' | 'te' | 'hi' }> = ({ language: initialLanguage = 'en' }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>(initialLanguage);
  const [selectedCrop, setSelectedCrop] = useState('');

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const fetchGuidance = async () => {
    if (!selectedCrop) return;
    setLoading(true);

    try {
      const prompt = `Provide complete step-by-step farming guidance for the crop: ${selectedCrop}.
      Include:
      1. Crop Name
      2. Suitable Soil Type
      3. Required Climate Conditions
      4. Seed Selection (best varieties)
      5. Step-by-Step Farming Process (Land preparation, Sowing method, Irrigation schedule, Fertilizer usage (chemical + organic), Pest and disease control)
      6. Input Requirements (Water needs, Fertilizers, Equipment)
      7. Pest/Disease Information (Common pests, Symptoms, Solutions (chemical + organic))
      8. Harvesting (Time duration, Signs of maturity)
      9. Yield Information (Expected production, Profit tips)
      
      Use simple, easy language for farmers. Avoid complex technical terms. Provide practical and actionable steps.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          cropName: { type: Type.STRING },
          soilType: { type: Type.STRING },
          climate: { type: Type.STRING },
          seeds: { type: Type.STRING },
          process: {
            type: Type.OBJECT,
            properties: {
              landPrep: { type: Type.STRING },
              sowing: { type: Type.STRING },
              irrigation: { type: Type.STRING },
              fertilizer: { type: Type.STRING },
              pestControl: { type: Type.STRING }
            },
            required: ["landPrep", "sowing", "irrigation", "fertilizer", "pestControl"]
          },
          inputs: {
            type: Type.OBJECT,
            properties: {
              water: { type: Type.STRING },
              fertilizers: { type: Type.STRING },
              equipment: { type: Type.STRING }
            },
            required: ["water", "fertilizers", "equipment"]
          },
          pests: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                symptoms: { type: Type.STRING },
                solutions: { type: Type.STRING }
              },
              required: ["name", "symptoms", "solutions"]
            }
          },
          harvesting: {
            type: Type.OBJECT,
            properties: {
              duration: { type: Type.STRING },
              signs: { type: Type.STRING }
            },
            required: ["duration", "signs"]
          },
          yield: {
            type: Type.OBJECT,
            properties: {
              expected: { type: Type.STRING },
              profitTips: { type: Type.STRING }
            },
            required: ["expected", "profitTips"]
          }
        },
        required: ["cropName", "soilType", "climate", "seeds", "process", "inputs", "pests", "harvesting", "yield"]
      };

      const advice = await getStructuredAdvice(prompt, schema, language);
      setResult(advice);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const t = {
    en: {
      title: "Farming Guide",
      subtitle: "Complete step-by-step expert advice",
      placeholder: "e.g. Rice, Cotton",
      getGuidance: "Analyze",
      cropName: "Crop Name",
      soilType: "Soil Type",
      climate: "Climate",
      processTitle: "Farming Process",
      landPrep: "Land Preparation",
      sowing: "Sowing Method",
      irrigation: "Irrigation Schedule",
      fertilizer: "Fertilizer Usage",
      pestControl: "Pest Control",
      seedSelection: "Seeds",
      inputRequirements: "Inputs",
      waterNeeds: "Water",
      fertilizers: "Fertilizers",
      equipment: "Equipment",
      harvestingInfo: "Harvesting",
      timeDuration: "Duration",
      signsOfMaturity: "Signs",
      pestInfo: "Pests & Diseases",
      symptoms: "Symptoms",
      solutions: "Solutions",
      expectedProduction: "Yield",
      profitTips: "Profit Tips"
    },
    te: {
      title: "వ్యవసాయ గైడ్",
      subtitle: "పూర్తి దశల వారీ నిపుణుల సలహా",
      placeholder: "ఉదా. వరి, పత్తి",
      getGuidance: "విశ్లేషించు",
      cropName: "పంట పేరు",
      soilType: "నేల రకం",
      climate: "వాతావరణం",
      processTitle: "వ్యవసాయ ప్రక్రియ",
      landPrep: "భూమి తయారీ",
      sowing: "విత్తే పద్ధతి",
      irrigation: "నీటి పారుదల",
      fertilizer: "ఎరువుల వినియోగం",
      pestControl: "తెగుళ్ల నియంత్రణ",
      seedSelection: "విత్తనాలు",
      inputRequirements: "ఇన్‌పుట్‌లు",
      waterNeeds: "నీరు",
      fertilizers: "ఎరువులు",
      equipment: "పరికరాలు",
      harvestingInfo: "కోత",
      timeDuration: "సమయం",
      signsOfMaturity: "సంకేతాలు",
      pestInfo: "తెగుళ్లు & వ్యాధులు",
      symptoms: "లక్షణాలు",
      solutions: "పరిష్కారాలు",
      expectedProduction: "దిగుబడి",
      profitTips: "లాభ చిట్కాలు"
    },
    hi: {
      title: "कृषि गाइड",
      subtitle: "पूर्ण चरण-दर-चरण विशेषज्ञ सलाह",
      placeholder: "जैसे चावल, कपास",
      getGuidance: "विश्लेषण करें",
      cropName: "फसल का नाम",
      soilType: "मिट्टी का प्रकार",
      climate: "जलवायु",
      processTitle: "कृषि प्रक्रिया",
      landPrep: "भूमि की तैयारी",
      sowing: "बुवाई की विधि",
      irrigation: "सिंचाई अनुसूची",
      fertilizer: "उर्वरक का उपयोग",
      pestControl: "कीट नियंत्रण",
      seedSelection: "बीज",
      inputRequirements: "इनपुट",
      waterNeeds: "पानी",
      fertilizers: "उर्वरक",
      equipment: "उपकरण",
      harvestingInfo: "कटाई",
      timeDuration: "अवधि",
      signsOfMaturity: "संकेत",
      pestInfo: "कीट और रोग",
      symptoms: "लक्षण",
      solutions: "समाधान",
      expectedProduction: "पैदावार",
      profitTips: "लाभ के सुझाव"
    }
  }[language];

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-white p-6 rounded-[2.5rem] card-shadow border border-stone-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-stone-900">{t.title}</h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{t.subtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.cropName}</label>
            <VoiceInput 
              onResult={(val) => setSelectedCrop(val)}
              placeholder={t.placeholder}
              className="w-full bg-stone-50 border border-stone-100 p-5 rounded-3xl text-stone-900 outline-none focus:ring-2 focus:ring-amber-500/20 font-bold text-lg transition-all"
              defaultValue={selectedCrop}
            />
          </div>

          <button 
            onClick={() => fetchGuidance()}
            disabled={loading || !selectedCrop}
            className="w-full py-5 bg-amber-500 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-5 h-5" />}
            {t.getGuidance}
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
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-[2rem] card-shadow border border-stone-100 space-y-2">
                <div className="flex items-center gap-2 text-amber-600">
                  <Sprout className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.cropName}</span>
                </div>
                <p className="text-lg font-black text-stone-900">🌾 {result.cropName}</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] card-shadow border border-stone-100 space-y-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <Droplets className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.soilType}</span>
                </div>
                <p className="text-lg font-black text-stone-900">🏜️ {result.soilType}</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] card-shadow border border-stone-100 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Timer className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.climate}</span>
                </div>
                <p className="text-lg font-black text-stone-900">☁️ {result.climate}</p>
              </div>
            </div>

            {/* Process Card */}
            <div className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 space-y-8">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Tractor className="w-3 h-3 text-amber-500" /> {t.processTitle}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{t.landPrep}</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">🚜 {result.process.landPrep}</p>
                </div>
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{t.sowing}</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">🌱 {result.process.sowing}</p>
                </div>
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{t.irrigation}</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">💧 {result.process.irrigation}</p>
                </div>
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{t.fertilizer}</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">🧪 {result.process.fertilizer}</p>
                </div>
              </div>
            </div>

            {/* Pests Card */}
            <div className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 space-y-6">
              <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Bug className="w-3 h-3 text-rose-500" /> {t.pestInfo}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.pests.map((pest: any, i: number) => (
                  <div key={i} className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-3">
                    <p className="font-black text-rose-600">🦠 {pest.name}</p>
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t.symptoms}</p>
                      <p className="text-xs text-stone-600">🔍 {pest.symptoms}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{t.solutions}</p>
                      <p className="text-xs text-stone-600">✅ {pest.solutions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Yield Card */}
            <div className="bg-emerald-600 p-8 rounded-[3rem] text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.expectedProduction}</h4>
                  <p className="text-xs font-bold leading-relaxed">📊 {result.yield.expected}</p>
                  <p className="text-xs font-bold leading-relaxed mt-1 italic">💰 {result.yield.profitTips}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
