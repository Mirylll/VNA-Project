"use client";

import { useEffect, useState } from 'react';
import { ChevronDown, Loader2, Save } from 'lucide-react';
import { getAuthToken } from '@/libs/core/utils/auth-token';

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

interface IndustryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { code: string; name: string; parentId?: number; level: number; isActive: boolean }) => void;
  initialData?: {
    id?: number;
    code?: string;
    name?: string;
    parentId?: number;
    level?: number;
    isActive?: boolean;
  } | null;
}

export default function IndustryModal({
  open,
  onClose,
  onSave,
  initialData = null,
}: IndustryModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<number | undefined>(undefined);
  const [level, setLevel] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});
  const [parentOptions, setParentOptions] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      setCode(initialData?.code || '');
      setName(initialData?.name || '');
      setParentId(initialData?.parentId ?? undefined);
      setLevel(initialData?.level ?? 1);
      setIsActive(initialData?.isActive ?? true);
      setErrors({});

      const token = getAuthToken();
      if (token) {
        fetch(`${baseUrl}/industries`, {
          headers: { authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (initialData?.id) {
              setParentOptions(data.filter((i: any) => i.id !== initialData.id));
            } else {
              setParentOptions(data);
            }
          })
          .catch(() => {});
      }
    }
  }, [open, initialData]);

  if (!open) return null;

  const isEdit = !!initialData?.id;

  function validate() {
    const errs: { code?: string; name?: string } = {};
    if (!code.trim()) errs.code = 'Mã ngành không được để trống';
    else if (code.trim().length > 50) errs.code = 'Mã ngành tối đa 50 ký tự';
    if (!name.trim()) errs.name = 'Tên ngành không được để trống';
    else if (name.trim().length > 255) errs.name = 'Tên ngành tối đa 255 ký tự';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({ code: code.trim(), name: name.trim(), parentId, level, isActive });
    } finally {
      setSaving(false);
    }
  }

  function handleParentChange(value: string) {
    const parsed = value ? Number(value) : undefined;
    setParentId(parsed);
    if (parsed) {
      const parent = parentOptions.find((i) => i.id === parsed);
      setLevel(parent ? parent.level + 1 : 1);
    } else {
      setLevel(1);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-3">
          <h2 className="text-white font-semibold text-base">
            {isEdit
              ? 'Cập nhật ngành nghề kinh doanh'
              : 'Thêm mới ngành nghề kinh doanh'}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative">
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    if (errors.code) setErrors((p) => ({ ...p, code: undefined }));
                  }}
                  placeholder="Nhập mã ngành"
                  maxLength={50}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                    errors.code
                      ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Mã ngành <span className="text-red-500">*</span>
            </label>
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code}</p>
            )}
          </div>

          <div className="relative">
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  placeholder="Nhập tên ngành"
                  maxLength={255}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                    errors.name
                      ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Tên ngành nghề <span className="text-red-500">*</span>
            </label>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="relative">
            <div className="relative">
              <select
                value={parentId ?? ''}
                onChange={(e) => handleParentChange(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 px-3 py-2 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Không có (ngành cấp 1)</option>
                {parentOptions
                  .filter((i: any) => i.isActive)
                  .map((i: any) => (
                    <option key={i.id} value={i.id}>
                      {i.code} - {i.name}
                    </option>
                  ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Nhóm ngành cha
            </label>
          </div>

          <div className="relative">
            <div className="relative">
              <select
                value={isActive ? 'active' : 'inactive'}
                onChange={(e) => setIsActive(e.target.value === 'active')}
                className="w-full appearance-none rounded-lg border border-slate-200 px-3 py-2 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="active">Sử dụng</option>
                <option value="inactive">Không sử dụng</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Trạng thái
            </label>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="text-slate-500 font-medium hover:text-slate-700 transition-colors text-sm"
          >
            Huỷ bỏ
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
