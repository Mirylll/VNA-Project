"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Plus, Eye, Pencil, KeyRound, RefreshCw, ChevronDown } from 'lucide-react';
import { getAuthToken } from '@/libs/core/utils/auth-token';
import SelectionBar from '@/libs/tts/components/SelectionBar';
import AccountInfoModal from '@/libs/tts/components/AccountInfoModal';
import EnterpriseResetPasswordModal from '@/libs/tts/components/EnterpriseResetPasswordModal';
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

export default function EnterpriseListPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterTaxCode, setFilterTaxCode] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [acctModal, setAcctModal] = useState<{ open: boolean; item: any }>({ open: false, item: null });
  const [resetPwModal, setResetPwModal] = useState<{ open: boolean; enterprise: any }>({ open: false, enterprise: null });
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

    fetch(`${baseUrl}/enterprises`, {
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
    const n = filterName.toLowerCase().trim();
    const tc = filterTaxCode.toLowerCase().trim();
    const et = filterType.toLowerCase().trim();
    const ind = filterIndustry.toLowerCase().trim();

    if (n && !item.name.toLowerCase().includes(n)) return false;
    if (tc && !(item.taxCode || '').toLowerCase().includes(tc)) return false;
    if (et && !(item.enterpriseType?.name || '').toLowerCase().includes(et)) return false;
    if (ind && !(item.industry?.name || '').toLowerCase().includes(ind)) return false;
    if (filterStatus === 'active' && !item.isActive) return false;
    if (filterStatus === 'inactive' && item.isActive) return false;
    return true;
  });

  function handleAddNew() {
    router.push('/admin/enterprises/create');
  }

  function handleEdit(item: any) {
    router.push(`/admin/enterprises/create?id=${item.id}`);
  }

  function handleViewAcct(item: any) {
    setAcctModal({ open: true, item });
  }

  function handleResetPw(item: any) {
    setResetPwModal({ open: true, enterprise: item });
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
      await fetch(`${baseUrl}/enterprises/${item.id}`, {
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
        fetch(`${baseUrl}/enterprises/${id}`, {
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
      setError(`Đã xoá ${succeeded}/${count} doanh nghiệp. ${failed} doanh nghiệp không thể xoá.`);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Danh sách doanh nghiệp
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {}}
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
              <th className="min-w-[200px] px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>

            <tr className="border-b border-slate-200">
              <td className="px-2 py-2" />
              <td className="px-2 py-2" />
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo tên doanh nghiệp..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo mã số thuế..."
                  value={filterTaxCode}
                  onChange={(e) => setFilterTaxCode(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo loại hình..."
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo ngành nghề..."
                  value={filterIndustry}
                  onChange={(e) => setFilterIndustry(e.target.value)}
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
                    <option value="inactive">Ngừng</option>
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
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                  Không tìm thấy doanh nghiệp
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
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewAcct(item)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleResetPw(item)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <KeyRound size={15} />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">{item.name}</td>
                  <td className="px-3 py-3 text-sm text-gray-700 font-mono">
                    {item.taxCode}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">
                    {item.enterpriseType?.name || '-'}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">
                    {item.industry?.name || '-'}
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

      <AccountInfoModal
        open={acctModal.open}
        currentAccount={acctModal.item}
        onClose={() => setAcctModal({ open: false, item: null })}
      />

      <EnterpriseResetPasswordModal
        open={resetPwModal.open}
        enterprise={resetPwModal.enterprise}
        onClose={() => setResetPwModal({ open: false, enterprise: null })}
        onSaved={() => fetchItems()}
      />

      <ConfirmDeleteDialog
        open={deleteConfirm}
        message={`Xoá ${selectedIds.length} doanh nghiệp đã chọn?`}
        onConfirm={handleDeleteSelected}
        onCancel={() => setDeleteConfirm(false)}
      />
    </div>
  );
}
