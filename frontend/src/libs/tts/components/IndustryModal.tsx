"use client";

import { ChevronDown, Save } from 'lucide-react';

interface IndustryModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: {
    code: string;
    name: string;
    parentGroup: string;
    status: string;
  }) => void;
  initialData?: {
    code: string;
    name: string;
    parentGroup: string;
    status: string;
  } | null;
}

export default function IndustryModal({
  open,
  onClose,
  onSave = () => {},
  initialData = null,
}: IndustryModalProps) {
  if (!open) return null;

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Modal header */}
        <div className="bg-blue-600 px-6 py-3">
          <h2 className="text-white font-semibold text-base">
            {isEdit
              ? 'Cập nhật ngành nghề kinh doanh'
              : 'Thêm mới ngành nghề kinh doanh'}
          </h2>
        </div>

        {/* Modal body */}
        <div className="p-6 space-y-6">
          {/* Field: Mã ngành */}
          <div className="relative border border-slate-300 rounded-lg px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              Mã ngành <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="1222"
              defaultValue={initialData?.code ?? ''}
              className="w-full border-none outline-none text-sm py-0.5"
            />
          </div>

          {/* Field: Tên ngành */}
          <div className="relative border border-slate-300 rounded-lg px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              Tên ngành <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="Khai thác đá tổ ong"
              defaultValue={initialData?.name ?? ''}
              className="w-full border-none outline-none text-sm py-0.5"
            />
          </div>

          {/* Field: Nhóm ngành cha */}
          <div className="relative border border-slate-300 rounded-lg px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              Nhóm ngành cha
            </label>
            <div className="relative">
              <select
                defaultValue={initialData?.parentGroup ?? ''}
                className="w-full appearance-none border-none outline-none text-sm py-0.5 bg-transparent pr-6"
              >
                <option value="" disabled>
                  122 - Khai thác đá
                </option>
                <option value="">Không có</option>
                <option value="122">122 - Khai thác đá</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
          </div>

          {/* Field: Trạng thái */}
          <div className="relative border border-slate-300 rounded-lg px-3 pt-3 pb-2">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              Trạng thái <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                defaultValue={initialData?.status ?? 'Sử dụng'}
                className="w-full appearance-none border-none outline-none text-sm py-0.5 bg-transparent pr-6"
              >
                <option>Sử dụng</option>
                <option>Không sử dụng</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="text-slate-500 font-medium hover:text-slate-700 transition-colors text-sm"
          >
            Huỷ bỏ
          </button>
          <button
            onClick={() =>
              onSave({
                code: '',
                name: '',
                parentGroup: '',
                status: 'Sử dụng',
              })
            }
            className="flex items-center gap-1.5 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm"
          >
            <Save size={15} />
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
