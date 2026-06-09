"use client";

import { useState } from 'react';
import { Upload, Plus, Eye, Pencil, KeyRound, ChevronDown } from 'lucide-react';

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-blue-600' : 'bg-gray-400'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-[18px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
}

interface EnterpriseListPageProps {
  items?: any[];
  onImportClick?: () => void;
  onAddNewClick?: () => void;
  onViewClick?: (id: any) => void;
  onEditClick?: (id: any) => void;
  onKeyClick?: (id: any) => void;
  onFilterChange?: (field: string, value: string) => void;
  onToggleStatus?: (id: any, value: boolean) => void;
}

export default function EnterpriseListPage({
  items = [],
  onImportClick = () => {},
  onAddNewClick = () => {},
  onViewClick = (_id: any) => {},
  onEditClick = (_id: any) => {},
  onKeyClick = (_id: any) => {},
  onFilterChange = (_field: string, _value: string) => {},
  onToggleStatus = (_id: any, _value: boolean) => {},
}: EnterpriseListPageProps) {
  const [demoActive, setDemoActive] = useState(true);

  return (
    <div className="p-6">
      {/* Top header bar */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Danh sách doanh nghiệp
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={onImportClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-blue-500 text-blue-500 text-sm hover:bg-blue-50 transition-colors"
          >
            <Upload size={16} />
            Thêm từ file
          </button>
          <button
            onClick={onAddNewClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Table container */}
      <div className="w-full overflow-hidden border border-slate-200 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            {/* Column headers */}
            <tr className="bg-gray-50 border-b border-slate-200">
              <th className="w-10 px-2 py-3 text-left">
                <input type="checkbox" className="accent-blue-600" />
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tên doanh nghiệp
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mã số thuế
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Loại hình kinh doanh
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ngành nghề kinh doanh
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Phường/ xã
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>

            {/* Filter inputs row */}
            <tr className="border-b border-slate-200">
              <td className="px-2 py-2" />
              <td className="px-2 py-2" />
              <td className="px-3 py-2">
                <input
                  placeholder=""
                  onChange={(e) => onFilterChange('name', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder=""
                  onChange={(e) => onFilterChange('taxCode', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <div className="relative">
                  <select
                    onChange={(e) => onFilterChange('enterpriseType', e.target.value)}
                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="" />
                    <option value="Loại A">Loại A</option>
                    <option value="Loại B">Loại B</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="relative">
                  <select
                    onChange={(e) => onFilterChange('industry', e.target.value)}
                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="" />
                    <option value="Ngành A">Ngành A</option>
                    <option value="Ngành B">Ngành B</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="relative">
                  <select
                    onChange={(e) => onFilterChange('ward', e.target.value)}
                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="" />
                    <option value="Phường 1">Phường 1</option>
                    <option value="Phường 2">Phường 2</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="relative">
                  <select
                    onChange={(e) => onFilterChange('status', e.target.value)}
                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
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
            {/* Skeleton row showing structure */}
            <tr className="border-b border-slate-200 hover:bg-gray-50 transition-colors">
              <td className="px-2 py-3 text-center">
                <input type="checkbox" className="accent-blue-600" />
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewClick('')}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => onEditClick('')}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onKeyClick('')}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <KeyRound size={15} />
                  </button>
                </div>
              </td>
              <td className="px-3 py-3 text-sm text-gray-500" />
              <td className="px-3 py-3 text-sm text-gray-500" />
              <td className="px-3 py-3 text-sm text-gray-500" />
              <td className="px-3 py-3 text-sm text-gray-500" />
              <td className="px-3 py-3 text-sm text-gray-500" />
              <td className="px-3 py-3">
                <ToggleSwitch
                  checked={demoActive}
                  onChange={setDemoActive}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
