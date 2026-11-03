import React from 'react';
import { ShieldCheck, Snowflake, Box, Truck, Check } from 'lucide-react';
import { Language, KosherAgency, StorageType } from '../types';
import { translations } from '../translations';

interface KosherFiltersProps {
  language: Language;
  selectedAgency: KosherAgency | 'all';
  onSelectAgency: (agency: KosherAgency | 'all') => void;
  selectedStorage: StorageType | 'all';
  onSelectStorage: (storage: StorageType | 'all') => void;
  onlyFba: boolean;
  onToggleFba: () => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  onSortChange: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;
}

export const KosherFilters: React.FC<KosherFiltersProps> = ({
  language,
  selectedAgency,
  onSelectAgency,
  selectedStorage,
  onSelectStorage,
  onlyFba,
  onToggleFba,
  sortBy,
  onSortChange,
}) => {
  const t = translations[language];

  const agencies: { id: KosherAgency | 'all'; nameEn: string; nameYi: string }[] = [
    { id: 'all', nameEn: 'All Hechsherim', nameYi: 'אלע הכשרים' },
    { id: 'Hisachdus', nameEn: 'Hisachdus Harabanim (CRC)', nameYi: 'התאחדות הרבנים (CRC)' },
    { id: 'Satmar-KJ', nameEn: 'Satmar Kiryas Joel', nameYi: 'קהל יטב לב ד׳סאטמאר ק"י' },
    { id: 'Satmar-Wmsbg', nameEn: 'Satmar Williamsburg', nameYi: 'קהל יטב לב וויליאמסבורג' },
    { id: 'Krasna', nameEn: 'Krasna Kashrus', nameYi: 'קראסנא' },
    { id: 'Nirbator', nameEn: 'Nirbator (Rav Teitelbaum)', nameYi: 'נירבאטאר' },
    { id: 'Belz', nameEn: 'Machzikei Hadas Belz', nameYi: 'בעלזא מחזיקי הדת' },
    { id: 'OU', nameEn: 'OU Glatt Kosher', nameYi: 'OU גלאט' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>{t.filterByKosher}</span>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">
            {language === 'yi' ? 'אויסשטעלן לויט:' : 'Sort by:'}
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0B192C]"
          >
            <option value="featured">{language === 'yi' ? 'ספעציעל רעקאמענדירט' : 'Featured'}</option>
            <option value="price-asc">{language === 'yi' ? 'פרייז: פון ביליג צו טייער' : 'Price: Low to High'}</option>
            <option value="price-desc">{language === 'yi' ? 'פרייז: פון טייער צו ביליג' : 'Price: High to Low'}</option>
            <option value="rating">{language === 'yi' ? 'העכסט באוואונדערט' : 'Highest Rated'}</option>
          </select>
        </div>
      </div>

      {/* Hechsher Badges */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {agencies.map((agency) => {
          const isSelected = selectedAgency === agency.id;
          return (
            <button
              key={agency.id}
              onClick={() => onSelectAgency(agency.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5" />}
              <span>{language === 'yi' ? agency.nameYi : agency.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary filter toggles: Cold Chain & FBA */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
        {/* Storage Type */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Snowflake className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.storageZone}:</span>
          </span>
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            <button
              onClick={() => onSelectStorage('all')}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                selectedStorage === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.allStorage}
            </button>
            <button
              onClick={() => onSelectStorage('ambient')}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                selectedStorage === 'ambient' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📦 {t.ambient}
            </button>
            <button
              onClick={() => onSelectStorage('chilled')}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                selectedStorage === 'chilled' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧊 {t.chilled}
            </button>
            <button
              onClick={() => onSelectStorage('frozen')}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                selectedStorage === 'frozen' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ❄️ {t.frozen}
            </button>
          </div>
        </div>

        {/* FBA Fulfillment Toggle */}
        <button
          onClick={onToggleFba}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
            onlyFba
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-amber-300" />
          <span>{language === 'yi' ? 'בלויז היימיש FBA עקספרעס' : 'Heimish FBA Express Only'}</span>
        </button>
      </div>
    </div>
  );
};
