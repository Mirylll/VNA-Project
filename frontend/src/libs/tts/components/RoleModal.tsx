"use client";

import { useState, useEffect } from 'react';
import {
  X,
  Save,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { getAuthToken } from '@/libs/core/utils/auth-token';

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: {
    code: string;
    name: string;
    permissionIds: number[];
  }) => void;
  initialData?: {
    code: string;
    name: string;
    permissionIds: number[];
  } | null;
}

function matches(item: any, code: string, name: string) {
  const c = code.toLowerCase().trim();
  const n = name.toLowerCase().trim();
  return (
    (!c || item.code.toLowerCase().includes(c)) &&
    (!n || item.name.toLowerCase().includes(n))
  );
}

export default function RoleModal({
  open,
  onClose,
  onSave = () => {},
  initialData = null,
}: RoleModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState<any[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [permFilterCode, setPermFilterCode] = useState('');
  const [permFilterName, setPermFilterName] = useState('');
  const [page, setPage] = useState(1);
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEdit = !!initialData;
  const pageSize = 10;

  const allPermissionIds = permissions.flatMap((g: any) =>
    (g.children || []).map((c: any) => c.id),
  );
  const allSelected = allPermissionIds.length > 0 && allPermissionIds.every((id: number) => selectedIds.includes(id));
  const someSelected = allPermissionIds.some((id: number) => selectedIds.includes(id)) && !allSelected;

  useEffect(() => {
    if (open) {
      setCode(initialData?.code ?? '');
      setName(initialData?.name ?? '');
      setSelectedIds(initialData?.permissionIds ?? []);
      setPage(1);
      setPermFilterCode('');
      setPermFilterName('');
      setErrors({});
      fetchPermissions();
    }
  }, [open]);

  function fetchPermissions() {
    setLoading(true);
    const token = getAuthToken();
    if (!token) return;

    fetch(`${baseUrl}/permissions/tree`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setPermissions(data);
        setExpandedGroups(data.map((g: any) => g.code));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  function toggleGroup(groupCode: string) {
    setExpandedGroups((prev) =>
      prev.includes(groupCode)
        ? prev.filter((c) => c !== groupCode)
        : [...prev, groupCode],
    );
  }

  function togglePermission(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  function toggleAllPermissions() {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allPermissionIds.includes(id)));
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...allPermissionIds.filter((id: number) => !prev.includes(id)),
      ]);
    }
  }

  function toggleGroupPermissions(group: any) {
    const childIds = (group.children || []).map((c: any) => c.id);
    const allSelected = childIds.every((id: number) =>
      selectedIds.includes(id),
    );
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((i: number) => !childIds.includes(i))
        : [...prev, ...childIds.filter((id: number) => !prev.includes(id))],
    );
  }

  const filteredPermissions = permissions
    .map((group) => {
      const matchGroup = matches(group, permFilterCode, permFilterName);
      const filteredChildren = (group.children || []).filter((child: any) =>
        matches(child, permFilterCode, permFilterName),
      );
      if (matchGroup) return group;
      if (filteredChildren.length > 0)
        return { ...group, children: filteredChildren };
      return null;
    })
    .filter(Boolean);

  const flatItems = filteredPermissions.flatMap((group: any) => [
    group,
    ...(expandedGroups.includes(group.code) ? group.children || [] : []),
  ]);

  const totalPages = Math.max(1, Math.ceil(flatItems.length / pageSize));
  const paginatedItems = flatItems.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-gray-800 font-semibold text-base">
            {isEdit ? 'Cập nhật vai trò' : 'Thêm mới vai trò'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-2 gap-4 px-6 pt-6">
          <div className={`relative border rounded-lg px-3 pt-3 pb-2 ${errors.code ? 'border-red-500' : 'border-slate-300'}`}>
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              Mã vai trò <span className="text-red-500">*</span>
            </label>
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (errors.code) setErrors((p) => ({ ...p, code: undefined }));
              }}
              placeholder="Nhập mã vai trò"
              maxLength={50}
              className="w-full border-none outline-none text-sm py-0.5"
            />
            {errors.code && <p className="text-xs text-red-500 mt-0.5">{errors.code}</p>}
          </div>
          <div className={`relative border rounded-lg px-3 pt-3 pb-2 ${errors.name ? 'border-red-500' : 'border-slate-300'}`}>
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              Tên vai trò <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
              }}
              placeholder="Nhập tên vai trò"
              maxLength={100}
              className="w-full border-none outline-none text-sm py-0.5"
            />
            {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
          </div>
        </div>

        {/* Permissions table */}
        <div className="px-6 pt-6 pb-4">
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-slate-200">
                  <th className="w-10 px-2 py-2.5 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => { if (el) el.indeterminate = someSelected; }}
                      onChange={toggleAllPermissions}
                      className="accent-blue-600"
                    />
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[45%]">
                    Mã quyền
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[45%]">
                    Tên quyền
                  </th>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-2 py-1.5" />
                  <td className="px-3 py-1.5">
                    <input
                      placeholder=""
                      value={permFilterCode}
                      onChange={(e) => {
                        setPermFilterCode(e.target.value);
                        setPage(1);
                      }}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      placeholder=""
                      value={permFilterName}
                      onChange={(e) => {
                        setPermFilterName(e.target.value);
                        setPage(1);
                      }}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-sm text-gray-400"
                    >
                      Đang tải...
                    </td>
                  </tr>
                ) : paginatedItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-sm text-gray-400"
                    >
                      Không tìm thấy quyền
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item: any) => {
                    const isGroup = item.children !== undefined;
                    const isExpanded = expandedGroups.includes(item.code);
                    const childIds = (item.children || []).map(
                      (c: any) => c.id,
                    );
                    const allChildrenSelected =
                      childIds.length > 0 &&
                      childIds.every((id: number) =>
                        selectedIds.includes(id),
                      );
                    const someChildrenSelected =
                      childIds.some((id: number) =>
                        selectedIds.includes(id),
                      ) &&
                      !allChildrenSelected;

                    return (
                      <tr
                        key={item.code}
                        className={`border-b border-slate-100 hover:bg-gray-50 transition-colors ${
                          isGroup ? '' : ''
                        }`}
                      >
                        <td className="px-2 py-2.5 text-center">
                          {isGroup ? (
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => toggleGroup(item.code)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {isExpanded ? (
                                  <ChevronDown size={14} />
                                ) : (
                                  <ChevronRight size={14} />
                                )}
                              </button>
                              <input
                                type="checkbox"
                                checked={allChildrenSelected || someChildrenSelected}
                                ref={(el) => {
                                  if (el)
                                    el.indeterminate = someChildrenSelected;
                                }}
                                onChange={() =>
                                  toggleGroupPermissions(item)
                                }
                                className="accent-blue-600"
                              />
                            </div>
                          ) : (
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(item.id)}
                              onChange={() => togglePermission(item.id)}
                              className="accent-blue-600 ml-6"
                            />
                          )}
                        </td>
                        <td
                          className={`px-3 py-2.5 text-sm font-mono ${
                            isGroup
                              ? 'font-semibold text-blue-700'
                              : 'text-gray-500 ml-6'
                          }`}
                        >
                          <span className={isGroup ? '' : 'ml-0'}>
                            {item.code}
                          </span>
                        </td>
                        <td
                          className={`px-3 py-2.5 text-sm ${
                            isGroup
                              ? 'font-semibold text-blue-700'
                              : 'text-gray-500'
                          }`}
                        >
                          {item.name}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-3 px-4 py-2 border-t border-slate-200 bg-white text-sm text-gray-500">
              <select
                value={pageSize}
                className="border border-slate-200 rounded px-1.5 py-0.5 text-xs outline-none"
              >
                <option value={10}>10</option>
              </select>
              <span>
                {flatItems.length === 0
                  ? '0 - 0 of 0'
                  : `${(page - 1) * pageSize + 1} - ${Math.min(
                      page * pageSize,
                      flatItems.length,
                    )} of ${flatItems.length}`}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={page >= totalPages}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-end border-t border-slate-200">
          <button
            onClick={async () => {
              const errs: { code?: string; name?: string } = {};
              if (!code.trim()) errs.code = 'Mã vai trò không được để trống';
              else if (code.trim().length > 50) errs.code = 'Mã vai trò tối đa 50 ký tự';
              if (!name.trim()) errs.name = 'Tên vai trò không được để trống';
              else if (name.trim().length > 100) errs.name = 'Tên vai trò tối đa 100 ký tự';
              setErrors(errs);
              if (Object.keys(errs).length > 0) return;
              setSaving(true);
              await onSave({ code, name, permissionIds: selectedIds });
              setSaving(false);
            }}
            disabled={saving}
            className="flex items-center gap-1.5 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={15} />
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}
