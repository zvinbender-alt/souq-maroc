import React, { useState } from 'react';
import {
  Bell,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  Edit3,
  HelpCircle,
  LogIn,
  LogOut,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  User,
  X,
  Check,
} from 'lucide-react';
import { Ad, MoroccanCity, ScreenTab, UserProfile } from '../types';
import { MOROCCAN_CITIES } from '../data/mockData';
import { safeOpenExternal } from '../utils/safeBrowser';
import { AdCard } from '../components/AdCard';
import { useAuth } from '../context/AuthContext';
import { deleteAdInFirestore, updateAdInFirestore } from '../firebase/adsService';

interface ProfileScreenProps {
  allAds: Ad[];
  favorites: string[];
  onToggleFavorite: (adId: string) => void;
  onNavigate: (tab: ScreenTab) => void;
  selectedCity: MoroccanCity;
  onSelectCity: (city: MoroccanCity) => void;
  onSelectAd: (ad: Ad) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  allAds,
  favorites,
  onToggleFavorite,
  onNavigate,
  selectedCity,
  onSelectCity,
  onSelectAd,
}) => {
  const { currentUser, userProfile, logout, openAuthModal, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'my-ads' | 'favorites' | 'edit-profile' | 'settings'>('my-ads');

  // Edit Profile Form State
  const [editName, setEditName] = useState(userProfile?.name || '');
  const [editPhone, setEditPhone] = useState(userProfile?.phone || '');
  const [editCity, setEditCity] = useState<MoroccanCity>(userProfile?.city || 'الدار البيضاء');
  const [editNeighborhood, setEditNeighborhood] = useState(userProfile?.neighborhood || '');
  const [editBio, setEditBio] = useState(userProfile?.bio || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync edit form with profile
  React.useEffect(() => {
    if (userProfile) {
      setEditName(userProfile.name);
      setEditPhone(userProfile.phone);
      setEditCity(userProfile.city);
      setEditNeighborhood(userProfile.neighborhood);
      setEditBio(userProfile.bio);
    }
  }, [userProfile]);

  // Settings State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Filter ads belonging to current user
  const myAds = currentUser
    ? allAds.filter((ad) => ad.seller.id === currentUser.uid || (userProfile?.phone && ad.seller.phone === userProfile.phone))
    : [];

  // Filtered favorite ads
  const favoriteAds = allAds.filter((ad) => favorites.includes(ad.id));

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateUserProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
        city: editCity,
        neighborhood: editNeighborhood.trim(),
        bio: editBio.trim(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleSold = async (ad: Ad) => {
    const newStatus = ad.status === 'sold' ? 'active' : 'sold';
    try {
      await updateAdInFirestore(ad.id, { status: newStatus });
    } catch (e) {
      console.error('Failed to toggle sold status', e);
    }
  };

  const handleDelete = async (adId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان من سوق المغرب نهائياً؟')) {
      try {
        await deleteAdInFirestore(adId);
      } catch (e) {
        console.error('Failed to delete ad', e);
      }
    }
  };

  const totalViews = myAds.reduce((acc, curr) => acc + curr.viewsCount, 0);

  // If user is not logged in, show authentication prompt card
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">سجل الدخول لإدارة حسابك في سوق المغرب</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          سجل الدخول لمتابعة إعلاناتك، الاطلاع على عروضك المفضلة، وتعديل ملفك الشخصي عبر Firebase.
        </p>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            إنشاء حساب جديد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-right">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-2xl flex items-center justify-center shadow-md">
            {userProfile?.name?.charAt(0) || currentUser.displayName?.charAt(0) || 'م'}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center text-white" title="حساب موثق">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-bold text-slate-900">{userProfile?.name || currentUser.displayName}</h1>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  حساب معتمد
                </span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {userProfile?.city || selectedCity}، {userProfile?.neighborhood || 'المغرب'}
                </span>
                <span>·</span>
                <span className="font-mono">{userProfile?.phone || currentUser.email}</span>
                <span>·</span>
                <span>منذ {userProfile?.memberSince || '2026'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-center sm:justify-end">
              <button
                onClick={() => onNavigate('add-ad')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة إعلان</span>
              </button>

              <button
                onClick={logout}
                className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-medium rounded-xl flex items-center gap-1 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            </div>
          </div>

          {userProfile?.bio && (
            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed max-w-xl">
              {userProfile.bio}
            </p>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-100">
            <div className="p-2 rounded-xl bg-slate-50 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">إعلاناتي</span>
              <span className="text-sm sm:text-base font-extrabold text-slate-800 font-mono tabular-nums">
                {myAds.length}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">المفضلة</span>
              <span className="text-sm sm:text-base font-extrabold text-slate-800 font-mono tabular-nums">
                {favorites.length}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">المشاهدات</span>
              <span className="text-sm sm:text-base font-extrabold text-slate-800 font-mono tabular-nums">
                {totalViews}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">التقييم</span>
              <span className="text-sm sm:text-base font-extrabold text-amber-500 font-mono tabular-nums">
                5.0 ★
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('my-ads')}
          className={`flex-1 min-w-[90px] py-2 px-3 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'my-ads' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          إعلاناتي ({myAds.length})
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 min-w-[90px] py-2 px-3 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'favorites' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          المفضلة ({favorites.length})
        </button>

        <button
          onClick={() => setActiveTab('edit-profile')}
          className={`flex-1 min-w-[90px] py-2 px-3 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'edit-profile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          تعديل الحساب
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 min-w-[90px] py-2 px-3 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'settings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          الإعدادات
        </button>
      </div>

      {/* TAB 1: MY ADS */}
      {activeTab === 'my-ads' && (
        <div className="space-y-3">
          {myAds.length > 0 ? (
            myAds.map((ad) => {
              const isSold = ad.status === 'sold';
              return (
                <div
                  key={ad.id}
                  className={`bg-white rounded-2xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    isSold ? 'border-slate-200 opacity-75 bg-slate-50/50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    onClick={() => onSelectAd(ad)}
                    className="flex items-center gap-3.5 flex-1 cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={ad.images[0] || '/src/assets/images/morocco_hero_banner_1790354597044.jpg'}
                        alt={ad.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                      {isSold && (
                        <span className="absolute inset-0 bg-black/60 text-white text-[10px] font-bold rounded-xl flex items-center justify-center">
                          تم البيع
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 hover:text-emerald-700">
                          {ad.title}
                        </h4>
                        {isSold && (
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                            مباع
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="font-bold text-emerald-700 font-mono">
                          {new Intl.NumberFormat('fr-MA').format(ad.price)} DH
                        </span>
                        <span>·</span>
                        <span>{ad.city}</span>
                        <span>·</span>
                        <span className="text-[11px] text-slate-400">{ad.viewsCount} مشاهدة</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                    <button
                      onClick={() => handleToggleSold(ad)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                        isSold
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSold ? 'إعادة تنشيط' : 'تمييز كـ تم البيع'}
                    </button>
                    <button
                      onClick={() => onSelectAd(ad)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-medium transition-colors"
                    >
                      معاينة
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="حذف الإعلان"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-10 text-center bg-white rounded-3xl border border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">ليس لديك أي إعلانات منشورة بعد</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-4">
                انشر أول إعلان لك مجاناً ومباشرة في Cloud Firestore.
              </p>
              <button
                onClick={() => onNavigate('add-ad')}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700"
              >
                أضف إعلانك الأول الآن
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FAVORITES */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favoriteAds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="p-10 text-center bg-white rounded-3xl border border-slate-200">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">قائمة المفضلة فارغة</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-4">
                احفظ الإعلانات التي تثير اهتمامك للرجوع إليها في أي وقت.
              </p>
              <button
                onClick={() => onNavigate('ads')}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700"
              >
                تصفح الإعلانات والهميزات
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EDIT PROFILE */}
      {activeTab === 'edit-profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">تعديل معلومات الملف الشخصي</h3>
            {saveSuccess && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                تم حفظ التعديلات في Firestore بنجاح!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف المغربي</label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-right"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المدينة بالمغرب</label>
              <select
                value={editCity}
                onChange={(e) => setEditCity(e.target.value as MoroccanCity)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
              >
                {MOROCCAN_CITIES.filter((c) => c !== 'الكل').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الحي أو المنطقة</label>
              <input
                type="text"
                value={editNeighborhood}
                onChange={(e) => setEditNeighborhood(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">نبذة تعريفية (Bio)</label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                placeholder="اكتب نبذة مختصرة عنك أو عن نشاطك التجاري..."
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isUpdating ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              إعدادات التطبيق وتفضيلات المستخدم
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">المدينة الافتراضية</span>
                  <span className="text-slate-400">تصفح الهميزات والعروض القريبة منك أولاً</span>
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => onSelectCity(e.target.value as MoroccanCity)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none text-xs"
                >
                  {MOROCCAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="font-semibold text-slate-800 block">إشعارات وتنبيهات الهميزات</span>
                  <span className="text-slate-400">تنبيهات فورية عند تخفيض الأسعار في إعلاناتك المحفوظة</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="font-semibold text-slate-800 block">أصوات التنبيهات</span>
                  <span className="text-slate-400">تشغيل نغمة عند وصول رسائل جديدة</span>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <div>
                <h5 className="text-xs font-bold text-slate-900">مساعدة ودعم مستخدمي سوق المغرب</h5>
                <span className="text-[11px] text-slate-500">فريق الدعم الفني المغربي رهن إشارتكم</span>
              </div>
            </div>
            <button
              onClick={() => {
                const text = encodeURIComponent('السلام عليكم، أحتاج مساعدة بخصوص تطبيق سوق المغرب.');
                safeOpenExternal(`https://wa.me/212600000000?text=${text}`, '_blank');
              }}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl"
            >
              تواصل معنا
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
