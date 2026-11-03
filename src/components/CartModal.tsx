import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Heart, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Language, Charity } from '../types';
import { translations } from '../translations';
import { mockCharities } from '../data/mockData';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  language: Language;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  isShabbosSimulated: boolean;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  language,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  isShabbosSimulated,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const ArrowIcon = language === 'yi' ? ArrowLeft : ArrowRight;

  // Delivery method
  const [shippingMethod, setShippingMethod] = useState<'local-same-day' | 'economy-ship' | 'group-dropoff'>('local-same-day');
  
  // Tzedakah round-up & donation
  const [enableRoundup, setEnableRoundup] = useState(true);
  const [selectedCharity, setSelectedCharity] = useState<Charity>(mockCharities[0]);
  const [extraDonation, setExtraDonation] = useState<number>(0);

  // Shabbos delivery schedule preference
  const [scheduledDay, setScheduledDay] = useState<string>(isShabbosSimulated ? 'sunday-morning' : 'friday-early');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Calculations
  const rawSubtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.product.price + (item.selectedVariant ? item.selectedVariant.priceDelta : 0);
    return acc + itemPrice * item.quantity;
  }, 0);

  let shippingCost = 0;
  if (shippingMethod === 'local-same-day') {
    shippingCost = rawSubtotal > 100 ? 0 : 9.99;
  } else if (shippingMethod === 'economy-ship') {
    shippingCost = rawSubtotal > 75 ? 0 : 5.99;
  } else {
    // group dropoff
    shippingCost = 2.99;
  }

  // Tzedakah calculation
  const cents = rawSubtotal % 1;
  const roundupChange = (cents > 0 && enableRoundup) ? Number((1 - cents).toFixed(2)) : 0;
  const totalTzedakah = roundupChange + extraDonation;

  const grandTotal = rawSubtotal + shippingCost + totalTzedakah;

  const handlePlaceOrder = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // canvas-confetti fallback
      }
    }, 1200);
  };

  const handleFinish = () => {
    onClearCart();
    setCheckoutSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900">
              {t.cart} ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
            {isShabbosSimulated && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {language === 'yi' ? 'שבת רוה פעריאדע אקטיוו' : 'Shabbos Pause Active'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {checkoutSuccess ? (
          /* Order Complete Screen */
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {t.orderSuccess}
              </h3>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                {language === 'yi' 
                  ? 'אייער באשטעלונג איז באשטעטיגט געווארן. אונזערע קוריערן אין וויליאמסבורג / מאנסי / ק"י וועלן אפגעבן אייער פעקל אין דער באשטימטער צייט, ללא שום חשש חילול שבת.'
                  : 'Your order has been confirmed and routed to Heimish FBA cold-chain fulfillment. Guaranteed Halachic schedule compliance.'}
              </p>
            </div>

            {totalTzedakah > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 max-w-sm mx-auto text-xs text-amber-950 flex items-center gap-3">
                <Heart className="w-6 h-6 text-rose-500 shrink-0 fill-current" />
                <div className="text-start">
                  <strong>{language === 'yi' ? 'זכות הצדקה:' : 'Tzedakah Impact:'}</strong>
                  <div>${totalTzedakah.toFixed(2)} {language === 'yi' ? 'איז געשיקט געווארן פאר' : 'was routed directly to'} <strong>{language === 'yi' ? selectedCharity.nameYi : selectedCharity.nameEn}</strong>. תזכו למצוות!</div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handleFinish}
                className="px-8 py-3 rounded-xl bg-[#0B192C] hover:bg-[#1E3A8A] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                {language === 'yi' ? 'צוריק צום מארקעט' : 'Continue Shopping'}
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Truck className="w-8 h-8" />
            </div>
            <p className="text-slate-600 font-medium">{t.emptyCart}</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#0B192C] text-white text-xs font-bold hover:bg-[#1E3A8A] cursor-pointer"
            >
              {language === 'yi' ? 'קוקט זיך אום אין געשעפט' : 'Start Browsing'}
            </button>
          </div>
        ) : (
          /* Normal Cart Flow */
          <div className="p-6 space-y-6">
            {/* Items list */}
            <div className="divide-y divide-slate-100 border-b border-slate-100 pb-2">
              {cartItems.map((item, idx) => {
                const itemPrice = item.product.price + (item.selectedVariant ? item.selectedVariant.priceDelta : 0);
                return (
                  <div key={`${item.product.id}-${idx}`} className="py-3 flex items-center justify-between gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={language === 'yi' ? item.product.titleYi : item.product.titleEn}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {language === 'yi' ? item.product.titleYi : item.product.titleEn}
                      </h4>
                      {item.selectedVariant && (
                        <span className="text-[11px] text-slate-500 block">
                          {language === 'yi' ? item.selectedVariant.nameYi : item.selectedVariant.nameEn}
                        </span>
                      )}
                      <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{item.product.kosherAgency}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity buttons */}
                      <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 overflow-hidden text-xs">
                        <button
                          onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-end min-w-[70px]">
                        <div className="font-black text-slate-900 text-sm">
                          ${(itemPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery & Schedule Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>{t.deliveryOptionsTitle}</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Same day */}
                <button
                  type="button"
                  onClick={() => setShippingMethod('local-same-day')}
                  className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                    shippingMethod === 'local-same-day'
                      ? 'bg-blue-50/70 border-blue-600 text-blue-950 shadow-2xs ring-1 ring-blue-600'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{language === 'yi' ? 'לאקאלע קוריער' : 'Local Courier'}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {rawSubtotal > 100 ? (language === 'yi' ? 'בחינם (העכער $100)' : 'Free over $100') : '$9.99 (Same-Day)'}
                  </div>
                </button>

                {/* Economy */}
                <button
                  type="button"
                  onClick={() => setShippingMethod('economy-ship')}
                  className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                    shippingMethod === 'economy-ship'
                      ? 'bg-blue-50/70 border-blue-600 text-blue-950 shadow-2xs ring-1 ring-blue-600'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{language === 'yi' ? 'עקאנאמישע שיקונג' : 'Economy Shipping'}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {rawSubtotal > 75 ? (language === 'yi' ? 'בחינם (העכער $75)' : 'Free over $75') : '$5.99 (2-3 Days)'}
                  </div>
                </button>

                {/* Neighborhood Dropoff */}
                <button
                  type="button"
                  onClick={() => setShippingMethod('group-dropoff')}
                  className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                    shippingMethod === 'group-dropoff'
                      ? 'bg-blue-50/70 border-blue-600 text-blue-950 shadow-2xs ring-1 ring-blue-600'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{language === 'yi' ? 'קהילה גרופע אָפנאם' : 'Group Shul Drop-off'}</div>
                  <div className="text-[11px] text-slate-500 mt-1">$2.99 ({language === 'yi' ? 'אין לאקאלע שול' : 'At local Shul'})</div>
                </button>
              </div>

              {/* Shabbos Schedule Delivery Option */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300/80 text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span>{t.shabbosDeliveryPreference}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="scheduleWindow"
                      checked={scheduledDay === 'friday-early'}
                      onChange={() => setScheduledDay('friday-early')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>{language === 'yi' ? 'פרייטאג אינדערפרי (ביז 1:00 נאכמיטאג)' : 'Friday Morning (Before 1:00 PM)'}</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="scheduleWindow"
                      checked={scheduledDay === 'sunday-morning'}
                      onChange={() => setScheduledDay('sunday-morning')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>{language === 'yi' ? 'זונטאג אינדערפרי (נאך שבת)' : 'Sunday Morning (Post-Shabbos Safe)'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Tzedakah Round-Up Integration */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/80 to-amber-50/60 border border-rose-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs sm:text-sm">
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  <span>{t.tzedakahRoundup}</span>
                </div>
                {roundupChange > 0 && (
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-rose-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableRoundup}
                      onChange={(e) => setEnableRoundup(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>+{roundupChange.toFixed(2)} {language === 'yi' ? 'צענטן' : 'cents'}</span>
                  </label>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {t.tzedakahDescription}
              </p>

              {/* Charity Select */}
              <div className="grid grid-cols-2 gap-2">
                {mockCharities.slice(0, 4).map((charity) => {
                  const isSelected = selectedCharity.id === charity.id;
                  return (
                    <button
                      key={charity.id}
                      type="button"
                      onClick={() => setSelectedCharity(charity)}
                      className={`p-2 rounded-xl text-xs font-semibold border text-start transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="truncate">{language === 'yi' ? charity.nameYi : charity.nameEn}</div>
                    </button>
                  );
                })}
              </div>

              {/* Extra donation buttons */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="text-slate-600 font-medium">{language === 'yi' ? 'צוגאב:' : 'Add:'}</span>
                {[0, 1, 3, 5, 18].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setExtraDonation(amt)}
                    className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                      extraDonation === amt
                        ? 'bg-rose-700 text-white border-rose-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {amt === 0 ? 'None' : `$${amt}${amt === 18 ? ' (חי)' : ''}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Payout & Totals Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-slate-900">${rawSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t.shipping}</span>
                <span className="font-semibold text-slate-900">
                  {shippingCost === 0 ? (language === 'yi' ? 'בחינם' : 'Free') : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              {totalTzedakah > 0 && (
                <div className="flex justify-between text-rose-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{language === 'yi' ? 'צדקה פאר' : 'Tzedakah for'} {language === 'yi' ? selectedCharity.nameYi : selectedCharity.nameEn}</span>
                  </span>
                  <span>+${totalTzedakah.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-black text-slate-900 text-base">
                <span>{language === 'yi' ? 'סך הכל באצאלן' : 'Total Amount'}</span>
                <span className="text-xl text-[#0B192C]">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handlePlaceOrder}
              disabled={isCheckingOut}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0B192C] to-[#1E3A8A] hover:from-[#1E3A8A] hover:to-[#0B192C] text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isCheckingOut ? (
                <span className="animate-pulse">{language === 'yi' ? 'באשטעטיגט די באצאלונג...' : 'Processing Payment...'}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t.placeOrder} (${grandTotal.toFixed(2)})</span>
                  <ArrowIcon className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
