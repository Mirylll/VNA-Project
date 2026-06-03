"use client";

import React, { useEffect, useState } from 'react';
import { clearAuthToken, getAuthToken } from '@/libs/core/utils/auth-token';

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [pathname, setPathname] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(getAuthToken());
      setPathname(window.location.pathname || '');
    }
  }, []);

  function openProfile(action?: string) {
    const e = new CustomEvent('open-user-popup', { detail: { action } });
    window.dispatchEvent(e);
  }

  function toggleExpand(menu: string) {
    setExpandedMenus(prev => 
      prev.includes(menu) 
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    );
  }

  // hide sidebar on login route or when not authenticated
  if (!token || pathname === '/' || pathname.startsWith('/login')) return null;

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-64 text-white shadow-lg" style={{ background: '#1a237e' }}>
      <div className="flex h-full flex-col">
        {/* HEADER */}
        <div className="p-4 flex items-center gap-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center font-bold text-white">VN</div>
          <div className="text-sm font-semibold">Ủy ban nhân dân</div>
        </div>

        {/* MAIN MENU */}
        <nav className="flex-1 overflow-auto p-3 text-sm">
          <ul className="space-y-1">
            {/* Hướng dẫn sử dụng */}
            <li>
              <button
                onClick={() => openProfile('profile')}
                className="w-full text-left px-3 py-2.5 rounded hover:bg-blue-800 cursor-pointer flex items-center gap-2 transition"
              >
                <span>📖</span>
                <span>Hướng dẫn sử dụng</span>
              </button>
            </li>

            {/* Trang chủ */}
            <li>
              <button className="w-full text-left px-3 py-2.5 rounded hover:bg-blue-800 cursor-pointer flex items-center gap-2 transition">
                <span>🏠</span>
                <span>Trang chủ</span>
              </button>
            </li>

            {/* Hệ thống - Expandable */}
            <li>
              <button
                onClick={() => toggleExpand('he-thong')}
                className="w-full text-left px-3 py-2.5 rounded hover:bg-blue-800 cursor-pointer flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <span>⚙️</span>
                  <span>Hệ thống</span>
                </span>
                <span className={`text-lg transition-transform ${expandedMenus.includes('he-thong') ? 'rotate-90' : ''}`}>›</span>
              </button>
              {expandedMenus.includes('he-thong') && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-blue-800 cursor-pointer text-sm transition">
                      • Quản lý người dùng
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-blue-800 cursor-pointer text-sm transition">
                      • Vai trò người dùng
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-blue-800 cursor-pointer text-sm transition">
                      • Tiếp nhận
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Quản lý phần mềm - Expandable */}
            <li>
              <button
                onClick={() => toggleExpand('quan-ly-phan-mem')}
                className="w-full text-left px-3 py-2.5 rounded hover:bg-blue-800 cursor-pointer flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <span>💻</span>
                  <span>Quản lý phần mềm</span>
                </span>
                <span className={`text-lg transition-transform ${expandedMenus.includes('quan-ly-phan-mem') ? 'rotate-90' : ''}`}>›</span>
              </button>
              {expandedMenus.includes('quan-ly-phan-mem') && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-blue-800 cursor-pointer text-sm transition">
                      • Phiên bản
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Chuẩn nghề nghiệp giáo viên - Expandable */}
            <li>
              <button
                onClick={() => toggleExpand('chuan-giao-vien')}
                className="w-full text-left px-3 py-2.5 rounded hover:bg-blue-800 cursor-pointer flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <span>👨‍🎓</span>
                  <span className="text-xs">Chuẩn nghề giáo viên</span>
                </span>
                <span className={`text-lg transition-transform ${expandedMenus.includes('chuan-giao-vien') ? 'rotate-90' : ''}`}>›</span>
              </button>
              {expandedMenus.includes('chuan-giao-vien') && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-blue-800 cursor-pointer text-sm transition">
                      • Chi tiết
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Chuẩn nghề nghiệp HT - HP - Expandable */}
            <li>
              <button
                onClick={() => toggleExpand('chuan-ht-hp')}
                className="w-full text-left px-3 py-2.5 rounded hover:bg-blue-800 cursor-pointer flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <span>👨‍💼</span>
                  <span className="text-xs">Chuẩn HT - HP</span>
                </span>
                <span className={`text-lg transition-transform ${expandedMenus.includes('chuan-ht-hp') ? 'rotate-90' : ''}`}>›</span>
              </button>
              {expandedMenus.includes('chuan-ht-hp') && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-blue-800 cursor-pointer text-sm transition">
                      • Chi tiết
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Báo cáo thống kê */}
            <li>
              <button className="w-full text-left px-3 py-2.5 rounded hover:bg-blue-800 cursor-pointer flex items-center gap-2 transition">
                <span>📊</span>
                <span>Báo cáo thống kê</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* BOTTOM USER SECTION */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              PT
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">Phan Thanh Tùng</div>
              <div className="text-xs text-blue-200 truncate">Quản trị viên</div>
            </div>
            <button 
              onClick={() => setOpenMenu((s) => !s)} 
              className="ml-2 rounded bg-white/10 hover:bg-white/20 px-2 py-1 text-sm font-bold flex-shrink-0 transition"
            >
              ›
            </button>

            {/* POPUP MENU */}
            {openMenu && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenMenu(false)}
                />
                
                {/* Menu */}
                <div className="absolute bottom-full right-0 mb-2 w-56 rounded-lg bg-white text-gray-800 shadow-xl z-50 overflow-hidden">
                  <button 
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3 border-b border-gray-100"
                    onClick={() => { 
                      openProfile('profile'); 
                      setOpenMenu(false); 
                    }}
                  >
                    <span>👤</span>
                    <span className="text-sm">Thông tin tài khoản</span>
                  </button>
                  
                  <button 
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3 border-b border-gray-100"
                    onClick={() => { 
                      openProfile('changePassword'); 
                      setOpenMenu(false); 
                    }}
                  >
                    <span>🔑</span>
                    <span className="text-sm">Đổi mật khẩu</span>
                  </button>
                  
                  <button 
                    className="w-full text-left px-4 py-3 hover:bg-red-50 transition flex items-center gap-3 text-red-600"
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
      </div>
    </aside>
  );
}
