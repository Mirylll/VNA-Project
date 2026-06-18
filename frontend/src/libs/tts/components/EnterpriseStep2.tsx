"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { useEnterpriseForm } from '@/libs/tts/contexts/EnterpriseFormContext';
import { getAuthToken, clearAuthToken } from '@/libs/core/utils/auth-token';

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

const fields = [
  { key: 'taxCode', label: 'Mã số thuế' },
  { key: 'name', label: 'Tên doanh nghiệp' },
  { key: 'foreignName', label: 'Tên viết bằng tiếng nước ngoài' },
  { key: 'licenseDate', label: 'Ngày cấp GPKD' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Số điện thoại cơ quan' },
  { key: 'enterpriseTypeId', label: 'Loại hình kinh doanh' },
  { key: 'industryId', label: 'Ngành nghề kinh doanh chính' },
  { key: 'provinceId', label: 'Tỉnh/Thành phố ĐKKD' },
  { key: 'wardId', label: 'Phường/Xã ĐKKD' },
  { key: 'address', label: 'Địa chỉ' },
  { key: 'operationProvinceId', label: 'Tỉnh/TP hoạt động KD' },
  { key: 'operationWardId', label: 'Phường/xã hoạt động KD' },
  { key: 'operationAddress', label: 'Địa điểm kinh doanh' },
  { key: 'leaderName', label: 'Người đứng đầu doanh nghiệp' },
  { key: 'leaderPhone', label: 'SĐT liên hệ người đứng đầu' },
];

export default function EnterpriseStep2({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const isEdit = !!searchParams?.id;
  const { formData, resetForm, deletedAttachmentIds, clearDeletedAttachments } = useEnterpriseForm();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [typesMap, setTypesMap] = useState<Record<string, string>>({});
  const [industriesMap, setIndustriesMap] = useState<Record<string, string>>({});
  const [wardsMap, setWardsMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    fetch(`${baseUrl}/enterprise-types`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((et: any) => { map[String(et.id)] = et.name; });
        setTypesMap(map);
      })
      .catch(() => {});

    fetch(`${baseUrl}/industries`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((ind: any) => { map[String(ind.id)] = `${ind.code} - ${ind.name}`; });
        setIndustriesMap(map);
      })
      .catch(() => {});

    fetch(`${baseUrl}/districts?provinceId=1`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((w: any) => { map[String(w.id)] = w.name; });
        setWardsMap(map);
      })
      .catch(() => {});
  }, []);

  const handleBack = () => {
    router.push(`/admin/enterprises/create${isEdit ? `?id=${searchParams.id}` : ''}`);
  };

  const handleConfirm = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('Bạn cần đăng nhập');
      return;
    }

    if (!formData.name.trim()) { setError('Tên doanh nghiệp không được để trống'); return; }
    if (!formData.taxCode.trim()) { setError('Mã số thuế không được để trống'); return; }
    if (!formData.enterpriseTypeId) { setError('Loại hình kinh doanh không được để trống'); return; }
    if (!formData.industryId) { setError('Ngành nghề kinh doanh không được để trống'); return; }
    if (!formData.provinceId) { setError('Tỉnh/Thành phố ĐKKD không được để trống'); return; }
    if (!formData.wardId) { setError('Phường/Xã ĐKKD không được để trống'); return; }
    if (!formData.email.trim()) { setError('Email không được để trống'); return; }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Email không đúng định dạng'); return;
    }

    setSaving(true);
    setError('');

    const body: any = {
      name: formData.name.trim(),
      taxCode: formData.taxCode.trim() || undefined,
      enterpriseTypeId: Number(formData.enterpriseTypeId),
      industryId: Number(formData.industryId),
      licenseDate: formData.licenseDate || undefined,
      provinceId: Number(formData.provinceId),
      wardId: Number(formData.wardId),
      address: formData.address || undefined,
      foreignName: formData.foreignName || undefined,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      operationProvinceId: formData.operationProvinceId ? Number(formData.operationProvinceId) : undefined,
      operationWardId: formData.operationWardId ? Number(formData.operationWardId) : undefined,
      operationAddress: formData.operationAddress || undefined,
      leaderName: formData.leaderName || undefined,
      leaderPhone: formData.leaderPhone || undefined,
      username: formData.taxCode.trim(),
      password: 'Default@123',
      isActive: true,
    };

    try {
      const res = await fetch(
        `${baseUrl}/enterprises${isEdit ? `/${searchParams.id}` : ''}`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );

      if (res.status === 401) {
        clearAuthToken();
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || (isEdit ? 'Cập nhật thất bại' : 'Thêm mới thất bại'));
      }

      const enterprise = await res.json();
      const enterpriseId = enterprise.id || searchParams.id;

      // 1. Delete attachments marked for deletion (edit mode)
      if (isEdit && deletedAttachmentIds.length > 0) {
        const deleteResults = await Promise.allSettled(
          deletedAttachmentIds.map((attId) =>
            fetch(`${baseUrl}/enterprises/${enterpriseId}/attachments/${attId}`, {
              method: 'DELETE',
              headers: { authorization: `Bearer ${token}` },
            }),
          ),
        );
        const deleteFailed = deleteResults.filter((r) => r.status === 'rejected');
        if (deleteFailed.length > 0) {
          setError(`Xoá file thất bại: ${deleteFailed.length} file`);
        }
        clearDeletedAttachments();
      }

      // 2. Upload new attachments (both create and edit)
      const newAttachments = formData.attachments.filter((att) => att.file);
      if (newAttachments.length > 0) {
        const uploadPromises = newAttachments.map(async (att) => {
          const fd = new FormData();
          fd.append('file', att.file!);
          fd.append('name', att.name);
          const uploadRes = await fetch(
            `${baseUrl}/enterprises/${enterpriseId}/attachments`,
            {
              method: 'POST',
              headers: { authorization: `Bearer ${token}` },
              body: fd,
            },
          );
          if (!uploadRes.ok) {
            const errText = await uploadRes.text().catch(() => 'Upload file thất bại');
            throw new Error(`${att.name}: ${errText}`);
          }
        });

        const results = await Promise.allSettled(uploadPromises);
        const rejected = results.filter((r) => r.status === 'rejected');
        if (rejected.length > 0) {
          const messages = rejected
            .map((r: any) => r.reason?.message || 'Lỗi upload')
            .join('; ');
          setError(`Doanh nghiệp đã lưu nhưng có lỗi upload: ${messages}`);
          resetForm();
          router.push('/admin/enterprises');
          return;
        }
      }

      resetForm();
      router.push('/admin/enterprises');
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối backend');
    } finally {
      setSaving(false);
    }
  };

  const renderValue = (key: string, value: string) => {
    if (!value) return <span className="text-gray-400">—</span>;
    if (key === 'enterpriseTypeId') return typesMap[value] || value;
    if (key === 'industryId') return industriesMap[value] || value;
    if (key === 'wardId' || key === 'operationWardId') return wardsMap[value] || value;
    if (key === 'provinceId' || key === 'operationProvinceId') {
      const provinceLabel: Record<string, string> = {
        '1': 'Thành phố Hồ Chí Minh',
        '2': 'Hà Nội',
        '3': 'Đà Nẵng',
      };
      return provinceLabel[value] || value;
    }
    return value;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-lg font-bold text-gray-900 mb-6">
        Thông tin về hồ sơ
      </h2>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="space-y-4">
          {fields.map(({ key, label }) => {
            const rawValue = formData[key as keyof typeof formData] as string;
            return (
              <div key={key} className="flex gap-4">
                <div className="w-56 shrink-0 text-sm font-semibold text-gray-800">
                  {label}
                  <span className="ml-0.5">:</span>
                </div>
                <div className="flex-1 text-sm text-gray-600">
                  {renderValue(key, rawValue)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 mb-6">
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
            {["Giấy phép kinh doanh", "Giấy tờ khác"].map((label, i) => {
              const f = formData.attachments.find(a => a.name === label);
              const hasFile = !!(f?.file || f?.fileName);
              return (
                <tr key={i} className="border-t border-gray-200 bg-white">
                  <td className="px-4 py-3 text-gray-700">{label}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {hasFile ? (f?.fileName || f?.file?.name) : <span className="italic text-gray-300">Chưa có file</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {hasFile && (
                      <button
                        type="button"
                        onClick={() => f?.url && window.open(f.url, '_blank')}
                        title="Xem file"
                        className="text-gray-400 hover:text-blue-600 transition p-1 inline-flex"
                      >
                        <EyeIcon />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
        <button
          onClick={handleBack}
          disabled={saving}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
        >
          Trở về
        </button>
        <button
          onClick={handleConfirm}
          disabled={saving}
          className="flex items-center gap-1.5 bg-blue-600 text-white font-semibold px-6 py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Check size={15} />
              Xác nhận
            </>
          )}
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
