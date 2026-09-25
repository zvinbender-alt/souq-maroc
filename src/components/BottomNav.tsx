import React from 'react';
import { Bookmark, Grid, Home, Plus, User } from 'lucide-react';
import { ScreenTab } from '../types';

interface BottomNavProps {
  currentTab: ScreenTab;
  onNavigate: (tab: ScreenTab) => void;
  favoritesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  favoritesCount,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] lg:hidden">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-2">
        {/* 1. Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'home' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] mt-1">الرئيسية</span>
        </button>

        {/* 2. Categories */}
        <button
          onClick={() => onNavigate('categories')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'categories' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Grid className={`w-5 h-5 ${currentTab === 'categories' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] mt-1">التصنيفات</span>
        </button>

        {/* 3. Add Ad (Elevated Moroccan Action Button) */}
        <div className="flex items-center justify-center h-full">
          <button
            onClick={() => onNavigate('add-ad')}
            className={`flex flex-col items-center justify-center -translate-y-3 w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-all ${
              currentTab === 'add-ad' ? 'ring-4 ring-emerald-100 scale-105' : ''
            }`}
            aria-label="أضف إعلانك"
          >
            <Plus className="w-6 h-6 stroke-[2.75]" />
          </button>
        </div>

        {/* 4. Favorites */}
        <button
          onClick={() => onNavigate('favorites')}
          className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'favorites' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${currentTab === 'favorites' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] mt-1">المفضلة</span>
          {favoritesCount > 0 && (
            <span className="absolute top-2 right-4 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* 5. User Profile */}
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'profile' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] mt-1">حسابي</span>
        </button>
      </div>
    </div>
  );
};
