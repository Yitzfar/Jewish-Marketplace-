import React from 'react';
import { ShieldCheck, Truck, Clock, Heart, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language, ProductCategory } from '../types';
import { translations } from '../translations';

interface HeroBannerProps {
  language: Language;
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  selectedCategory: ProductCategory | 'all';
  onOpenBundles: () => void;
  onOpenAi: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  onSelectCategory,
  selectedCategory,
  onOpenBundles,
  onOpenAi,
}) => {
  const t = translations[language];
  const ArrowIcon = language === 'yi' ? ArrowLeft : ArrowRight;

  const categories = [
    { id: 'all', nameEn: 'All Departments', nameYi: 'אלע אפטיילונגען', icon: '🏛️' },
    { id: 'kosher-food', nameEn: 'Kosher Groceries & Meat', nameYi: 'כשרע עסנווארג & פלייש', icon: '🥩' },
    { id: 'judaica', nameEn: 'Judaica & Silver', nameYi: 'תשמישי קדושה & זילבער', icon: '🕎' },
    { id: 'clothing', nameEn: 'Chassidish Attire & Bekishes', nameYi: 'בגדי שבת & בעקישעס', icon: '🎩' },
    { id: 'books-seforim', nameEn: 'Seforim & Yiddish Books', nameYi: 'ספרים & אידישע ביכער', icon: '📚' },
    { id: 'holiday-bundles', nameEn: 'Holiday & Simcha Bundles', nameYi: 'יום טוב & שמחה פעקלעך', icon: '🎁' }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0B192C] via-[#10243E] to-[#1A365D] text-white pt-8 pb-12 px-4 shadow-inner">
      {/* Background Decorative patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'yi' ? 'סאטמאר & היימישער קהילה מארקעטפלעץ 1.0' : 'Multi-Vendor Jewish Community Marketplace'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {language === 'yi' ? (
                <>
                  אלעס כשר פאר דער אידישער היים, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">
                    באשטעלט אין איין צענטער.
                  </span>
                </>
              ) : (
                <>
                  Kosher Food, Judaica & Attire, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">
                    All from Verified Heimish Vendors.
                  </span>
                </>
              )}
            </h1>

            <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
              {language === 'yi' 
                ? 'א גרויסע פלאטפארמע פאר הונדערטער היימישע געשעפטן: מהדרין פלייש און בעקערייען (התאחדות הרבנים / סאטמאר), זילבער, ספרים, און שבת קליידער. שנעלע לאקאלע ליפערונג, שבת-זיכערע סיסטעם, און צדקה אפרונדונג.'
                : 'Direct access to hundreds of vetted Jewish vendors: Hisachdus & Mehadrin meats, bakeries, sterling silver, seforim, and custom Bekishes. Local 3-hour courier, guaranteed Halachic Shabbos order management, and community fulfillment.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onOpenBundles}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{language === 'yi' ? 'זעט יום טוב & שבת פעקלעך' : 'Explore Holiday & Shabbos Bundles'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAi}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{language === 'yi' ? 'פרעג דעם AI אסיסטענט' : 'Consult AI Shopping Assistant'}</span>
              </button>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'yi' ? 'השגחת התאחדות הרבנים' : 'Hisachdus Mehadrin'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{language === 'yi' ? 'שנעלע לאקאלע קוריער' : 'Same-Day Courier'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'yi' ? 'שבת רוה פעריאדע' : 'Halachic Shabbos Pause'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{language === 'yi' ? 'צדקה אפרונדונג' : 'Tzedakah Round-Up'}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats & Featured Badge Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300">
                  {language === 'yi' ? 'קהילה פולפילמענט אינפראסטרוקטור' : 'Community Fulfillment Network (FBA)'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
                  99.9% Uptime
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-black text-white">200+</div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {language === 'yi' ? 'באשטעטיגטע פארקויפער' : 'Vetted Heimish Vendors'}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-black text-amber-300">3-Hour</div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {language === 'yi' ? 'לאקאלע ליפערונג ראטע' : 'Local Courier Cutoff'}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-black text-white">100%</div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {language === 'yi' ? 'סאטמארער אידיש & ענגליש' : 'Bilingual Heimish RTL'}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-black text-emerald-400">Glatt</div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {language === 'yi' ? 'חסידישע שחיטה מהדרין' : 'Strict Kosher Standards'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-xs text-amber-100 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-amber-200">
                    {language === 'yi' ? 'פרייטאג באשטעלונג צייט:' : 'Erev Shabbos Order Window:'}
                  </strong>
                  <span>
                    {language === 'yi'
                      ? 'באשטעלונגען ביז 12:00 מיטאג ווערן געליפערט היינט פאר שבת. שפעטערע באשטעלונגען ווערן אויטאמאטיש געפלאנט אויף זונטאג.'
                      : 'Orders placed before 12:00 PM arrive today before candle lighting. Later orders automatically scheduled for Sunday morning.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pill Selectors */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            {language === 'yi' ? 'קלויבט אויס א קאטעגאריע:' : 'Browse by Department:'}
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((c) => {
              const isSelected = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCategory(c.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <span className="text-base">{c.icon}</span>
                  <span>{language === 'yi' ? c.nameYi : c.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
