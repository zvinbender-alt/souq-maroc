import React from 'react';
import {
  ArrowLeft,
  Briefcase,
  Car,
  Home as HomeIcon,
  Search,
  Sparkles,
  Smartphone,
  TrendingUp,
  Wrench,
  ShieldCheck,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  Shirt,
  Armchair,
  ShoppingBag,
} from 'lucide-react';
import { Ad, Category, MoroccanCity, ProjectIdea, ScreenTab, ServiceProvider } from '../types';
import { AdCard } from '../components/AdCard';
import { PWAInstallButton } from '../components/PWAInstallButton';

interface HomeScreenProps {
  ads: Ad[];
  categories: Category[];
  services: ServiceProvider[];
  projectIdeas: ProjectIdea[];
  selectedCity: MoroccanCity;
  favorites: string[];
  onToggleFavorite: (adId: string) => void;
  onSelectAd: (ad: Ad) => void;
  onSelectService: (service: ServiceProvider) => void;
  onSelectProject: (project: ProjectIdea) => void;
  onNavigate: (tab: ScreenTab) => void;
  onSelectCategory: (categoryId: string) => void;
  onSearchQuery: (query: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  ads,
  categories,
  services,
  projectIdeas,
  selectedCity,
  favorites,
  onToggleFavorite,
  onSelectAd,
  onSelectService,
  onSelectProject,
  onNavigate,
  onSelectCategory,
  onSearchQuery,
}) => {
  const [searchInput, setSearchInput] = React.useState('');
  const [activeTabFilter, setActiveTabFilter] = React.useState<'all' | 'vehicles' | 'real-estate' | 'electronics' | 'jobs'>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchQuery(searchInput);
      onNavigate('search');
    }
  };

  // Filter ads by city if specific city selected
  const cityFilteredAds = selectedCity === 'الكل'
    ? ads
    : ads.filter((ad) => ad.city === selectedCity);

  const featuredAds = cityFilteredAds.filter((ad) => ad.isFeatured).slice(0, 4);

  const latestAds = (activeTabFilter === 'all'
    ? cityFilteredAds
    : cityFilteredAds.filter((ad) => ad.categoryId === activeTabFilter)
  ).slice(0, 8);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'real-estate':
        return <HomeIcon className="w-5 h-5" />;
      case 'vehicles':
        return <Car className="w-5 h-5" />;
      case 'services':
        return <Wrench className="w-5 h-5" />;
      case 'projects':
        return <TrendingUp className="w-5 h-5" />;
      case 'electronics':
        return <Smartphone className="w-5 h-5" />;
      case 'jobs':
        return <Briefcase className="w-5 h-5" />;
      case 'home-furniture':
        return <Armchair className="w-5 h-5" />;
      case 'fashion':
        return <Shirt className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Search Header Bar in Home */}
      <section className="bg-gradient-to-b from-emerald-800 via-emerald-800 to-teal-900 text-white pt-7 pb-11 px-4 sm:px-6 rounded-b-[2.5rem] shadow-sm relative overflow-hidden">
        {/* Subtle Moroccan geometric background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-emerald-100 mb-3">
            <span>🇲🇦</span>
            <span>المنصة المغربية الشاملة للإعلانات، الخدمات، وهمزات المشاريع</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            كل ما تبحث عنه في المغرب، في مكان واحد
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto mb-6">
            عقارات، سيارات، إلكترونيات، وظائف، حرفيين موثوقين، وأفكار مشاريع مربحة.
          </p>

          {/* Search Box with working submission */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto relative flex items-center bg-white rounded-2xl shadow-xl p-1.5 transition-all focus-within:ring-4 focus-within:ring-emerald-400/30"
          >
            <div className="pr-3 text-slate-400">
              <Search className="w-5 h-5 text-emerald-700" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث عن: شقة للكراء، رينو كليو، آيفون 16، صباغ، وظيفة، عربة قهوة..."
              className="w-full py-2.5 px-2 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none bg-transparent text-right"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all active:scale-95 whitespace-nowrap"
            >
              بحث
            </button>
          </form>

          {/* Quick search keywords */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-emerald-100/80 flex-wrap">
            <span className="font-semibold text-white">الأكثر طلباً:</span>
            {['شقق كراء كازا', 'Dacia Sandero', 'Golf 8', 'iPhone 16 Pro', 'وظائف مطاعم', 'عربة قهوة'].map((kw) => (
              <button
                key={kw}
                onClick={() => {
                  onSearchQuery(kw);
                  onNavigate('search');
                }}
                className="hover:text-white hover:underline transition-colors text-[11px]"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PWA In-App Install Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <PWAInstallButton variant="banner" />
      </div>

      {/* Main Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">تصفح حسب التصنيف</h2>
            <p className="text-xs text-slate-500">اختر القسم للوصول الفوري للعروض</p>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>عرض الكل</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2.5 sm:gap-3.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                onNavigate('ads');
              }}
              className="flex flex-col items-center p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-xs transition-all group text-center min-h-[96px] justify-center"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-700 flex items-center justify-center mb-2 transition-colors">
                {getCategoryIcon(cat.id)}
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-800 leading-tight group-hover:text-emerald-700">
                {cat.nameAr}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Deals (هميزات اليوم) */}
      {featuredAds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">هميزات اليوم المميزة</h2>
                <p className="text-xs text-slate-500">أفضل العروض والفرص الحصرية بالمغرب</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('ads')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>المزيد</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredAds.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                isFavorite={favorites.includes(ad.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectAd}
              />
            ))}
          </div>
        </section>
      )}

      {/* Interactive Project Ideas Teaser Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-md">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="max-w-xl text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-purple-200 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>ركن المقاول الذكي والهمزات التجارية بالمغرب</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                باغي تبدا مشروعك الخاص في المغرب؟
              </h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-4">
                تصفح دراسات مبسطة لأفكار مشاريع مربحة تبدأ من 12,000 درهم مع خطوات التنفيذ وسر النجاح في السوق المغربي.
              </p>
              <button
                onClick={() => onNavigate('projects')}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow transition-all active:scale-95 inline-flex items-center gap-1.5"
              >
                <span>استكشف أفكار المشاريع الآن</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Cards of 2 projects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
              {projectIdeas.slice(0, 2).map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 cursor-pointer transition-all text-right max-w-xs"
                >
                  <span className="text-[10px] text-amber-300 font-bold block mb-1">
                    {proj.category}
                  </span>
                  <h4 className="text-xs font-bold line-clamp-1 text-white">{proj.title}</h4>
                  <span className="text-[11px] text-emerald-300 font-mono font-bold mt-1 block">
                    رأس المال: {new Intl.NumberFormat('fr-MA').format(proj.capitalMinMAD)} DH
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Moroccan Local Artisans & Services Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">حرفيين وخدمات موثوقة بالمغرب</h2>
            <p className="text-xs text-slate-500">صباغة، سباكة، كهرباء، ونقل أثاث مع فحص الهوية والتقييمات الحقيقية</p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>كل الحرفيين</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.slice(0, 4).map((srv) => (
            <div
              key={srv.id}
              onClick={() => onSelectService(srv)}
              className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={srv.avatar}
                    alt={srv.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{srv.name}</h4>
                    <span className="text-[11px] text-emerald-700 font-medium block">
                      {srv.profession}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    {srv.city}
                  </span>
                  <span>·</span>
                  <span className="font-semibold text-amber-500">★ {srv.rating}</span>
                  <span className="text-[10px]">({srv.reviewCount} تقييم)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  يبدأ من <span className="font-bold text-slate-900">{srv.startingPriceMAD || 50} DH</span>
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                  طلب تدخل
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Ads Section with Tabs (All, Vehicles, Real Estate, Electronics, Jobs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">أحدث الإعلانات المضافة</h2>
            <p className="text-xs text-slate-500">عروض متجددة على مدار الساعة في جميع المدن</p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'vehicles', label: 'سيارات' },
              { id: 'real-estate', label: 'عقارات' },
              { id: 'electronics', label: 'إلكترونيات' },
              { id: 'jobs', label: 'وظائف' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabFilter(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTabFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestAds.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              isFavorite={favorites.includes(ad.id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectAd}
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('ads')}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
          >
            تصفح جميع الإعلانات ({ads.length})
          </button>
        </div>
      </section>

      {/* Safety & Trust Promise */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-100/80 rounded-3xl p-6 border border-slate-200/70 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                معاملات آمنة وموثوقة 100% في المغرب
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1 max-w-xl">
                نحرص على أمان مستخدمينا: التحقق من أرقام الهواتف المغربية، حظر الحسابات الوهمية فورياً، وإرشادات واضحة للتعامل باليد وجهاً لوجه بدون مخاطر.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            نصائح السلامة
          </button>
        </div>
      </section>
    </div>
  );
};
