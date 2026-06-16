"use client";

import { useState, useEffect } from 'react';
import { Plus, Pencil, RefreshCw, ChevronDown } from 'lucide-react';
import { getAuthToken } from '@/libs/core/utils/auth-token';
import IndustryModal from '@/libs/tts/components/IndustryModal';
import SelectionBar from '@/libs/tts/components/SelectionBar';
import ConfirmDeleteDialog from '@/libs/tts/components/ConfirmDeleteDialog';

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

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

export default function IndustryListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  function fetchItems() {
    setLoading(true);
    setError('');

    const token = getAuthToken();
    if (!token) {
      setError('Bạn cần đăng nhập');
      setLoading(false);
      return;
    }

    fetch(`${baseUrl}/industries`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải danh sách');
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((err) => setError(err.message || 'Lỗi kết nối backend'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter((item: any) => {
    const c = filterCode.toLowerCase().trim();
    const n = filterName.toLowerCase().trim();
    const l = filterLevel.trim();
    if (c && !item.code.toLowerCase().includes(c)) return false;
    if (n && !item.name.toLowerCase().includes(n)) return false;
    if (l && String(item.level) !== l) return false;
    if (filterStatus === 'active' && !item.isActive) return false;
    if (filterStatus === 'inactive' && item.isActive) return false;
    return true;
  });

  function handleAddNew() {
    setEditingItem(null);
    setShowModal(true);
  }

  function handleEdit(item: any) {
    setEditingItem(item);
    setShowModal(true);
  }

  async function handleSave(data: { code: string; name: string; parentId?: number; level: number; isActive: boolean }) {
    const token = getAuthToken();
    if (!token) return;

    try {
      if (editingItem?.id) {
        await fetch(`${baseUrl}/industries/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
      } else {
        await fetch(`${baseUrl}/industries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
      }

      setShowModal(false);
      fetchItems();
    } catch {
      setError('Lỗi khi lưu');
    }
  }

  async function handleToggleStatus(item: any) {
    const token = getAuthToken();
    if (!token) return;

    // Optimistic update: cập nhật ngay trong state local, không re-fetch
    const newIsActive = !item.isActive;
    setItems((prev: any[]) =>
      prev.map((i: any) =>
        i.id === item.id ? { ...i, isActive: newIsActive } : i,
      ),
    );

    try {
      await fetch(`${baseUrl}/industries/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: newIsActive }),
      });
    } catch {
      // Rollback nếu API lỗi
      setItems((prev: any[]) =>
        prev.map((i: any) =>
          i.id === item.id ? { ...i, isActive: item.isActive } : i,
        ),
      );
      setError('Lỗi cập nhật trạng thái');
    }
  }

  async function handleDeleteSelected() {
    setDeleteConfirm(false);
    const token = getAuthToken();
    if (!token) return;

    const results = await Promise.allSettled(
      selectedIds.map((id) =>
        fetch(`${baseUrl}/industries/${id}`, {
          method: 'DELETE',
          headers: { authorization: `Bearer ${token}` },
        }),
      ),
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    const count = selectedIds.length;

    setSelectedIds([]);
    fetchItems();

    if (failed > 0) {
      setError(`Đã xoá ${succeeded}/${count} ngành nghề. ${failed} ngành nghề không thể xoá.`);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Danh sách ngành nghề kinh doanh
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Thêm mới
          </button>
        </div>
      </div>

      <div className="w-full overflow-hidden border border-slate-200 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-slate-200">
              <th className="w-10 px-2 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    filteredItems.length > 0 &&
                    selectedIds.length === filteredItems.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(filteredItems.map((r: any) => r.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                  className="accent-blue-600"
                />
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
              <th className="min-w-[160px] px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>

            <tr className="border-b border-slate-200">
              <td className="px-2 py-2" />
              <td className="px-2 py-2" />
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo mã ngành..."
                  value={filterCode}
                  onChange={(e) => setFilterCode(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo tên ngành..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo cấp..."
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Lọc theo trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không sử dụng</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                  Đang tải...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-red-400">
                  <span>{error}</span>
                  <button
                    onClick={fetchItems}
                    className="ml-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <RefreshCw size={14} /> Thử lại
                  </button>
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                  Không tìm thấy ngành nghề
                </td>
              </tr>
            ) : (
              filteredItems.map((item: any) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => {
                        setSelectedIds((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((id) => id !== item.id)
                            : [...prev, item.id],
                        );
                      }}
                      className="accent-blue-600"
                    />
                  </td>
                  <td className="px-2 py-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700 font-mono">
                    {item.code}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">
                    {item.name}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">
                    {item.level}
                  </td>
                  <td className="px-3 py-3">
                    <ToggleSwitch
                      checked={item.isActive}
                      onChange={() => handleToggleStatus(item)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <SelectionBar
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onDelete={() => setDeleteConfirm(true)}
      />

      <IndustryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={editingItem}
      />

      <ConfirmDeleteDialog
        open={deleteConfirm}
        message={`Xoá ${selectedIds.length} ngành nghề đã chọn?`}
        onConfirm={handleDeleteSelected}
        onCancel={() => setDeleteConfirm(false)}
      />
    </div>
  );
}
