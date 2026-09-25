import React from 'react';
import {
  CheckCircle2,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Star,
  Wrench,
  X,
  Clock,
  Award,
} from 'lucide-react';
import { ServiceProvider } from '../types';
import { safeOpenExternal } from '../utils/safeBrowser';

interface ServiceDetailModalProps {
  service: ServiceProvider | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !service) return null;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `السلام عليكم معلم ${service.name}، شفت خدمتك "${service.profession}" على تطبيق سوق المغرب وبغيت نسولك على خدمة بمدينة ${service.city}.`
    );
    safeOpenExternal(`https://wa.me/${service.whatsapp}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    safeOpenExternal(`tel:${service.phone}`, '_self');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 max-h-[92vh] flex flex-col">
        {/* Top Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-500">بطاقة الحرفي والخدمة</span>
          </div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            {service.availability}
          </span>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Artisan Header */}
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              <img
                src={service.avatar}
                alt={service.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80';
                }}
                className="w-full h-full object-cover"
              />
              {service.isVerified && (
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{service.name}</h2>
              </div>
              <p className="text-sm font-semibold text-emerald-700 mt-0.5">
                {service.profession}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
                <span className="flex items-center gap-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {service.city}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  {service.rating} ({service.reviewCount} تقييم حقيقي)
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-slate-500" />
                  {service.experienceYears} سنوات خبرة
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Guidance */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">التسعير التقريبي</span>
                <span className="text-xs font-bold text-slate-800">
                  يبدأ من {service.startingPriceMAD || 50} درهم
                </span>
              </div>
            </div>
            {service.hourlyRateMAD && (
              <span className="text-xs text-slate-500 font-mono">
                أو {service.hourlyRateMAD} درهم / الساعة
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">نبذة عن الحرفي والخدمات:</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-white">
              {service.description}
            </p>
          </div>

          {/* Key Skills */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2.5">التخصصات والمهارات:</h4>
            <div className="flex flex-wrap gap-2">
              {service.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium border border-slate-200/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Guarantee / Verification */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 leading-relaxed">
              <span className="font-bold block mb-0.5">ضمان الثقة والاحترافية:</span>
              تم التحقق من هوية الحرفي ورقم هاتفه من طرف فريق سوق المغرب لضمان جودة التدخل المنزلي وسلامة الزبون.
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="sticky bottom-0 z-20 bg-white border-t border-slate-200 p-3 sm:p-4 flex items-center gap-3">
          <button
            onClick={handleWhatsApp}
            className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span>طلب الخدمة عبر واتساب</span>
          </button>
          <button
            onClick={handleCall}
            className="h-12 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Phone className="w-4.5 h-4.5" />
            <span>اتصال</span>
          </button>
        </div>
      </div>
    </div>
  );
};
