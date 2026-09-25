import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, CheckCircle2, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed, hide by default
  if (isInstalled) {
    if (variant === 'full') {
      return (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تطبيق سوق المغرب مثبت وجاهز للعمل بدون إنترنت</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    await install();
    setIsInstalling(false);
  };

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        {variant === 'banner' ? (
          <div className={`p-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl shadow-lg border border-emerald-800 ${className}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">ثبت تطبيق سوق المغرب</h4>
                  <p className="text-xs text-emerald-200 mt-0.5">تصفح أسرع وتجربة سلسة على آيفون وآيباد</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(true)}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                تثبيت على iOS
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowIOSGuide(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors shadow-xs ${className}`}
            title="تثبيت التطبيق على آيفون / آيباد"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>تثبيت التطبيق</span>
          </button>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-right text-slate-800 border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    🇲🇦
                  </div>
                  <h3 className="text-base font-bold text-slate-900">تثبيت سوق المغرب على iOS</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-4 space-y-3 text-xs leading-relaxed text-slate-600">
                <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    1
                  </span>
                  <div>
                    اضغط على زر المشاركة <Share2 className="w-4 h-4 inline-block text-blue-600 mx-1 align-sub" /> في أسفل شاشة متصفح Safari.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    2
                  </span>
                  <div>
                    مرر للأسفل واضغط على <strong className="text-slate-800">"إضافة إلى الصفحة الرئيسية"</strong> <PlusSquare className="w-4 h-4 inline-block text-slate-700 mx-1 align-sub" /> (Add to Home Screen).
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    3
                  </span>
                  <div>
                    اضغط على <strong className="text-emerald-700">"إضافة" (Add)</strong> في الزاوية العلوية لتثبيت التطبيق مثل أي تطبيق أصلي!
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-2 w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition"
              >
                فهمت، حسناً
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'banner') {
      return (
        <div className={`p-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl shadow-lg border border-emerald-800 ${className}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold">تطبيق سوق المغرب الرسمي</h4>
                <p className="text-xs text-emerald-200 mt-0.5">ثبت التطبيق على هاتفك لتصفح بدون إنترنت وإشعارات فورية</p>
              </div>
            </div>
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>{isInstalling ? 'جاري التثبيت...' : 'تثبيت التطبيق'}</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors shadow-xs ${className}`}
        title="تثبيت تطبيق سوق المغرب على جهازك"
      >
        <Download className="w-3.5 h-3.5 text-emerald-700" />
        <span>{isInstalling ? 'جاري التثبيت...' : 'تثبيت التطبيق'}</span>
      </button>
    );
  }

  // Fallback for general browsers when not yet prompted or standalone
  return null;
};
