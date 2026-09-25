import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Search as SearchIcon,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { Ad, Category, MoroccanCity } from '../types';
import { AdCard } from '../components/AdCard';
import { MOROCCAN_CITIES } from '../data/mockData';

interface SearchScreenProps {
  ads: Ad[];
  categories: Category[];
  initialQuery?: string;
  selectedCity: MoroccanCity;
  onSelectCity: (city: MoroccanCity) => void;
  favorites: string[];
  onToggleFavorite: (adId: string) => void;
  onSelectAd: (ad: Ad) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  ads,
  categories,
  initialQuery = '',
  selectedCity,
  onSelectCity,
  favorites,
  onToggleFavorite,
  onSelectAd,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCat, setSelectedCat] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Dacia Sandero',
    'TMAX 530',
    'شقق للكراء بالمعاريف',
    'عربة قهوة متنقلة',
  ]);

  const popularKeywords = [
    'كليو 5',
    'برطمة في مراكش',
    'صباغ محترف',
    'iPhone 15 Pro Max',
    'محل تجاري للتقبيل',
    'صالون مغربي عصري',
    'دراجة نارية',
    'سخانات ماء وسباك',
  ];

  const handleSelectKeyword = (kw: string) => {
    setQuery(kw);
    if (!recentSearches.includes(kw)) {
      setRecentSearches((prev) => [kw, ...prev.slice(0, 5)]);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  // Filter ads based on search query
  const searchResults = ads.filter((ad) => {
    if (selectedCity !== 'الكل' && ad.city !== selectedCity) return false;
    if (selectedCat && ad.categoryId !== selectedCat) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase();
    const matchTitle = ad.title.toLowerCase().includes(q);
    const matchDesc = ad.description.toLowerCase().includes(q);
    const matchCity = ad.city.toLowerCase().includes(q);
    const matchNeighborhood = ad.neighborhood.toLowerCase().includes(q);
    const matchSubCat = ad.subCategory ? ad.subCategory.toLowerCase().includes(q) : false;

    return matchTitle || matchDesc || matchCity || matchNeighborhood || matchSubCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Search Input Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="relative">
          <SearchIcon className="w-5 h-5 text-emerald-600 absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن أي شيء في سوق المغرب..."
            className="w-full pr-12 pl-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
            autoFocus
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {/* City select */}
          <select
            value={selectedCity}
            onChange={(e) => onSelectCity(e.target.value as MoroccanCity)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            {MOROCCAN_CITIES.map((c) => (
              <option key={c} value={c}>
                المدينة: {c}
              </option>
            ))}
          </select>

          {/* Category select */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="">جميع الأقسام</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameAr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Popular keywords tags when query is short */}
      {!query && (
        <div className="space-y-4">
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>عمليات البحث الأخيرة:</span>
                </span>
                <button
                  onClick={() => setRecentSearches([])}
                  className="text-[11px] text-slate-400 hover:text-rose-500"
                >
                  مسح السجل
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectKeyword(item)}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs rounded-xl border border-slate-200/60"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular searches in Morocco */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mb-2.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
              <span>الكلمات الأكثر بحثاً في المغرب الآن:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {popularKeywords.map((kw, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectKeyword(kw)}
                  className="px-3 py-1.5 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 text-xs font-medium rounded-xl border border-emerald-100 transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {query ? `نتائج البحث عن "${query}"` : 'كل الإعلانات المتاحة'}:{' '}
          <strong className="text-slate-800 font-mono">{searchResults.length}</strong> إعلان
        </span>
      </div>

      {/* Results Grid */}
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {searchResults.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              isFavorite={favorites.includes(ad.id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectAd}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <span className="text-4xl block mb-2">🔍</span>
          <h3 className="text-sm font-bold text-slate-800 mb-1">لم نجد نتائج مطابقة لبحثك</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            تأكد من كتابة الكلمة بشكل صحيح، أو جرب اختيار "كل المدن" لعرض نتائج أوسع في المغرب.
          </p>
        </div>
      )}
    </div>
  );
};
