import React, { useState, useEffect } from 'react';
import { Ad, MoroccanCity, ProjectIdea, ScreenTab, ServiceProvider } from './types';
import {
  CATEGORIES,
  INITIAL_ADS,
  MOROCCAN_CITIES,
  PROJECT_IDEAS,
  SERVICE_PROVIDERS,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AdDetailModal } from './components/AdDetailModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AdSuccessModal } from './components/AdSuccessModal';
import { AuthModal } from './components/AuthModal';

import { AuthProvider, useAuth } from './context/AuthContext';
import {
  deleteAdInFirestore,
  subscribeToAds,
  subscribeToUserFavorites,
  toggleFavoriteInFirestore,
  updateAdInFirestore,
} from './firebase/adsService';

import { HomeScreen } from './pages/HomeScreen';
import { CategoriesScreen } from './pages/CategoriesScreen';
import { AdsScreen } from './pages/AdsScreen';
import { AddAdScreen } from './pages/AddAdScreen';
import { ProjectIdeasScreen } from './pages/ProjectIdeasScreen';
import { ServicesScreen } from './pages/ServicesScreen';
import { SearchScreen } from './pages/SearchScreen';
import { FavoritesScreen } from './pages/FavoritesScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { Smartphone, Monitor } from 'lucide-react';

function MarketplaceApp() {
  const { currentUser, openAuthModal } = useAuth();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<ScreenTab>('home');
  const [selectedCity, setSelectedCity] = useState<MoroccanCity>('الدار البيضاء');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mobile Device Mockup Frame toggle
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Firestore Real-Time Ads State
  const [ads, setAds] = useState<Ad[]>(INITIAL_ADS);

  // Favorites State (stored in Firestore per user, or locally if guest)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('souq_maroc_favorites');
      return saved ? JSON.parse(saved) : ['ad-1', 'ad-3', 'ad-5'];
    } catch {
      return ['ad-1', 'ad-3', 'ad-5'];
    }
  });

  // Modal inspection states
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceProvider | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectIdea | null>(null);
  const [createdAdSuccess, setCreatedAdSuccess] = useState<Ad | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'همزة جديدة في طنجة 🔥',
      body: 'تم إضافة سيارة رينو كليو 5 بسعر ممتاز في مالباطا طنجة.',
      time: 'منذ 15 دقيقة',
      type: 'deal' as const,
      isRead: false,
    },
    {
      id: 'notif-2',
      title: 'تخفيض في سعر شقة المعاريف 💰',
      body: 'قام كريم التازي بتخفيض الإيجار الشهري إلى 8,500 درهم.',
      time: 'منذ ساعتين',
      type: 'price-drop' as const,
      isRead: false,
    },
    {
      id: 'notif-3',
      title: 'قاعدة بيانات متصلة مع Cloud Firestore 🚀',
      body: 'جميع إعلاناتك ومفضلتك أصبحت محفوظة سحابياً في الوقت الفعلي.',
      time: 'الآن',
      type: 'system' as const,
      isRead: false,
    },
  ]);

  // Subscribe to real-time Firestore Ads
  useEffect(() => {
    const unsubscribe = subscribeToAds((firestoreAds) => {
      setAds(firestoreAds);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to real-time User Favorites in Firestore if logged in
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = subscribeToUserFavorites(currentUser.uid, (userFavs) => {
        setFavorites(userFavs);
        try {
          localStorage.setItem('souq_maroc_favorites', JSON.stringify(userFavs));
        } catch (e) {
          console.warn(e);
        }
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Toggle Favorite Handler
  const handleToggleFavorite = async (adId: string) => {
    const isFav = favorites.includes(adId);
    const updated = isFav ? favorites.filter((id) => id !== adId) : [...favorites, adId];
    setFavorites(updated);
    try {
      localStorage.setItem('souq_maroc_favorites', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    if (currentUser) {
      try {
        await toggleFavoriteInFirestore(currentUser.uid, adId, isFav);
      } catch (e) {
        console.error('Error updating favorite in Firestore', e);
      }
    }
  };

  // Add Ad local callback
  const handleAddAd = (newAd: Ad) => {
    setAds((prev) => [newAd, ...prev.filter((a) => a.id !== newAd.id)]);
  };

  // Mark all notifications as read
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      className="min-h-screen bg-slate-100 flex flex-col items-center justify-start text-right transition-all font-sans"
      dir="rtl"
    >
      {/* Device Frame Switcher Banner */}
      <div className="w-full bg-slate-900 text-slate-300 px-4 py-1.5 flex items-center justify-between text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-white">سوق المغرب · Souq Maroc</span>
          <span className="hidden sm:inline text-slate-400">| قاعدة بيانات Cloud Firestore ومصادقة حية</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg">
          <button
            onClick={() => setIsMobileFrame(false)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              !isMobileFrame ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">شاشة كاملة</span>
          </button>
          <button
            onClick={() => setIsMobileFrame(true)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              isMobileFrame ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>محاكاة أندرويد</span>
          </button>
        </div>
      </div>

      {/* Main App Container */}
      <div
        className={`w-full bg-slate-50 min-h-screen flex flex-col relative transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-md my-4 rounded-[42px] shadow-2xl border-[10px] border-slate-900 overflow-hidden ring-1 ring-slate-800'
            : 'max-w-full'
        }`}
      >
        {/* Top Header Bar */}
        <Header
          currentTab={currentTab}
          onNavigate={setCurrentTab}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          unreadCount={unreadCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full">
          {currentTab === 'home' && (
            <HomeScreen
              ads={ads}
              categories={CATEGORIES}
              services={SERVICE_PROVIDERS}
              projectIdeas={PROJECT_IDEAS}
              selectedCity={selectedCity}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectAd={setSelectedAd}
              onSelectService={setSelectedService}
              onSelectProject={setSelectedProject}
              onNavigate={setCurrentTab}
              onSelectCategory={(catId) => {
                setSelectedCategoryId(catId);
                setCurrentTab('ads');
              }}
              onSearchQuery={(q) => {
                setSearchQuery(q);
                setCurrentTab('search');
              }}
            />
          )}

          {currentTab === 'categories' && (
            <CategoriesScreen
              categories={CATEGORIES}
              onSelectCategory={(catId) => {
                setSelectedCategoryId(catId);
              }}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'ads' && (
            <AdsScreen
              ads={ads}
              categories={CATEGORIES}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectAd={setSelectedAd}
            />
          )}

          {currentTab === 'add-ad' && (
            <AddAdScreen
              categories={CATEGORIES}
              onAddAd={handleAddAd}
              onAdCreatedSuccess={(ad) => {
                setCreatedAdSuccess(ad);
              }}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectIdeasScreen
              projectIdeas={PROJECT_IDEAS}
              onSelectProject={setSelectedProject}
            />
          )}

          {currentTab === 'services' && (
            <ServicesScreen
              services={SERVICE_PROVIDERS}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              onSelectService={setSelectedService}
            />
          )}

          {currentTab === 'search' && (
            <SearchScreen
              ads={ads}
              categories={CATEGORIES}
              initialQuery={searchQuery}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectAd={setSelectedAd}
            />
          )}

          {currentTab === 'favorites' && (
            <FavoritesScreen
              ads={ads}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectAd={setSelectedAd}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileScreen
              allAds={ads}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onNavigate={setCurrentTab}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              onSelectAd={setSelectedAd}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onNavigate={setCurrentTab}
          favoritesCount={favorites.length}
        />

        {/* Global Modals */}
        <AdDetailModal
          ad={selectedAd}
          isOpen={!!selectedAd}
          onClose={() => setSelectedAd(null)}
          isFavorite={selectedAd ? favorites.includes(selectedAd.id) : false}
          onToggleFavorite={handleToggleFavorite}
          allAds={ads}
          onSelectSimilarAd={(sim) => {
            setSelectedAd(sim);
          }}
        />

        <ServiceDetailModal
          service={selectedService}
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
        />

        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          onExploreAdsForProject={(query) => {
            setSearchQuery(query);
            setCurrentTab('search');
          }}
        />

        <NotificationDrawer
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        />

        <AdSuccessModal
          ad={createdAdSuccess}
          isOpen={!!createdAdSuccess}
          onClose={() => setCreatedAdSuccess(null)}
          onViewAd={(ad) => {
            setCreatedAdSuccess(null);
            setSelectedAd(ad);
          }}
        />

        <AuthModal />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MarketplaceApp />
    </AuthProvider>
  );
}
