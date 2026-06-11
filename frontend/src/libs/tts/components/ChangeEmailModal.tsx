"use client";

import { useEffect, useState } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { getAuthToken, clearAuthToken } from '@/libs/core/utils/auth-token';

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

interface ChangeEmailModalProps {
  open: boolean;
  currentEmail: string;
  userId: string;
  onClose: () => void;
  onSuccess: (newEmail: string) => void;
}

export default function ChangeEmailModal({
  open,
  currentEmail,
  userId,
  onClose,
  onSuccess,
}: ChangeEmailModalProps) {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    setStep(1);
    setOtp('');
    setNewEmail('');
    setCountdown(60);
    setError('');
    setLoading(false);
    sendOtp();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  async function sendOtp() {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${baseUrl}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: currentEmail }),
      });

      if (res.status === 401) {
        clearAuthToken();
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Gửi OTP thất bại');
      }

      setCountdown(60);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!otp.trim()) {
      setError('Vui lòng nhập mã OTP');
      return;
    }

    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${baseUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: currentEmail, otp: otp.trim() }),
      });

      if (res.status === 401) {
        clearAuthToken();
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Mã OTP không đúng');
      }

      setStep(2);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEmail() {
    if (!newEmail.trim()) {
      setError('Vui lòng nhập email mới');
      return;
    }

    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${baseUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail.trim() }),
      });

      if (res.status === 401) {
        clearAuthToken();
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Cập nhật email thất bại');
      }

      onSuccess(newEmail.trim());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (step === 2) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl shadow-xl w-[440px] p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="text-blue-600 font-bold text-lg uppercase text-center mb-2">
            Thay đổi email
          </h2>

          <p className="text-sm text-slate-500 text-center mb-8">
            Vui lòng nhập email mới
          </p>

          <div className="relative mb-6">
            <input
              type="text"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="Phanthanhtung094@gmail.com"
              className="w-full h-11 rounded-lg border border-slate-200 px-3 pt-3 pb-1 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
              Email <span className="text-red-500">*</span>
            </label>
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center mb-4">{error}</p>
          )}

          <button
            onClick={handleSaveEmail}
            disabled={loading || !newEmail.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? 'Đang xử lý...' : 'Lưu'}
          </button>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 font-medium pt-4 block text-center w-full cursor-pointer transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-[440px] p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-blue-600 font-bold text-lg uppercase text-center mb-6">
          Thay đổi email
        </h2>

        <p className="text-sm text-slate-600 text-center leading-relaxed mb-6">
          Chúng tôi đã gửi mã xác minh qua số email cũ
        </p>
        <p className="text-sm font-bold text-slate-800 text-center mb-2">
          {currentEmail}
        </p>
        <p className="text-sm text-slate-600 text-center mb-8">
          Bạn vui lòng kiểm tra và điền mã xác thực
        </p>

        <div className="relative mb-6">
          <input
            type="text"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              if (error) setError('');
            }}
            placeholder="122456"
            className="w-full h-12 rounded-lg border border-slate-200 px-4 pt-3 pb-1 text-lg text-slate-700 tracking-widest text-center outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
            OTP <span className="text-red-500">*</span>
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-xs text-center mb-4">{error}</p>
        )}

        <div className="text-center mb-8">
          <p className="text-blue-600 font-medium text-sm mb-1">{timerDisplay}</p>
          <p className="text-sm text-slate-400">
            Chưa nhận được mã?{' '}
            <button
              onClick={sendOtp}
              disabled={loading || countdown > 0}
              className="text-slate-600 font-medium hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gửi lại
            </button>
          </p>
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || !otp.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : null}
          {loading ? 'Đang xử lý...' : 'Xác nhận'}
        </button>

        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-700 font-medium pt-3 block text-center w-full cursor-pointer transition-colors"
        >
          Hủy bỏ
        </button>
      </div>
    </div>
  );
}
