import React, { useState } from 'react';
import { 
  Truck, 
  Snowflake, 
  Box, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  BarChart3, 
  RefreshCw,
  Search
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface WmsTrackingViewProps {
  language: Language;
}

export const WmsTrackingView: React.FC<WmsTrackingViewProps> = ({ language }) => {
  const t = translations[language];

  const [activeZone, setActiveZone] = useState<'all' | 'frozen' | 'chilled' | 'ambient'>('all');
  const [trackingInput, setTrackingInput] = useState('HM-778201');
  const [searchedOrder, setSearchedOrder] = useState<any>({
    trackingNumber: 'HM-778201',
    destination: 'Williamsburg, Brooklyn (Bedford Ave)',
    recipient: 'Yoel Gross',
    status: 'Out for Local Courier Delivery',
    items: [
      { name: 'Glatt Kosher Prime Ribeye (Hisachdus)', temp: 'Frozen (-18°C)', status: 'Verified' },
      { name: 'Handmade Water Challahs (Krasna)', temp: 'Ambient (20°C)', status: 'Fresh Packed' },
      { name: 'Hungarian Chocolate Kokosh Cake', temp: 'Chilled (3°C)', status: 'Cold Chain Checked' }
    ],
    temperatureHistory: 'Constant 2.4°C verified by IoT cold-sensor #SN-881',
    eta: 'Today by 3:30 PM (Guaranteed before Shabbos candle lighting)',
    shabbosCompliance: 'Passed: 2h 15m safety margin prior to Plag HaMincha'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>{language === 'yi' ? 'היימיש עקספרעס פולפילמענט נעטווארק (FBA)' : 'Heimish Express Fulfillment & WMS Network'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'yi' ? 'קעלט-קייט פולפילמענט & לאקאלע קוריער פלאטע' : 'Cold-Chain Warehousing & Local Courier Logistics'}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            {language === 'yi'
              ? 'געבויט אויפ׳ן מאדעל פון עמעזאן FBA מיט ספעציעלע כשרות משגיחים און קלימאט-קאנטראלירטע זאנעס פאר פארפרוירענע מהדרין פלייש, פרישע חלות, און היימישע סאלאטן.'
              : 'Multi-tiered storage with dedicated Glatt Kosher mashgiach stations, real-time IoT temperature sensors, and rapid same-day refrigerated vans.'}
          </p>
        </div>

        {/* Live Warehouse Telemetry */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-2 text-xs text-white">
          <div className="flex items-center justify-between gap-6 pb-1 border-b border-white/10">
            <span className="text-slate-300">{language === 'yi' ? 'לאגער צענטער:' : 'Central Hub:'}</span>
            <span className="font-bold text-amber-300">Monsey & Maspeth Hubs</span>
          </div>
          <div className="flex items-center justify-between gap-6 pb-1 border-b border-white/10">
            <span className="text-slate-300">{language === 'yi' ? 'אקטיווע קוריערן:' : 'Active Fleet:'}</span>
            <span className="font-bold text-emerald-400">38 Refrigerated Vans</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-slate-300">{language === 'yi' ? 'כשרות אינספעקציע:' : 'Kosher Seal Audit:'}</span>
            <span className="font-bold text-white">100% Verified</span>
          </div>
        </div>
      </div>

      {/* 3 Temperature Storage Zones Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Frozen Zone */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 uppercase flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-blue-600" />
              <span>{language === 'yi' ? 'זאנע 1: פארפרוירן (Frozen)' : 'Zone 1: Deep Frozen'}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
              -18°C / 0°F
            </span>
          </div>
          <div className="text-lg font-black text-slate-900">
            {language === 'yi' ? 'מהדרין גלאט פלייש & עופות' : 'Glatt Kosher Meats & Poultry'}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'yi'
              ? 'אפגעטיילטע חסידישע שחיטה אפטיילונג מיט ספעציעלע סימנים און חותם בתוך חותם פאר יעדן פעקל.'
              : 'Dedicated Hasidic shechita section with tamper-evident Chosam B\'soch Chosam double-seal validation.'}
          </p>
        </div>

        {/* Chilled Perishables */}
        <div className="bg-white p-5 rounded-2xl border border-cyan-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-900 uppercase flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-cyan-600" />
              <span>{language === 'yi' ? 'זאנע 2: אפגעקילט (Chilled)' : 'Zone 2: Chilled Cold Chain'}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[11px] font-bold">
              3°C / 37°F
            </span>
          </div>
          <div className="text-lg font-black text-slate-900">
            {language === 'yi' ? 'געבעקס, סאלאטן & מילכיגס' : 'Bakery, Dips & Cholov Yisroel'}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'yi'
              ? 'פרישע שבתדיגע סאלאטן, קאקאש קעיקס, און הערינג געפאקט אין פארזיגלטע קעלט-קאנטיינערס.'
              : 'Fresh Shabbos salads, kokosh cakes, and herring shipped in insulated reusable thermal totes.'}
          </p>
        </div>

        {/* Ambient Dry Goods */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
              <Box className="w-4 h-4 text-amber-600" />
              <span>{language === 'yi' ? 'זאנע 3: טרוקן (Ambient)' : 'Zone 3: Ambient Dry Goods'}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
              21°C / 70°F
            </span>
          </div>
          <div className="text-lg font-black text-slate-900">
            {language === 'yi' ? 'זילבער, ספרים & בעקישעס' : 'Silver Judaica, Seforim & Attire'}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'yi'
              ? 'ספעציעלע זיכערע שפייכלער פאר ריינעם 925 זילבער, חומשים, און חסידישע קליידער.'
              : 'High-security climate-controlled vault for sterling silver Kiddush cups, leather seforim, and silk Bekishes.'}
          </p>
        </div>
      </div>

      {/* Real-time Order Tracking Simulator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {language === 'yi' ? 'באשטעלונג טרעקינג & קעלט-קייט סענסאר' : 'Live Order Tracking & Cold-Chain Sensor'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'yi' ? 'לייגט אריין אייער טרעקינג נומער:' : 'Enter your tracking code:'}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              placeholder="e.g. HM-778201"
            />
            <button
              onClick={() => {}}
              className="px-4 py-2 bg-[#0B192C] text-white rounded-xl text-xs font-bold hover:bg-[#1E3A8A] cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {searchedOrder && (
          <div className="space-y-6">
            {/* Tracking Progress */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-emerald-950 text-sm">
                    {searchedOrder.status}
                  </div>
                  <div className="text-xs text-emerald-800">
                    {searchedOrder.destination} • {searchedOrder.recipient}
                  </div>
                </div>
              </div>

              <div className="text-end">
                <div className="text-xs font-bold text-slate-700">
                  {searchedOrder.eta}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 justify-end mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{searchedOrder.shabbosCompliance}</span>
                </div>
              </div>
            </div>

            {/* Items inside with temperature check */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {language === 'yi' ? 'ארטיקלען אין פעקל:' : 'Consolidated Package Items:'}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {searchedOrder.items.map((item: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-slate-500">{item.temp}</div>
                    <div className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Snowflake className="w-4 h-4 text-blue-600" />
                <span><strong>IoT Telemetry:</strong> {searchedOrder.temperatureHistory}</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700">Audit Passed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
