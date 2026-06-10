"use client";

import { useState } from 'react';
import { Upload, Plus, ChevronDown, Pencil } from 'lucide-react';
import AddEnterpriseTypeModal from '@/libs/tts/components/AddEnterpriseTypeModal';

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

interface EnterpriseTypeListPageProps {
  items?: any[];
  onImportClick?: () => void;
  onAddNewClick?: () => void;
  onEditClick?: (id: any) => void;
  onFilterChange?: (field: string, value: string) => void;
  onToggleStatus?: (id: any, value: boolean) => void;
}

export default function EnterpriseTypeListPage({
  items = [],
  onImportClick = () => {},
  onAddNewClick = () => {},
  onEditClick = (_id: any) => {},
  onFilterChange = (_field: string, _value: string) => {},
  onToggleStatus = (_id: any, _value: boolean) => {},
}: EnterpriseTypeListPageProps) {
  const [demoActive, setDemoActive] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  function handleAddNew() {
    onAddNewClick();
    setEditingItem(null);
    setShowModal(true);
  }

  function handleEdit(item: any) {
    onEditClick(item);
    setEditingItem(item);
    setShowModal(true);
  }

  return (
    <div className="p-6">
      {/* Top header bar */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Danh sách loại hình kinh doanh
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
            onClick={handleAddNew}
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
              <th className="w-10 px-2 py-3" />
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mã loại hình
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tên loại hình
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
                  onChange={(e) => onFilterChange('code', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder=""
                  onChange={(e) => onFilterChange('name', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
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
              <td className="px-2 py-3">
                <button
                  onClick={() => handleEdit({ id: '' })}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Pencil size={15} />
                </button>
              </td>
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

      <AddEnterpriseTypeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        initialData={editingItem}
      />
    </div>
  );
}
