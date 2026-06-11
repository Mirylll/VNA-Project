"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Calendar, Eye, Download, Trash2 } from 'lucide-react';
import { useEnterpriseForm } from '@/libs/tts/contexts/EnterpriseFormContext';

export default function EnterpriseStep1({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const isEdit = !!searchParams?.id;
  const { formData, updateField } = useEnterpriseForm();
  const router = useRouter();

  useEffect(() => {
    if (isEdit) {
      // TODO: fetch enterprise data and call loadFromApi
    }
  }, [isEdit, searchParams?.id]);

  const handleContinue = () => {
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
  };

  return (
    <div>
      {/* ===== PANEL A ===== */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-6 pb-3 border-b border-slate-200">
          Thêm mới doanh nghiệp
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tên doanh nghiệp */}
          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
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
          </div>

          {/* Mã số thuế */}
          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
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
          </div>

          {/* Loại hình kinh doanh */}
          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
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
                <option value="1">Công ty cổ phần</option>
                <option value="2">Công ty TNHH 1 thành viên</option>
                <option value="3">Doanh nghiệp tư nhân</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
          </div>

          {/* Ngành nghề kinh doanh chính */}
          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
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
                <option value="1">Công nghệ thông tin</option>
                <option value="2">Xây dựng</option>
                <option value="3">Thương mại</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
          </div>

          {/* Ngày cấp GPKD */}
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

          {/* Tỉnh/Thành phố ĐKKD */}
          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
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
          </div>

          {/* Phường/Xã ĐKKD */}
          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
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
          </div>

          {/* Địa chỉ */}
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
          {/* Tên viết bằng tiếng nước ngoài */}
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

          {/* Email */}
          <div className="relative border border-slate-200 rounded-lg h-11 px-3 pt-3 pb-2">
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
          </div>

          {/* Số điện thoại cơ quan */}
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

          {/* Tỉnh/TP hoạt động KD */}
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

          {/* Phường/xã hoạt động KD */}
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

          {/* Empty placeholder */}
          <div />

          {/* Địa điểm kinh doanh */}
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

          {/* Người đứng đầu doanh nghiệp */}
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

          {/* SĐT liên hệ người đứng đầu */}
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
              {formData.attachments.map((file, idx) => (
                <tr key={idx} className="border-b border-slate-200 last:border-b-0">
                  <td className="px-4 py-3 text-sm text-gray-700">{file.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{file.fileName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye size={15} />
                      </button>
                      <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Download size={15} />
                      </button>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
