"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Calendar, Upload, Eye, Download, Trash2 } from 'lucide-react';
import { useEnterpriseForm } from '@/libs/tts/contexts/EnterpriseFormContext';
import { getAuthToken, clearAuthToken } from '@/libs/core/utils/auth-token';
import AttachmentDialog from '@/libs/tts/components/AttachmentDialog';
import ConfirmDeleteDialog from '@/libs/tts/components/ConfirmDeleteDialog';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachDialogOpen, setAttachDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ idx: number; name: string; id?: number } | null>(null);

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
        if (data.province?.id && data.province?.id !== 1) {
          try {
            const wardRes = await fetch(`${baseUrl}/districts?provinceId=${data.province.id}`, {
              headers: { authorization: `Bearer ${token}` },
            });
            if (wardRes.ok) setWards(await wardRes.json());
          } catch {}
        }
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
      .then((data) => setEnterpriseTypes(data))
      .catch(() => {});
    fetch(`${baseUrl}/industries`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setIndustries(data))
      .catch(() => {});
  }, []);

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};
    for (const field of requiredFields) {
      const value = (formData as any)[field.key];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field.key] = `${field.label} không được để trống`;
      }
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

          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Ngày cấp GPKD
            </label>
            <div className="relative">
              <input
                type="date"
                name="licenseDate"
                value={formData.licenseDate}
                onChange={handleInputChange}
                className="w-full border-none outline-none text-sm py-0.5 [color-scheme:light]"
              />
              <Calendar
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
          </div>

          {renderField('provinceId',
            <>
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                Tỉnh/Thành phố ĐKKD <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="provinceId"
                  value={formData.provinceId}
                  onChange={handleInputChange}
                  className="w-full appearance-none border-none outline-none text-sm py-0.5 bg-transparent pr-6"
                >
                  <option value="" disabled>Chọn tỉnh/thành phố</option>
                  <option value="1">Thành phố Hồ Chí Minh</option>
                  <option value="2">Hà Nội</option>
                  <option value="3">Đà Nẵng</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                />
              </div>
            </>
          )}

          {renderField('wardId',
            <>
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                Phường/Xã ĐKKD <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="wardId"
                  value={formData.wardId}
                  onChange={handleInputChange}
                  className="w-full appearance-none border-none outline-none text-sm py-0.5 bg-transparent pr-6"
                >
                  <option value="" disabled>Chọn phường/xã</option>
                  <option value="1">Phường Hiệp Bình Phước</option>
                  <option value="2">Phường 1</option>
                  <option value="3">Phường 2</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                />
              </div>
            </>
          )}

          <div className="col-span-2 relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Địa chỉ
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="162 đường số 2, khu đô thị Vạn Phúc"
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
              className="w-full border-none outline-none text-sm py-0.5"
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
              className="w-full border-none outline-none text-sm py-0.5"
            />
          </div>

          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Tỉnh/TP hoạt động KD
            </label>
            <div className="relative">
              <select
                name="operationProvinceId"
                value={formData.operationProvinceId}
                onChange={handleInputChange}
                className="w-full appearance-none border-none outline-none text-sm py-0.5 bg-transparent pr-6"
              >
                <option value="" disabled>Chọn tỉnh/thành phố</option>
                <option value="1">Thành phố Hồ Chí Minh</option>
                <option value="2">Hà Nội</option>
                <option value="3">Đà Nẵng</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
          </div>

          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Phường/xã hoạt động KD
            </label>
            <div className="relative">
              <select
                name="operationWardId"
                value={formData.operationWardId}
                onChange={handleInputChange}
                className="w-full appearance-none border-none outline-none text-sm py-0.5 bg-transparent pr-6"
              >
                <option value="" disabled>Chọn phường/xã</option>
                <option value="1">Phường Gò Vấp</option>
                <option value="2">Phường 1</option>
                <option value="3">Phường 2</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
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
              className="w-full border-none outline-none text-sm py-0.5"
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
              className="w-full border-none outline-none text-sm py-0.5"
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
              className="w-full border-none outline-none text-sm py-0.5"
            />
          </div>
        </div>
      </div>

      {/* ===== PANEL C ===== */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-6 pb-3 border-b border-slate-200">
          File đính kèm
        </h3>

        <div className="w-full overflow-hidden border border-slate-200 rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tên file
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Thông tin file
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {formData.attachments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-400">
                    Chưa có file đính kèm
                  </td>
                </tr>
              ) : (
                formData.attachments.map((file, idx) => (
                  <tr key={idx} className="border-b border-slate-200 last:border-b-0">
                    <td className="px-4 py-3 text-sm text-gray-700">{file.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{file.fileName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => file.url && window.open(file.url, '_blank')}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                        {file.url && (
                          <a
                            href={file.url}
                            download={file.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Download size={15} />
                          </a>
                        )}
                        <button
                          onClick={() => setDeleteConfirm({ idx, name: file.name, id: file.id })}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => setAttachDialogOpen(true)}
          className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-lg border border-dashed border-blue-400 text-blue-500 text-sm hover:bg-blue-50 transition-colors"
        >
          <Upload size={16} />
          Thêm file đính kèm
        </button>
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

      <AttachmentDialog
        open={attachDialogOpen}
        onClose={() => setAttachDialogOpen(false)}
      />

      <ConfirmDeleteDialog
        open={!!deleteConfirm}
        message="Xoá file đính kèm"
        itemName={deleteConfirm?.name}
        onConfirm={() => {
          try {
            if (deleteConfirm === null) return;
            if (deleteConfirm.id) {
              markAttachmentForDelete(deleteConfirm.id);
            } else {
              const next = formData.attachments.filter((_, i) => i !== deleteConfirm.idx);
              updateField('attachments', next);
            }
          } finally {
            setDeleteConfirm(null);
          }
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
