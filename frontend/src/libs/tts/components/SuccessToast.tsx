"use client";

import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onClose: () => void;
}

export default function SuccessToast({
  message,
  visible,
  duration = 3000,
  onClose,
}: SuccessToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      const timer = setTimeout(() => {
        setMounted(false);
        setTimeout(onClose, 200);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setMounted(false);
    }
  }, [visible, duration, onClose]);

  if (!visible && !mounted) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-[60] transition-all duration-200 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg min-w-[360px]">
        <CheckCircle2 size={20} className="text-green-600 shrink-0" />
        <span className="text-slate-700 text-sm font-medium flex-1">
          {message}
        </span>
        <button
          onClick={() => {
            setMounted(false);
            setTimeout(onClose, 200);
          }}
          className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
