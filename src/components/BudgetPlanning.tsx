import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, PieChart, Loader2, Plus, Trash2, Info, ShieldCheck, Zap, DollarSign } from 'lucide-react';
import { getStructuredAdvice } from '../services/gemini';
import { Type } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { FeatureHeader } from './FeatureHeader';
import { VoiceInput } from './VoiceInput';

interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  description: string;
}

export const BudgetPlanning: React.FC<{ language?: 'en' | 'te' | 'hi' }> = ({ language: initialLanguage = 'en' }) => {
  const [showGuide, setShowGuide] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>(initialLanguage);
  const [items, setItems] = useState<BudgetItem[]>([
    { id: '1', category: 'Seeds', amount: 5000, description: 'High yield variety' },
    { id: '2', category: 'Fertilizer', amount: 8000, description: 'NPK and Organic' }
  ]);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const addItem = () => {
    const newItem: BudgetItem = {
      id: Math.random().toString(36).substr(2, 9),
      category: 'Other',
      amount: 0,
      description: ''
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof BudgetItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const prompt = `Analyze this farm budget:
        Items: ${JSON.stringify(items)}
        Provide a total budget calculation, cost optimization tips, and a profit projection summary.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          totalBudget: { type: Type.NUMBER },
          optimizations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          profitProjection: { type: Type.STRING },
          summary: { type: Type.STRING }
        },
        required: ["totalBudget", "optimizations", "profitProjection", "summary"]
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
      title: "1️⃣ Farm Budget Planning",
      whatTitle: "2️⃣ What This Tool Does:",
      whatDesc: "Helps you list all farming costs and uses AI to find where you can save money and increase profit.",
      whyTitle: "3️⃣ Why It Is Useful:",
      whyDesc: "Prevents financial loss by giving you a clear picture of your investment versus expected returns.",
      howTitle: "4️⃣ How To Use:",
      howStep1: "Add your expenses (Seeds, Labor, etc.)",
      howStep2: "Enter the amounts you expect to spend",
      howStep3: "Get AI analysis on your budget",
      inputsTitle: "5️⃣ Inputs Needed:",
      inputsItems: "Expense Categories",
      inputsAmounts: "Cost Amounts",
      actionTitle: "6️⃣ ACTION SECTION",
      startBtn: "START PLANNING",
      formCategory: "Category",
      formAmount: "Amount",
      formDesc: "Description",
      addBtn: "Add Item",
      analyzeBtn: "ANALYZE BUDGET",
      total: "Total Budget",
      optimization: "Cost Optimization Tips",
      projection: "Profit Projection",
      summary: "AI Summary"
    },
    te: {
      title: "1️⃣ ఫామ్ బడ్జెట్ ప్లానింగ్",
      whatTitle: "2️⃣ ఈ సాధనం ఏమి చేస్తుంది:",
      whatDesc: "అన్ని వ్యవసాయ ఖర్చులను జాబితా చేయడంలో మీకు సహాయపడుతుంది మరియు మీరు ఎక్కడ డబ్బు ఆదా చేయవచ్చో మరియు లాభాన్ని పెంచుకోవచ్చో కనుగొనడానికి AIని ఉపయోగిస్తుంది.",
      whyTitle: "3️⃣ ఇది ఎందుకు ఉపయోగపడుతుంది:",
      whyDesc: "మీ పెట్టుబడి మరియు ఆశించిన రాబడి గురించి స్పష్టమైన చిత్రాన్ని ఇవ్వడం ద్వారా ఆర్థిక నష్టాన్ని నివారిస్తుంది.",
      howTitle: "4️⃣ ఎలా ఉపయోగించాలి:",
      howStep1: "మీ ఖర్చులను జోడించండి (విత్తనాలు, కూలీలు మొదలైనవి)",
      howStep2: "మీరు ఖర్చు చేయాలనుకుంటున్న మొత్తాలను నమోదు చేయండి",
      howStep3: "మీ బడ్జెట్‌పై AI విశ్లేషణను పొందండి",
      inputsTitle: "5️⃣ అవసరమైన ఇన్‌పుట్‌లు:",
      inputsItems: "ఖర్చు వర్గాలు",
      inputsAmounts: "ఖర్చు మొత్తాలు",
      actionTitle: "6️⃣ చర్య విభాగం",
      startBtn: "ప్లానింగ్ ప్రారంభించండి",
      formCategory: "వర్గం",
      formAmount: "మొత్తం",
      formDesc: "వివరణ",
      addBtn: "ఐటెమ్ జోడించు",
      analyzeBtn: "బడ్జెట్ విశ్లేషించండి",
      total: "మొత్తం బడ్జెట్",
      optimization: "ఖర్చు ఆదా చిట్కాలు",
      projection: "లాభాల అంచనా",
      summary: "AI సారాంశం"
    },
    hi: {
      title: "1️⃣ फार्म बजट योजना",
      whatTitle: "2️⃣ यह उपकरण क्या करता है:",
      whatDesc: "सभी खेती की लागतों को सूचीबद्ध करने में आपकी मदद करता है और यह पता लगाने के लिए AI का उपयोग करता है कि आप कहां पैसे बचा सकते हैं और लाभ बढ़ा सकते हैं।",
      whyTitle: "3️⃣ यह क्यों उपयोगी है:",
      whyDesc: "आपके निवेश बनाम अपेक्षित रिटर्न की स्पष्ट तस्वीर देकर वित्तीय नुकसान को रोकता है।",
      howTitle: "4️⃣ उपयोग कैसे करें:",
      howStep1: "अपने खर्च जोड़ें (बीज, श्रम, आदि)",
      howStep2: "वह राशि दर्ज करें जिसे आप खर्च करने की उम्मीद करते हैं",
      howStep3: "अपने बजट पर AI विश्लेषण प्राप्त करें",
      inputsTitle: "5️⃣ आवश्यक इनपुट:",
      inputsItems: "व्यय श्रेणियां",
      inputsAmounts: "लागत राशि",
      actionTitle: "6️⃣ एक्शन सेक्शन",
      startBtn: "योजना शुरू करें",
      formCategory: "श्रेणी",
      formAmount: "राशि",
      formDesc: "विवरण",
      addBtn: "आइटम जोड़ें",
      analyzeBtn: "बजट का विश्लेषण करें",
      total: "कुल बजट",
      optimization: "लागत अनुकूलन सुझाव",
      projection: "लाभ का अनुमान",
      summary: "AI सारांश"
    }
  }[language];

  if (showGuide) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-amber-400" />
            </div>
            <h1 className="text-4xl font-black tracking-tight">{t.title}</h1>
            <div className="flex justify-center gap-2">
              <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-lg text-xs font-bold ${language === 'en' ? 'bg-amber-500 text-white' : 'bg-white/5 text-stone-400'}`}>EN</button>
              <button onClick={() => setLanguage('te')} className={`px-3 py-1 rounded-lg text-xs font-bold ${language === 'te' ? 'bg-amber-500 text-white' : 'bg-white/5 text-stone-400'}`}>తెలుగు</button>
              <button onClick={() => setLanguage('hi')} className={`px-3 py-1 rounded-lg text-xs font-bold ${language === 'hi' ? 'bg-amber-500 text-white' : 'bg-white/5 text-stone-400'}`}>हिंदी</button>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-amber-400 font-bold flex items-center gap-2 mb-2">
                <Info className="w-4 h-4" /> {t.whatTitle}
              </h3>
              <p className="text-stone-300 leading-relaxed">
                {t.whatDesc}
              </p>
            </section>

            <section>
              <h3 className="text-amber-400 font-bold flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4" /> {t.whyTitle}
              </h3>
              <p className="text-stone-300 leading-relaxed">
                {t.whyDesc}
              </p>
            </section>

            <section>
              <h3 className="text-amber-400 font-bold flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" /> {t.howTitle}
              </h3>
              <ul className="text-stone-400 text-sm space-y-2">
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full" /> {t.howStep1}</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full" /> {t.howStep2}</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full" /> {t.howStep3}</li>
              </ul>
            </section>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h3 className="text-center text-xs font-black text-stone-500 uppercase tracking-[0.2em] mb-6">{t.actionTitle}</h3>
            <button 
              onClick={() => setShowGuide(false)}
              className="w-full py-6 bg-amber-500 hover:bg-amber-400 text-white rounded-3xl font-black text-2xl tracking-wider shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all active:scale-95 flex items-center justify-center gap-4 group"
            >
              <Wallet className="w-8 h-8 group-hover:rotate-12 transition-transform" />
              {t.startBtn}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="text-stone-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <FeatureHeader 
          title={t.title.split(' ').slice(1).join(' ')}
          subtitle={t.whyDesc}
          icon={<Wallet className="w-8 h-8" />}
          language={language}
          setLanguage={setLanguage}
          setShowGuide={setShowGuide}
          colorClass="bg-amber-600"
        />

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] shadow-2xl space-y-6">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{t.formCategory}</label>
                  <VoiceInput 
                    defaultValue={item.category}
                    onResult={(text) => updateItem(item.id, 'category', text)}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{t.formAmount}</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 z-10" />
                    <VoiceInput 
                      type="number"
                      defaultValue={item.amount.toString()}
                      onResult={(text) => updateItem(item.id, 'amount', Number(text))}
                      className="w-full bg-white/5 border border-white/10 p-3 pl-10 rounded-xl text-white outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{t.formDesc}</label>
                  <VoiceInput 
                    defaultValue={item.description}
                    onResult={(text) => updateItem(item.id, 'description', text)}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button 
              onClick={addItem}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              {t.addBtn}
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading || items.length === 0}
              className="flex-[2] py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-2xl font-black text-lg shadow-lg shadow-amber-500/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <TrendingUp className="w-6 h-6" />}
              {t.analyzeBtn}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-amber-400 text-xl flex items-center gap-3">
                    <PieChart className="w-6 h-6" />
                    {t.total}
                  </h3>
                  <div className="text-3xl font-black text-white">
                    💰 {t.total}: ${result.totalBudget.toLocaleString()}
                  </div>
                </div>
                <div className="p-6 bg-amber-500/10 rounded-3xl border border-amber-500/20">
                  <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest mb-2">{t.projection}</p>
                  <p className="text-lg font-bold text-white leading-relaxed">📈 {t.projection}: {result.profitProjection}</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl space-y-6">
                <h3 className="font-black text-stone-300 text-xl flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-stone-400" />
                  {t.optimization}
                </h3>
                <ul className="space-y-3">
                  {result.optimizations.map((opt: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 text-stone-300 text-sm">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      💡 {t.optimization}: {opt}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-2 bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-black text-stone-300 text-xl">{t.summary}</h4>
                </div>
                <p className="text-stone-300 leading-relaxed text-lg italic">"📝 {t.summary}: {result.summary}"</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
