import React from 'react';
import { ShoppingCart, Star, ShieldCheck, Snowflake, Box, Truck } from 'lucide-react';
import { Product, Language } from '../types';
import { translations } from '../translations';

interface ProductCardProps {
  product: Product;
  language: Language;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  onAddToCart,
  onViewDetails,
}) => {
  const t = translations[language];

  const getKosherAgencyDisplay = (agency: string) => {
    switch (agency) {
      case 'Hisachdus':
        return language === 'yi' ? 'התאחדות הרבנים (CRC)' : 'Hisachdus Harabanim (CRC)';
      case 'Satmar-KJ':
        return language === 'yi' ? 'סאטמאר ק"י' : 'Satmar Kiryas Joel';
      case 'Satmar-Wmsbg':
        return language === 'yi' ? 'סאטמאר וויליאמסבורג' : 'Satmar Williamsburg';
      case 'Krasna':
        return language === 'yi' ? 'קראסנא' : 'Krasna Kashrus';
      case 'Nirbator':
        return language === 'yi' ? 'נירבאטאר' : 'Nirbator';
      case 'Belz':
        return language === 'yi' ? 'בעלזא' : 'Belz Machzikei Hadas';
      case 'OU':
        return 'OU Glatt';
      default:
        return agency;
    }
  };

  const getStorageBadge = () => {
    if (product.storageType === 'frozen') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
          <Snowflake className="w-3 h-3 text-blue-600" />
          <span>{language === 'yi' ? 'פארפרוירן' : 'Frozen'}</span>
        </span>
      );
    }
    if (product.storageType === 'chilled') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200 flex items-center gap-1">
          <Snowflake className="w-3 h-3 text-cyan-600" />
          <span>{language === 'yi' ? 'אפגעקילט' : 'Chilled'}</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
        <Box className="w-3 h-3 text-slate-500" />
        <span>{language === 'yi' ? 'טרוקן' : 'Dry'}</span>
      </span>
    );
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image & Badges */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={language === 'yi' ? product.titleYi : product.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          <div className="flex items-center gap-1">
            {getStorageBadge()}
            {product.fulfillmentType === 'FBA' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0B192C] text-amber-300 border border-amber-400/30 flex items-center gap-1 shadow-xs">
                <Truck className="w-3 h-3 text-amber-300" />
                <span>FBA</span>
              </span>
            )}
          </div>

          {/* Kosher Badge */}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-white shadow-xs flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>{getKosherAgencyDisplay(product.kosherAgency)}</span>
          </span>
        </div>

        {product.originalPrice && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold shadow-xs">
            {language === 'yi' ? 'אין ספעציעל' : 'Sale'}
          </div>
        )}
      </div>

      {/* Body Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Vendor name */}
          <div className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              {product.vendorName}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(product)}
            className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors text-sm sm:text-base line-clamp-2 leading-snug cursor-pointer mb-2"
          >
            {language === 'yi' ? product.titleYi : product.titleEn}
          </h3>

          {/* Description Snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {language === 'yi' ? product.descriptionYi : product.descriptionEn}
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[#0B192C]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold">
              {language === 'yi' ? 'מהדרין גלאט כשר' : 'Mehadrin Glatt'}
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="px-3 py-2 rounded-xl bg-[#0B192C] hover:bg-[#1E3A8A] active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title={t.addToCart}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t.addToCart}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
