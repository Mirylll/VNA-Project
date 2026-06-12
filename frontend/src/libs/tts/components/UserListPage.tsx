"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Plus, ChevronDown, Pencil, KeyRound, RefreshCw } from 'lucide-react';
import { getAuthToken } from '@/libs/core/utils/auth-token';
import SelectionBar from './SelectionBar';
import ResetPasswordModal from './ResetPasswordModal';
import SuccessToast from './SuccessToast';
import ConfirmDeleteDialog from '@/libs/tts/components/ConfirmDeleteDialog';

interface UserData {
  id: string;
  username: string;
  fullName: string;
  email: string;
  isActive: boolean;
  role?: { id: number; name: string };
  title?: { id: number; name: string };
}

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

function matches(item: UserData, filters: Record<string, string>) {
  for (const [key, val] of Object.entries(filters)) {
    const v = val.toLowerCase().trim();
    if (!v) continue;
    if (key === 'fullName' && !item.fullName.toLowerCase().includes(v)) return false;
    if (key === 'username' && !item.username.toLowerCase().includes(v)) return false;
    if (key === 'email' && !(item.email || '').toLowerCase().includes(v)) return false;
    if (key === 'role' && !(item.role?.name || '').toLowerCase().includes(v)) return false;
    if (key === 'status') {
      const active = v === 'hoạt động' || v === 'active';
      const inactive = v === 'ngừng' || v === 'inactive';
      if (active && !item.isActive) return false;
      if (inactive && item.isActive) return false;
    }
  }
  return true;
}

export default function UserListPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [resetPasswordUser, setResetPasswordUser] = useState<UserData | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({
    fullName: '',
    username: '',
    email: '',
    role: '',
    status: '',
  });

  function fetchUsers() {
    setLoading(true);
    setFetchError(false);
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetch(`${baseUrl}/users`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setUsers)
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const hasFilters = Object.values(filters).some((v) => v.trim());
  const filteredUsers = hasFilters
    ? users.filter((u) => matches(u, filters))
    : users;

  function handleAddNew() {
    router.push('/admin/users/detail');
  }

  function handleEdit(id: string) {
    router.push(`/admin/users/detail?id=${id}`);
  }

  async function handleToggleStatus(user: UserData) {
    const token = getAuthToken();
    if (!token) return;

    // Optimistic update: cập nhật ngay trong state local, không re-fetch
    const newIsActive = !user.isActive;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, isActive: newIsActive } : u,
      ),
    );

    try {
      const res = await fetch(`${baseUrl}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: newIsActive }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) throw new Error();
    } catch {
      // Rollback nếu API lỗi
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isActive: user.isActive } : u,
        ),
      );
      setToastMessage('Không thể thay đổi trạng thái');
    }
  }

  async function handleDeleteSelected() {
    setDeleteConfirm(false);
    const token = getAuthToken();
    if (!token) return;

    const results = await Promise.allSettled(
      selectedIds.map((id) =>
        fetch(`${baseUrl}/users/${id}`, {
          method: 'DELETE',
          headers: { authorization: `Bearer ${token}` },
        }),
      ),
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    const count = selectedIds.length;

    setSelectedIds([]);
    fetchUsers();

    if (failed > 0) {
      alert(
        `Đã xoá ${succeeded}/${count} người dùng. ${
          failed > 0 ? `${failed} người dùng không thể xoá.` : ''
        }`,
      );
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Danh sách người dùng
        </h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-blue-500 text-blue-500 text-sm hover:bg-blue-50 transition-colors">
            <Upload size={16} />
            Import
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
                    filteredUsers.length > 0 &&
                    selectedIds.length === filteredUsers.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(filteredUsers.map((u) => u.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                  className="accent-blue-600"
                />
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
              <th className="min-w-[190px] px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Chức danh
              </th>
              <th className="min-w-[200px] px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>

            <tr className="border-b border-slate-200">
              <td className="px-2 py-2" />
              <td className="px-2 py-2" />
              <td className="px-2 py-2" />
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo họ tên..."
                  value={filters.fullName}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, fullName: e.target.value }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo tài khoản..."
                  value={filters.username}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, username: e.target.value }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo email..."
                  value={filters.email}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <div className="relative">
                  <select
                    value={filters.role}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, role: e.target.value }))
                    }
                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Lọc theo vai trò</option>
                    <option value="Admin">Admin</option>
                    <option value="CEO">CEO</option>
                    <option value="Manager">Manager</option>
                    <option value="Employee">Employee</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder="Tìm theo chức danh..."
                  value={filters.title || ''}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, status: e.target.value }))
                    }
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
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-gray-400">
                  Đang tải...
                </td>
              </tr>
            ) : fetchError ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-red-400">
                  <span>Không thể tải dữ liệu.</span>
                  <button
                    onClick={fetchUsers}
                    className="ml-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <RefreshCw size={14} /> Thử lại
                  </button>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-gray-400">
                  {hasFilters ? 'Không tìm thấy người dùng' : 'Chưa có người dùng nào'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => {
                        setSelectedIds((prev) =>
                          prev.includes(user.id)
                            ? prev.filter((id) => id !== user.id)
                            : [...prev, user.id],
                        );
                      }}
                      className="accent-blue-600"
                    />
                  </td>
                  <td className="px-2 py-3">
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                  </td>
                  <td className="px-2 py-3">
                    <button
                      onClick={() => setResetPasswordUser(user)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <KeyRound size={15} />
                    </button>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900 font-medium">
                    {user.fullName}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500">
                    {user.username}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500">
                    {user.email || '—'}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500">
                    {user.role?.name || '—'}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500">
                    {user.title?.name || '—'}
                  </td>
                  <td className="px-3 py-3">
                    <ToggleSwitch
                      checked={user.isActive}
                      onChange={() => handleToggleStatus(user)}
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

      <ResetPasswordModal
        open={!!resetPasswordUser}
        user={resetPasswordUser}
        onClose={() => setResetPasswordUser(null)}
        onSaved={fetchUsers}
        onSuccess={() => setToastMessage('Đặt lại mật khẩu thành công')}
      />

      <SuccessToast
        message={toastMessage}
        visible={!!toastMessage}
        onClose={() => setToastMessage('')}
      />

      <ConfirmDeleteDialog
        open={deleteConfirm}
        message={`Xoá ${selectedIds.length} người dùng đã chọn?`}
        onConfirm={handleDeleteSelected}
        onCancel={() => setDeleteConfirm(false)}
      />
    </div>
  );
}
