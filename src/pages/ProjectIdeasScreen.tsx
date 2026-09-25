import React, { useState } from 'react';
import {
  Banknote,
  CheckCircle,
  ChevronLeft,
  Filter,
  Lightbulb,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { ProjectIdea } from '../types';

interface ProjectIdeasScreenProps {
  projectIdeas: ProjectIdea[];
  onSelectProject: (project: ProjectIdea) => void;
}

export const ProjectIdeasScreen: React.FC<ProjectIdeasScreenProps> = ({
  projectIdeas,
  onSelectProject,
}) => {
  const [capitalFilter, setCapitalFilter] = useState<'all' | 'under30k' | '30k-60k' | 'over60k'>('all');

  const filteredProjects = projectIdeas.filter((p) => {
    if (capitalFilter === 'under30k') return p.capitalMinMAD < 30000;
    if (capitalFilter === '30k-60k') return p.capitalMinMAD >= 30000 && p.capitalMinMAD <= 60000;
    if (capitalFilter === 'over60k') return p.capitalMinMAD > 60000;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-2xl text-right relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-purple-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ريادة الأعمال والهمزات الاستثمارية بالمغرب</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold mb-2">
            أفكار مشاريع مربحة ودراسات جدوى مبسطة
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
            استكشف أفكار مشاريع مجربة في السوق المغربي مع رأس المال التقديري، خطوات البدء، والمعدات المطلوبة للبدء بثقة ونجاح.
          </p>
        </div>
      </div>

      {/* Filter Tabs for Capital */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">تصفية حسب رأس المال</h2>
          <span className="text-xs text-slate-500">اختر الميزانية المتوفرة لديك بالدرهم</span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'كل الميزانيات' },
            { id: 'under30k', label: 'أقل من 30,000 DH' },
            { id: '30k-60k', label: '30,000 - 60,000 DH' },
            { id: 'over60k', label: 'أكثر من 60,000 DH' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCapitalFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                capitalFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((project) => {
          const minCap = new Intl.NumberFormat('fr-MA').format(project.capitalMinMAD);
          const maxCap = new Intl.NumberFormat('fr-MA').format(project.capitalMaxMAD);

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-purple-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Image */}
                {project.image && (
                  <div className="aspect-[16/9] bg-slate-100 overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-purple-900/80 text-white text-xs font-bold rounded-xl backdrop-blur-xs">
                      {project.category}
                    </div>
                  </div>
                )}

                <div className="p-5 text-right">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {project.tagline}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 block font-medium">رأس المال التقريبي</span>
                      <span className="text-xs font-bold text-emerald-700 font-mono tabular-nums block mt-0.5">
                        {minCap} - {maxCap} DH
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 block font-medium">نسبة الربح التقديرية</span>
                      <span className="text-xs font-bold text-purple-700 block mt-0.5">
                        {project.expectedProfitability}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-5 pb-5 pt-1 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">
                  مستوى الصعوبة: <strong className="text-slate-700">{project.difficultyLevel}</strong>
                </span>
                <button
                  type="button"
                  className="px-4 py-2 bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <span>عرض دراسة الفكرة</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
