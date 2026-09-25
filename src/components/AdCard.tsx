import React, { useState, useMemo } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, MapPin, MessageSquare, Phone } from 'lucide-react';
import { Ad } from '../types';
import { safeOpenExternal } from '../utils/safeBrowser';
import { getFallbackImage, getSanitizedImages } from '../utils/imageUtils';

interface AdCardProps {
  ad: Ad;
  isFavorite: boolean;
  onToggleFavorite: (adId: string) => void;
  onSelect: (ad: Ad) => void;
}

export const AdCard: React.FC<AdCardProps> = ({
  ad,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  // Ensure sanitized, valid HTTPS images with fallback from Unsplash/Picsum
  const images = useMemo(() => getSanitizedImages(ad), [ad]);

  // Active image source with fallback if empty or failed
  const activeImage = useMemo(() => {
    if (failedImages[currentImageIndex]) {
      return getFallbackImage(ad.categoryId, currentImageIndex);
    }
    const currentUrl = images[currentImageIndex];
    if (!currentUrl || currentUrl.trim() === '') {
      return getFallbackImage(ad.categoryId, currentImageIndex);
    }
    return currentUrl;
  }, [images, currentImageIndex, failedImages, ad.categoryId]);

  // Format price in MAD with Moroccan thousands separator
  const formattedPrice = new Intl.NumberFormat('fr-MA').format(ad.price);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(`السلام عليكم، شفت إعلانك "${ad.title}" على سوق المغرب ومهتم به.`);
    safeOpenExternal(`https://wa.me/${ad.seller.whatsapp}?text=${message}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    safeOpenExternal(`tel:${ad.seller.phone}`, '_self');
  };

  return (
    <div
      onClick={() => onSelect(ad)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Media Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden select-none">
        <img
          src={activeImage}
          alt={ad.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            setFailedImages((prev) => ({ ...prev, [currentImageIndex]: true }));
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Multi-image Navigation & Indicator (e.g. 1/2 indicator) */}
        {images.length > 1 && (
          <>
            {/* 1/2 Indicator Badge */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[11px] font-bold rounded-md font-mono tabular-nums backdrop-blur-xs shadow-xs z-10">
              {currentImageIndex + 1}/{images.length}
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 pointer-events-none">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    idx === currentImageIndex ? 'w-4 bg-white shadow-xs' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Next / Previous Controls */}
            <button
              onClick={handleNextImage}
              aria-label="الصورة التالية"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrevImage}
              aria-label="الصورة السابقة"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Featured Label */}
        {ad.isFeatured && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-amber-500/90 text-white text-[11px] font-bold rounded-lg shadow-sm backdrop-blur-xs z-10">
            همزة مميزة
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(ad.id);
          }}
          className={`absolute top-2.5 left-2.5 w-9 h-9 rounded-xl flex items-center justify-center transition-transform active:scale-90 backdrop-blur-md z-10 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white/80 hover:bg-white text-slate-700'
          }`}
          aria-label={isFavorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
        >
          <Bookmark className={`w-4.5 h-4.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-0.5 text-slate-700 font-medium">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{ad.city}</span>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{ad.neighborhood}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-[11px]">{ad.date}</span>
          </div>

          {/* Ad Title */}
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {ad.title}
          </h3>
        </div>

        {/* Price & Quick Actions Footer */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-emerald-700 tabular-nums font-mono">
                {formattedPrice}
              </span>
              <span className="text-xs font-medium text-emerald-800">درهم</span>
            </div>
            {ad.isNegotiable ? (
              <span className="text-[10px] text-slate-500 block">قابل للنقاش</span>
            ) : (
              <span className="text-[10px] text-slate-400 block">سعر نهائي</span>
            )}
          </div>

          {/* Quick Contact Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleWhatsApp}
              className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors"
              title="تواصل عبر واتساب"
              aria-label="تواصل عبر واتساب"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={handleCall}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              title="اتصال هاتفي"
              aria-label="اتصال هاتفي"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
