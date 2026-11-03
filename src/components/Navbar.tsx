import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Globe, 
  Sparkles, 
  Store, 
  Truck, 
  Layers, 
  Gift, 
  X,
  Keyboard
} from 'lucide-react';
import { Language, CartItem } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenAi: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onPerformSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  activeTab,
  onTabChange,
  cartItems,
  onOpenCart,
  onOpenAi,
  searchQuery,
  onSearchChange,
  onPerformSearch,
}) => {
  const t = translations[language];
  const [showKeyboard, setShowKeyboard] = useState(false);

  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Heimish Yiddish characters helper for quick typing without Hebrew keyboard
  const yiddishKeys = [
    'א', 'ב', 'בּ', 'ג', 'ד', 'ה', 'ו', 'וו', 'וי', 'ז', 'זש', 'ח', 'ט', 'טש', 
    'י', 'יי', 'ײַ', 'כ', 'ך', 'ל', 'מ', 'ם', 'נ', 'ן', 'ס', 'ע', 'פ', 'פֿ', 'ף', 
    'צ', 'ץ', 'ק', 'ר', 'ש', 'ת'
  ];

  const handleKeyPress = (char: string) => {
    onSearchChange(searchQuery + char);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 md:gap-6">
        {/* Brand / Logo */}
        <div 
          onClick={() => onTabChange('marketplace')}
          className="cursor-pointer flex items-center gap-2 group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B192C] to-[#1E3A8A] flex items-center justify-center text-amber-400 font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            <span>ה</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl md:text-2xl text-[#0B192C] tracking-tight">
                {language === 'yi' ? 'היימישמאַרקעט' : 'HeimishMarket'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                מהדרין
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {t.siteSubtitle}
            </p>
          </div>
        </div>

        {/* Search Bar with Yiddish Keyboard Support */}
        <div className="flex-1 max-w-2xl relative">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              onPerformSearch();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 text-sm md:text-base pl-10 pr-20 py-2.5 rounded-full border border-slate-200 focus:border-[#0B192C] focus:ring-2 focus:ring-[#0B192C]/10 transition-all outline-hidden"
            />
            <Search className={`w-4 h-4 text-slate-400 absolute ${language === 'yi' ? 'right-3' : 'left-3'}`} />
            
            <div className={`absolute flex items-center gap-1 ${language === 'yi' ? 'left-2' : 'right-2'}`}>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              
              <button
                type="button"
                onClick={() => setShowKeyboard(!showKeyboard)}
                title={t.yiddishKeyboardHelper}
                className={`p-1.5 rounded-full transition-colors ${
                  showKeyboard ? 'bg-amber-100 text-amber-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Keyboard className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Virtual Yiddish Keyboard Helper */}
          {showKeyboard && (
            <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-white p-3 rounded-2xl shadow-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Keyboard className="w-3.5 h-3.5 text-amber-600" />
                  {language === 'yi' ? 'אידישע אותיות הילף (דרוקט אויף די אותיות):' : 'Heimish Yiddish Keyboard Helper:'}
                </span>
                <button
                  onClick={() => setShowKeyboard(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center" dir="rtl">
                {yiddishKeys.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKeyPress(key)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 font-bold text-sm text-slate-800 transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-2xs"
                  >
                    {key}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => onSearchChange(searchQuery + ' ')}
                  className="px-4 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 cursor-pointer"
                >
                  Space
                </button>
                <button
                  type="button"
                  onClick={() => onSearchChange(searchQuery.slice(0, -1))}
                  className="px-3 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-medium text-red-700 cursor-pointer"
                >
                  Backspace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons: Language switcher, AI assistant, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => {
              const next = language === 'yi' ? 'en' : 'yi';
              onLanguageChange(next);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Switch Language / בייט שפראך"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'yi' ? 'English' : 'אידיש (סאטמאר)'}</span>
          </button>

          {/* AI Shopping Assistant Button */}
          <button
            onClick={onOpenAi}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{language === 'yi' ? 'AI קלוגער קויפער' : 'AI Assistant'}</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0B192C] transition-colors cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartTotalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {cartTotalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Links Bar */}
      <nav className="bg-slate-50 border-t border-slate-200/80 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => onTabChange('marketplace')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'marketplace' 
                ? 'bg-[#0B192C] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t.marketplace}</span>
          </button>

          <button
            onClick={() => onTabChange('bundles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'bundles' 
                ? 'bg-[#0B192C] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Gift className="w-4 h-4 text-amber-500" />
            <span>{t.holidayBundles}</span>
          </button>

          <button
            onClick={() => onTabChange('vendor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'vendor' 
                ? 'bg-[#0B192C] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Store className="w-4 h-4 text-blue-600" />
            <span>{t.vendorPortal}</span>
          </button>

          <button
            onClick={() => onTabChange('wms')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'wms' 
                ? 'bg-[#0B192C] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>{t.wmsFulfillment}</span>
          </button>

          <button
            onClick={onOpenAi}
            className={`sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'yi' ? 'AI קלוגער קויפער' : 'AI Assistant'}</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
