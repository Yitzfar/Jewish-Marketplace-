import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Star, 
  Truck, 
  Snowflake, 
  Box, 
  CheckCircle2, 
  ShoppingCart, 
  Clock, 
  Share2 
} from 'lucide-react';
import { Product, Language, ProductVariant } from '../types';
import { translations } from '../translations';

interface ProductDetailModalProps {
  product: Product | null;
  language: Language;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  language,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const t = translations[language];
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [copied, setCopied] = useState(false);

  const currentPrice = product.price + (selectedVariant ? selectedVariant.priceDelta : 0);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Left Column: Image & Badges */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
              <img
                src={product.imageUrl}
                alt={language === 'yi' ? product.titleYi : product.titleEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-md flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{product.kosherAgency}</span>
                </span>
                {product.fulfillmentType === 'FBA' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0B192C] text-amber-300 shadow-md flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Heimish FBA</span>
                  </span>
                )}
              </div>
            </div>

            {/* Kosher Verification Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-2 text-emerald-950">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{language === 'yi' ? 'באשטעטיגטער כשרות פאספארט:' : 'Kosher Verification Details:'}</span>
              </div>
              <p className="leading-relaxed">
                {language === 'yi' 
                  ? (product.kosherNotesYi || 'מהדרין גלאט כשר תחת השגחת התאחדות הרבנים / סאטמאר')
                  : (product.kosherNotesEn || 'Glatt Kosher Mehadrin, Chassidishe Shechita')}
              </p>
              <div className="pt-1 flex items-center gap-3 text-[11px] text-emerald-800 font-semibold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'yi' ? 'משגיח תמידי' : 'Mashgiach Temidi'}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'yi' ? 'שומר שבת' : 'Shomer Shabbos Owned'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Details, Variants & Actions */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                  <span>{language === 'yi' ? 'פארקויפט דורך:' : 'Sold by:'} {product.vendorName}</span>
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copied ? (language === 'yi' ? 'קאפירט!' : 'Copied!') : (language === 'yi' ? 'טייל מיט' : 'Share')}</span>
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {language === 'yi' ? product.titleYi : product.titleEn}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-400">|</span>
                  <span className="text-xs text-slate-600 font-medium">
                    {product.reviewCount} {t.reviews}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold ml-2">
                    ✓ {language === 'yi' ? 'אין לאגער' : 'In Stock'} ({product.stockCount} {language === 'yi' ? 'פארבליבן' : 'available'})
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-3xl font-black text-[#0B192C]">
                  ${currentPrice.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-slate-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  {language === 'yi' ? 'עקספרעס לאקאלע ליפערונג' : 'Local Courier Eligible'}
                </span>
              </div>

              {/* Description */}
              <div className="text-sm text-slate-600 leading-relaxed space-y-2">
                <p>{language === 'yi' ? product.descriptionYi : product.descriptionEn}</p>
              </div>

              {/* Variants Picker if available */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {language === 'yi' ? 'קלויבט אויס וואריאנט / גרייס:' : 'Select Option / Size:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-start ${
                            isSelected
                              ? 'bg-[#0B192C] text-white border-[#0B192C] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div>{language === 'yi' ? v.nameYi : v.nameEn}</div>
                          {v.priceDelta > 0 && (
                            <div className="text-[11px] opacity-80 mt-0.5">+${v.priceDelta.toFixed(2)}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery info banner */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block">
                    {language === 'yi' ? 'שבת & יום טוב צייט גאראנטיע:' : 'Shabbos & Yom Tov Timing Guarantee:'}
                  </strong>
                  <span>
                    {language === 'yi'
                      ? 'קיין שום ליפערונגען ווערן נישט געמאכט אום שבת ויום טוב. באשטעלונגען פרייטאג נאך חצות ווערן געשיקט זונטאג צופרי.'
                      : 'Zero deliveries are dispatched during Shabbos or Jewish holidays. Friday orders past cutoff are guaranteed for Sunday morning.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Quantity + Add to Cart */}
            <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center rounded-xl border border-slate-300 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, quantity, selectedVariant);
                  onClose();
                }}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-98 text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-slate-950" />
                <span>
                  {t.addToCart} • ${(currentPrice * quantity).toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
