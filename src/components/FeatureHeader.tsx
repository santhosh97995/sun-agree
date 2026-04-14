import React from 'react';
import { Info } from 'lucide-react';

interface FeatureHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  language: 'en' | 'te' | 'hi';
  setLanguage: (lang: 'en' | 'te' | 'hi') => void;
  setShowGuide: (show: boolean) => void;
  colorClass?: string;
}

export const FeatureHeader: React.FC<FeatureHeaderProps> = ({ 
  title, 
  subtitle, 
  icon, 
  language, 
  setLanguage, 
  setShowGuide,
  colorClass = "bg-emerald-600"
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 ${colorClass} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
          {icon}
        </div>
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            {title}
          </h1>
          <p className="text-stone-500 font-bold text-sm uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 shadow-sm">
          <button 
            onClick={() => setLanguage('en')} 
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${language === 'en' ? `${colorClass} text-white shadow-md` : 'text-stone-500 hover:bg-stone-200'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('te')} 
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${language === 'te' ? `${colorClass} text-white shadow-md` : 'text-stone-500 hover:bg-stone-200'}`}
          >
            తెలుగు
          </button>
          <button 
            onClick={() => setLanguage('hi')} 
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${language === 'hi' ? `${colorClass} text-white shadow-md` : 'text-stone-500 hover:bg-stone-200'}`}
          >
            हिंदी
          </button>
        </div>
        <button 
          onClick={() => setShowGuide(true)}
          className="p-3 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-600 transition-all border border-stone-200 shadow-sm"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
