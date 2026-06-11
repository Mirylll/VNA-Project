"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  HardHat,
  KeyRound,
  LogOut,
  Menu,
  Settings,
  UserRound,
} from 'lucide-react';
import { clearAuthToken } from '@/libs/core/utils/auth-token';

export default function EnterpriseSidebar() {
  const router = useRouter();
  const [openUserMenu, setOpenUserMenu] = useState(false);

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
          className="relative flex w-full items-center gap-3 bg-[#2B59C3] py-3 pl-10 pr-4 text-left font-medium text-white shadow-[inset_4px_0_0_rgba(255,255,255,0.95)]"
        >
          <span className="absolute left-5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white" />
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
          className="relative flex w-full items-center gap-3 py-3 pl-10 pr-4 text-left text-white/95 transition hover:bg-white/10"
        >
          <span className="absolute left-5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/80" />
          <span>TNLD theo HĐLĐ</span>
        </button>
      </nav>

      <div className="px-4 pb-4">
        <div className="relative flex items-center gap-3 border-t border-dashed border-white/45 pt-4">
          <img
            src="/avatar-placeholder.svg"
            alt="Phan Thanh Tùng"
            className="h-9 w-9 rounded-full border border-white/30 bg-white object-cover"
          />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            Phan Thanh Tùng
          </span>
          <button
            type="button"
            onClick={() => setOpenUserMenu((current) => !current)}
            className="rounded-md p-1 text-white/90 transition hover:bg-white/10"
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
              <div className="absolute bottom-full right-0 z-50 mb-2 w-56 overflow-hidden rounded-lg bg-white text-slate-800 shadow-xl">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left text-sm transition hover:bg-slate-50"
                  onClick={() => {
                    setOpenUserMenu(false);
                    router.push('/admin/account');
                  }}
                >
                  <UserRound size={17} className="text-slate-500" />
                  <span>Thông tin tài khoản</span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left text-sm transition hover:bg-slate-50"
                  onClick={() => {
                    setOpenUserMenu(false);
                    openProfile('changePassword');
                  }}
                >
                  <KeyRound size={17} className="text-amber-600" />
                  <span>Đổi mật khẩu</span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                  onClick={() => {
                    clearAuthToken();
                    location.href = '/login';
                  }}
                >
                  <LogOut size={17} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
