import React from 'react';
import { Bell, LogIn, MapPin, Plus, Search, Sparkles, User as UserIcon } from 'lucide-react';
import { MoroccanCity, ScreenTab } from '../types';
import { MOROCCAN_CITIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentTab: ScreenTab;
  onNavigate: (tab: ScreenTab) => void;
  selectedCity: MoroccanCity;
  onSelectCity: (city: MoroccanCity) => void;
  onOpenNotifications: () => void;
  unreadCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  selectedCity,
  onSelectCity,
  onOpenNotifications,
  unreadCount,
}) => {
  const [showCityMenu, setShowCityMenu] = React.useState(false);
  const { currentUser, userProfile, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-right group focus:outline-none"
            aria-label="الرئيسية"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              🇲🇦
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans block leading-none">
                سوق<span className="text-emerald-600">.المغرب</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                هميزات وفرص المغرب
              </span>
            </div>
          </button>

          {/* Quick Moroccan City Selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowCityMenu(!showCityMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{selectedCity}</span>
            </button>

            {showCityMenu && (
              <div
                className="absolute right-0 mt-2 w-48 max-h-72 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setShowCityMenu(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-100 mb-1">
                  اختر مدينتك بالمغرب
                </div>
                {MOROCCAN_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => onSelectCity(city)}
                    className={`w-full text-right px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                      selectedCity === city
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors hover:text-emerald-700 ${
              currentTab === 'home' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => onNavigate('ads')}
            className={`transition-colors hover:text-emerald-700 ${
              currentTab === 'ads' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            تصفح الإعلانات
          </button>
          <button
            onClick={() => onNavigate('categories')}
            className={`transition-colors hover:text-emerald-700 ${
              currentTab === 'categories' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            التصنيفات
          </button>
          <button
            onClick={() => onNavigate('services')}
            className={`transition-colors hover:text-emerald-700 flex items-center gap-1 ${
              currentTab === 'services' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            <span>حرفيين وخدمات</span>
          </button>
          <button
            onClick={() => onNavigate('projects')}
            className={`transition-colors hover:text-emerald-700 flex items-center gap-1 ${
              currentTab === 'projects' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>أفكار مشاريع</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton variant="compact" />

          {/* Quick Search Button */}
          <button
            onClick={() => onNavigate('search')}
            className="w-10 h-10 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
            title="بحث في الإعلانات"
            aria-label="بحث"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
            title="الإشعارات"
            aria-label="الإشعارات"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </button>

          {/* User Account / Login Button */}
          {currentUser ? (
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
              title="الملف الشخصي"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold">
                {userProfile?.name?.charAt(0) || currentUser.displayName?.charAt(0) || 'م'}
              </div>
              <span className="hidden md:inline max-w-[90px] truncate">
                {userProfile?.name || currentUser.displayName || 'حسابي'}
              </span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
            >
              <LogIn className="w-4 h-4 text-emerald-600" />
              <span>دخول / تسجيل</span>
            </button>
          )}

          {/* Primary CTA (Add Ad) */}
          <button
            onClick={() => onNavigate('add-ad')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 shadow-sm active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>أضف إعلانك</span>
          </button>
        </div>
      </div>
    </header>
  );
};
