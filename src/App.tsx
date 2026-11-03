import React, { useState, useEffect, useMemo } from 'react';
import { 
  Language, 
  Product, 
  CartItem, 
  ProductCategory, 
  KosherAgency, 
  StorageType, 
  ZmanimLocation,
  ProductVariant
} from './types';
import { mockProducts, mockBundles, mockZmanimLocations } from './data/mockData';
import { translations } from './translations';
import { ShabbosBanner } from './components/ShabbosBanner';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { KosherFilters } from './components/KosherFilters';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartModal } from './components/CartModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { VendorDashboard } from './components/VendorDashboard';
import { WmsTrackingView } from './components/WmsTrackingView';
import { Sparkles, Gift, ArrowRight, ArrowLeft } from 'lucide-react';

export default function App() {
  // Localization: 'yi' (Heimish Satmar Yiddish) default with instant toggle
  const [language, setLanguage] = useState<Language>('yi');
  
  // Zmanim & Shabbos pause simulation
  const [selectedLocation, setSelectedLocation] = useState<ZmanimLocation>(mockZmanimLocations[0]);
  const [isShabbosSimulated, setIsShabbosSimulated] = useState<boolean>(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('marketplace');

  // Product catalog state (includes initial mock items + bundles)
  const [products, setProducts] = useState<Product[]>([...mockProducts, ...mockBundles]);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: mockProducts[0], quantity: 1 },
    { product: mockProducts[1], quantity: 2 }
  ]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedAgency, setSelectedAgency] = useState<KosherAgency | 'all'>('all');
  const [selectedStorage, setSelectedStorage] = useState<StorageType | 'all'>('all');
  const [onlyFba, setOnlyFba] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Synchronize document direction and language for authentic RTL
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'yi' ? 'rtl' : 'ltr';
  }, [language]);

  const t = translations[language];

  // Add to cart helper
  const handleAddToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && item.selectedVariant?.id === variant?.id
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedVariant: variant }];
    });
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    setCartItems(prev => {
      const copy = [...prev];
      copy[index].quantity = quantity;
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Add newly generated product from Vendor Portal
  const handleAddProductToStore = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (activeTab === 'bundles') {
        if (p.category !== 'holiday-bundles') return false;
      } else if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Kosher agency filter
      if (selectedAgency !== 'all' && p.kosherAgency !== selectedAgency) {
        return false;
      }

      // Storage filter
      if (selectedStorage !== 'all' && p.storageType !== selectedStorage) {
        return false;
      }

      // FBA filter
      if (onlyFba && p.fulfillmentType !== 'FBA') {
        return false;
      }

      // Search Query: supports Yiddish, English, and phonetic transliterations
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesEn = p.titleEn.toLowerCase().includes(q) || p.descriptionEn.toLowerCase().includes(q);
        const matchesYi = p.titleYi.toLowerCase().includes(q) || p.descriptionYi.toLowerCase().includes(q);
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(q));
        const matchesVendor = p.vendorName.toLowerCase().includes(q);
        if (!matchesEn && !matchesYi && !matchesTags && !matchesVendor) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, activeTab, selectedCategory, selectedAgency, selectedStorage, onlyFba, searchQuery, sortBy]);

  const ArrowIcon = language === 'yi' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1E293B]">
      {/* 1. Shabbos Zmanim & Halachic Pause Banner */}
      <ShabbosBanner
        language={language}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        isShabbosSimulated={isShabbosSimulated}
        onToggleShabbosSimulation={() => setIsShabbosSimulated(!isShabbosSimulated)}
      />

      {/* 2. Bilingual Navbar with Yiddish Keyboard Helper */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onPerformSearch={() => setActiveTab('marketplace')}
      />

      {/* 3. Main Views Switching */}
      <main className="flex-1 pb-16">
        {activeTab === 'marketplace' && (
          <>
            {/* Hero Banner with departments */}
            <HeroBanner
              language={language}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onOpenBundles={() => setActiveTab('bundles')}
              onOpenAi={() => setIsAiOpen(true)}
            />

            {/* Marketplace Grid with Kosher Filters */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
              <KosherFilters
                language={language}
                selectedAgency={selectedAgency}
                onSelectAgency={setSelectedAgency}
                selectedStorage={selectedStorage}
                onSelectStorage={setSelectedStorage}
                onlyFba={onlyFba}
                onToggleFba={() => setOnlyFba(!onlyFba)}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      language={language}
                      onAddToCart={(p) => handleAddToCart(p, 1)}
                      onViewDetails={(p) => setDetailProduct(p)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                  <div className="text-4xl">🔍</div>
                  <h3 className="font-bold text-slate-800 text-lg">
                    {language === 'yi' ? 'קיין פראדוקטן נישט געפונען' : 'No products found'}
                  </h3>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto">
                    {language === 'yi' 
                      ? 'פרובירט צו טוישן די זוך אדער ליידיגט די כשרות פילטערס.' 
                      : 'Try adjusting your search keywords or resetting kosher agency filters.'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedAgency('all');
                      setSelectedStorage('all');
                      setOnlyFba(false);
                    }}
                    className="px-4 py-2 bg-[#0B192C] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#1E3A8A]"
                  >
                    {language === 'yi' ? 'מעק אויס אלע פילטערס' : 'Reset All Filters'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Holiday & Simcha Bundles Tab */}
        {activeTab === 'bundles' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black">
                  <Gift className="w-3.5 h-3.5" />
                  <span>{language === 'yi' ? 'יום טוב & שמחה פעקלעך' : 'Curated Jewish Holiday Bundles'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {language === 'yi' ? 'גרייטע פעקלעך פאר שבת, חנוכה, פסח & שמחות' : 'Ready-Made Shabbos, Chanukah & Simcha Kits'}
                </h1>
                <p className="text-amber-100 text-xs sm:text-sm max-w-xl">
                  {language === 'yi'
                    ? 'ספעציעל צוזאמענגעשטעלט פון עטליכע היימישע געשעפטן אינאיינעם (חלות, פלייש, זילבער, אויל) מיט איין קלארן פרייז און שנעלע ליפערונג.'
                    : 'Multi-vendor bundles combining bakery, meat, silver, and seforim in a single box with group fulfillment savings.'}
                </p>
              </div>

              <button
                onClick={() => setIsAiOpen(true)}
                className="px-5 py-3 rounded-2xl bg-[#0B192C] text-white font-bold text-xs hover:bg-[#1E3A8A] flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{language === 'yi' ? 'באראט זיך מיט AI וועגן א פעקל' : 'Ask AI for Custom Bundle'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  language={language}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onViewDetails={(p) => setDetailProduct(p)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Vendor Dashboard Tab */}
        {activeTab === 'vendor' && (
          <VendorDashboard
            language={language}
            onAddProductToStore={handleAddProductToStore}
          />
        )}

        {/* WMS Fulfillment Tab */}
        {activeTab === 'wms' && (
          <WmsTrackingView language={language} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0B192C] text-slate-400 text-xs border-t border-slate-800 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-base">
                ה
              </div>
              <span className="font-extrabold text-lg text-white">
                {language === 'yi' ? 'היימישמאַרקעט' : 'HeimishMarket'}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {language === 'yi' 
                ? 'דער הויפט צענטראלער מארקעטפלעץ פאר דער אידישער קהילה. פולע כשרות באשטעטיגונג, שבת-רוה סיסטעם, און צדקה אינטעגראציע.'
                : 'The premier multi-vendor marketplace platform for the Jewish community. Strict kosher verification, automated Shabbos scheduling, and community tzedakah integration.'}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {language === 'yi' ? 'כשרות & קהילה' : 'Kosher & Community'}
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>התאחדות הרבנים דארה"ב וקנדה (CRC)</li>
              <li>קהל יטב לב ד'סאטמאר (ק"י / וויליאמסבורג)</li>
              <li>קראסנא כשרות</li>
              <li>נירבאטאר - הגה"צ מנירבאטאר</li>
              <li>מחזיקי הדת בעלזא</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {language === 'yi' ? 'ליפערונג & פולפילמענט' : 'Logistics & Courier'}
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Williamsburg & Crown Heights Express</li>
              <li>Boro Park & Flatbush Direct</li>
              <li>Monsey / Rockland Cold Chain Hub</li>
              <li>Kiryas Joel / Monroe Local Routes</li>
              <li>Lakewood, NJ Daily Shuttle</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {language === 'yi' ? 'קונדן סערוויס & הילף' : 'Customer Service & Help'}
            </h4>
            <p className="text-[11px] leading-relaxed mb-3">
              {language === 'yi'
                ? 'אונזער AI אסיסטענט שטייט גרייט 24/6 אייך צו העלפן מיט כשרות, שבת פארבאטן, און פראדוקטן.'
                : 'Our AI Shopping Concierge is ready 24/6 to assist with kosher specifications, Shabbos prep, and order inquiries.'}
            </p>
            <button
              onClick={() => setIsAiOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'yi' ? 'עפנט AI אסיסטענט' : 'Open AI Concierge'}</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} HeimishMarket (היימישמאַרקעט). All Rights Reserved. Shomer Shabbos Verified.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-400/80">תזכו למצוות!</span>
            <span>Bilingual RTL / LTR</span>
            <span>PCI-DSS Compliant</span>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        language={language}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart & Checkout Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        language={language}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        isShabbosSimulated={isShabbosSimulated}
      />

      {/* AI Assistant Modal (Gemini 3.8 Flash) */}
      <AIAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        language={language}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onViewProduct={(p) => setDetailProduct(p)}
      />
    </div>
  );
}
