import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, MapPin, Calendar, Loader2, Coins, Info, ShieldCheck, Zap, Scale, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getMarketPriceAdvice } from '../services/gemini';
import { Type } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceInput } from './VoiceInput';

export const MarketPricePrediction: React.FC<{ language?: 'en' | 'te' | 'hi' }> = ({ language: initialLanguage = 'en' }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>(initialLanguage);
  const [cropType, setCropType] = useState('');
  const [region, setRegion] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cropType || !region) return;
    setLoading(true);

    try {
      const advice = await getMarketPriceAdvice(
        cropType, 
        region, 
        quantity,
        language
      );
      setResult(advice);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const t = {
    en: {
      title: "Market Price",
      subtitle: "Smart price forecasting & market analysis",
      formCrop: "Crop Name",
      formRegion: "Region / Location",
      formQuantity: "Quantity (kg)",
      analyzeBtn: "Analyze",
      forecastTitle: "6-Month Price Forecast",
      bestTime: "Best Time to Sell",
      nearbyMarkets: "Nearby Markets",
      marketAnalysis: "Market Analysis",
      currentPrice: "Current Price",
      totalValue: "Total Estimated Value",
      placeholders: { crop: "e.g. Wheat, Rice", region: "e.g. Punjab", quantity: "e.g. 100" },
      marketLabels: { distance: "away", price: "Price/kg" }
    },
    te: {
      title: "మార్కెట్ ధర",
      subtitle: "స్మార్ట్ ధర అంచనా & మార్కెట్ విశ్లేషణ",
      formCrop: "పంట పేరు",
      formRegion: "ప్రాంతం / ప్రదేశం",
      formQuantity: "పరిమాణం (kg)",
      analyzeBtn: "విశ్లేషించు",
      forecastTitle: "6 నెలల ధర అంచనా",
      bestTime: "విక్రయించడానికి ఉత్తమ సమయం",
      nearbyMarkets: "సమీప మార్కెట్లు",
      marketAnalysis: "మార్కెట్ విశ్లేషణ",
      currentPrice: "ప్రస్తుత ధర",
      totalValue: "మొత్తం అంచనా విలువ",
      placeholders: { crop: "ఉదా. వరి, గోధుమ", region: "ఉదా. పంజాబ్", quantity: "ఉదా. 100" },
      marketLabels: { distance: "దూరంలో", price: "ధర/kg" }
    },
    hi: {
      title: "बाजार मूल्य",
      subtitle: "स्मार्ट मूल्य पूर्वानुमान और बाजार विश्लेषण",
      formCrop: "फसल का नाम",
      formRegion: "क्षेत्र / स्थान",
      formQuantity: "मात्रा (kg)",
      analyzeBtn: "विश्लेषण करें",
      forecastTitle: "6 महीने का मूल्य पूर्वानुमान",
      bestTime: "बेचने का सबसे अच्छा समय",
      nearbyMarkets: "पास के बाजार",
      marketAnalysis: "बाजार विश्लेषण",
      currentPrice: "वर्तमान मूल्य",
      totalValue: "कुल अनुमानित मूल्य",
      placeholders: { crop: "जैसे चावल, गेहूं", region: "जैसे पंजाब", quantity: "जैसे 100" },
      marketLabels: { distance: "दूर", price: "मूल्य/kg" }
    }
  }[language];

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-white p-6 rounded-[2.5rem] card-shadow border border-stone-100 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <TrendingUp className="w-6 h-6" />
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
              onResult={(val) => setCropType(val)}
              placeholder={t.placeholders.crop}
              className="w-full bg-stone-50 border border-stone-100 p-5 rounded-3xl text-stone-900 outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-lg transition-all"
              defaultValue={cropType}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.formRegion}</label>
              <VoiceInput 
                onResult={(val) => setRegion(val)}
                placeholder={t.placeholders.region}
                className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-900 outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-sm transition-all"
                defaultValue={region}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.formQuantity}</label>
              <input 
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={t.placeholders.quantity}
                className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-stone-900 outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-sm transition-all"
              />
            </div>
          </div>

          <button 
            onClick={() => handleSubmit()}
            disabled={loading || !cropType || !region}
            className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-[2rem] card-shadow border border-stone-100 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Coins className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.currentPrice}</span>
                </div>
                <p className="text-2xl font-black text-stone-900">{result.currentPricePerKg}</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] card-shadow border border-stone-100 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Wallet className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.totalValue}</span>
                </div>
                <p className="text-2xl font-black text-stone-900">{result.totalValue}</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] card-shadow border border-stone-100 space-y-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.bestTime}</span>
                </div>
                <p className="text-lg font-black text-stone-900">🕒 {result.bestTimeToSell}</p>
              </div>
            </div>

            {/* Chart Card */}
            <div className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 space-y-8">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-indigo-500" /> {t.forecastTitle}
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.forecastData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Markets Card */}
            <div className="bg-white p-8 rounded-[3rem] card-shadow border border-stone-100 space-y-6">
              <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-3 h-3 text-rose-500" /> {t.nearbyMarkets}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.nearbyMarkets.map((market: any, i: number) => (
                  <div key={i} className="p-5 bg-stone-50 rounded-3xl border border-stone-100 flex items-center justify-between">
                    <div>
                      <p className="font-black text-stone-900">📍 {market.name}</p>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">🛣️ {market.distance} {t.marketLabels.distance}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-indigo-600">💰 {market.currentPrice}</p>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t.marketLabels.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Card */}
            <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
                  <Info className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.marketAnalysis}</h4>
                  <p className="text-xs font-bold leading-relaxed">📊 {result.marketAnalysis}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
