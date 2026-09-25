import React from 'react';
import { CheckCircle, Eye, Share2, Sparkles, X } from 'lucide-react';
import { Ad } from '../types';

interface AdSuccessModalProps {
  ad: Ad | null;
  isOpen: boolean;
  onClose: () => void;
  onViewAd: (ad: Ad) => void;
}

export const AdSuccessModal: React.FC<AdSuccessModalProps> = ({
  ad,
  isOpen,
  onClose,
  onViewAd,
}) => {
  if (!isOpen || !ad) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block mb-1">
            تم النشر بنجاح 🇲🇦
          </span>
          <h3 className="text-lg font-bold text-slate-900">مبروك! إعلانك معروض الآن في سوق المغرب</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            "{ad.title}" متاح الآن لجميع المشترين في {ad.city} وباقي المدن.
          </p>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 text-right">
          <img
            src={ad.images[0]}
            alt={ad.title}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{ad.title}</h4>
            <span className="text-xs font-bold text-emerald-700 font-mono">
              {new Intl.NumberFormat('fr-MA').format(ad.price)} درهم
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onViewAd(ad);
            }}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>معاينة إعلانك الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
