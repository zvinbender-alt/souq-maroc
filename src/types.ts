export type MoroccanCity =
  | 'الكل'
  | 'الدار البيضاء'
  | 'الرباط'
  | 'مراكش'
  | 'طنجة'
  | 'فاس'
  | 'أكادير'
  | 'مكناس'
  | 'وجدة'
  | 'القنيطرة'
  | 'تطوان'
  | 'تمارة'
  | 'الجديدة'
  | 'الصويرة'
  | 'آسفي'
  | 'الناظور'
  | 'العيون'
  | 'المحمدية';

export interface Category {
  id: string;
  nameAr: string;
  nameFr: string;
  iconName: string;
  count: number;
  color: string;
  subcategories: string[];
}

export interface Seller {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  city: string;
  avatar?: string;
  isVerified: boolean;
  memberSince: string;
  rating: number;
  reviewsCount: number;
  totalListings: number;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number; // in MAD (درهم مغربي)
  isNegotiable: boolean;
  categoryId: string;
  subCategory?: string;
  city: MoroccanCity;
  neighborhood: string;
  date: string;
  images: string[];
  seller: Seller;
  condition: 'جديد' | 'مستعمل كأنه جديد' | 'مستعمل بحالة جيدة' | 'غير محدد';
  isFeatured?: boolean;
  viewsCount: number;
  status?: 'active' | 'sold';
  specs?: Record<string, string>;
}

export interface ServiceProvider {
  id: string;
  name: string;
  profession: string;
  professionId: string;
  city: MoroccanCity;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  phone: string;
  whatsapp: string;
  avatar: string;
  isVerified: boolean;
  startingPriceMAD?: number;
  hourlyRateMAD?: number;
  skills: string[];
  description: string;
  portfolioImages: string[];
  availability: 'متاح اليوم' | 'متاح هذا الأسبوع' | 'حسب الموعد';
}

export interface ProjectIdea {
  id: string;
  title: string;
  tagline: string;
  category: string;
  capitalMinMAD: number;
  capitalMaxMAD: number;
  expectedProfitability: string;
  difficultyLevel: 'سهل للمبتدئين' | 'متوسط' | 'يتطلب خبرة';
  timelineMonths: number;
  overview: string;
  targetAudience: string;
  requiredEquipment: string[];
  successSteps: string[];
  moroccanMarketTips: string;
  image: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  city: MoroccanCity;
  neighborhood: string;
  bio: string;
  avatar: string;
  isVerified: boolean;
  memberSince: string;
}

export type ScreenTab =
  | 'home'
  | 'categories'
  | 'ads'
  | 'add-ad'
  | 'projects'
  | 'services'
  | 'search'
  | 'favorites'
  | 'profile';
