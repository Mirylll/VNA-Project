"use client";

import { useEffect, useRef, useState } from "react";

interface Option {
  id: number | string;
  name: string;
}

interface AutocompleteProps {
  value: string | number;
  options: Option[];
  placeholder?: string;
  onSelect: (value: string) => void;
  className?: string;
  error?: boolean;
  plain?: boolean;
  disabled?: boolean;
}

function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export default function Autocomplete({
  value,
  options,
  placeholder,
  onSelect,
  className = "",
  error,
  plain,
  disabled,
}: AutocompleteProps) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => String(o.id) === String(value));

  useEffect(() => {
    setInput(selected ? selected.name : "");
  }, [value, selected]);

  const filtered = options.filter((o) =>
    removeAccents(o.name).toLowerCase().includes(removeAccents(input).toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    setOpen(true);
    setHighlightIdx(-1);
    if (!e.target.value) {
      onSelect("");
    }
  }

  function handleSelect(opt: Option) {
    setInput(opt.name);
    setOpen(false);
    onSelect(String(opt.id));
    inputRef.current?.blur();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIdx((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIdx((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIdx >= 0 && highlightIdx < filtered.length) {
          handleSelect(filtered[highlightIdx]);
        }
        break;
      case "Escape":
        setOpen(false);
        setHighlightIdx(-1);
        break;
    }
  }

  function handleBlur() {
    if (!selected && !input) {
      onSelect("");
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onFocus={() => !disabled && setOpen(true)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className={`${
          plain
            ? ""
            : "w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2"
        } ${
          plain
            ? ""
            : error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-200"
        } ${disabled ? "bg-gray-50 cursor-not-allowed" : ""} ${className}`}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-36 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {filtered.map((opt, idx) => (
            <li
              key={opt.id}
              onClick={() => handleSelect(opt)}
              onMouseEnter={() => setHighlightIdx(idx)}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                idx === highlightIdx
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-700 hover:bg-blue-50"
              }`}
            >
              {opt.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
