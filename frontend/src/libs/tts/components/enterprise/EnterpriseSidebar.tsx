"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  HardHat,
  Menu,
  Settings,
} from 'lucide-react';
import { clearAuthToken, getAuthUser } from '@/libs/core/utils/auth-token';

function getEnterpriseDisplayName() {
  const user = getAuthUser() as
    | (ReturnType<typeof getAuthUser> & { enterpriseName?: string; companyName?: string })
    | null;
  return user?.enterpriseName || user?.companyName || user?.fullName || user?.username || 'Doanh nghiệp';
}

export default function EnterpriseSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [enterpriseName, setEnterpriseName] = useState(getEnterpriseDisplayName);
  const isCompanyInfo = pathname.startsWith('/enterprise/company-info');
  const isAccount = pathname.startsWith('/enterprise/account');
  const isTnldHdld = pathname.startsWith('/enterprise/tnld-hdld');

  useEffect(() => {
    function handleEnterpriseNameChanged(event: Event) {
      const nextName = (event as CustomEvent<{ name?: string }>).detail?.name?.trim();
      setEnterpriseName(nextName || getEnterpriseDisplayName());
    }

    window.addEventListener('enterprise-name-changed', handleEnterpriseNameChanged);
    return () => window.removeEventListener('enterprise-name-changed', handleEnterpriseNameChanged);
  }, []);

  function openProfile(action?: string) {
    window.dispatchEvent(new CustomEvent('open-user-popup', { detail: { action } }));
  }

  return (
    <aside className="flex h-screen w-[260px] flex-shrink-0 flex-col bg-[#173B8F] text-white">
      <div className="flex h-[92px] items-center gap-3 border-b border-white/20 px-4">
        <img
          src="/emblemofvietnam.png"
          alt="Ủy ban nhân dân thành phố Hồ Chí Minh"
          className="h-12 w-12 flex-shrink-0 object-contain"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-5">
            Ủy ban nhân dân thành phố
          </p>
          <p className="text-[13px] font-semibold leading-5">Hồ Chí Minh</p>
        </div>
        <button
          type="button"
          className="rounded-md p-1.5 text-white/90 transition hover:bg-white/10"
          aria-label="Thu gọn menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <nav className="flex-1 py-3 text-sm">
        <button
          type="button"
          className="flex w-full items-center gap-3 px-4 py-3 text-left font-medium text-white/95 transition hover:bg-white/10"
        >
          <Settings size={18} />
          <span className="flex-1">Hệ thống</span>
          <ChevronDown size={18} />
        </button>

        <button
          type="button"
          onClick={() => router.push('/enterprise/company-info')}
          className={`relative flex w-full items-center gap-3 py-3 pl-10 pr-4 text-left font-medium text-white transition hover:bg-white/10 ${
            isCompanyInfo ? 'bg-[#2B59C3] shadow-[inset_4px_0_0_rgba(255,255,255,0.95)]' : ''
          }`}
        >
          <span className={`absolute left-5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${isCompanyInfo ? 'bg-white' : 'bg-white/80'}`} />
          <BriefcaseBusiness size={16} className="text-white/90" />
          <span>Thông tin doanh nghiệp</span>
        </button>

        <button
          type="button"
          className="flex w-full items-center gap-3 px-4 py-3 text-left font-medium text-white/95 transition hover:bg-white/10"
        >
          <HardHat size={18} />
          <span className="flex-1">Tai nạn lao động</span>
          <ChevronDown size={18} />
        </button>

        <button
          type="button"
          onClick={() => router.push('/enterprise/tnld-hdld')}
          className={`relative flex w-full items-center gap-3 py-3 pl-10 pr-4 text-left text-white/95 transition hover:bg-white/10 ${
            isTnldHdld ? 'bg-[#2B59C3] shadow-[inset_4px_0_0_rgba(255,255,255,0.95)]' : ''
          }`}
        >
          <span className={`absolute left-5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${isTnldHdld ? 'bg-white' : 'bg-white/80'}`} />
          <span>TNLD theo HĐLĐ</span>
        </button>
      </nav>

      <div className="border-t border-white/10 px-4 py-3">
        <div className="relative flex items-center gap-3">
          <img
            src="/avatar-placeholder.svg"
            alt={enterpriseName}
            className="h-10 w-10 flex-shrink-0 rounded-full border border-white/30 bg-white object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-white">
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
                    router.push('/enterprise/account');
                  }}
                >
                  <span>👤</span>
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
                  <span>🔑</span>
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
                  <span>🚪</span>
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
