"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChangePasswordModal from './ChangePasswordModal';
import ChangeEmailModal from './ChangeEmailModal';
import { getAuthToken } from '@/libs/core/utils/auth-token';

type User = { id: string; username: string; email?: string; fullName?: string };

export default function UserProfilePopup() {
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
      
      if (action === 'changePassword') {
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
