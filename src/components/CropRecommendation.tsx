import React, { useState, useEffect } from 'react';
import { Sprout, Map, Loader2, CheckCircle2, Tractor, Info, ShieldCheck, Zap, Camera, TrendingUp, BarChart3 } from 'lucide-react';
import { getStructuredAdvice } from '../services/gemini';
import { Type } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceInput } from './VoiceInput';

export const CropRecommendation: React.FC<{ language?: 'en' | 'te' | 'hi' }> = ({ language: initialLanguage = 'en' }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>(initialLanguage);
  const [soilType, setSoilType] = useState('Loamy');
  const [rainfall, setRainfall] = useState('');
  const [temperature, setTemperature] = useState('');
  const [demand, setDemand] = useState('High');

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const prompt = `Recommend crops for:
        Soil Type: ${soilType}
        Rainfall: ${rainfall} mm/year
        Temperature: ${temperature}°C
        Market Demand: ${demand}.
        Suggest 3-5 most suitable crops.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                crop: { type: Type.STRING },
                reason: { type: Type.STRING },
                suitabilityScore: { type: Type.NUMBER, description: "Score from 0-100" }
              }
            }
          },
          generalAdvice: { type: Type.STRING }
        },
        required: ["recommendations", "generalAdvice"]
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
      title: "Crop Advisor",
      subtitle: "Find the perfect crop for your land",
      formSoil: "Soil Type",
      formRainfall: "Rainfall (mm)",
      formTemp: "Temperature (°C)",
      formDemand: "Market Demand",
      getBtn: "Analyze",
      match: "Match",
      strategicAdvice: "Strategic Advice",
      soilTypes: { Alluvial: "Alluvial", Black: "Black", Red: "Red", Sandy: "Sandy", Loamy: "Loamy" },
      demands: { High: "High Demand", Moderate: "Moderate Demand", Stable: "Stable Demand" }
    },
    te: {
      title: "పంట సలహాదారు",
      subtitle: "మీ భూమికి సరిపోయే పంటను కనుగొనండి",
      formSoil: "నేల రకం",
      formRainfall: "వర్షపాతం (mm)",
      formTemp: "ఉష్ణోగ్రత (°C)",
      formDemand: "మార్కెట్ డిమాండ్",
      getBtn: "విశ్లేషించు",
      match: "సరిపోలిక",
      strategicAdvice: "వ్యూహాత్మక సలహా",
      soilTypes: { Alluvial: "ఒండ్రు నేల", Black: "నల్ల రేగడి", Red: "ఎర్ర నేల", Sandy: "ఇసుక నేల", Loamy: "లోమీ నేల" },
      demands: { High: "అధిక డిమాండ్", Moderate: "మధ్యస్థ డిమాండ్", Stable: "స్థిరమైన డిమాండ్" }
    },
    hi: {
      title: "फसल सलाहकार",
      subtitle: "अपनी भूमि के लिए सही फसल खोजें",
      formSoil: "मिट्टी का प्रकार",
      formRainfall: "वर्षा (मिमी)",
      formTemp: "तापमान (°C)",
      formDemand: "बाजार की मांग",
      getBtn: "विश्लेषण करें",
      match: "मैच",
      strategicAdvice: "रणनीतिक सलाह",
      soilTypes: { Alluvial: "जलोढ़", Black: "काली मिट्टी", Red: "लाल मिट्टी", Sandy: "रेतीली", Loamy: "दोमट" },
      demands: { High: "उच्च मांग", Moderate: "मध्यम मांग", Stable: "स्थिर मांग" }
    }
  }[language];

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-white p-6 rounded-[2.5rem] card-shadow border border-stone-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Tractor className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-stone-900">{t.title}</h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{t.subtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.formSoil}</label>
              <select 
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm transition-all"
              >
                <option value="Alluvial">{t.soilTypes.Alluvial}</option>
                <option value="Black">{t.soilTypes.Black}</option>
                <option value="Red">{t.soilTypes.Red}</option>
                <option value="Sandy">{t.soilTypes.Sandy}</option>
                <option value="Loamy">{t.soilTypes.Loamy}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.formDemand}</label>
              <select 
                value={demand}
                onChange={(e) => setDemand(e.target.value)}
                className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm transition-all"
              >
                <option value="High">{t.demands.High}</option>
                <option value="Moderate">{t.demands.Moderate}</option>
                <option value="Stable">{t.demands.Stable}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.formRainfall}</label>
              <input 
                type="number"
                value={rainfall}
                onChange={(e) => setRainfall(e.target.value)}
                placeholder="e.g. 1200"
                className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.formTemp}</label>
              <input 
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="e.g. 28"
                className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm transition-all"
              />
            </div>
          </div>

          <button 
            onClick={() => handleSubmit()}
            disabled={loading || !rainfall || !temperature}
            className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.recommendations.map((rec: any, i: number) => (
                <div key={i} className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 space-y-6 hover:border-emerald-200 transition-all group">
                  <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-black text-stone-900">🌾 {rec.crop}</h4>
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4" />
                      {rec.suitabilityScore}% {t.match}
                    </div>
                  </div>
                  <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Info className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t.strategicAdvice}</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">📝 {rec.reason}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-600 p-8 rounded-[3rem] text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.strategicAdvice}</h4>
                  <p className="text-xs font-bold leading-relaxed">💡 {result.generalAdvice}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
