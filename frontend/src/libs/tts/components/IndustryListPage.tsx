"use client";

import { useState, useEffect, Fragment } from 'react';
import { Plus, Pencil, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { getAuthToken } from '@/libs/core/utils/auth-token';
import IndustryModal from '@/libs/tts/components/IndustryModal';
import SelectionBar from '@/libs/tts/components/SelectionBar';
import Pagination from './Pagination';
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

function matches(item: any, code: string, name: string) {
  const c = code.toLowerCase().trim();
  const n = name.toLowerCase().trim();
  return (
    (!c || item.code.toLowerCase().includes(c)) &&
    (!n || item.name.toLowerCase().includes(n))
  );
}

function toRoman(n: number): string {
  const val = [10, 9, 5, 4, 1];
  const sym = ['X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  for (let i = 0; i < val.length; i++) {
    while (n >= val[i]) {
      result += sym[i];
      n -= val[i];
    }
  }
  return result;
}

export default function IndustryListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

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
      .then((data) => {
        setItems(data);
        // Auto-expand all groups that have children
        const roots = data.filter((i: any) => !i.parent);
        roots.forEach((r: any, i: number) => { r.stt = toRoman(i + 1); });
        setExpandedGroups(roots.filter((r: any) => r.children?.length > 0).map((r: any) => r.code));
      })
      .catch((err) => setError(err.message || 'Lỗi kết nối backend'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCode, filterName, filterStatus, filterLevel, itemsPerPage]);

  // Recursive filter: match items + their children, attach _filteredChildren
  function filterTree(nodes: any[]): any[] {
    return nodes
      .map((node: any) => {
        const matchNode = matches(node, filterCode, filterName) &&
          (filterStatus === '' ||
            (filterStatus === 'active' && node.isActive) ||
            (filterStatus === 'inactive' && !node.isActive)) &&
          (!filterLevel.trim() || String(node.level).includes(filterLevel.trim()));
        const filteredChildren = filterTree(node.children || []);
        if (matchNode) {
          if (filteredChildren.length > 0) node = { ...node, _filteredChildren: filteredChildren };
          return node;
        }
        if (filteredChildren.length > 0)
          return { ...node, _filteredChildren: filteredChildren };
        return null;
      })
      .filter(Boolean);
  }

  // Roots = items with no parent
  const allRoots = items.filter((i: any) => !i.parent);

  // Filter: recursively
  const filteredGroups = filterCode || filterName || filterStatus
    ? filterTree(allRoots)
    : allRoots;

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function toggleGroup(code: string) {
    setExpandedGroups((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code],
    );
  }

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

  // Recursively collect visible IDs from expanded items
  function collectVisibleIds(nodes: any[]): number[] {
    const ids: number[] = [];
    nodes.forEach((item: any) => {
      ids.push(item.id);
      if (expandedGroups.includes(item.code)) {
        const children = item._filteredChildren || item.children || [];
        ids.push(...collectVisibleIds(children));
      }
    });
    return ids;
  }

  const allPageSelected = paginatedGroups.length > 0 &&
    collectVisibleIds(paginatedGroups).every((id) => selectedIds.includes(id));

  function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setSelectedIds((prev) => {
        const all = collectVisibleIds(paginatedGroups);
        return [...new Set([...prev, ...all])];
      });
    } else {
      const pageIds = new Set(collectVisibleIds(paginatedGroups));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    }
  }

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  // Recursive render
  function renderTreeRows(nodes: any[], depth: number): React.ReactNode {
    return nodes.map((item: any, idx: number) => {
      const children = item._filteredChildren || item.children || [];
      const hasChildren = children.length > 0;
      const isOpen = expandedGroups.includes(item.code);
      const isRoot = depth === 0;
      const indent = depth * 20;

      return (
        <Fragment key={item.id}>
          <tr className={`border-b ${depth === 0 ? 'border-slate-200' : 'border-slate-100'} hover:bg-gray-50 transition-colors`}>
            {/* Checkbox */}
            <td className="px-2 py-3 text-center">
              <div className={`inline-flex items-center gap-0.5 ${depth > 0 ? 'ml-6' : ''}`}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleGroup(item.code)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                ) : depth > 0 ? (
                  <span className="w-[14px]" />
                ) : null}
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="accent-blue-600 ml-0.5"
                />
              </div>
            </td>
            {/* STT */}
            <td className="px-2 py-3 text-center">
              {isRoot ? (
                <span className="text-xs font-semibold text-blue-600">{item.stt}</span>
              ) : (
                <span className="text-xs text-slate-500">{idx + 1}</span>
              )}
            </td>
            {/* Edit */}
            <td className="px-2 py-3">
              <button
                onClick={() => handleEdit(item)}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Pencil size={15} />
              </button>
            </td>
            {/* Mã ngành */}
            <td
              className={`px-3 py-3 text-sm font-mono ${depth === 0 ? 'font-semibold text-blue-600 break-all' : 'text-slate-600'}`}
              style={depth > 0 ? { paddingLeft: `${8 + indent}px` } : undefined}
            >
              {item.code}
            </td>
            {/* Tên ngành nghề */}
            <td
              className={`px-3 py-3 text-sm ${depth === 0 ? 'font-semibold text-blue-600' : 'text-slate-600'}`}
              style={depth > 0 ? { paddingLeft: `${4 + indent}px` } : undefined}
            >
              {item.name}
            </td>
            {/* Cấp */}
            <td className={`px-3 py-3 text-xs ${depth === 0 ? 'font-semibold text-blue-600 uppercase' : 'text-slate-500 uppercase'}`}>
              Cấp {item.level}
            </td>
            {/* Trạng thái */}
            <td className="px-3 py-3">
              <ToggleSwitch
                checked={item.isActive}
                onChange={() => handleToggleStatus(item)}
              />
            </td>
          </tr>
          {/* Recursive children */}
          {isOpen && hasChildren && renderTreeRows(children, depth + 1)}
        </Fragment>
      );
    });
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
                  checked={allPageSelected}
                  onChange={handleSelectAll}
                  className="accent-blue-600"
                />
              </th>
              <th className="w-10 px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                STT
              </th>
              <th className="w-10 px-2 py-3" />
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mã ngành
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tên ngành nghề
              </th>
              <th className="w-[10%] px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Cấp
              </th>
              <th className="min-w-[160px] px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>

            <tr className="border-b border-slate-200">
              <td className="px-2 py-2" />
              <td className="px-2 py-2">
                <div className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-gray-400 bg-gray-50">
                  I / II
                </div>
              </td>
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
                  placeholder="Lọc theo cấp..."
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
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                  Đang tải...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-red-400">
                  <span>{error}</span>
                  <button
                    onClick={fetchItems}
                    className="ml-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <RefreshCw size={14} /> Thử lại
                  </button>
                </td>
              </tr>
            ) : paginatedGroups.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                  Không tìm thấy ngành nghề
                </td>
              </tr>
            ) : (
              renderTreeRows(paginatedGroups, 0)
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredGroups.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
      />

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
