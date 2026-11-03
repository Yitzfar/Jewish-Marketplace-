import React, { useState } from 'react';
import { 
  Store, 
  Sparkles, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Truck, 
  CheckCircle, 
  Calendar, 
  Layers, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { Language, Vendor, Product, KosherAgency } from '../types';
import { translations } from '../translations';
import { mockVendors, mockProducts } from '../data/mockData';

interface VendorDashboardProps {
  language: Language;
  onAddProductToStore: (newProduct: Product) => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  language,
  onAddProductToStore,
}) => {
  const t = translations[language];

  // Active vendor profile
  const [currentVendor, setCurrentVendor] = useState<Vendor>(mockVendors[0]);
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'ai-creator' | 'forecasting' | 'payouts'>('ai-creator');

  // AI Listing State
  const [draftTitle, setDraftTitle] = useState('Hungarian Poppy Seed Beiglech (Rugelach)');
  const [draftDesc, setDraftDesc] = useState('Freshly rolled dough filled with rich poppy seed and honey, Pas Yisroel, baked early Friday morning.');
  const [draftKosher, setDraftKosher] = useState<KosherAgency>('Hisachdus');
  const [draftPrice, setDraftPrice] = useState('16.50');
  const [draftStorage, setDraftStorage] = useState<'ambient' | 'chilled' | 'frozen'>('ambient');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedListing, setGeneratedListing] = useState<any>(null);
  const [listingSuccess, setListingSuccess] = useState(false);

  // Demand Forecast State
  const [selectedHoliday, setSelectedHoliday] = useState('pesach');
  const [forecastData, setForecastData] = useState<any>({
    holidayName: 'Pesach / פסח',
    peakTrafficMultiplier: '8.4x',
    projectedOrderVolume: '28,500 orders',
    topCategories: ['Kosher Food (Matzot, Wine, Beef)', 'Pesach Cookware & Linens', 'Haggadahs & Seforim'],
    warehouseAdvice: 'Increase FBA cold-chain meat storage by 320% by 3 weeks prior to Nissan. Enable early bulk ship drop-offs.',
    recommendedInventoryBuffer: '+65% for non-perishables, +35% for poultry'
  });
  const [isForecasting, setIsForecasting] = useState(false);

  const handleGenerateListing = async () => {
    setIsGenerating(true);
    setListingSuccess(false);
    try {
      const response = await fetch('/api/ai/translate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draftTitle,
          description: draftDesc,
          kosherAgency: draftKosher
        })
      });
      const data = await response.json();
      setGeneratedListing(data);
    } catch (e) {
      console.error(e);
      setGeneratedListing({
        titleYi: `${draftTitle} - היימיש למהדרין`,
        titleEn: draftTitle,
        descriptionYi: 'געשמאקע פרישע געבעקס געמאכט לויט דער אלטער אונגארישער טראדיציע. כשר למהדרין מן המהדרין.',
        descriptionEn: draftDesc,
        kosherNotesYi: 'השגחת התאחדות הרבנים, פת ישראל, קמח ישן',
        kosherNotesEn: 'Certified Hisachdus Harabanim, Pas Yisroel',
        tags: ['bakery', 'heimish', 'shabbos', 'מהדרין']
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishListing = () => {
    if (!generatedListing) return;

    const newProd: Product = {
      id: 'prod-new-' + Date.now(),
      vendorId: currentVendor.id,
      vendorName: currentVendor.nameEn,
      titleEn: generatedListing.titleEn || draftTitle,
      titleYi: generatedListing.titleYi || draftTitle,
      descriptionEn: generatedListing.descriptionEn || draftDesc,
      descriptionYi: generatedListing.descriptionYi || draftDesc,
      price: parseFloat(draftPrice) || 15.0,
      category: 'kosher-food',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
      kosherAgency: draftKosher,
      kosherMehadrin: true,
      kosherNotesEn: generatedListing.kosherNotesEn,
      kosherNotesYi: generatedListing.kosherNotesYi,
      inStock: true,
      stockCount: 45,
      storageType: draftStorage,
      fulfillmentType: 'FBA',
      deliveryOptions: ['local-same-day', 'economy-ship'],
      rating: 5.0,
      reviewCount: 1,
      tags: generatedListing.tags || ['heimish'],
      reviews: []
    };

    onAddProductToStore(newProd);
    setListingSuccess(true);
  };

  const handleFetchForecast = async (holiday: string) => {
    setSelectedHoliday(holiday);
    setIsForecasting(true);
    try {
      const res = await fetch('/api/ai/demand-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ holiday })
      });
      const data = await res.json();
      setForecastData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsForecasting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Vendor Header */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
              {language === 'yi' ? 'פארקויפער פלאטפארמע' : 'Vendor Portal'}
            </span>
            <span className="text-xs text-slate-300">
              {language === 'yi' ? 'באשטעטיגטער מוכר זינט' : 'Member since'} {currentVendor.joinedYear}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'yi' ? currentVendor.nameYi : currentVendor.nameEn}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            {language === 'yi' ? currentVendor.taglineYi : currentVendor.taglineEn}
          </p>
        </div>

        {/* Switch Vendor Demo Profile */}
        <div className="relative z-10 flex flex-col items-end gap-2">
          <div className="text-xs text-slate-400 font-semibold">
            {language === 'yi' ? 'בייט פארקויפער חשבון:' : 'Switch Vendor Profile:'}
          </div>
          <select
            value={currentVendor.id}
            onChange={(e) => {
              const v = mockVendors.find(vend => vend.id === e.target.value);
              if (v) setCurrentVendor(v);
            }}
            className="bg-white/10 text-white border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer focus:outline-none"
          >
            {mockVendors.map((vend) => (
              <option key={vend.id} value={vend.id} className="bg-slate-900 text-white">
                {language === 'yi' ? vend.nameYi : vend.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t.totalRevenue}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">$84,240.00</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            +18.4% {language === 'yi' ? 'פארגאנגענעם חודש' : 'vs last month'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t.activeListings}</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">42</div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">
            {language === 'yi' ? 'אלע צוויי-שפראכיג' : '100% Bilingual Yiddish'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t.ordersFulfillment}</span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">1,280</div>
          <div className="text-[11px] text-amber-800 font-semibold mt-1">
            {language === 'yi' ? 'דורך היימיש FBA קאלט-קייט' : 'via Heimish FBA Cold Chain'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{language === 'yi' ? 'כשרות פאס' : 'Kosher Status'}</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">100% Mehadrin</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {language === 'yi' ? 'השגחה פאראייניגט' : 'Audited by Hisachdus'}
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('ai-creator')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors ${
            activeSubTab === 'ai-creator'
              ? 'bg-[#0B192C] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t.aiListingCreator}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('forecasting')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors ${
            activeSubTab === 'forecasting'
              ? 'bg-[#0B192C] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>{language === 'yi' ? 'AI יום טוב פארזעהונג (ML)' : 'AI Holiday Peak Forecasts (ML)'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors ${
            activeSubTab === 'inventory'
              ? 'bg-[#0B192C] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4 text-blue-500" />
          <span>{language === 'yi' ? 'לאגער & FBA קאנסיינמענט' : 'Inventory & FBA Consignment'}</span>
        </button>
      </div>

      {/* TAB 1: AI Listing Creator & Satmar Yiddish Translator */}
      {activeSubTab === 'ai-creator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input side */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-base">
                {language === 'yi' ? 'שאפט פראדוקט מיט AI איבערזעצונג' : 'Create Product with AI Yiddish Translator'}
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                {language === 'yi' ? 'פראדוקט נאמען (ענגליש אדער אידיש):' : 'Product Title (English or Yiddish):'}
              </label>
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B192C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                {t.aiListingPrompt}
              </label>
              <textarea
                rows={3}
                value={draftDesc}
                onChange={(e) => setDraftDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B192C]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  {language === 'yi' ? 'הכשר:' : 'Kosher Agency:'}
                </label>
                <select
                  value={draftKosher}
                  onChange={(e) => setDraftKosher(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800"
                >
                  <option value="Hisachdus">Hisachdus Harabanim</option>
                  <option value="Satmar-KJ">Satmar Kiryas Joel</option>
                  <option value="Satmar-Wmsbg">Satmar Williamsburg</option>
                  <option value="Krasna">Krasna Kashrus</option>
                  <option value="Nirbator">Nirbator</option>
                  <option value="Belz">Belz Machzikei Hadas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  {language === 'yi' ? 'פרייז ($):' : 'Price ($):'}
                </label>
                <input
                  type="text"
                  value={draftPrice}
                  onChange={(e) => setDraftPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  {t.storageZone}:
                </label>
                <select
                  value={draftStorage}
                  onChange={(e) => setDraftStorage(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800"
                >
                  <option value="ambient">Ambient (Dry)</option>
                  <option value="chilled">Chilled (Perishable)</option>
                  <option value="frozen">Frozen (Glatt Meat)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateListing}
              disabled={isGenerating || !draftTitle}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
              <span>
                {isGenerating 
                  ? (language === 'yi' ? 'איבערזעצט אויף סאטמארער אידיש...' : 'Generating Heimish Listing with Gemini 3.8...') 
                  : t.generateListingBtn}
              </span>
            </button>
          </div>

          {/* Preview side */}
          <div className="lg:col-span-6 bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-800 text-base">
                {t.listingPreview}
              </h3>
              {generatedListing && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  Ready for Human Review
                </span>
              )}
            </div>

            {generatedListing ? (
              <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                {/* Yiddish Block */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-start space-y-1.5" dir="rtl">
                  <div className="text-[11px] font-bold text-amber-900 uppercase">
                    היימישע אידיש (סאטמארער שרייבונג):
                  </div>
                  <div className="font-black text-slate-950 text-base">
                    {generatedListing.titleYi}
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    {generatedListing.descriptionYi}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-semibold pt-1">
                    ✓ {generatedListing.kosherNotesYi || 'מהדרין גלאט כשר'}
                  </div>
                </div>

                {/* English Block */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-start space-y-1.5" dir="ltr">
                  <div className="text-[11px] font-bold text-slate-600 uppercase">
                    English Commercial Listing:
                  </div>
                  <div className="font-black text-slate-900 text-base">
                    {generatedListing.titleEn || draftTitle}
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    {generatedListing.descriptionEn || draftDesc}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold pt-1">
                    ✓ {generatedListing.kosherNotesEn || 'Certified Kosher'}
                  </div>
                </div>

                {/* Tags */}
                {generatedListing.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {generatedListing.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {listingSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'yi' ? 'די ליסטינג איז פובליצירט געווארן אינעם קאטאלאג!' : 'Listing published to live catalog!'}</span>
                  </div>
                ) : (
                  <button
                    onClick={handlePublishListing}
                    className="w-full py-3 rounded-xl bg-[#0B192C] hover:bg-[#1E3A8A] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    {language === 'yi' ? 'באשטעטיג און לייג ארויף צום פארקויף' : 'Approve & Publish to Marketplace'}
                  </button>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                {language === 'yi'
                  ? 'שרייבט אריין די פרטים פון לינקס און דרוקט אויפ׳ן קנעפל צו באקומען די צוויי-שפראכיגע איבערזעצונג.'
                  : 'Enter product details on the left and click Generate to see the bilingual Satmar Yiddish & English copy.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AI Holiday Demand Forecasting */}
      {activeSubTab === 'forecasting' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-lg">
                {language === 'yi' ? 'AI מאשין לערנען - פארזעהונג פאר יום טוב סעזאן' : 'ML Demand Forecasting Engine'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'yi' 
                  ? 'רעכנט אויס היסטארישע דאטן פון וויליאמסבורג, בארא פארק, און מאנסי צו רעקאמענדירן לאגער פאר יעדן יום טוב.'
                  : 'Predictive seasonal spikes across Hasidic clusters to optimize FBA cold storage and warehouse inventory.'}
              </p>
            </div>

            {/* Event Picker */}
            <div className="flex gap-2">
              {[
                { id: 'pesach', labelEn: 'Pesach Peak', labelYi: 'פסח סעזאן' },
                { id: 'shabbos-weekly', labelEn: 'Weekly Shabbos Surge', labelYi: 'ערב שבת סערדזש' },
                { id: 'chanukah', labelEn: 'Chanukah Peak', labelYi: 'חנוכה סעזאן' },
              ].map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => handleFetchForecast(ev.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedHoliday === ev.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {language === 'yi' ? ev.labelYi : ev.labelEn}
                </button>
              ))}
            </div>
          </div>

          {forecastData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <span className="text-xs font-bold text-amber-900 uppercase">
                  {language === 'yi' ? 'פארקער פארגרעסערונג:' : 'Peak Traffic Multiplier:'}
                </span>
                <div className="text-3xl font-black text-amber-700">
                  {forecastData.peakTrafficMultiplier}
                </div>
                <p className="text-xs text-amber-950">
                  {language === 'yi' ? 'פארגעזעענע באשטעלונגען:' : 'Projected Volume:'} <strong>{forecastData.projectedOrderVolume}</strong>
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
                <span className="text-xs font-bold text-blue-900 uppercase">
                  {language === 'yi' ? 'הויפט קאטעגאריעס אין פארלאנג:' : 'Top Demand Categories:'}
                </span>
                <ul className="text-xs text-blue-950 space-y-1 list-disc list-inside">
                  {forecastData.topCategories?.map((c: string, idx: number) => (
                    <li key={idx} className="font-semibold">{c}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  {language === 'yi' ? 'לאגער באפער רעקאמענדאציע:' : 'Inventory Buffer Recommendation:'}
                </span>
                <div className="text-base font-bold text-emerald-700">
                  {forecastData.recommendedInventoryBuffer}
                </div>
                <p className="text-xs text-slate-600">
                  {forecastData.warehouseAdvice}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Inventory Table */}
      {activeSubTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base">
              {language === 'yi' ? 'אקטועלע לאגער רשימה' : 'Live Warehouse Inventory'}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {mockProducts.length} {language === 'yi' ? 'ארטיקלען אין סיסטעם' : 'products tracked'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3 text-start">{language === 'yi' ? 'פראדוקט' : 'Product'}</th>
                  <th className="p-3 text-start">{language === 'yi' ? 'הכשר' : 'Kosher'}</th>
                  <th className="p-3 text-start">{language === 'yi' ? 'סטארעדזש' : 'Zone'}</th>
                  <th className="p-3 text-start">{language === 'yi' ? 'לאגער' : 'In Stock'}</th>
                  <th className="p-3 text-start">{language === 'yi' ? 'פרייז' : 'Price'}</th>
                  <th className="p-3 text-start">{language === 'yi' ? 'FBA סטאטוס' : 'Fulfillment'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <img src={p.imageUrl} className="w-8 h-8 rounded-lg object-cover" />
                      <span>{language === 'yi' ? p.titleYi : p.titleEn}</span>
                    </td>
                    <td className="p-3 text-emerald-700 font-semibold">{p.kosherAgency}</td>
                    <td className="p-3 uppercase font-medium">{p.storageType}</td>
                    <td className="p-3 font-bold">{p.stockCount} units</td>
                    <td className="p-3 font-black text-slate-900">${p.price.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                        {p.fulfillmentType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
