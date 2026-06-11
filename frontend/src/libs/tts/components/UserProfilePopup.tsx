"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChangePasswordModal from './ChangePasswordModal';
import ChangeEmailModal from './ChangeEmailModal';
import { getAuthToken } from '@/libs/core/utils/auth-token';

type User = { id: string; username: string; email?: string; fullName?: string };

export default function UserProfilePopup() {
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [pathname, setPathname] = useState<string>('');
  const [message, setMessage] = useState('');
  const baseUrl = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') : '';
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(getAuthToken());
      setPathname(window.location.pathname || '');
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    fetch(`${baseUrl}/auth/me`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => setUser(null));
  }, [baseUrl, token]);

  useEffect(() => {
    function handler(e: any) {
      const action = e?.detail?.action as string | undefined;
      setToken(getAuthToken());
      
      if (action === 'profile') {
        setShowProfile(true);
      } else if (action === 'changePassword') {
        setShowChangePassword(true);
      } else if (action === 'changeEmail') {
        setShowChangeEmail(true);
      }
    }

    window.addEventListener('open-user-popup', handler as EventListener);
    return () => window.removeEventListener('open-user-popup', handler as EventListener);
  }, []);

  async function changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    setMessage('');
    if (!token) return setMessage('Chưa đăng nhập');
    
    try {
      const res = await fetch(`${baseUrl}/auth/change-password`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
        }),
      });
      
      if (res.ok) {
        setMessage('Đổi mật khẩu thành công');
        setShowChangePassword(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        const err = await res.json();
        setMessage(err.message || 'Lỗi');
      }
    } catch (error) {
      setMessage('Lỗi kết nối');
    }
  }

  async function changeEmail(newEmail: string) {
    setMessage('');
    setUser((prev) => (prev ? { ...prev, email: newEmail } : prev));
    window.dispatchEvent(new CustomEvent('user-email-changed', { detail: { email: newEmail } }));
    setMessage('Email đã được cập nhật thành công');
    setShowChangeEmail(false);
    setTimeout(() => setMessage(''), 3000);
  }

  // If not logged in, or we're on the login page/root, don't render anything
  if (!token) return null;
  if (pathname === '/' || pathname.startsWith('/login')) return null;

  return (
    <>
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="flex items-center justify-between bg-blue-600 px-5 py-4 text-white">
              <h3 className="text-base font-semibold">Thông tin tài khoản</h3>
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="rounded px-2 py-1 text-xl leading-none transition hover:bg-white/10"
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            <div className="px-5 py-5">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  {(user?.fullName || user?.username || 'PT')
                    .split(' ')
                    .filter(Boolean)
                    .slice(-2)
                    .map((part) => part[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-gray-900">
                    {user?.fullName || 'Chưa có họ tên'}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Quản trị viên
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div>
                  <div className="text-xs font-medium text-gray-500">Tên đăng nhập</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {user?.username || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500">Họ và tên</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {user?.fullName || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500">Email</div>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium text-gray-900">
                      {user?.email || '-'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfile(false);
                        setShowChangeEmail(true);
                      }}
                      className="shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Thay đổi
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t bg-gray-50 px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  setShowChangePassword(true);
                }}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Đổi mật khẩu
              </button>
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSave={changePassword}
      />

      {/* Change Email Modal */}
      <ChangeEmailModal
        open={showChangeEmail}
        onClose={() => setShowChangeEmail(false)}
        currentEmail={user?.email || ''}
        token={token}
        onSave={changeEmail}
      />

      {/* Global Message */}
      {message && (
        <div className={`fixed bottom-4 left-64 right-4 z-40 p-4 rounded-lg text-sm font-medium ${
          message.includes('thành công') 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}
    </>
  );
}
