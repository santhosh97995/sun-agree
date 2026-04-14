import React, { useState, useEffect } from 'react';
import { FlaskConical, Sprout, Calendar, Loader2, Info, ShieldCheck, Zap, Calculator, Camera, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { getStructuredAdvice } from '../services/gemini';
import { Type } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceInput } from './VoiceInput';

export const FertilizerRecommendation: React.FC<{ language?: 'en' | 'te' | 'hi' }> = ({ language: initialLanguage = 'en' }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>(initialLanguage);
  const [cropName, setCropName] = useState('');
  const [soilType, setSoilType] = useState('Loamy');
  const [stage, setStage] = useState('Seedling');

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cropName) return;
    setLoading(true);

    try {
      const prompt = `Recommend fertilizer for:
        Crop: ${cropName}
        Soil: ${soilType}
        Growth Stage: ${stage}.
        Provide fertilizer type, quantity per acre, and timing.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          fertilizerType: { type: Type.STRING },
          quantity: { type: Type.STRING },
          timing: { type: Type.STRING },
          applicationMethod: { type: Type.STRING },
          precautions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["fertilizerType", "quantity", "timing"]
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
      title: "Fertilizer Guide",
      subtitle: "Expert dosage for maximum harvest",
      formCrop: "Crop Name",
      formSoil: "Soil Type",
      formStage: "Growth Stage",
      getBtn: "Analyze",
      detailsTitle: "Fertilizer Details",
      type: "Type",
      quantity: "Quantity",
      application: "Application",
      timing: "Best Timing",
      method: "Method",
      precautions: "Precautions & Tips",
      placeholder: "e.g. Rice, Wheat",
      soilTypes: { Loamy: "Loamy", Clay: "Clay", Sandy: "Sandy", Silty: "Silty" },
      stages: { Seedling: "Seedling", Vegetative: "Vegetative Growth", Flowering: "Flowering", Fruiting: "Fruiting / Maturation" }
    },
    te: {
      title: "ఎరువుల గైడ్",
      subtitle: "గరిష్ట పంట కోసం నిపుణుల మోతాదు",
      formCrop: "పంట పేరు",
      formSoil: "నేల రకం",
      formStage: "పెరుగుదల దశ",
      getBtn: "విశ్లేషించు",
      detailsTitle: "ఎరువుల వివరాలు",
      type: "రకం",
      quantity: "పరిమాణం",
      application: "అప్లికేషన్",
      timing: "ఉత్తమ సమయం",
      method: "పద్ధతి",
      precautions: "జాగ్రత్తలు & చిట్కాలు",
      placeholder: "ఉదా. వరి, గోధుమ",
      soilTypes: { Loamy: "లోమీ నేల", Clay: "బంకమట్టి", Sandy: "ఇసుక నేల", Silty: "సిల్టీ నేల" },
      stages: { Seedling: "నారు దశ", Vegetative: "శాఖీయ పెరుగుదల", Flowering: "పూత దశ", Fruiting: "కాయ దశ / పరిపక్వత" }
    },
    hi: {
      title: "उर्वरक गाइड",
      subtitle: "अधिकतम फसल के लिए विशेषज्ञ खुराक",
      formCrop: "फसल का नाम",
      formSoil: "मिट्टी का प्रकार",
      formStage: "विकास का चरण",
      getBtn: "विश्लेषण करें",
      detailsTitle: "उर्वरक विवरण",
      type: "प्रकार",
      quantity: "मात्रा",
      application: "अनुप्रयोग",
      timing: "सबसे अच्छा समय",
      method: "तरीका",
      precautions: "सावधानियां और सुझाव",
      placeholder: "जैसे चावल, गेहूं",
      soilTypes: { Loamy: "दोमट", Clay: "चिकनी मिट्टी", Sandy: "रेतीली", Silty: "गाद वाली मिट्टी" },
      stages: { Seedling: "अंकुर", Vegetative: "वानस्पतिक विकास", Flowering: "फूल आना", Fruiting: "फल आना / परिपक्वता" }
    }
  }[language];

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-white p-6 rounded-[2.5rem] card-shadow border border-stone-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <Calculator className="w-6 h-6" />
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
              className="w-full bg-stone-50 border border-stone-100 p-5 rounded-3xl text-stone-900 outline-none focus:ring-2 focus:ring-amber-500/20 font-bold text-lg transition-all"
              defaultValue={cropName}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.formSoil}</label>
              <select 
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-900 outline-none focus:ring-2 focus:ring-amber-500/20 font-bold text-sm transition-all"
              >
                <option value="Loamy">{t.soilTypes.Loamy}</option>
                <option value="Clay">{t.soilTypes.Clay}</option>
                <option value="Sandy">{t.soilTypes.Sandy}</option>
                <option value="Silty">{t.soilTypes.Silty}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.formStage}</label>
              <select 
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-900 outline-none focus:ring-2 focus:ring-amber-500/20 font-bold text-sm transition-all"
              >
                <option value="Seedling">{t.stages.Seedling}</option>
                <option value="Vegetative">{t.stages.Vegetative}</option>
                <option value="Flowering">{t.stages.Flowering}</option>
                <option value="Fruiting">{t.stages.Fruiting}</option>
              </select>
            </div>
          </div>

          <button 
            onClick={() => handleSubmit()}
            disabled={loading || !cropName}
            className="w-full py-5 bg-amber-500 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
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
                <h3 className="text-2xl font-black text-stone-900">{t.detailsTitle}</h3>
                <div className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {cropName}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600">
                    <FlaskConical className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.type}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">🧪 {t.type}: {result.fertilizerType}</p>
                </div>
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.quantity}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">⚖️ {t.quantity}: {result.quantity}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.timing}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">🕒 {t.timing}: {result.timing}</p>
                </div>
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Sprout className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.method}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">🛠️ {t.method}: {result.applicationMethod}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-amber-500" /> {t.precautions}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.precautions.map((p: string, i: number) => (
                    <div key={i} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span className="text-xs text-stone-600">⚠️ {t.precautions}: {p}</span>
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
