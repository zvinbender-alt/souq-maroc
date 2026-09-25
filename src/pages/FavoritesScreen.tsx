import React from 'react';
import { Bookmark, ShoppingBag, Trash2 } from 'lucide-react';
import { Ad, ScreenTab } from '../types';
import { AdCard } from '../components/AdCard';

interface FavoritesScreenProps {
  ads: Ad[];
  favorites: string[];
  onToggleFavorite: (adId: string) => void;
  onSelectAd: (ad: Ad) => void;
  onNavigate: (tab: ScreenTab) => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  ads,
  favorites,
  onToggleFavorite,
  onSelectAd,
  onNavigate,
}) => {
  const favoriteAds = ads.filter((ad) => favorites.includes(ad.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">إعلاناتك المفضلة</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            العروض والهميزات التي قمت بحفظها للرجوع إليها في أي وقت
          </p>
        </div>
        {favoriteAds.length > 0 && (
          <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-3 py-1 rounded-xl font-mono">
            {favoriteAds.length} إعلانات محفوظة
          </span>
        )}
      </div>

      {favoriteAds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoriteAds.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectAd}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">قائمة المفضلة فارغة حالياً</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            انقر على أيقونة الحفظ (الإشارة المرجعية) في أي إعلان يعجبك لتجده محفوظاً هنا بكل سهولة.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('ads')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              تصفح أحدث الهميزات
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
