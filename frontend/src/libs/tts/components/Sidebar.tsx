"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, ChevronDown } from 'lucide-react';
import { clearAuthToken, getAuthToken, type AuthUser } from '@/libs/core/utils/auth-token';

interface SubMenuItem {
  label: string;
  id: string;
  route: string;
  permission?: string;
}

interface MenuGroup {
  label: string;
  id: string;
  items: SubMenuItem[];
}

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

const menuGroups: MenuGroup[] = [
  {
    label: 'Hệ thống',
    id: 'he-thong',
    items: [
      { label: 'Phân quyền', id: 'phan-quyen', route: '/admin/permissions', permission: 'ADMIN_C_PERMISSION_VIEW' },
      { label: 'Vai trò', id: 'vai-tro', route: '/admin/roles', permission: 'ADMIN_C_ROLE_VIEW' },
      { label: 'Quản lý người dùng', id: 'quan-ly-nguoi-dung', route: '/admin/users', permission: 'ADMIN_C_USER_VIEW' },
      { label: 'Loại hình doanh nghiệp', id: 'loai-hinh-doanh-nghiep', route: '/admin/enterprise-types', permission: 'ADMIN_C_ENTERPRISE_TYPE_VIEW' },
      { label: 'Ngành nghề kinh doanh', id: 'nganh-nghe-kinh-doanh', route: '/admin/industries', permission: 'ADMIN_C_INDUSTRY_VIEW' },
      { label: 'Quản lý doanh nghiệp', id: 'quan-ly-doanh-nghiep', route: '/admin/enterprises', permission: 'ADMIN_C_ENTERPRISE_VIEW' },
      { label: 'Kỳ báo cáo', id: 'ky-bao-cao', route: '/admin/report-periods', permission: 'ADMIN_C_REPORT_PERIOD_VIEW' },
    ],
  },
  {
    label: 'Tai nạn lao động',
    id: 'tai-nan-lao-dong',
    items: [
      { label: 'Danh mục chung', id: 'danh-muc-chung', route: '/admin/tnld-categories', permission: 'ADMIN_C_TNLD_CATEGORY_VIEW' },
      { label: 'TNLĐ theo HĐLĐ', id: 'tnld-theo-hdld', route: '/admin/tnld-contracts', permission: 'ADMIN_C_TNLD_CONTRACT_VIEW' },
    ],
  },
];

function getRouteMap() {
  const map: Record<string, string> = {};
  for (const group of menuGroups) {
    for (const item of group.items) {
      map[item.id] = item.route;
    }
  }
  return map;
}

function getIdFromPath(path: string): string {
  const routeMap = getRouteMap();
  const reverse: Record<string, string> = {};
  for (const [id, route] of Object.entries(routeMap)) {
    reverse[route] = id;
  }
  return reverse[path] || '';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Sidebar() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([
    'he-thong',
  ]);
  const [activeItem, setActiveItem] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [pathname, setPathname] = useState<string>('');
  const [user, setUser] = useState<{
    id: string;
    fullName: string;
    avatarUrl?: string;
    titleName?: string;
    permissions?: Array<{ id: string; code: string; name: string }>;
  } | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = getAuthToken();
      setToken(t);
      const p = window.location.pathname;
      setPathname(p);
      const id = getIdFromPath(p);
      if (id) setActiveItem(id);

      if (t) {
        fetch(`${baseUrl}/auth/me`, {
          headers: { authorization: `Bearer ${t}` },
        }).then((res) => {
          if (res.status === 401) {
            clearAuthToken();
            window.location.href = '/login';
            return null;
          }
          return res.ok ? res.json() : null;
        }).then((data) => {
          if (data) {
            setAvatarError(false);
            setUser(data);
          }
        }).catch(() => {});
      }
    }
  }, []);

  function openProfile(action?: string) {
    const e = new CustomEvent('open-user-popup', { detail: { action } });
    window.dispatchEvent(e);
  }

  function toggleExpand(menu: string) {
    setExpandedMenus((prev) =>
      prev.includes(menu)
        ? prev.filter((m) => m !== menu)
        : [...prev, menu],
    );
  }

  const permissionCodes = new Set(user?.permissions?.map((p) => p.code) || []);
  const visibleMenuGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.permission || permissionCodes.has(item.permission)),
    }))
    .filter((group) => group.items.length > 0);

  if (!token || pathname === '/' || pathname.startsWith('/login')) return null;

  const initials = user ? getInitials(user.fullName) : '??';
  const displayName = user?.fullName || '...';
  const displayTitle = user?.titleName || '...';

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-64 text-white shadow-lg bg-[#112D75]">
      <div className="flex h-full flex-col">
        {/* HEADER */}
        <div className="px-5 py-4 flex items-center gap-3 border-b border-white/10">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white p-1 shrink-0 overflow-hidden shadow-sm">
            <img
              src="/emblemofvietnam.png"
              alt="Emblem of Vietnam"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-sm font-semibold leading-tight">Ủy ban nhân dân</span>
            <span className="text-sm font-semibold leading-tight">thành phố Hồ Chí Minh</span>
          </div>
        </div>

        {/* MAIN MENU */}
        <nav className="flex-1 overflow-auto py-4 text-sm">
          {visibleMenuGroups.map((group) => (
            <div key={group.id} className="mb-2">
              {/* Parent button */}
              <button
                onClick={() => toggleExpand(group.id)}
                className="w-full flex items-center justify-between px-5 py-3 text-slate-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Settings size={18} />
                  <span>{group.label}</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    expandedMenus.includes(group.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Sub-items */}
              {expandedMenus.includes(group.id) && (
                <ul className="mt-1 space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveItem(item.id);
                          router.push(item.route);
                        }}
                        className={`w-full text-left flex items-center gap-2 px-5 py-2.5 transition-colors ${
                          activeItem === item.id
                            ? 'bg-[#1D4ED8] text-white'
                            : 'text-slate-300 hover:text-white'
                        }`}
                        style={{ paddingLeft: '3rem' }}
                      >
                        <span className="text-xs">•</span>
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        {/* BOTTOM USER SECTION */}
        <div className="px-4 py-3 border-t border-white/10">
          <div className="flex items-center gap-3 relative">
            {user?.avatarUrl && !avatarError ? (
              <img
                src={`${baseUrl}${user.avatarUrl}`}
                alt="Avatar"
                onError={() => setAvatarError(true)}
                className="h-10 w-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate text-white">
                {displayName}
              </div>
              <div className="text-xs text-blue-200 truncate">
                {displayTitle}
              </div>
            </div>
            <button
              onClick={() => setOpenMenu((s) => !s)}
              className="ml-2 rounded bg-white/10 hover:bg-white/20 px-2 py-1 text-sm font-bold flex-shrink-0 text-white transition"
            >
              ›
            </button>

            {openMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenMenu(false)}
                />
                <div className="absolute bottom-full right-0 mb-2 w-56 rounded-lg bg-white text-gray-800 shadow-xl z-50 overflow-hidden">
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3 border-b border-gray-100"
                    onClick={() => {
                      setOpenMenu(false);
                      if (user?.id) router.push(`/admin/users/detail?id=${user.id}`);
                    }}
                  >
                    <img src="/icons/profile.svg" alt="" className="w-4 h-4" />
                    <span className="text-sm">Thông tin tài khoản</span>
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3 border-b border-gray-100"
                    onClick={() => {
                      openProfile('changePassword');
                      setOpenMenu(false);
                    }}
                  >
                    <img src="/icons/key.svg" alt="" className="w-4 h-4" />
                    <span className="text-sm">Đổi mật khẩu</span>
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-red-50 transition flex items-center gap-3 text-red-600"
                    onClick={() => {
                      clearAuthToken();
                      location.href = '/login';
                    }}
                  >
                    <img src="/icons/log-out.svg" alt="" className="w-4 h-4" />
                    <span className="text-sm">Đăng xuất</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
