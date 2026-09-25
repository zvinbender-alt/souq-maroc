import React, { useState, useMemo } from 'react';
import {
  Filter,
  Grid as GridIcon,
  List,
  MapPin,
  RotateCcw,
  SlidersHorizontal,
  X,
  Search,
  Check,
} from 'lucide-react';
import { Ad, Category, MoroccanCity } from '../types';
import { AdCard } from '../components/AdCard';
import { MOROCCAN_CITIES } from '../data/mockData';

interface AdsScreenProps {
  ads: Ad[];
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  selectedCity: MoroccanCity;
  onSelectCity: (city: MoroccanCity) => void;
  favorites: string[];
  onToggleFavorite: (adId: string) => void;
  onSelectAd: (ad: Ad) => void;
}

export const AdsScreen: React.FC<AdsScreenProps> = ({
  ads,
  categories,
  selectedCategoryId,
  onSelectCategory,
  selectedCity,
  onSelectCity,
  favorites,
  onToggleFavorite,
  onSelectAd,
}) => {
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'priceAsc' | 'priceDesc'>('newest');
  const [keyword, setKeyword] = useState<string>('');
  const [conditionFilter, setConditionFilter] = useState<string>('all');

  // Filter and sort ads
  const filteredAds = useMemo(() => {
    return ads
      .filter((ad) => {
        // City filter
        if (selectedCity !== 'الكل' && ad.city !== selectedCity) return false;
        // Category filter
        if (selectedCategoryId && selectedCategoryId !== 'all' && ad.categoryId !== selectedCategoryId)
          return false;
        // Condition filter
        if (conditionFilter !== 'all' && ad.condition !== conditionFilter) return false;
        // Min price
        if (minPrice && ad.price < parseFloat(minPrice)) return false;
        // Max price
        if (maxPrice && ad.price > parseFloat(maxPrice)) return false;
        // Keyword search across title, description, neighborhood, and subcategory
        if (keyword.trim()) {
          const q = keyword.toLowerCase();
          const matchTitle = ad.title.toLowerCase().includes(q);
          const matchDesc = ad.description.toLowerCase().includes(q);
          const matchNeighborhood = ad.neighborhood.toLowerCase().includes(q);
          const matchSub = ad.subCategory ? ad.subCategory.toLowerCase().includes(q) : false;
          if (!matchTitle && !matchDesc && !matchNeighborhood && !matchSub) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        return 0; // Default order (newest)
      });
  }, [ads, selectedCity, selectedCategoryId, conditionFilter, minPrice, maxPrice, sortBy, keyword]);

  const handleResetFilters = () => {
    onSelectCity('الكل');
    onSelectCategory('');
    setMinPrice('');
    setMaxPrice('');
    setKeyword('');
    setConditionFilter('all');
    setSortBy('newest');
  };

  const hasActiveFilters =
    selectedCity !== 'الكل' ||
    selectedCategoryId !== '' ||
    conditionFilter !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    keyword !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="ابحث بالعنوان أو الكلمات (مثال: كليو، مفروشة، TMAX، مكيف، CDI...)"
              className="w-full pr-10 pl-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
            />
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                مسح
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {/* City Selector */}
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value as MoroccanCity)}
              className="text-xs bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-slate-700 focus:outline-none"
            >
              {MOROCCAN_CITIES.map((c) => (
                <option key={c} value={c}>
                  المدينة: {c}
                </option>
              ))}
            </select>

            {/* Category Selector */}
            <select
              value={selectedCategoryId}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-slate-700 focus:outline-none"
            >
              <option value="">كل التصنيفات</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameAr}
                </option>
              ))}
            </select>

            {/* Condition Selector */}
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-slate-700 focus:outline-none"
            >
              <option value="all">كل الحالات</option>
              <option value="جديد">جديد فقط</option>
              <option value="مستعمل كأنه جديد">مستعمل كأنه جديد</option>
              <option value="مستعمل بحالة جيدة">مستعمل بحالة جيدة</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-slate-700 focus:outline-none"
            >
              <option value="newest">الترتيب: الأحدث</option>
              <option value="priceAsc">السعر: الأقل أولاً</option>
              <option value="priceDesc">السعر: الأعلى أولاً</option>
            </select>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 px-2 py-2 flex items-center gap-1 font-medium whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
            )}
          </div>
        </div>

        {/* Secondary Price Filter Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-600 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-semibold">تحديد السعر (درهم DH):</span>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="الحد الأدنى"
              className="w-24 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
            <span>-</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="الحد الأقصى"
              className="w-24 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            النتائج: <strong className="text-slate-800">{filteredAds.length}</strong> إعلان
          </span>
        </div>
      </div>

      {/* Ads Grid */}
      {filteredAds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAds.map((ad) => (
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
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80">
          <span className="text-4xl block mb-2">🔍</span>
          <h3 className="text-base font-bold text-slate-900 mb-1">لا توجد إعلانات مطابقة لبحثك</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            جرب تغيير المدينة، مسح السعر أو اختيار تصنيف آخر للعثور على هميزات ممتازة.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700"
          >
            عرض جميع الإعلانات
          </button>
        </div>
      )}
    </div>
  );
};
