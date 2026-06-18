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

export default function IndustryListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
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
  }, [filterCode, filterName, filterStatus, itemsPerPage]);

  // Build tree: children grouped by parent
  const childrenByParentId: Record<number, any[]> = {};
  items.forEach((item: any) => {
    const pid = item.parent?.id;
    if (pid) {
      if (!childrenByParentId[pid]) childrenByParentId[pid] = [];
      childrenByParentId[pid].push(item);
    }
  });

  // Roots = items with no parent
  const allRoots = items.filter((i: any) => !i.parent);

  // Filter: match groups + children (like PermissionListPage)
  const filteredGroups = filterCode || filterName || filterStatus
    ? allRoots
        .map((group: any) => {
          const matchGroup = matches(group, filterCode, filterName) &&
            (filterStatus === '' ||
              (filterStatus === 'active' && group.isActive) ||
              (filterStatus === 'inactive' && !group.isActive));
          const filteredChildren = (childrenByParentId[group.id] || []).filter(
            (child: any) =>
              matches(child, filterCode, filterName) &&
              (filterStatus === '' ||
                (filterStatus === 'active' && child.isActive) ||
                (filterStatus === 'inactive' && !child.isActive)),
          );
          if (matchGroup) return group;
          if (filteredChildren.length > 0)
            return { ...group, _filteredChildren: filteredChildren };
          return null;
        })
        .filter(Boolean)
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

  // compute all item IDs for the current page (groups + visible children)
  function getPageItemIds(): number[] {
    const ids: number[] = [];
    paginatedGroups.forEach((group: any) => {
      ids.push(group.id);
      if (expandedGroups.includes(group.code)) {
        const children = group._filteredChildren || childrenByParentId[group.id] || [];
        children.forEach((c: any) => ids.push(c.id));
      }
    });
    return ids;
  }

  const allPageSelected = paginatedGroups.length > 0 &&
    getPageItemIds().every((id) => selectedIds.includes(id));

  function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setSelectedIds((prev) => {
        const all = getPageItemIds();
        return [...new Set([...prev, ...all])];
      });
    } else {
      const pageIds = new Set(getPageItemIds());
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    }
  }

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
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
              <th className="w-10 px-2 py-3" />
              <th className="w-[10%] px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Cấp
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mã ngành
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tên ngành nghề
              </th>
              <th className="min-w-[160px] px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>

            <tr className="border-b border-slate-200">
              <td className="px-2 py-2" />
              <td className="px-2 py-2" />
              <td className="px-3 py-2">
                <div className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-gray-400 bg-gray-50">
                  Cấp 1 / Cấp 2
                </div>
              </td>
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
            ) : paginatedGroups.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                  Không tìm thấy ngành nghề
                </td>
              </tr>
            ) : (
              paginatedGroups.map((group: any) => {
                const groupChildren = group._filteredChildren || childrenByParentId[group.id] || [];
                const isOpen = expandedGroups.includes(group.code);
                const hasChildren = groupChildren.length > 0;

                return (
                  <Fragment key={group.id}>
                    {/* Group row (parent / level 1) */}
                    <tr className="border-b border-slate-200 hover:bg-gray-50 transition-colors">
                      <td className="px-2 py-3 text-center">
                        <div className="inline-flex items-center gap-0.5">
                          {hasChildren ? (
                            <button
                              onClick={() => toggleGroup(group.code)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                          ) : (
                            <span className="w-[14px]" />
                          )}
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(group.id)}
                            onChange={() => toggleSelect(group.id)}
                            className="accent-blue-600 ml-0.5"
                          />
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <button
                          onClick={() => handleEdit(group)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                      </td>
                      <td className="px-3 py-3 text-xs font-semibold text-blue-600 uppercase">
                        Cấp 1
                      </td>
                      <td className="px-3 py-3 text-sm font-semibold text-blue-600 font-mono break-all">
                        {group.code}
                      </td>
                      <td className="px-3 py-3 text-sm font-semibold text-blue-600">
                        {group.name}
                      </td>
                      <td className="px-3 py-3">
                        <ToggleSwitch
                          checked={group.isActive}
                          onChange={() => handleToggleStatus(group)}
                        />
                      </td>
                    </tr>

                    {/* Child rows */}
                    {isOpen && hasChildren && groupChildren.map((child: any) => (
                      <tr
                        key={child.id}
                        className="border-b border-slate-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-2 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(child.id)}
                            onChange={() => toggleSelect(child.id)}
                            className="accent-blue-600 ml-6"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <button
                            onClick={() => handleEdit(child)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-500 uppercase">
                          Cấp {child.level || 2}
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-600 font-mono pl-8">
                          {child.code}
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-600 pl-4">
                          {child.name}
                        </td>
                        <td className="px-3 py-3">
                          <ToggleSwitch
                            checked={child.isActive}
                            onChange={() => handleToggleStatus(child)}
                          />
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                );
              })
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
