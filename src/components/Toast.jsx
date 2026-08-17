import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111111] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-gray-800 animate-slide-up">
      <CheckCircle2 className="w-5 h-5 text-[#FF9C9A] flex-shrink-0" />
      <span className="text-xs font-medium pr-2">{message}</span>
      <button 
        onClick={onClose} 
        className="text-gray-400 hover:text-white p-1 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
