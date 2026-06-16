"use client";

import { useState, useEffect } from 'react';
import { Plus, Pencil, RefreshCw } from 'lucide-react';
import { getAuthToken, hasPermission } from '@/libs/core/utils/auth-token';
import RoleModal from './RoleModal';
import SelectionBar from './SelectionBar';

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

function matches(item: any, code: string, name: string) {
  const c = code.toLowerCase().trim();
  const n = name.toLowerCase().trim();
  return (
    (!c || item.code.toLowerCase().includes(c)) &&
    (!n || item.name.toLowerCase().includes(n))
  );
}

export default function RoleListPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [filterName, setFilterName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const canCreate = hasPermission('ADMIN_C_ROLE_CREATE');
  const canUpdate = hasPermission('ADMIN_C_ROLE_UPDATE');
  const canDelete = hasPermission('ADMIN_C_ROLE_DELETE');
  const canAssignPermissions = hasPermission('ADMIN_C_PERMISSION_ASSIGN');

  function fetchRoles() {
    setLoading(true);
    setError('');

    const token = getAuthToken();
    if (!token) {
      setError('Bạn cần đăng nhập để xem danh sách vai trò');
      setLoading(false);
      return;
    }

    fetch(`${baseUrl}/roles`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải danh sách vai trò');
        return res.json();
      })
      .then((data) => {
        setRoles(data);
      })
      .catch((err) => {
        setError(err.message || 'Lỗi kết nối backend');
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  const filteredRoles = filterCode || filterName
    ? roles.filter((r) => matches(r, filterCode, filterName))
    : roles;

  function handleAddNew() {
    if (!canCreate) return;
    setEditingRole(null);
    setShowModal(true);
  }

  function handleEdit(role: any) {
    if (!canUpdate && !canAssignPermissions) return;
    setEditingRole({
      id: role.id,
      code: role.code,
      name: role.name,
      permissionIds: (role.permissions || []).map((p: any) => p.id),
    });
    setShowModal(true);
  }

  async function handleSave(data: {
    code: string;
    name: string;
    permissionIds: number[];
  }) {
    const token = getAuthToken();
    if (!token) return;
    if (editingRole?.id && !canUpdate && !canAssignPermissions) return;
    if (!editingRole?.id && !canCreate) return;

    try {
      let roleId = editingRole?.id;

      if (roleId && canUpdate) {
        await fetch(`${baseUrl}/roles/${roleId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code: data.code, name: data.name }),
        });
      } else {
        const res = await fetch(`${baseUrl}/roles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code: data.code, name: data.name }),
        });
        const created = await res.json();
        roleId = created.id;
      }

      if (canAssignPermissions) {
        await fetch(`${baseUrl}/roles/${roleId}/permissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ permissionIds: data.permissionIds }),
        });
      }

      setShowModal(false);
      fetchRoles();
    } catch {
      setError('Lỗi khi lưu vai trò');
    }
  }

  async function handleDeleteSelected() {
    const token = getAuthToken();
    if (!token) return;
    if (!canDelete) return;

    const count = selectedIds.length;
    if (!window.confirm(`Bạn có chắc chắn muốn xoá ${count} vai trò đã chọn?`))
      return;

    const results = await Promise.allSettled(
      selectedIds.map((id) =>
        fetch(`${baseUrl}/roles/${id}`, {
          method: 'DELETE',
          headers: { authorization: `Bearer ${token}` },
        }),
      ),
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    setSelectedIds([]);
    fetchRoles();

    if (failed > 0) {
      setError(
        `Đã xoá ${succeeded}/${count} vai trò. ${
          failed > 0
            ? `${failed} vai trò không thể xoá (có thể đang được sử dụng).`
            : ''
        }`,
      );
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Danh sách vai trò
        </h1>
        <div className="flex items-center gap-3">
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
                <input
                  type="checkbox"
                  checked={
                    filteredRoles.length > 0 &&
                    selectedIds.length === filteredRoles.length
                  }
                  onChange={(e) => {
                    if (!canDelete) return;
                    if (e.target.checked) {
                      setSelectedIds(filteredRoles.map((r: any) => r.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                  disabled={!canDelete}
                  className="accent-blue-600"
                />
              </th>
              <th className="w-10 px-2 py-3" />
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mã vai trò
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tên vai trò
              </th>
            </tr>

            <tr className="border-b border-slate-200">
              <td className="px-2 py-2" />
              <td className="px-2 py-2" />
              <td className="px-3 py-2">
                <input
                  placeholder=""
                  value={filterCode}
                  onChange={(e) => setFilterCode(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  placeholder=""
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  Đang tải...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-red-400"
                >
                  <span>{error}</span>
                  <button
                    onClick={fetchRoles}
                    className="ml-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <RefreshCw size={14} /> Thử lại
                  </button>
                </td>
              </tr>
            ) : filteredRoles.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  Không tìm thấy vai trò
                </td>
              </tr>
            ) : (
              filteredRoles.map((role: any) => (
                <tr
                  key={role.id}
                  className="border-b border-slate-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(role.id)}
                      onChange={() => {
                        if (!canDelete) return;
                        setSelectedIds((prev) =>
                          prev.includes(role.id)
                            ? prev.filter((id) => id !== role.id)
                            : [...prev, role.id],
                        );
                      }}
                      disabled={!canDelete}
                      className="accent-blue-600"
                    />
                  </td>
                  <td className="px-2 py-3">
                    {(canUpdate || canAssignPermissions) && (
                      <button
                        onClick={() => handleEdit(role)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700 font-mono">
                    {role.code}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">
                    {role.name}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {canDelete && (
        <SelectionBar
          selectedCount={selectedIds.length}
          onClear={() => setSelectedIds([])}
          onDelete={handleDeleteSelected}
        />
      )}

      <RoleModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={editingRole}
      />
    </div>
  );
}
