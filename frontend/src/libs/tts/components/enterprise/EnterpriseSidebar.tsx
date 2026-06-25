"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  HardHat,
  Settings,
} from 'lucide-react';
import { clearAuthToken, getAuthToken, getAuthUser } from '@/libs/core/utils/auth-token';

function getEnterpriseDisplayName() {
  const user = getAuthUser() as
    | (ReturnType<typeof getAuthUser> & { enterpriseName?: string; companyName?: string })
    | null;
  return user?.enterpriseName || user?.companyName || user?.fullName || user?.username || 'Doanh nghiệp';
}

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

export default function EnterpriseSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([
    'he-thong',
  ]);
  const [enterpriseName, setEnterpriseName] = useState(getEnterpriseDisplayName);
  const [user, setUser] = useState<{ avatarUrl?: string; fullName?: string } | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const isCompanyInfo = pathname.startsWith('/enterprise/company-info');
  const isAccount = pathname.startsWith('/enterprise/account-info');
  const isTnldHdld = pathname.startsWith('/enterprise/tnld-hdld');

  useEffect(() => {
    function handleEnterpriseNameChanged(event: Event) {
      const nextName = (event as CustomEvent<{ name?: string }>).detail?.name?.trim();
      setEnterpriseName(nextName || getEnterpriseDisplayName());
    }

    window.addEventListener('enterprise-name-changed', handleEnterpriseNameChanged);
    return () => window.removeEventListener('enterprise-name-changed', handleEnterpriseNameChanged);
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    fetch(`${baseUrl}/auth/me`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAvatarError(false);
          setUser(data);
        }
      })
      .catch(() => {});
  }, []);

  function getInitials(name: string) {
    const words = name.split(' ').filter(Boolean);
    const lastWord = words[words.length - 1] || '';
    return lastWord.slice(0, 3).toUpperCase() || 'DN';
  }

  function openProfile(action?: string) {
    window.dispatchEvent(new CustomEvent('open-user-popup', { detail: { action } }));
  }

  function toggleExpand(menu: string) {
    setExpandedMenus((prev) =>
      prev.includes(menu)
        ? prev.filter((m) => m !== menu)
        : [...prev, menu],
    );
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-64 flex flex-col bg-[#112D75] text-white shadow-lg">
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

      <nav className="flex-1 overflow-auto py-4 text-sm">
        <div className="mb-2">
          <button
            type="button"
            onClick={() => toggleExpand('he-thong')}
            className="w-full flex items-center justify-between px-5 py-3 text-slate-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Settings size={18} />
              <span>Hệ thống</span>
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                expandedMenus.includes('he-thong') ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedMenus.includes('he-thong') && (
            <ul className="mt-1 space-y-0.5">
              <li>
                <button
                  type="button"
                  onClick={() => router.push('/enterprise/company-info')}
                  className={`w-full text-left flex items-center gap-2 px-5 py-2.5 transition-colors ${
                    isCompanyInfo ? 'bg-[#1D4ED8] text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="text-xs">•</span>
                  <span>Thông tin doanh nghiệp</span>
                </button>
              </li>
            </ul>
          )}
        </div>

        <div className="mb-2">
          <button
            type="button"
            onClick={() => toggleExpand('tai-nan-lao-dong')}
            className="w-full flex items-center justify-between px-5 py-3 text-slate-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <HardHat size={18} />
              <span>Tai nạn lao động</span>
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                expandedMenus.includes('tai-nan-lao-dong') ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedMenus.includes('tai-nan-lao-dong') && (
            <ul className="mt-1 space-y-0.5">
              <li>
                <button
                  type="button"
                  onClick={() => router.push('/enterprise/tnld-hdld')}
                  className={`w-full text-left flex items-center gap-2 px-5 py-2.5 transition-colors ${
                    isTnldHdld ? 'bg-[#1D4ED8] text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="text-xs">•</span>
                  <span>TNLD theo HĐLĐ</span>
                </button>
              </li>
            </ul>
          )}
        </div>
      </nav>

      <div className="border-t border-white/10 px-4 py-3">
        <div className="relative flex items-center gap-3">
          {user?.avatarUrl && !avatarError ? (
            <img
              src={`${baseUrl}${user.avatarUrl}`}
              alt={enterpriseName}
              onError={() => setAvatarError(true)}
              className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white">
              {getInitials(user?.fullName || enterpriseName)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold leading-tight text-white whitespace-normal break-words">
              {enterpriseName}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpenUserMenu((current) => !current)}
            className="ml-2 flex-shrink-0 rounded bg-white/10 px-2 py-1 text-sm font-bold text-white transition hover:bg-white/20"
            aria-label="Mở menu tài khoản"
          >
            <ChevronRight
              size={20}
              className={`transition-transform ${openUserMenu ? '-rotate-90' : ''}`}
            />
          </button>

          {openUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOpenUserMenu(false)}
              />
              <div className="absolute bottom-full right-0 z-50 mb-2 w-56 overflow-hidden rounded-lg bg-white text-gray-800 shadow-xl">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50"
                  onClick={() => {
                    setOpenUserMenu(false);
                    router.push('/enterprise/account-info');
                  }}
                >
                  <img src="/icons/profile.svg" alt="" className="h-4 w-4" />
                  <span className={`text-sm ${isAccount ? 'font-semibold text-blue-700' : ''}`}>
                    Thông tin tài khoản
                  </span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50"
                  onClick={() => {
                    setOpenUserMenu(false);
                    openProfile('changePassword');
                  }}
                >
                  <img src="/icons/key.svg" alt="" className="h-4 w-4" />
                  <span className="text-sm">Đổi mật khẩu</span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
                  onClick={() => {
                    clearAuthToken();
                    location.href = '/login';
                  }}
                >
                  <img src="/icons/log-out.svg" alt="" className="h-4 w-4" />
                  <span className="text-sm">Đăng xuất</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
