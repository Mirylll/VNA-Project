"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { getAuthToken } from '@/libs/core/utils/auth-token';

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

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

function matches(item: any, code: string, name: string) {
  const c = code.toLowerCase().trim();
  const n = name.toLowerCase().trim();
  return (
    (!c || item.code.toLowerCase().includes(c)) &&
    (!n || item.name.toLowerCase().includes(n))
  );
}

interface PermissionListPageProps {
  onFilterChange?: (field: string, value: string) => void;
}

export default function PermissionListPage({
  onFilterChange = () => {},
}: PermissionListPageProps) {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [filterName, setFilterName] = useState('');

  function fetchData() {
    setLoading(true);
    setError('');

    const token = getAuthToken();
    if (!token) {
      setError('Bạn cần đăng nhập để xem danh sách quyền');
      setLoading(false);
      return;
    }

    fetch(`${baseUrl}/permissions/tree`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải danh sách quyền');
        return res.json();
      })
      .then((data) => {
        const withStt = data.map((g: any, i: number) => ({
          ...g,
          stt: toRoman(i + 1),
          children: (g.children || []).map((c: any, j: number) => ({
            ...c,
            stt: String(j + 1),
          })),
        }));
        setPermissions(withStt);
        setExpandedGroups(withStt.map((g: any) => g.code));
      })
      .catch((err) => {
        setError(err.message || 'Lỗi kết nối backend');
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPermissions = filterCode || filterName
    ? permissions
        .map((group) => {
          const matchGroup = matches(group, filterCode, filterName);
          const filteredChildren = (group.children || []).filter((child: any) =>
            matches(child, filterCode, filterName),
          );
          if (matchGroup) return group;
          if (filteredChildren.length > 0)
            return { ...group, children: filteredChildren };
          return null;
        })
        .filter(Boolean)
    : permissions;

  function toggleGroup(code: string) {
    setExpandedGroups((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code],
    );
  }

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900">
            Danh sách quyền
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-sm">Đang tải danh sách quyền...</span>
        </div>
      </div>
    );
  }

  /* ---------- Error state ---------- */
  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900">
            Danh sách quyền
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-red-500">
          <span className="text-sm mb-3">{error}</span>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-300 text-red-500 text-sm hover:bg-red-50 transition-colors"
          >
            <RefreshCw size={14} />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Top header bar */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Danh sách quyền
        </h1>
      </div>

      {/* Table container */}
      <div className="w-full overflow-hidden border border-slate-200 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            {/* Column headers */}
            <tr className="bg-gray-50 border-b border-slate-200">
              <th className="w-[5%] px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                STT
              </th>
              <th className="w-[10%] px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Loại
              </th>
              <th className="w-[40%] px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mã quyền
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tên quyền
              </th>
            </tr>

            {/* Filter inputs row */}
            <tr className="border-b border-slate-200">
              <td className="px-3 py-2" />
              <td className="px-4 py-2">
                <div className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-gray-400 bg-gray-50">
                  Group / Component
                </div>
              </td>
              <td className="px-4 py-2">
                <input
                  placeholder=""
                  value={filterCode}
                  onChange={(e) => setFilterCode(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-4 py-2">
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
            {filteredPermissions.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  Không tìm thấy quyền phù hợp
                </td>
              </tr>
            ) : (
              filteredPermissions.map((group: any) => {
              const isOpen = expandedGroups.includes(group.code);

              return (
                <>
                  {/* Group row */}
                  <tr
                    key={group.code}
                    className="border-b border-slate-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-3.5 text-center">
                      <div className="inline-flex items-center gap-1">
                        <span className="text-xs font-semibold text-blue-600">
                          {group.stt}
                        </span>
                        <button
                          onClick={() => toggleGroup(group.code)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {isOpen ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-blue-600 uppercase">
                      {group.type}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-blue-600 font-mono break-all">
                      {group.code}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-blue-600">
                      {group.name}
                    </td>
                  </tr>

                  {/* Child rows */}
                  {isOpen &&
                    (group.children || []).map((child: any) => (
                      <tr
                        key={child.code}
                        className="border-b border-slate-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-3 text-xs text-slate-500 text-center">
                          {child.stt}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 uppercase">
                          {child.type}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 font-mono pl-8">
                          {child.code}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 pl-4">
                          {child.name}
                        </td>
                      </tr>
                    ))}
                </>
              );
            })
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
