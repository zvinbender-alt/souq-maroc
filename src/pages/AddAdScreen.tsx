import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  LogIn,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { Ad, Category, MoroccanCity } from '../types';
import { MOROCCAN_CITIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { createAdInFirestore, uploadAdImage } from '../firebase/adsService';

interface AddAdScreenProps {
  categories: Category[];
  onAddAd: (newAd: Ad) => void;
  onAdCreatedSuccess: (ad: Ad) => void;
}

export const AddAdScreen: React.FC<AddAdScreenProps> = ({
  categories,
  onAddAd,
  onAdCreatedSuccess,
}) => {
  const { currentUser, userProfile, openAuthModal } = useAuth();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'real-estate');
  const [subCategory, setSubCategory] = useState('');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [city, setCity] = useState<MoroccanCity>(userProfile?.city || 'الدار البيضاء');
  const [neighborhood, setNeighborhood] = useState(userProfile?.neighborhood || '');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<Ad['condition']>('مستعمل كأنه جديد');
  const [sellerName, setSellerName] = useState(userProfile?.name || 'مستخدم سوق المغرب');
  const [phone, setPhone] = useState(userProfile?.phone || '0661223344');
  const [hasWhatsApp, setHasWhatsApp] = useState(true);

  // Sync with user profile when logged in
  React.useEffect(() => {
    if (userProfile) {
      if (!sellerName || sellerName === 'مستخدم سوق المغرب') setSellerName(userProfile.name);
      if (!phone || phone === '0661223344') setPhone(userProfile.phone);
      if (userProfile.city) setCity(userProfile.city);
      if (userProfile.neighborhood && !neighborhood) setNeighborhood(userProfile.neighborhood);
    }
  }, [userProfile]);

  // Multiple Images State (can hold Files or URLs)
  const [imageFiles, setImageFiles] = useState<(File | string)[]>([
    '/src/assets/images/morocco_apartment_living_1790354610792.jpg',
  ]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([
    '/src/assets/images/morocco_apartment_living_1790354610792.jpg',
  ]);

  const sampleImages = [
    { label: 'عقار / صالون', url: '/src/assets/images/morocco_apartment_living_1790354610792.jpg' },
    { label: 'سيارة حديثة', url: '/src/assets/images/morocco_modern_car_1790354622064.jpg' },
    { label: 'مشروع / مقهى', url: '/src/assets/images/morocco_project_cafe_1790354646299.jpg' },
    { label: 'تقني / حرفي', url: '/src/assets/images/morocco_artisan_service_1790354633726.jpg' },
  ];

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);

  const handleMultipleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setImageFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImagePreviews((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addPresetImage = (url: string) => {
    if (!imagePreviews.includes(url)) {
      setImageFiles((prev) => [...prev, url]);
      setImagePreviews((prev) => [...prev, url]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim() || title.length < 8) {
      newErrors.title = 'يرجى كتابة عنوان واضح لا يقل عن 8 أحرف';
    }
    if (!price || parseFloat(price) <= 0) {
      newErrors.price = 'يرجى إدخال سعر صحيح بالدرهم المغربي';
    }
    if (!description.trim() || description.length < 15) {
      newErrors.description = 'يرجى كتابة وصف تفصيلي (15 حرفاً على الأقل)';
    }
    if (!neighborhood.trim()) {
      newErrors.neighborhood = 'يرجى تحديد الحي أو المنطقة بالمدينة';
    }
    if (!phone.trim()) {
      newErrors.phone = 'يرجى إدخال رقم هاتف مغربي صحيح';
    }
    if (imagePreviews.length === 0) {
      newErrors.images = 'يرجى إضافة صورة واحدة على الأقل للإعلان';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenPreview = () => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    if (validateForm()) {
      setShowPreviewModal(true);
    }
  };

  const handleConfirmPublish = async () => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const cleanPhone = phone.replace(/\s+/g, '');
      let cleanWhatsApp = cleanPhone;
      if (cleanWhatsApp.startsWith('0')) {
        cleanWhatsApp = '212' + cleanWhatsApp.substring(1);
      }

      // Upload images to Firebase Storage
      const uploadedImageUrls: string[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const item = imageFiles[i];
        const uploadedUrl = await uploadAdImage(item, `ad_${Date.now()}`, i);
        uploadedImageUrls.push(uploadedUrl);
      }

      const adData: Omit<Ad, 'id'> = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price) || 0,
        isNegotiable,
        categoryId,
        subCategory: subCategory || selectedCategoryObj?.subcategories[0] || 'عام',
        city,
        neighborhood: neighborhood.trim(),
        date: 'الآن',
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : imagePreviews,
        seller: {
          id: currentUser.uid,
          name: sellerName.trim() || userProfile?.name || 'مستخدم سوق المغرب',
          phone: cleanPhone,
          whatsapp: cleanWhatsApp,
          city,
          isVerified: true,
          memberSince: '2026',
          rating: 5.0,
          reviewsCount: 1,
          totalListings: 1,
        },
        condition,
        isFeatured: false,
        viewsCount: 1,
        status: 'active',
        specs: {
          'المدينة': city,
          'الحي': neighborhood,
          'الحالة': condition,
          'التفاوض': isNegotiable ? 'قابل للنقاش' : 'سعر نهائي',
        },
      };

      // Save to Cloud Firestore
      const newAdId = await createAdInFirestore(adData);
      const createdAd: Ad = { ...adData, id: newAdId };

      setIsSubmitting(false);
      setShowPreviewModal(false);
      onAddAd(createdAd);
      onAdCreatedSuccess(createdAd);
    } catch (err: any) {
      console.error('Error creating ad in Firestore:', err);
      setSubmitError(err.message || 'تعذر نشر الإعلان، يرجى التحقق من اتصالك والمحاولة ثانية');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 text-right">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>نشر حقيقي ومباشر على قاعدة بيانات Cloud Firestore</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">أضف إعلاناً جديداً</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          انشر سلعتك أو خدمتك لتصل إلى آلاف المشترين بالمغرب وتبقى محفوظة بعد تحديث الصفحة.
        </p>
      </div>

      {!currentUser && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="text-xs text-amber-900">
            <span className="font-bold block mb-0.5">تسجيل الدخول مطلوب لنشر الإعلانات:</span>
            لتتمكن من ربط الإعلان بحسابك وتعديله أو حذفه لاحقاً بأمان عبر Firebase.
          </div>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-xs"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>
        </div>
      )}

      {submitError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
          {submitError}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleOpenPreview(); }} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            1. المعلومات الأساسية والتصنيف
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              عنوان الإعلان <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="مثال: رينو كليو 5 ديزل نقية، أو شقة مفروشة للكراء بالمعاريف"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
            />
            {errors.title && <span className="text-rose-500 text-[11px] mt-1 block">{errors.title}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                القسم الرئيسي <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubCategory('');
                }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                القسم الفرعي
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
              >
                <option value="">اختر القسم الفرعي</option>
                {selectedCategoryObj?.subcategories.map((sub, i) => (
                  <option key={i} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Price & Condition */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            2. السعر والحالة
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                السعر بالدرهم المغربي (DH) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
                  }}
                  placeholder="مثال: 4500"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-right"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  درهم
                </span>
              </div>
              {errors.price && <span className="text-rose-500 text-[11px] mt-1 block">{errors.price}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                حالة السلعة
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
              >
                <option value="جديد">جديد (جديد تماماً بالكرتونة)</option>
                <option value="مستعمل كأنه جديد">مستعمل كأنه جديد (بدون خدوش)</option>
                <option value="مستعمل بحالة جيدة">مستعمل بحالة جيدة (شغال ممتاز)</option>
                <option value="غير محدد">خدمة، وظيفة أو عقار (غير محدد)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isNegotiable"
              checked={isNegotiable}
              onChange={(e) => setIsNegotiable(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="isNegotiable" className="text-xs font-medium text-slate-700 cursor-pointer">
              السعر قابل للنقاش والتفاوض (يساعد في سرعة البيع)
            </label>
          </div>
        </div>

        {/* Section 3: Location & Images */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            3. الموقع والصور
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                المدينة بالمغرب <span className="text-rose-500">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as MoroccanCity)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
              >
                {MOROCCAN_CITIES.filter((c) => c !== 'الكل').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الحي أو المنطقة <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => {
                  setNeighborhood(e.target.value);
                  if (errors.neighborhood) setErrors((prev) => ({ ...prev, neighborhood: '' }));
                }}
                placeholder="مثال: المعاريف، حسان، أكدال، مالباطا..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
              />
              {errors.neighborhood && (
                <span className="text-rose-500 text-[11px] mt-1 block">{errors.neighborhood}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              الوصف بالتفصيل <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder="اكتب مواصفات السلعة، الموديل، تاريخ الشراء، سبب البيع، وأي تفاصيل تهم المشتري المغربي..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right leading-relaxed"
            />
            {errors.description && (
              <span className="text-rose-500 text-[11px] mt-1 block">{errors.description}</span>
            )}
          </div>

          {/* Multiple Images Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700">
                صور الإعلان ({imagePreviews.length} صور مضافة) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">تُخزن في Cloud Storage</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {imagePreviews.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
                  <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow-sm hover:bg-rose-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 right-1 bg-black/65 text-white text-[9px] px-1.5 py-0.5 rounded">
                      الغلاف
                    </span>
                  )}
                </div>
              ))}

              <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 flex flex-col items-center justify-center cursor-pointer transition-colors p-2 text-center">
                <Camera className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-[11px] font-medium text-slate-600">رفع صور</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleFilesUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 block mb-1.5">أو اختر صور نموذجية متوفرة:</span>
              <div className="flex flex-wrap gap-1.5">
                {sampleImages.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => addPresetImage(s.url)}
                    className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                  >
                    + {s.label}
                  </button>
                ))}
              </div>
            </div>
            {errors.images && <span className="text-rose-500 text-[11px] mt-1 block">{errors.images}</span>}
          </div>
        </div>

        {/* Section 4: Contact Information */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            4. معلومات الاتصال بالبائع
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم المعلن
              </label>
              <input
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder="الاسم الكامل"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رقم الهاتف المغربي <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  placeholder="0661234567"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none font-mono text-right"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {errors.phone && <span className="text-rose-500 text-[11px] mt-1 block">{errors.phone}</span>}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="hasWhatsApp"
              checked={hasWhatsApp}
              onChange={(e) => setHasWhatsApp(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="hasWhatsApp" className="text-xs font-medium text-slate-700 cursor-pointer">
              رقم الهاتف متوفر على واتساب لتسهيل تواصل المشترين معك
            </label>
          </div>
        </div>

        {/* Publish Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleOpenPreview}
            className="w-full sm:w-1/2 h-13 rounded-2xl bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-sm shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4.5 h-4.5" />
            <span>معاينة قبل النشر</span>
          </button>

          <button
            type="button"
            onClick={handleOpenPreview}
            className="w-full sm:w-1/2 h-13 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4.5 h-4.5" />
            <span>متابعة ونشر الإعلان</span>
          </button>
        </div>
      </form>

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">معاينة الإعلان قبل حفظه في Firestore:</span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden relative">
                <img
                  src={imagePreviews[0]}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded">
                  {city}
                </span>
                {imagePreviews.length > 1 && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-mono rounded">
                    1/{imagePreviews.length} صور
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-2xl font-black text-emerald-700 font-mono">
                    {new Intl.NumberFormat('fr-MA').format(parseFloat(price) || 0)}
                  </span>
                  <span className="text-xs font-bold text-emerald-800">درهم (DH)</span>
                  <span className="text-[11px] text-slate-400 mr-2">
                    {isNegotiable ? '(قابل للتفاوض)' : '(سعر نهائي)'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{title}</h3>
                <div className="text-xs text-slate-500 mt-1">
                  {city} · {neighborhood} · {condition}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {description}
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{sellerName}</span>
                  <span className="text-slate-500 font-mono">{phone}</span>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-medium rounded-lg text-[11px]">
                  واتساب متاح
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center gap-2 bg-slate-50">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white"
              >
                تعديل البيانات
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmPublish}
                className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>جاري الرفع والحفظ في Firestore...</span>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>تأكيد ونشر الإعلان الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
