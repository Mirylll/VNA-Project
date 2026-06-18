"use client";

import { useState, useEffect, useRef } from 'react';
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

function getMaxDays(month: number, year: number): number {
  const m = month || 1;
  const y = year || 2026;
  if (m === 2) {
    const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
    return isLeap ? 29 : 28;
  }
  const thirtyDays = [4, 6, 9, 11];
  return thirtyDays.includes(m) ? 30 : 31;
}

function clampDateParts(d: string, m: string, y: string) {
  let cleanD = d;
  let cleanM = m;
  let cleanY = y;

  // Validate and clamp month
  if (cleanM.length === 2) {
    let monthNum = parseInt(cleanM, 10);
    if (monthNum > 12) monthNum = 12;
    if (monthNum === 0) monthNum = 1;
    cleanM = String(monthNum).padStart(2, '0');
  }

  // Validate and clamp year (only clamp when 4 digits are typed)
  if (cleanY.length === 4) {
    let yearNum = parseInt(cleanY, 10);
    const currentYear = new Date().getFullYear();
    if (yearNum < currentYear) {
      yearNum = currentYear;
    }
    cleanY = String(yearNum);
  }

  // Validate and clamp day based on max days of month/year
  if (cleanD.length === 2) {
    let dayNum = parseInt(cleanD, 10);
    const mNum = cleanM ? parseInt(cleanM, 10) : 1;
    const yNum = cleanY.length === 4 ? parseInt(cleanY, 10) : 2026;
    const maxDays = getMaxDays(mNum, yNum);
    if (dayNum > maxDays) dayNum = maxDays;
    if (dayNum === 0) dayNum = 1;
    cleanD = String(dayNum).padStart(2, '0');
  }

  return { d: cleanD, m: cleanM, y: cleanY };
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

  const initialParts = parseParts(value);
  const [localD, setLocalD] = useState(initialParts.d);
  const [localM, setLocalM] = useState(initialParts.m);
  const [localY, setLocalY] = useState(initialParts.y);

  // Synchronize state when value changes externally (e.g. native calendar pick)
  useEffect(() => {
    const p = parseParts(value);
    setLocalD(p.d);
    setLocalM(p.m);
    setLocalY(p.y);
  }, [value]);

  function triggerChange(d: string, m: string, y: string) {
    if (d.length === 2 && m.length === 2 && y.length === 4) {
      const dayNum = parseInt(d, 10);
      const monthNum = parseInt(m, 10);
      const yearNum = parseInt(y, 10);
      const maxDays = getMaxDays(monthNum, yearNum);
      if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= maxDays && yearNum >= new Date().getFullYear()) {
        onChange(toIso(d, m, y));
        return;
      }
    }
    onChange('');
  }

  function handleSegmentChange(segment: 'd' | 'm' | 'y', raw: string) {
    const cleaned = raw.replace(/\D/g, '');
    const maxLen = segment === 'y' ? 4 : 2;
    const clipped = cleaned.slice(0, maxLen);

    if (segment === 'd') {
      const clamped = clampDateParts(clipped, localM, localY);
      setLocalD(clamped.d);
      triggerChange(clamped.d, clamped.m, clamped.y);
    } else if (segment === 'm') {
      const clamped = clampDateParts(localD, clipped, localY);
      setLocalD(clamped.d); // in case month change forces day clamping
      setLocalM(clamped.m);
      triggerChange(clamped.d, clamped.m, clamped.y);
    } else if (segment === 'y') {
      const clamped = clampDateParts(localD, localM, clipped);
      setLocalD(clamped.d); // in case year change (leap year) forces day clamping
      setLocalY(clamped.y);
      triggerChange(clamped.d, clamped.m, clamped.y);
    }

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
          value={localD}
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
          value={localM}
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
          value={localY}
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
