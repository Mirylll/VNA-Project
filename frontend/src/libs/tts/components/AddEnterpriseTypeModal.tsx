"use client";

import { useEffect, useState } from 'react';
import { ChevronDown, Loader2, Save } from 'lucide-react';

interface AddEnterpriseTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { code: string; name: string; isActive: boolean }) => void;
  initialData?: {
    id?: number;
    code?: string;
    name?: string;
    isActive?: boolean;
  } | null;
}

export default function AddEnterpriseTypeModal({
  open,
  onClose,
  onSave,
  initialData = null,
}: AddEnterpriseTypeModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});

  useEffect(() => {
    if (open) {
      setCode(initialData?.code || '');
      setName(initialData?.name || '');
      setIsActive(initialData?.isActive ?? true);
      setErrors({});
    }
  }, [open, initialData]);

  if (!open) return null;

  const isEdit = !!initialData?.id;

  function validate() {
    const errs: { code?: string; name?: string } = {};
    if (!code.trim()) errs.code = 'Mã loại hình không được để trống';
    if (!name.trim()) errs.name = 'Tên loại hình không được để trống';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({ code: code.trim(), name: name.trim(), isActive });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-3">
          <h2 className="text-white font-semibold text-base">
            {isEdit
              ? 'Cập nhật loại hình kinh doanh'
              : 'Thêm mới loại hình kinh doanh'}
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
              placeholder="Nhập mã loại hình"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                errors.code
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Mã loại hình <span className="text-red-500">*</span>
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
              placeholder="Nhập tên loại hình"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                errors.name
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Tên loại hình kinh doanh <span className="text-red-500">*</span>
            </label>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
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
