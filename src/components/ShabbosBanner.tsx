import React from 'react';
import { Moon, Sun, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { Language, ZmanimLocation } from '../types';
import { translations } from '../translations';
import { mockZmanimLocations } from '../data/mockData';

interface ShabbosBannerProps {
  language: Language;
  selectedLocation: ZmanimLocation;
  onSelectLocation: (loc: ZmanimLocation) => void;
  isShabbosSimulated: boolean;
  onToggleShabbosSimulation: () => void;
}

export const ShabbosBanner: React.FC<ShabbosBannerProps> = ({
  language,
  selectedLocation,
  onSelectLocation,
  isShabbosSimulated,
  onToggleShabbosSimulation,
}) => {
  const t = translations[language];

  return (
    <div className={`transition-colors duration-300 ${
      isShabbosSimulated 
        ? 'bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-amber-200 border-b border-amber-500/30' 
        : 'bg-[#0B192C] text-slate-100 border-b border-slate-800'
    } py-2 px-4 text-xs md:text-sm`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Zmanim location selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-medium text-amber-400">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{language === 'yi' ? 'זמני היום:' : 'Zmanim:'}</span>
          </div>
          
          <div className="relative inline-flex items-center gap-1 bg-white/10 hover:bg-white/15 px-2 py-0.5 rounded text-white cursor-pointer">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <select
              value={selectedLocation.id}
              onChange={(e) => {
                const found = mockZmanimLocations.find(l => l.id === e.target.value);
                if (found) onSelectLocation(found);
              }}
              className="bg-transparent text-white cursor-pointer focus:outline-none pr-1"
            >
              {mockZmanimLocations.map(loc => (
                <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                  {language === 'yi' ? loc.nameYi : loc.nameEn}
                </option>
              ))}
            </select>
          </div>

          <span className="hidden sm:inline text-slate-300">
            {t.candleLightingIn} <strong className="text-amber-300 font-semibold">{selectedLocation.candleLighting}</strong>
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">
            {language === 'yi' ? 'מוצאי שבת:' : 'Havdalah:'} <strong className="text-slate-200">{selectedLocation.shabbosEnds}</strong>
          </span>
        </div>

        {/* Center / Status info */}
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-200 hidden lg:inline">
            {language === 'yi' 
              ? '100% שומר שבת כהלכה • קיין שום ליפערונג אום שבת ויום טוב' 
              : '100% Shomer Shabbos • Automated ordering pause & Sunday pre-scheduling'}
          </span>
        </div>

        {/* Right: Shabbos Pause Mode Simulation */}
        <div className="flex items-center gap-2">
          {isShabbosSimulated ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
              <Moon className="w-3.5 h-3.5" />
              {t.shabbosModeActive}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs">
              <Sun className="w-3.5 h-3.5" />
              {t.resumeNormalMode}
            </span>
          )}

          <button
            onClick={onToggleShabbosSimulation}
            className={`cursor-pointer px-2.5 py-1 rounded text-xs font-medium transition-all ${
              isShabbosSimulated 
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Test the Shabbos order pause window mandated by community requirements"
          >
            {isShabbosSimulated ? (language === 'yi' ? 'ענדיג שבת טעסט' : 'Exit Shabbos Test') : t.testShabbosPause}
          </button>
        </div>
      </div>
    </div>
  );
};
