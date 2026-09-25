import React from 'react';
import { Bookmark, CheckCircle2, MapPin, Phone, MessageSquare } from 'lucide-react';
import { Ad } from '../types';
import { safeOpenExternal } from '../utils/safeBrowser';

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
  const [imageError, setImageError] = React.useState(false);

  // Format price in MAD with Moroccan thousands separator
  const formattedPrice = new Intl.NumberFormat('fr-MA').format(ad.price);

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
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {!imageError && ad.images.length > 0 ? (
          <img
            src={ad.images[0]}
            alt={ad.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4 text-center">
            <span className="text-3xl mb-1">🇲🇦</span>
            <span className="text-xs font-medium text-slate-500">{ad.city}</span>
          </div>
        )}

        {/* Quiet Featured Label (Clean editorial banner, not garish candy pill) */}
        {ad.isFeatured && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-amber-500/90 text-white text-[11px] font-bold rounded-lg shadow-sm backdrop-blur-xs">
            همزة مميزة
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(ad.id);
          }}
          className={`absolute top-2.5 left-2.5 w-9 h-9 rounded-xl flex items-center justify-center transition-transform active:scale-90 backdrop-blur-md ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white/80 hover:bg-white text-slate-700'
          }`}
          aria-label={isFavorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
        >
          <Bookmark className={`w-4.5 h-4.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Image count indicator if multiple */}
        {ad.images.length > 1 && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] rounded-md font-mono tabular-nums backdrop-blur-xs">
            1/{ad.images.length}
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed Metadata (Zero-pill discipline) */}
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

        {/* Price & Seller / Quick Actions Footer */}
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
