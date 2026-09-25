import React from 'react';
import {
  Armchair,
  Briefcase,
  Car,
  ChevronLeft,
  Home,
  Shirt,
  Smartphone,
  Sparkles,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { Category, ScreenTab } from '../types';

interface CategoriesScreenProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  onNavigate: (tab: ScreenTab) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  categories,
  onSelectCategory,
  onNavigate,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'real-estate':
        return <Home className="w-6 h-6" />;
      case 'vehicles':
        return <Car className="w-6 h-6" />;
      case 'services':
        return <Wrench className="w-6 h-6" />;
      case 'projects':
        return <TrendingUp className="w-6 h-6" />;
      case 'electronics':
        return <Smartphone className="w-6 h-6" />;
      case 'home-furniture':
        return <Armchair className="w-6 h-6" />;
      case 'jobs':
        return <Briefcase className="w-6 h-6" />;
      case 'fashion':
        return <Shirt className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      <div className="text-right">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">أقسام وتصنيفات سوق المغرب</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          اختر القسم الذي يناسب اهتمامك لتصفح آلاف العروض والخدمات المتاحة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-5 hover:border-emerald-500/80 hover:shadow-sm transition-all"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  {getIcon(category.id)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{category.nameAr}</h3>
                  <span className="text-xs text-slate-400 font-sans">{category.nameFr}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectCategory(category.id);
                  onNavigate('ads');
                }}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50/70 px-3 py-1.5 rounded-xl transition-colors"
              >
                <span>تصفح الكل</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Subcategories list as quick interactive buttons */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                الأقسام الأكثر طلباً:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {category.subcategories.map((sub, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectCategory(category.id);
                      onNavigate('ads');
                    }}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs rounded-xl border border-slate-200/60 transition-colors text-right"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
