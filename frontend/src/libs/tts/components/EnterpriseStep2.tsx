"use client";

import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { useEnterpriseForm } from '@/libs/tts/contexts/EnterpriseFormContext';

const labelMap: Record<string, string> = {
  name: 'Tên doanh nghiệp',
  taxCode: 'Mã số thuế',
  enterpriseTypeId: 'Loại hình kinh doanh',
  industryId: 'Ngành nghề kinh doanh chính',
  licenseDate: 'Ngày cấp GPKD',
  provinceId: 'Tỉnh/Thành phố ĐKKD',
  wardId: 'Phường/Xã ĐKKD',
  address: 'Địa chỉ',
  foreignName: 'Tên viết bằng tiếng nước ngoài',
  email: 'Email',
  phone: 'Số điện thoại cơ quan',
  operationProvinceId: 'Tỉnh/TP hoạt động KD',
  operationWardId: 'Phường/xã hoạt động KD',
  operationAddress: 'Địa điểm kinh doanh',
  leaderName: 'Người đứng đầu doanh nghiệp',
  leaderPhone: 'SĐT liên hệ người đứng đầu',
};

const valueMap: Record<string, Record<string, string>> = {
  enterpriseTypeId: { '1': 'Công ty cổ phần', '2': 'Công ty TNHH', '3': 'Doanh nghiệp tư nhân' },
  industryId: { '1': 'Công nghệ thông tin', '2': 'Xây dựng', '3': 'Thương mại' },
  provinceId: { '1': 'Thành phố Hồ Chí Minh', '2': 'Hà Nội', '3': 'Đà Nẵng' },
  wardId: { '1': 'Phường Gò Vấp', '2': 'Phường 1', '3': 'Phường 2' },
  operationProvinceId: { '1': 'Thành phố Hồ Chí Minh', '2': 'Hà Nội', '3': 'Đà Nẵng' },
  operationWardId: { '1': 'Phường Gò Vấp', '2': 'Phường 1', '3': 'Phường 2' },
};

export default function EnterpriseStep2({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const isEdit = !!searchParams?.id;
  const { formData, resetForm } = useEnterpriseForm();
  const router = useRouter();

  const handleBack = () => {
    router.push(`/admin/enterprises/create${isEdit ? `?id=${searchParams.id}` : ''}`);
  };

  const handleConfirm = () => {
    // TODO: POST /enterprises or PUT /enterprises/:id
    resetForm();
    router.push('/admin/enterprises');
  };

  const renderValue = (key: string, value: string) => {
    if (!value) return <span className="text-gray-400">—</span>;
    const mapped = valueMap[key]?.[value];
    return mapped || value;
  };

  return (
    <div>
      {/* Xác nhận thông tin */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-6 pb-3 border-b border-slate-200">
          Xác nhận thông tin đăng ký
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(labelMap).map(([key, label]) => (
              <div key={key} className="col-span-1">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-sm text-gray-800 font-medium">
                  {renderValue(key, formData[key as keyof typeof formData] as string)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* File đính kèm */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-6 pb-3 border-b border-slate-200">
          File đính kèm
        </h3>
        <div className="w-full overflow-hidden border border-slate-200 rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên file</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thông tin file</th>
              </tr>
            </thead>
            <tbody>
              {formData.attachments.map((file, idx) => (
                <tr key={idx} className="border-b border-slate-200 last:border-b-0">
                  <td className="px-4 py-3 text-sm text-gray-700">{file.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{file.fileName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={handleBack}
          className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
        >
          Quay lại
        </button>
        <button
          onClick={handleConfirm}
          className="flex items-center gap-1.5 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm"
        >
          <Check size={15} />
          Xác nhận
        </button>
      </div>
    </div>
  );
}
