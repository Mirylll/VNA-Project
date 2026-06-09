"use client";

import { useState } from 'react';
import { Upload, Plus, Pencil } from 'lucide-react';
import IndustryModal from '@/libs/tts/components/IndustryModal';

interface IndustryListPageProps {
  items?: any[];
  onImportClick?: () => void;
  onAddNewClick?: () => void;
  onEditClick?: (id: any) => void;
  onFilterChange?: (field: string, value: string) => void;
}

export default function IndustryListPage({
  items = [],
  onImportClick = () => {},
  onAddNewClick = () => {},
  onEditClick = (_id: any) => {},
  onFilterChange = (_field: string, _value: string) => {},
}: IndustryListPageProps) {
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
          Danh sách ngành nghề kinh doanh
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
                Mã ngành
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tên ngành nghề
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Cấp
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
                <input
                  placeholder=""
                  onChange={(e) => onFilterChange('level', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
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
              <td className="px-3 py-3 text-sm text-gray-500" />
            </tr>
          </tbody>
        </table>
      </div>

      <IndustryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        initialData={editingItem}
      />
    </div>
  );
}
