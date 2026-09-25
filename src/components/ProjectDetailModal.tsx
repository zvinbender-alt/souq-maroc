import React from 'react';
import {
  Banknote,
  CheckCircle,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
  X,
  Share2,
} from 'lucide-react';
import { ProjectIdea } from '../types';

interface ProjectDetailModalProps {
  project: ProjectIdea | null;
  isOpen: boolean;
  onClose: () => void;
  onExploreAdsForProject: (categoryName: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onExploreAdsForProject,
}) => {
  if (!isOpen || !project) return null;

  const minCap = new Intl.NumberFormat('fr-MA').format(project.capitalMinMAD);
  const maxCap = new Intl.NumberFormat('fr-MA').format(project.capitalMaxMAD);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-500">دراسة مبسطة لفكرة المشروع</span>
          </div>

          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg">
            {project.category}
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Hero Image */}
          {project.image && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={project.image}
                alt={project.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title & Tagline */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{project.title}</h2>
            <p className="text-sm text-slate-600 mt-1">{project.tagline}</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
              <span className="text-[11px] text-emerald-800 font-medium block">رأس المال المطلوب</span>
              <span className="text-sm font-extrabold text-emerald-700 font-mono tabular-nums block mt-0.5">
                {minCap} - {maxCap} DH
              </span>
            </div>

            <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-2xl">
              <span className="text-[11px] text-purple-800 font-medium block">هامش الربح المتوقع</span>
              <span className="text-sm font-extrabold text-purple-700 block mt-0.5">
                {project.expectedProfitability}
              </span>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-[11px] text-amber-800 font-medium block">مستوى الصعوبة</span>
              <span className="text-sm font-extrabold text-amber-800 block mt-0.5">
                {project.difficultyLevel}
              </span>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">فكرة المشروع باختصار:</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
              {project.overview}
            </p>
          </div>

          {/* Target Audience */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-1.5">الفئة المستهدفة في المغرب:</h4>
            <p className="text-xs font-medium text-slate-800">{project.targetAudience}</p>
          </div>

          {/* Equipment Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-slate-600" />
              <span>المعدات والتجهيزات الأساسية:</span>
            </h4>
            <div className="space-y-1.5">
              {project.requiredEquipment.map((eq, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{eq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Steps */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-slate-600" />
              <span>خطة التنفيذ خطوة بخطوة:</span>
            </h4>
            <div className="space-y-2">
              {project.successSteps.map((step, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Moroccan Market Secret Tip */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed">
              <span className="font-bold block mb-1">سر النجاح في السوق المغربي:</span>
              {project.moroccanMarketTips}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="sticky bottom-0 z-20 bg-white border-t border-slate-200 p-3 sm:p-4 flex items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onExploreAdsForProject(project.title);
            }}
            className="flex-1 h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Sparkles className="w-4.5 h-4.5" />
            <span>ابحث عن معدات ومحلات لهذا المشروع</span>
          </button>
        </div>
      </div>
    </div>
  );
};
