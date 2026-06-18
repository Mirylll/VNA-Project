"use client";

import { useEffect, useState } from 'react';
import { ChevronDown, Save } from 'lucide-react';
import { getAuthToken } from '@/libs/core/utils/auth-token';

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

interface EnterpriseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

export default function EnterpriseModal({
  open,
  onClose,
  onSuccess = () => {},
  initialData = null,
}: EnterpriseModalProps) {
  const [enterpriseTypes, setEnterpriseTypes] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [enterpriseTypeId, setEnterpriseTypeId] = useState('');
  const [industryId, setIndustryId] = useState('');
  const [wardId, setWardId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!initialData;

  useEffect(() => {
    if (!open) return;
    const token = getAuthToken();
    if (!token) return;

    fetch(`${baseUrl}/enterprise-types`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setEnterpriseTypes(d.filter((item: any) => item.isActive !== false)))
      .catch(() => {});

    fetch(`${baseUrl}/industries`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setIndustries(d.filter((item: any) => item.isActive !== false && item.level === 4)))
      .catch(() => {});

    fetch(`${baseUrl}/districts?provinceId=1`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setWards(d))
      .catch(() => {});
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (isEdit && initialData) {
      setName(initialData.name || '');
      setTaxCode(initialData.taxCode || '');
      setEnterpriseTypeId(String(initialData.enterpriseType?.id ?? ''));
      setIndustryId(String(initialData.industry?.id ?? ''));
      setWardId(String(initialData.ward?.id ?? ''));
      setIsActive(initialData.isActive ?? true);
    } else {
      setName('');
      setTaxCode('');
      setEnterpriseTypeId('');
      setIndustryId('');
      setWardId('');
      setIsActive(true);
    }
    setError('');
  }, [open, initialData, isEdit]);

  if (!open) return null;

  async function handleSave() {
    if (!name.trim()) {
      setError('Tên doanh nghiệp là bắt buộc');
      return;
    }
    if (!enterpriseTypeId) {
      setError('Vui lòng chọn loại hình kinh doanh');
      return;
    }
    if (!industryId) {
      setError('Vui lòng chọn ngành nghề kinh doanh');
      return;
    }

    const taxDigits = taxCode.replace(/-/g, '');
    if (taxCode.trim() && taxDigits.length < 10) {
      setError('Mã số thuế phải có ít nhất 10 ký tự (không tính dấu gạch ngang)');
      return;
    }
    if (taxDigits.length > 15) {
      setError('Mã số thuế tối đa 15 ký tự (không tính dấu gạch ngang)');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError('Bạn cần đăng nhập');
      return;
    }

    setSaving(true);
    setError('');

    const body: any = {
      name: name.trim(),
      taxCode: taxCode.trim() || undefined,
      enterpriseTypeId: Number(enterpriseTypeId),
      industryId: Number(industryId),
      wardId: wardId ? Number(wardId) : undefined,
      username: taxCode.trim(),
      password: 'Default@123',
      isActive,
    };

    try {
      const res = await fetch(
        `${baseUrl}/enterprises${isEdit ? `/${initialData.id}` : ''}`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || (isEdit ? 'Cập nhật thất bại' : 'Thêm mới thất bại'));
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối backend');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-3">
          <h2 className="text-white font-semibold text-base">
            {isEdit ? 'Cập nhật doanh nghiệp' : 'Thêm mới doanh nghiệp'}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="relative border border-slate-300 rounded-lg px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              Tên doanh nghiệp <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="Nhập tên doanh nghiệp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="w-full border-none outline-none text-sm py-0.5"
            />
          </div>

          <div className="relative border border-slate-300 rounded-lg px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              Mã số thuế
            </label>
            <input
              value={taxCode}
              onChange={(e) => setTaxCode(e.target.value)}
              maxLength={50}
              className="w-full border-none outline-none text-sm py-0.5"
            />
          </div>

          <div className="relative border border-slate-300 rounded-lg px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              Loại hình kinh doanh <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={enterpriseTypeId}
                onChange={(e) => setEnterpriseTypeId(e.target.value)}
                className="w-full appearance-none border-none outline-none text-sm py-0.5 bg-transparent pr-6"
              >
                <option value="" disabled>Chọn loại hình</option>
                {enterpriseTypes.map((et: any) => (
                  <option key={et.id} value={String(et.id)}>{et.name}</option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
          </div>

          <div className="relative border border-slate-300 rounded-lg px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              Ngành nghề kinh doanh <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={industryId}
                onChange={(e) => setIndustryId(e.target.value)}
                className="w-full appearance-none border-none outline-none text-sm py-0.5 bg-transparent pr-6"
              >
                <option value="" disabled>Chọn ngành nghề</option>
                {industries.map((ind: any) => (
                  <option key={ind.id} value={String(ind.id)}>{ind.code} - {ind.name}</option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
          </div>

          <div className="relative border border-slate-300 rounded-lg px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              Phường/ xã
            </label>
            <div className="relative">
              <select
                value={wardId}
                onChange={(e) => setWardId(e.target.value)}
                className="w-full appearance-none border-none outline-none text-sm py-0.5 bg-transparent pr-6"
              >
                <option value="" disabled>Chọn phường/ xã</option>
                {wards.map((w: any) => (
                  <option key={w.id} value={String(w.id)}>{w.name}</option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
          </div>

          <div className="relative border border-slate-300 rounded-lg px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              Trạng thái
            </label>
            <div className="relative">
              <select
                value={isActive ? 'active' : 'inactive'}
                onChange={(e) => setIsActive(e.target.value === 'active')}
                className="w-full appearance-none border-none outline-none text-sm py-0.5 bg-transparent pr-6"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200">
          <button
            onClick={onClose}
            disabled={saving}
            className="text-slate-500 font-medium hover:text-slate-700 transition-colors text-sm"
          >
            Huỷ bỏ
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}
