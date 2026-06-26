"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-end gap-4 px-6 py-3 border-t border-slate-200 bg-white text-xs text-slate-500 font-medium">
      <div className="flex items-center gap-1">
        <span>Hiển thị</span>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 border border-slate-200 rounded px-2 py-0.5 bg-white text-slate-600 font-semibold focus:outline-none text-xs hover:border-slate-300 transition-colors"
          >
            <span>{itemsPerPage}</span>
            <ChevronDown size={10} className="text-slate-500" />
          </button>
          
          {isOpen && (
            <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded shadow-lg z-50 py-1 min-w-[50px] animate-in fade-in slide-in-from-top-1 duration-100">
              {[10, 20, 50].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    onItemsPerPageChange(size);
                    setIsOpen(false);
                  }}
                  className={`w-full text-center px-2 py-1 text-xs hover:bg-blue-50 transition-colors block ${
                    size === itemsPerPage ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <span>{startItem} - {endItem} / {totalItems}</span>
      <div className="flex gap-1.5">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1 rounded border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={12} />
        </button>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1 rounded border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
        >
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

