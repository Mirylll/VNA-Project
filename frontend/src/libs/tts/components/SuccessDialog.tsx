"use client";

import { X, CheckCircle2 } from 'lucide-react';

interface SuccessDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

export default function SuccessDialog({
  open,
  title = 'Thành công',
  message,
  onClose,
}: SuccessDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-green-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-white" />
            <h2 className="text-white font-semibold text-base">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600">{message}</p>
        </div>

        <div className="flex items-center justify-end px-6 pb-6">
          <button
            onClick={onClose}
            className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
