export type Language = 'yi' | 'en';

export type KosherAgency = 
  | 'Hisachdus' // התאחדות הרבנים (CRC)
  | 'Satmar-KJ' // קהל יטב לב ד'סאטמאר קרית יואל
  | 'Satmar-Wmsbg' // קהל יטב לב וויליאמסבורג
  | 'Nirbator' // נירבאטאר - הגה"צ מנירבאטאר
  | 'Krasna' // קראסנא
  | 'Volove' // וואלאווע
  | 'Belz' // בעלזא מחזיקי הדת
  | 'OU' // Orthodox Union Glatt
  | 'Eida-Charedis' // העדה החרדית ירושלים
  | 'CRC-Chicago'; // Central Rabbinical Council

export type ProductCategory = 
  | 'kosher-food' // כשרע עסנווארג
  | 'judaica' // תשמישי קדושה ויודאיקא
  | 'clothing' // היימישע קליידער & בגדי שבת
  | 'books-seforim' // ספרים און ביכער
  | 'home-goods' // הויז געצייג
  | 'holiday-bundles'; // יום טוב & שמחה פעקלעך

export type StorageType = 'ambient' | 'chilled' | 'frozen';

export interface ProductVariant {
  id: string;
  nameEn: string;
  nameYi: string;
  priceDelta: number;
  sku: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  commentEn: string;
  commentYi: string;
  date: string;
  verifiedBuyer: boolean;
  kosherFeedback?: string;
}

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  titleEn: string;
  titleYi: string;
  descriptionEn: string;
  descriptionYi: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  imageUrl: string;
  kosherAgency: KosherAgency;
  kosherMehadrin: boolean;
  kosherNotesEn?: string;
  kosherNotesYi?: string;
  inStock: boolean;
  stockCount: number;
  storageType: StorageType;
  fulfillmentType: 'FBA' | 'VendorDirect';
  deliveryOptions: ('local-same-day' | 'economy-ship' | 'group-dropoff')[];
  rating: number;
  reviewCount: number;
  variants?: ProductVariant[];
  tags: string[];
  reviews: Review[];
  isHolidayFeatured?: boolean;
}

export interface Vendor {
  id: string;
  nameEn: string;
  nameYi: string;
  taglineEn: string;
  taglineYi: string;
  location: string;
  rating: number;
  salesCount: number;
  logo: string;
  bannerImage: string;
  categories: ProductCategory[];
  hechsherPartners: KosherAgency[];
  fbaSubscribed: boolean;
  joinedYear: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Charity {
  id: string;
  nameEn: string;
  nameYi: string;
  descriptionEn: string;
  descriptionYi: string;
  logo: string;
  category: 'food' | 'medical' | 'poverty' | 'simchos';
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tzedakahAmount: number;
  charityId?: string;
  total: number;
  status: 'Received' | 'Warehouse Processing' | 'Out for Local Courier' | 'Delivered' | 'Paused for Shabbos';
  scheduledDeliveryTime: string;
  isShabbosSafe: boolean;
  trackingNumber: string;
  shippingMethod: 'local-same-day' | 'economy-ship' | 'group-dropoff';
  address: string;
  recipientName: string;
}

export interface ZmanimLocation {
  id: string;
  nameEn: string;
  nameYi: string;
  candleLighting: string;
  shabbosEnds: string;
  isCurrentlyShabbos: boolean;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language: Language;
  timestamp: string;
  suggestedProducts?: string[]; // product IDs
}
