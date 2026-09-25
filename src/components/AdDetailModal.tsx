import React, { useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  MessageSquare,
  Phone,
  Share2,
  ShieldCheck,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Ad } from '../types';
import { safeCopyToClipboard, safeOpenExternal } from '../utils/safeBrowser';
import { getFallbackImage, getSafeImageUrl, getSanitizedImages } from '../utils/imageUtils';

interface AdDetailModalProps {
  ad: Ad | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (adId: string) => void;
  allAds?: Ad[];
  onSelectSimilarAd?: (ad: Ad) => void;
}

export const AdDetailModal: React.FC<AdDetailModalProps> = ({
  ad,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  allAds = [],
  onSelectSimilarAd,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showQuickMessage, setShowQuickMessage] = useState(false);
  const [quickMsgText, setQuickMsgText] = useState('السلام عليكم خويا، واش السلعة ما زال متوفرة؟');
  const [messageSent, setMessageSent] = useState(false);

  if (!isOpen || !ad) return null;

  const formattedPrice = new Intl.NumberFormat('fr-MA').format(ad.price);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `السلام عليكم خويا ${ad.seller.name}، شفت إعلانك "${ad.title}" على تطبيق سوق المغرب ومهتم بالتفاصيل والسعر.`
    );
    safeOpenExternal(`https://wa.me/${ad.seller.whatsapp}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    safeOpenExternal(`tel:${ad.seller.phone}`, '_self');
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: ad.title,
          text: `${ad.title} - ${formattedPrice} درهم على سوق المغرب`,
          url: window.location.href,
        });
        return;
      } catch (e: any) {
        // User aborted/cancelled sharing sheet
        if (e?.name === 'AbortError') {
          return;
        }
        // Fallback to clipboard
      }
    }
    await safeCopyToClipboard(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendQuickMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMsgText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setShowQuickMessage(false);
    }, 2000);
  };

  // Find similar ads from same category or same city
  const similarAds = allAds
    .filter((other) => other.id !== ad.id && (other.categoryId === ad.categoryId || other.city === ad.city))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4">
      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-500">تفاصيل الإعلان</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors relative"
              title="مشاركة الإعلان"
            >
              <Share2 className="w-4 h-4" />
              {copied && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow whitespace-nowrap z-30">
                  تم نسخ الرابط!
                </span>
              )}
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => onToggleFavorite(ad.id)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                isFavorite
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              aria-label="المفضلة"
            >
              <Bookmark className={`w-4.5 h-4.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-24 sm:pb-6">
          {/* Main Photo Gallery */}
          {(() => {
            const galleryImages = getSanitizedImages(ad);
            const safeCurrentImg = galleryImages[activeImageIndex] || galleryImages[0];
            return (
              <>
                <div className="relative aspect-[16/10] bg-slate-950 sm:max-h-[380px] overflow-hidden select-none">
                  <img
                    src={safeCurrentImg}
                    alt={ad.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = getFallbackImage(ad.categoryId, activeImageIndex);
                    }}
                    className="w-full h-full object-contain sm:object-cover"
                  />

                  {/* 1/2 Indicator Badge */}
                  {galleryImages.length > 1 && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 text-white text-xs font-mono font-bold rounded-lg backdrop-blur-xs z-10">
                      {activeImageIndex + 1}/{galleryImages.length}
                    </div>
                  )}

                  {/* Gallery Navigation Arrows */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-10"
                        aria-label="الصورة السابقة"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-10"
                        aria-label="الصورة التالية"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-xs rounded-full z-10">
                        {galleryImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              activeImageIndex === idx ? 'bg-white w-4' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails Row if multiple images */}
                {galleryImages.length > 1 && (
                  <div className="px-4 py-2 bg-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          activeImageIndex === idx
                            ? 'border-emerald-600 scale-105 shadow-xs'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${ad.title} ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getFallbackImage(ad.categoryId, idx);
                          }}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            );
          })()}

          <div className="p-4 sm:p-6 space-y-6">
            {/* Price & Title Section */}
            <div>
              <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tabular-nums font-mono">
                    {formattedPrice}
                  </span>
                  <span className="text-sm font-semibold text-emerald-800">درهم مغربي (DH)</span>
                  {ad.isNegotiable ? (
                    <span className="text-xs text-slate-500 mr-2 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                      قابل للنقاش
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 mr-2 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                      سعر نهائي
                    </span>
                  )}
                </div>
                {ad.isFeatured && (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-lg">
                    همزة مميزة 🔥
                  </span>
                )}
              </div>

              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {ad.title}
              </h1>

              {/* Quiet Unboxed Metadata */}
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{ad.city}، {ad.neighborhood}</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>نُشر {ad.date}</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{ad.viewsCount} مشاهدة</span>
                </span>
                {ad.condition && ad.condition !== 'غير محدد' && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-700 font-medium">الحالة: {ad.condition}</span>
                  </>
                )}
              </div>
            </div>

            {/* Specifications Grid if present */}
            {ad.specs && Object.keys(ad.specs).length > 0 && (
              <div className="border border-slate-200/80 rounded-2xl p-4 bg-slate-50/60">
                <h4 className="text-xs font-bold text-slate-600 mb-3">المواصفات والمعلومات:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(ad.specs).map(([label, value]) => (
                    <div key={label} className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-400 block">{label}</span>
                      <span className="text-xs font-semibold text-slate-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2">الوصف الكامل:</h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white">
                {ad.description}
              </p>
            </div>

            {/* Seller Profile Card */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-lg flex items-center justify-center shrink-0">
                  {ad.seller.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">{ad.seller.name}</span>
                    {ad.seller.isVerified && (
                      <span className="inline-flex items-center gap-0.5 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        حساب موثق
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    عضو منذ {ad.seller.memberSince} · {ad.seller.city} · {ad.seller.totalListings} إعلانات
                  </div>
                </div>
              </div>

              {/* Seller Rating & Deals */}
              <div className="flex items-center gap-3 text-xs text-slate-600 sm:text-left">
                <div>
                  <span className="font-bold text-amber-500 block">★ {ad.seller.rating}</span>
                  <span className="text-[10px] text-slate-400">({ad.seller.reviewsCount} تقييم)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuickMessage(!showQuickMessage)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 text-emerald-700 font-medium text-xs rounded-xl transition-colors shadow-2xs"
                >
                  إرسال رسالة
                </button>
              </div>
            </div>

            {/* Quick in-app message simulation box */}
            {showQuickMessage && (
              <form onSubmit={handleSendQuickMessage} className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-900">رسالة سريعة إلى {ad.seller.name}:</span>
                  <button
                    type="button"
                    onClick={() => setShowQuickMessage(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    إلغاء
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={quickMsgText}
                    onChange={(e) => setQuickMsgText(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال</span>
                  </button>
                </div>
                {messageSent && (
                  <span className="text-[11px] text-emerald-700 font-semibold block animate-pulse">
                    ✓ تم إرسال رسالتك للبائع بنجاح!
                  </span>
                )}
              </form>
            )}

            {/* Safety Tips Banner */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950 leading-relaxed">
                <span className="font-bold block">نصيحة أمان من سوق المغرب:</span>
                تجنب إرسال أي تسبيق مالي عبر تطبيقات الدفع أو البنك قبل معاينة السلعة والتأكد منها وجهاً لوجه في مكان عام وآمن.
              </div>
            </div>

            {/* Similar Ads Recommendations */}
            {similarAds.length > 0 && (
              <div className="pt-2">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>هميزات مشابهة قد تهمك:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {similarAds.map((sim) => (
                    <div
                      key={sim.id}
                      onClick={() => onSelectSimilarAd?.(sim)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 transition-all cursor-pointer bg-white flex flex-col justify-between group"
                    >
                      <img
                        src={getSafeImageUrl(sim.images[0] || sim.imageUrl, sim.categoryId, 0)}
                        alt={sim.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = getFallbackImage(sim.categoryId, 0);
                        }}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700">
                        {sim.title}
                      </h5>
                      <span className="text-xs font-extrabold text-emerald-700 font-mono mt-1">
                        {new Intl.NumberFormat('fr-MA').format(sim.price)} DH
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Action Footer (Thumbs Zone) */}
        <div className="sticky bottom-0 z-20 bg-white border-t border-slate-200 p-3 sm:p-4 flex items-center gap-3">
          <button
            onClick={handleWhatsApp}
            className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span>مراسلة عبر واتساب</span>
          </button>

          <button
            onClick={handleCall}
            className="h-12 px-5 sm:px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all"
          >
            <Phone className="w-4.5 h-4.5" />
            <span>اتصال ({ad.seller.phone})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
