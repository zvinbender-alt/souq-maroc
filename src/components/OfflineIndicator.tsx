import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../utils/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 flex items-center gap-3 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-bounce">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span className="flex-1">أنت غير متصل بالإنترنت — يتم استخدام البيانات المحفوظة محلياً.</span>
      <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0"></span>
    </div>
  );
};
