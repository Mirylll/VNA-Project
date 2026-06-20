"use client";

import { useEffect, useState } from 'react';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { getAuthToken } from '@/libs/core/utils/auth-token';
import { requestChangeEmailOtp, verifyChangeEmailOtp } from '@/libs/core/services/auth.service';

interface ChangeEmailModalProps {
  open: boolean;
  onClose: () => void;
  currentEmail?: string;
  token?: string | null;
  userId?: string;
  onSave?: (newEmail: string) => void | Promise<void>;
  onSuccess?: (newEmail: string) => void | Promise<void>;
}

export default function ChangeEmailModal({
  open,
  onClose,
  currentEmail = '',
  token,
  onSave,
  onSuccess,
}: ChangeEmailModalProps) {
  const [step, setStep] = useState<1 | 2>(2);
  const [otp, setOtp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep(2);
      setOtp('');
      setNewEmail('');
      setCountdown(60);
      setMessage('');
      setError('');
      setLoading(false);
      setSendingOtp(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || step !== 1 || countdown <= 0) return;

    const timer = window.setInterval(() => {
      setCountdown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown, open, step]);

  if (!open) return null;

  const authToken = token || getAuthToken();

  function getErrorMessage(err: unknown, fallback: string) {
    const message = err instanceof Error ? err.message : fallback;
    if (message.includes('Mã OTP không đúng')) {
      return 'Mã OTP không chính xác, vui lòng kiểm tra lại';
    }
    return message;
  }

  async function sendOtpEmail() {
    if (!authToken) {
      setError('Chưa đăng nhập');
      return false;
    }

    setSendingOtp(true);
    setError('');
    setMessage('');

    try {
      await requestChangeEmailOtp(newEmail, authToken);
      setMessage('Đã gửi OTP đến email hiện tại của bạn');
      setCountdown(60);
      return true;
    } catch (err) {
      setError(getErrorMessage(err, 'Lỗi gửi OTP'));
      return false;
    } finally {
      setSendingOtp(false);
    }
  }

  function handleOtpChange(value: string) {
    setOtp(value.replace(/\D/g, '').slice(0, 6));
    setError('');
  }

  async function handleSaveEmail() {
    setMessage('');
    setError('');

    if (!newEmail) {
      setError('Vui lòng nhập email mới');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError('Email không hợp lệ, vui lòng kiểm tra lại dữ liệu');
      return;
    }
    if (newEmail === currentEmail) {
      setError('Email mới không được trùng email hiện tại, vui lòng kiểm tra lại dữ liệu');
      return;
    }

    const sent = await sendOtpEmail();
    if (sent) setStep(1);
  }

  async function handleVerifyOtp() {
    if (!authToken) {
      setError('Chưa đăng nhập');
      return;
    }
    if (otp.length !== 6) {
      setError('OTP phải gồm 6 chữ số');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyChangeEmailOtp(otp, authToken);
      await onSave?.(newEmail);
      await onSuccess?.(newEmail);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, 'Lỗi xác minh OTP'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {error && (
        <div className="absolute left-1/2 top-8 z-[60] flex w-[min(520px,calc(100vw-32px))] -translate-x-1/2 items-center gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 shadow-lg">
          <AlertCircle size={18} className="shrink-0 fill-red-500 text-white" />
          <span className="min-w-0 flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError('')}
            className="shrink-0 rounded p-1 text-red-500 transition hover:bg-red-100"
            aria-label="Đóng thông báo lỗi"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 transition hover:text-slate-600"
          aria-label="Đóng"
        >
          <X size={20} />
        </button>

        <h3 className="mb-2 text-center text-lg font-bold uppercase text-blue-600">
          Thay đổi email
        </h3>

        {step === 2 ? (
          <>
            <p className="mb-6 text-center text-sm text-slate-600">
              Vui lòng nhập email mới
            </p>

            <label className="mb-4 block">
              <span className="mb-2 block text-xs font-medium text-slate-600">
                Email <span className="text-red-500">*</span>
              </span>
              <input
                type="email"
                value={newEmail}
                onChange={(event) => {
                  setNewEmail(event.target.value);
                  setError('');
                }}
                className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Nhập email mới"
              />
            </label>

            <button
              type="button"
              onClick={handleSaveEmail}
              disabled={sendingOtp}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sendingOtp && <Loader2 size={18} className="animate-spin" />}
              {sendingOtp ? 'Đang gửi OTP...' : 'Lưu'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="mt-4 block w-full text-center text-sm font-medium text-slate-500 transition hover:text-slate-700"
            >
              Hủy bỏ
            </button>
          </>
        ) : (
          <>
            <div className="mb-5 text-center text-sm text-slate-600">
              <p>Chúng tôi đã gửi mã xác minh qua email hiện tại</p>
              <p className="mt-2 font-bold text-slate-800">{currentEmail || 'Email hiện tại'}</p>
              <p className="mt-2">Bạn vui lòng kiểm tra và điền mã xác thực</p>
            </div>

            {message && (
              <div className="mb-4 rounded border border-green-200 bg-green-50 p-2 text-center text-sm text-green-700">
                {message}
              </div>
            )}

            <label className="mb-4 block">
              <span className="mb-2 block text-xs font-medium text-slate-600">
                OTP <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(event) => handleOtpChange(event.target.value)}
                maxLength={6}
                className="h-12 w-full rounded-lg border border-slate-300 px-3 text-center text-xl font-bold tracking-widest outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="000000"
                disabled={loading}
              />
            </label>

            <div className="mb-4 text-center">
              <p className="text-sm font-semibold text-blue-600">
                00:{String(countdown).padStart(2, '0')}
              </p>
              <button
                type="button"
                onClick={sendOtpEmail}
                disabled={countdown > 0 || sendingOtp}
                className="mt-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Chưa nhận được mã? Gửi lại
              </button>
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Đang xác minh...' : 'Xác nhận'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="mt-4 block w-full text-center text-sm font-medium text-slate-500 transition hover:text-slate-700"
            >
              Hủy bỏ
            </button>
          </>
        )}
      </div>
    </div>
  );
}
