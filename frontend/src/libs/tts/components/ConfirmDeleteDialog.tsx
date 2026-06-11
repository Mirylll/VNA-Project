"use client";

import { X, Trash2 } from 'lucide-react';

interface ConfirmDeleteDialogProps {
  open: boolean;
  title?: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  title = 'Xác nhận xoá',
  message,
  itemName,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDeleteDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-red-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trash2 size={18} className="text-white" />
            <h2 className="text-white font-semibold text-base">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600">
            {message}
            {itemName && (
              <>
                {' '}
                <span className="font-bold text-slate-800">{itemName}</span>?
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-slate-500 font-medium hover:text-slate-700 transition-colors text-sm disabled:opacity-50"
          >
            Huỷ bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-1.5 bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
          >
            <Trash2 size={15} />
            {loading ? 'Đang xoá...' : 'Xoá'}
          </button>
        </div>
      </div>
    </div>
  );
}
