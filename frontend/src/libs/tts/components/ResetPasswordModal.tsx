"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Eye, EyeOff } from 'lucide-react';
import { getAuthToken, clearAuthToken } from '@/libs/core/utils/auth-token';

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

interface ResetPasswordModalProps {
  open: boolean;
  user: { id: string; username: string } | null;
  onClose: () => void;
  onSaved: () => void;
  onSuccess?: () => void;
}

export default function ResetPasswordModal({
  open,
  user,
  onClose,
  onSaved,
  onSuccess,
}: ResetPasswordModalProps) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!open || !user) return null;
  const currentUser = user;

  async function handleSave() {
    if (!password) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setSaving(true);
    setError('');

    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await fetch(`${baseUrl}/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (res.status === 401) {
        clearAuthToken();
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Lỗi khi lưu mật khẩu');
      }

      setPassword('');
      onSaved();
      onSuccess?.();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Không thể cập nhật mật khẩu. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    setPassword('');
    setError('');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-[420px] overflow-hidden">
        {/* HEADER */}
        <div className="bg-blue-600 px-5 py-4 flex items-center justify-between">
          <h2 className="text-white font-semibold text-base">Xác nhận</h2>
          <button onClick={handleClose} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-4">
            Khởi tạo mật khẩu cho tài khoản{' '}
            <span className="font-bold text-slate-800">{currentUser.username}</span>
          </p>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Nhập mật khẩu mới mong muốn"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={handleClose}
            className="text-slate-500 font-medium hover:text-slate-700 transition-colors text-sm"
          >
            Huỷ bỏ
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Save size={16} />
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}
