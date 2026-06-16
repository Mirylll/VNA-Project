"use client";

import { useRouter } from 'next/navigation';
import { Upload, Plus, ChevronDown, Pencil, KeyRound } from 'lucide-react';
import { hasPermission } from '@/libs/core/utils/auth-token';

function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-blue-600' : 'bg-gray-400'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-[18px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
}

export default function UserListPage() {
  const router = useRouter();
  const canCreate = hasPermission('ADMIN_C_USER_CREATE');
  const canUpdate = hasPermission('ADMIN_C_USER_UPDATE');

  function handleAddNew() {
    router.push('/admin/users/detail');
  }

  function handleEdit(id: any) {
    router.push(`/admin/users/detail?id=${id}`);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Danh sách người dùng
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-blue-500 text-blue-500 text-sm hover:bg-blue-50 transition-colors"
          >
            <Upload size={16} />
            Import
          </button>
          {canCreate && (
            <button
              onClick={handleAddNew}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Thêm mới
            </button>
          )}
        </div>
      </div>

      <div className="w-full overflow-hidden border border-slate-200 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-slate-200">
              <th className="w-10 px-2 py-3 text-left">
                <input type="checkbox" className="accent-blue-600" />
              </th>
              <th className="w-10 px-2 py-3" />
              <th className="w-10 px-2 py-3" />
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Họ và tên
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tài khoản
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Chức danh
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>

            <tr className="border-b border-slate-200">
              <td className="px-2 py-2" />
              <td className="px-2 py-2" />
              <td className="px-2 py-2" />
              <td className="px-3 py-2">
                <input
                  placeholder=""
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder=""
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder=""
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <div className="relative">
                  <select className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <option value="" />
                    <option value="Chuyên viên">Chuyên viên</option>
                    <option value="Quản lý">Quản lý</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder=""
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <div className="relative">
                  <select className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <option value="" />
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Ngừng">Ngừng</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200 hover:bg-gray-50 transition-colors">
              <td className="px-2 py-3 text-center">
                <input type="checkbox" className="accent-blue-600" />
              </td>
              <td className="px-2 py-3">
                {canUpdate && (
                  <button
                    onClick={() => handleEdit('')}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                )}
              </td>
              <td className="px-2 py-3">
                {canUpdate && (
                  <button
                    onClick={() => {}}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <KeyRound size={15} />
                  </button>
                )}
              </td>
              <td className="px-3 py-3 text-sm text-gray-500" />
              <td className="px-3 py-3 text-sm text-gray-500" />
              <td className="px-3 py-3 text-sm text-gray-500" />
              <td className="px-3 py-3 text-sm text-gray-500" />
              <td className="px-3 py-3 text-sm text-gray-500" />
              <td className="px-3 py-3">
                <ToggleSwitch
                  checked={false}
                  onChange={() => {}}
                  disabled={!canUpdate}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
