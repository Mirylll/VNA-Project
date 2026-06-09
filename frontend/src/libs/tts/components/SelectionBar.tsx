"use client";

import { Trash2, X } from 'lucide-react';

interface SelectionBarProps {
  selectedCount: number;
  onClear: () => void;
  onDelete: () => void;
}

export default function SelectionBar({
  selectedCount,
  onClear,
  onDelete,
}: SelectionBarProps) {
  if (selectedCount <= 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
      <div className="flex items-center bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Selection indicator */}
        <div className="flex items-center bg-blue-600 text-white font-bold text-base px-4 py-3 min-w-[48px] justify-center">
          {selectedCount}
        </div>

        {/* Status text */}
        <div className="flex items-center bg-gray-50 px-4 py-3 text-sm text-gray-600">
          dữ liệu được chọn
        </div>

        {/* Delete button */}
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 bg-red-600 text-white font-semibold px-4 py-3 text-sm hover:bg-red-700 transition-colors"
        >
          <Trash2 size={16} />
          Xoá
        </button>

        {/* Clear button */}
        <button
          onClick={onClear}
          className="flex items-center justify-center px-3 py-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
