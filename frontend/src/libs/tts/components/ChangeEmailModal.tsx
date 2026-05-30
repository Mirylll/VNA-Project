"use client";

import React, { useState, useEffect } from 'react';

interface ChangeEmailModalProps {
  open: boolean;
  onClose: () => void;
  currentEmail?: string;
  onSave?: (newEmail: string) => void;
}

export default function ChangeEmailModal({ open, onClose, currentEmail = 'phanthanhtung093@gmail.com', onSave }: ChangeEmailModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [message, setMessage] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') : '';

  // Send OTP when modal opens
  useEffect(() => {
    if (open && step === 1) {
      sendOtpEmail();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setOtp('');
      setNewEmail('');
      setCountdown(60);
      setMessage('');
      setOtpError('');
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (countdown <= 0 || !open || step !== 1) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, open, step]);

  if (!open) return null;

  const sendOtpEmail = async () => {
    setSendingOtp(true);
    setOtpError('');
    setMessage('');
    try {
      const res = await fetch(`${baseUrl}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Đã gửi OTP đến email của bạn');
        setCountdown(60);
      } else {
        setOtpError(data.message || 'Lỗi gửi OTP');
      }
    } catch (error) {
      setOtpError('Lỗi kết nối');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(numericOnly);
    setOtpError('');
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError('OTP phải gồm 6 chữ số');
      return;
    }
    
    setLoading(true);
    setOtpError('');
    try {
      const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, otp })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStep(2);
      } else {
        // Handle error response
        const errorMsg = data.message || data.error?.message || 'Xác minh OTP thất bại';
        setOtpError(errorMsg);
      }
    } catch (error) {
      setOtpError('Lỗi xác minh OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = () => {
    setMessage('');
    if (!newEmail) {
      setOtpError('Vui lòng nhập email mới');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setOtpError('Email không hợp lệ');
      return;
    }
    if (onSave) {
      onSave(newEmail);
    }
    onClose();
  };

  const handleResendOtp = async () => {
    await sendOtpEmail();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg overflow-hidden bg-white shadow-lg">
        {/* Header */}
        <div className="px-4 py-4 text-center border-b border-gray-200">
          <h3 className="text-lg font-bold text-blue-600">THAY ĐỔI EMAIL</h3>
        </div>

        {/* Body */}
        <div className="px-4 py-4">
          {step === 1 ? (
            <>
              {/* Step 1: OTP Verification */}
              {sendingOtp ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm text-gray-600">Đang gửi OTP...</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-center space-y-2">
                    <p className="text-sm text-gray-600">Chúng tôi đã gửi mã xác minh qua số email cũ</p>
                    <p className="font-bold text-gray-800 text-sm">{currentEmail}</p>
                    <p className="text-sm text-gray-600">Bạn vui lòng kiểm tra và điền mã xác thực</p>
                  </div>

                  {message && (
                    <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm text-center">
                      ✓ {message}
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-xs text-gray-600 font-medium mb-2">
                      OTP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={otp}
                      onChange={handleOtpChange}
                      maxLength={6}
                      className="w-full text-center text-2xl font-bold tracking-widest rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="000000"
                      disabled={loading}
                    />
                  </div>

                  {otpError && (
                    <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center">
                      ✗ {otpError}
                    </div>
                  )}

                  <div className="mb-4 text-center">
                    <p className="text-sm font-semibold text-blue-600">
                      00:{String(countdown).padStart(2, '0')}
                    </p>
                  </div>

                  <div className="mb-4 text-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={countdown > 0 || sendingOtp}
                      className={`text-sm font-medium ${
                        countdown > 0 || sendingOtp
                          ? 'cursor-not-allowed text-gray-400'
                          : 'text-blue-600 hover:underline'
                      }`}
                    >
                      {countdown > 0 ? `Gửi lại (${countdown}s)` : 'Chưa nhận được mã? Gửi lại'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6 || loading}
                    className={`mb-3 w-full rounded px-4 py-2 text-sm font-medium text-white transition ${
                      otp.length !== 6 || loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Đang xác minh...' : 'Xác nhận'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* Step 2: Enter New Email */}
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-600">Vui lòng nhập email mới</p>
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-600 font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    setOtpError('');
                  }}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Nhập email mới"
                />
              </div>

              {otpError && (
                <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center">
                  ✗ {otpError}
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveEmail}
                disabled={!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)}
                className={`mb-3 w-full rounded px-4 py-2 text-sm font-medium text-white transition ${
                  !newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Lưu
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Hủy bỏ
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
