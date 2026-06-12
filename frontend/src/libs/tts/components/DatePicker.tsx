"use client";

import { useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

function parseParts(iso: string) {
  if (!iso) return { d: '', m: '', y: '' };
  const [y, m, d] = iso.split('-');
  return { d: d || '', m: m || '', y: y || '' };
}

function toIso(d: string, m: string, y: string) {
  if (!d || !m || !y) return '';
  return `${y.padStart(4, '0')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

export default function DatePicker({
  value,
  onChange,
  className = '',
  error,
}: DatePickerProps) {
  const hiddenRef = useRef<HTMLInputElement>(null);
  const dRef = useRef<HTMLInputElement>(null);
  const mRef = useRef<HTMLInputElement>(null);
  const yRef = useRef<HTMLInputElement>(null);

  const parts = parseParts(value);

  function handleSegmentChange(segment: 'd' | 'm' | 'y', raw: string) {
    const cleaned = raw.replace(/\D/g, '');
    const maxLen = segment === 'y' ? 4 : 2;
    const clipped = cleaned.slice(0, maxLen);

    const next = { ...parseParts(value), [segment]: clipped };
    onChange(toIso(next.d, next.m, next.y));

    if (clipped.length === maxLen) {
      if (segment === 'd') mRef.current?.focus();
      else if (segment === 'm') yRef.current?.focus();
    }
  }

  function handleKeyDown(
    segment: 'd' | 'm' | 'y',
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    const input = e.currentTarget;
    if (e.key === 'Backspace' && input.selectionStart === 0 && input.selectionEnd === 0) {
      if (segment === 'm') dRef.current?.focus();
      else if (segment === 'y') mRef.current?.focus();
    }
  }

  function focusRef(ref: React.RefObject<HTMLInputElement | null>) {
    setTimeout(() => ref.current?.focus(), 0);
  }

  const segClass =
    `w-full rounded-lg border px-2 py-2 text-sm text-center outline-none transition focus:ring-2 ` +
    (error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200');

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-1">
        <input
          ref={dRef}
          type="text"
          inputMode="numeric"
          value={parts.d}
          onChange={(e) => handleSegmentChange('d', e.target.value)}
          onKeyDown={(e) => handleKeyDown('d', e)}
          placeholder="dd"
          className={segClass}
          style={{ maxWidth: 56 }}
        />
        <span className="text-gray-400 text-sm select-none">/</span>
        <input
          ref={mRef}
          type="text"
          inputMode="numeric"
          value={parts.m}
          onChange={(e) => handleSegmentChange('m', e.target.value)}
          onKeyDown={(e) => handleKeyDown('m', e)}
          placeholder="mm"
          className={segClass}
          style={{ maxWidth: 56 }}
        />
        <span className="text-gray-400 text-sm select-none">/</span>
        <input
          ref={yRef}
          type="text"
          inputMode="numeric"
          value={parts.y}
          onChange={(e) => handleSegmentChange('y', e.target.value)}
          onKeyDown={(e) => handleKeyDown('y', e)}
          placeholder="yyyy"
          className={segClass}
          style={{ maxWidth: 76 }}
        />
        <button
          type="button"
          onClick={() => {
            hiddenRef.current?.showPicker();
            // focus segments after picker closes
            setTimeout(() => dRef.current?.focus(), 200);
          }}
          className="ml-1 p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <Calendar size={16} />
        </button>
      </div>
      <input
        ref={hiddenRef}
        type="date"
        value={value}
        onChange={(e) => {
          if (e.target.value) {
            const [y, m, d] = e.target.value.split('-');
            onChange(toIso(d, m, y)); // re-order: native date gives ISO
          }
        }}
        className="sr-only"
      />
    </div>
  );
}
