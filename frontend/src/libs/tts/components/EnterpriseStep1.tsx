"use client";

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useEnterpriseForm } from '@/libs/tts/contexts/EnterpriseFormContext';
import { getAuthToken, clearAuthToken } from '@/libs/core/utils/auth-token';
import DatePicker from '@/libs/tts/components/DatePicker';
import Autocomplete from '@/libs/tts/components/Autocomplete';

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

const requiredFields: { key: string; label: string }[] = [
  { key: 'name', label: 'Tên doanh nghiệp' },
  { key: 'taxCode', label: 'Mã số thuế' },
  { key: 'enterpriseTypeId', label: 'Loại hình kinh doanh' },
  { key: 'industryId', label: 'Ngành nghề kinh doanh chính' },
  { key: 'provinceId', label: 'Tỉnh/Thành phố ĐKKD' },
  { key: 'wardId', label: 'Phường/Xã ĐKKD' },
  { key: 'email', label: 'Email' },
];

export default function EnterpriseStep1({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const isEdit = !!searchParams?.id;
  const { formData, updateField, loadFromApi, markAttachmentForDelete } = useEnterpriseForm();
  const router = useRouter();
  const [enterpriseTypes, setEnterpriseTypes] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const REQUIRED_LABELS = ["Giấy phép kinh doanh", "Giấy tờ khác"];

  const fileEntries = REQUIRED_LABELS.map(label => {
    const existing = formData.attachments.find(a => a.name === label);
    return {
      label,
      file: existing?.file || null,
      fileName: existing?.fileName || null,
      url: existing?.url || null,
      id: existing?.id,
    };
  });

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (label: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      alert("Chỉ chấp nhận file PDF");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      alert(`Dung lượng file tối đa là 10MB`);
      return;
    }
    const newAtt = {
      name: label,
      fileName: f.name,
      file: f,
      url: URL.createObjectURL(f),
      size: `${(f.size / 1024).toFixed(0)} KB`
    };

    const next = [...formData.attachments];
    const existingIdx = next.findIndex(a => a.name === label);
    if (existingIdx >= 0) {
      const existing = next[existingIdx];
      if (existing.id) markAttachmentForDelete(existing.id);
      next[existingIdx] = newAtt;
    } else {
      next.push(newAtt);
    }
    updateField('attachments', next);
    e.target.value = '';
  };

  const handleDeleteFile = (label: string) => {
    const existingIdx = formData.attachments.findIndex(a => a.name === label);
    if (existingIdx >= 0) {
      const existing = formData.attachments[existingIdx];
      if (existing.id) markAttachmentForDelete(existing.id);
      const next = formData.attachments.filter((_, i) => i !== existingIdx);
      updateField('attachments', next);
    }
  };

  useEffect(() => {
    if (!isEdit || !searchParams?.id) return;
    let cancelled = false;
    (async () => {
      const token = getAuthToken();
      if (!token) return;
      try {
        const res = await fetch(`${baseUrl}/enterprises/${searchParams.id}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          clearAuthToken();
          router.push('/login');
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        loadFromApi({
          name: data.name || '',
          taxCode: data.taxCode || '',
          enterpriseTypeId: String(data.enterpriseType?.id ?? data.enterpriseTypeId ?? ''),
          industryId: String(data.industry?.id ?? data.industryId ?? ''),
          licenseDate: data.licenseDate ? data.licenseDate.substring(0, 10) : '',
          provinceId: String(data.province?.id ?? data.provinceId ?? ''),
          wardId: String(data.ward?.id ?? data.wardId ?? ''),
          address: data.address || '',
          foreignName: data.foreignName || '',
          email: data.email || '',
          phone: data.phone || '',
          operationProvinceId: String(data.operationProvince?.id ?? data.operationProvinceId ?? ''),
          operationWardId: String(data.operationWard?.id ?? data.operationWardId ?? ''),
          operationAddress: data.operationAddress || '',
          leaderName: data.leaderName || '',
          leaderPhone: data.leaderPhone || '',
          attachments: (data.attachments || []).map((att: any) => ({
            id: att.id,
            name: att.name,
            fileName: att.fileName,
            url: `${baseUrl}${att.filePath}`,
            size: att.fileSize
              ? att.fileSize > 1024 * 1024
                ? `${(att.fileSize / (1024 * 1024)).toFixed(1)} MB`
                : `${(att.fileSize / 1024).toFixed(0)} KB`
              : undefined,
          })),
        });
      } catch (err) {
        console.error('Failed to load enterprise for edit', err);
      }
    })();
    return () => { cancelled = true; };
  }, [isEdit, searchParams?.id]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    fetch(`${baseUrl}/enterprise-types`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setEnterpriseTypes(data.filter((d: any) => d.isActive !== false)))
      .catch(() => {});
    fetch(`${baseUrl}/industries`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setIndustries(data.filter((d: any) => d.isActive !== false && d.level === 4)))
      .catch(() => {});
    fetch(`${baseUrl}/provinces`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : [])
      .then(setProvinces)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!formData.provinceId) return;
    const token = getAuthToken();
    if (!token) return;
    fetch(`${baseUrl}/districts?provinceId=${formData.provinceId}`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setWards(data))
      .catch(() => {});
  }, [formData.provinceId]);

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};
    for (const field of requiredFields) {
      const value = (formData as any)[field.key];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field.key] = `${field.label} không được để trống`;
      }
    }

    const taxDigits = formData.taxCode.replace(/-/g, '');
    if (formData.taxCode.trim() && taxDigits.length < 10) {
      newErrors.taxCode = 'Mã số thuế phải có ít nhất 10 ký tự (không tính dấu gạch ngang)';
    } else if (taxDigits.length > 15) {
      newErrors.taxCode = 'Mã số thuế tối đa 15 ký tự (không tính dấu gạch ngang)';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Email không đúng định dạng';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    router.push(
      `/admin/enterprises/create/step-2${isEdit ? `?id=${searchParams.id}` : ''}`,
    );
  };

  const handleCancel = () => {
    router.push('/admin/enterprises');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    updateField(name as any, value);
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  function renderField(key: string, children: React.ReactNode) {
    const hasError = !!errors[key];
    return (
      <div>
        <div
          className={`relative border rounded-lg h-11 px-3 pt-3 pb-2 ${
            hasError ? 'border-red-400' : 'border-slate-200'
          }`}
        >
          {children}
        </div>
        {hasError && (
          <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* ===== PANEL A ===== */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-6 pb-3 border-b border-slate-200">
            {isEdit ? 'Cập nhật doanh nghiệp' : 'Thêm mới doanh nghiệp'}
          </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderField('name',
            <>
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                Tên doanh nghiệp <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Công ty cổ phần công nghệ quốc tế VNA"
                maxLength={100}
                className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300"
              />
            </>
          )}

          {renderField('taxCode',
            <>
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                Mã số thuế <span className="text-red-500">*</span>
              </label>
              <input
                name="taxCode"
                value={formData.taxCode}
                onChange={handleInputChange}
                placeholder="910000888292"
                maxLength={50}
                className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300"
              />
            </>
          )}

          {renderField('enterpriseTypeId',
            <>
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                Loại hình kinh doanh <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="enterpriseTypeId"
                  value={formData.enterpriseTypeId}
                  onChange={handleInputChange}
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
            </>
          )}

          {renderField('industryId',
            <>
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                Ngành nghề kinh doanh chính <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="industryId"
                  value={formData.industryId}
                  onChange={handleInputChange}
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
            </>
          )}

          <div className="relative w-full">
            <label className="absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs text-slate-500">
              Ngày cấp GPKD
            </label>
            <DatePicker
              value={formData.licenseDate}
              onChange={(iso) => updateField('licenseDate', iso)}
              className="w-full"
            />
          </div>

          {renderField('provinceId',
            <>
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                Tỉnh/Thành phố ĐKKD <span className="text-red-500">*</span>
              </label>
              <Autocomplete
                value={formData.provinceId}
                options={provinces.map((p: any) => ({ id: p.id, name: p.name }))}
                placeholder="Chọn tỉnh/thành phố"
                onSelect={(val) => updateField('provinceId', val)}
                className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300"
                plain
              />
            </>
          )}

          <div className={`relative border rounded-lg h-11 px-3 pt-3 pb-2 ${errors.wardId ? 'border-red-400' : 'border-slate-200'}`}>
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Phường/Xã ĐKKD <span className="text-red-500">*</span>
            </label>
            <Autocomplete
              value={formData.wardId}
              options={wards.map((w: any) => ({ id: w.id, name: w.name }))}
              placeholder="Chọn phường/xã"
              onSelect={(val) => {
                updateField('wardId', val);
                if (errors.wardId) {
                  setErrors((prev) => { const n = { ...prev }; delete n.wardId; return n; });
                }
              }}
              className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300"
              error={!!errors.wardId}
              plain
            />
          </div>

          <div className="col-span-2 relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Địa chỉ
            </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                maxLength={500}
                className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300"
              />
          </div>
        </div>
      </div>

      {/* ===== PANEL B ===== */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-6 pb-3 border-b border-slate-200">
          Thông tin liên hệ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Tên viết bằng tiếng nước ngoài
            </label>
              <input
                name="foreignName"
                value={formData.foreignName}
                onChange={handleInputChange}
                maxLength={255}
                className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300"
              />
          </div>

          {renderField('email',
            <>
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="vna@gmail.com"
                maxLength={200}
                className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300"
              />
            </>
          )}

          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Số điện thoại cơ quan
            </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                maxLength={20}
                className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300"
              />
          </div>

          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Tỉnh/TP hoạt động KD
            </label>
            <Autocomplete
              value={formData.operationProvinceId}
              options={provinces.map((p: any) => ({ id: p.id, name: p.name }))}
              onSelect={(val) => updateField('operationProvinceId', val)}
              className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300"
              plain
            />
          </div>

          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Phường/xã hoạt động KD
            </label>
            <Autocomplete
              value={formData.operationWardId}
              options={wards.map((w: any) => ({ id: w.id, name: w.name }))}
              onSelect={(val) => updateField('operationWardId', val)}
              className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300"
              plain
            />
          </div>

          <div />

          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Địa điểm kinh doanh
            </label>
              <input
                name="operationAddress"
                value={formData.operationAddress}
                onChange={handleInputChange}
                maxLength={500}
                className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300"
              />
          </div>

          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Người đứng đầu doanh nghiệp
            </label>
              <input
                name="leaderName"
                value={formData.leaderName}
                onChange={handleInputChange}
                maxLength={100}
                className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300"
              />
          </div>

          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              SĐT liên hệ người đứng đầu
            </label>
              <input
                name="leaderPhone"
                value={formData.leaderPhone}
                onChange={handleInputChange}
                maxLength={20}
                className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300"
              />
          </div>
        </div>
      </div>

      {/* ===== PANEL C ===== */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-4">File đính kèm</h3>
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Tên file</th>
              <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Thông tin file</th>
              <th className="text-right px-4 py-2.5 text-gray-600 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {fileEntries.map((f, i) => {
              const hasFile = !!(f.file || f.fileName);
              return (
                <tr key={i} className="border-t border-gray-200">
                  <td className="px-4 py-3 text-gray-700">{f.label}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {hasFile ? f.fileName : <span className="italic text-gray-300">Chưa có file</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {/* View */}
                      <button
                        type="button"
                        onClick={() => f.url && window.open(f.url, '_blank')}
                        disabled={!hasFile}
                        title="Xem file"
                        className={`p-1.5 rounded transition ${
                          hasFile
                            ? "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                            : "text-gray-200 cursor-not-allowed"
                        }`}
                      >
                        <EyeIcon />
                      </button>
                      {/* Upload / ghi đè */}
                      <button
                        type="button"
                        title="Tải lên"
                        onClick={() => fileRefs.current[i]?.click()}
                        className="p-1.5 rounded text-gray-500 hover:text-green-600 hover:bg-green-50 transition"
                      >
                        <UploadIcon />
                      </button>
                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteFile(f.label)}
                        disabled={!hasFile}
                        title="Xóa file"
                        className={`p-1.5 rounded transition ${
                          hasFile
                            ? "text-gray-500 hover:text-red-600 hover:bg-red-50"
                            : "text-gray-200 cursor-not-allowed"
                        }`}
                      >
                        <TrashIcon />
                      </button>
                      {/* Hidden file input */}
                      <input
                        type="file"
                        accept="application/pdf"
                        ref={(el) => { fileRefs.current[i] = el; }}
                        className="hidden"
                        onChange={(e) => handleFileChange(f.label, e)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={handleCancel}
          className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
        >
          Huỷ bỏ
        </button>
        <button
          onClick={handleContinue}
          className="flex items-center gap-1.5 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm"
        >
          Tiếp tục
          <ChevronDown size={15} className="rotate-[-90deg]" />
        </button>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
