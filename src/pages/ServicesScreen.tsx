import React, { useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Wrench,
} from 'lucide-react';
import { MoroccanCity, ServiceProvider } from '../types';
import { MOROCCAN_CITIES } from '../data/mockData';
import { safeOpenExternal } from '../utils/safeBrowser';

interface ServicesScreenProps {
  services: ServiceProvider[];
  selectedCity: MoroccanCity;
  onSelectCity: (city: MoroccanCity) => void;
  onSelectService: (service: ServiceProvider) => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  services,
  selectedCity,
  onSelectCity,
  onSelectService,
}) => {
  const [selectedProfession, setSelectedProfession] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const professions = [
    { id: 'all', label: 'جميع المهن' },
    { id: 'painter', label: 'صباغة وديكور' },
    { id: 'plumber', label: 'سباكة وترصيص' },
    { id: 'electrician', label: 'كهرباء ومراقبة' },
    { id: 'mover', label: 'نقل الأثاث وترحيل' },
    { id: 'ac-repair', label: 'تبريد وتكييف' },
  ];

  const filteredServices = services.filter((srv) => {
    if (selectedCity !== 'الكل' && srv.city !== selectedCity) return false;
    if (selectedProfession !== 'all' && srv.professionId !== selectedProfession) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = srv.name.toLowerCase().includes(q);
      const matchProf = srv.profession.toLowerCase().includes(q);
      const matchDesc = srv.description.toLowerCase().includes(q);
      if (!matchName && !matchProf && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Top Banner */}
      <div className="bg-emerald-800 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-2xl text-right relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-100 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>شبكة الحرفيين المعتمدين بالمغرب</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold mb-2">
            ابحث عن معلم أو تقني محترف في مدينتك
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            سباكون، كهربائيون، صباغون، وخبراء ترحيل أثاث معتمدون مع تقييمات حقيقية وأسعار شفافة.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو الخدمة..."
              className="w-full pr-10 pl-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
            />
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">المدينة:</span>
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value as MoroccanCity)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none w-full md:w-auto"
            >
              {MOROCCAN_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Profession tabs */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {professions.map((prof) => (
            <button
              key={prof.id}
              onClick={() => setSelectedProfession(prof.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                selectedProfession === prof.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {prof.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            onClick={() => onSelectService(srv)}
            className="bg-white rounded-3xl border border-slate-200 p-5 hover:border-emerald-500 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img
                    src={srv.avatar}
                    alt={srv.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {srv.isVerified && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-right">
                  <h3 className="text-sm font-bold text-slate-900">{srv.name}</h3>
                  <span className="text-xs font-semibold text-emerald-700 block mt-0.5">
                    {srv.profession}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {srv.city}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      {srv.rating}
                    </span>
                    <span>({srv.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {srv.skills.slice(0, 3).map((skill, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {srv.description}
              </p>
            </div>

            {/* Quick Action Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">التسعير</span>
                <span className="text-xs font-bold text-slate-800">
                  يبدأ من {srv.startingPriceMAD} DH
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const text = encodeURIComponent(`السلام عليكم معلم ${srv.name}، شفت خدمتك على سوق المغرب.`);
                    safeOpenExternal(`https://wa.me/${srv.whatsapp}?text=${text}`, '_blank');
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>واتساب</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    safeOpenExternal(`tel:${srv.phone}`, '_self');
                  }}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
