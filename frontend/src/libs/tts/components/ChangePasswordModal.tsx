"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (oldPassword: string, newPassword: string, confirmPassword: string) => void;
}

export default function ChangePasswordModal({ open, onClose, onSave }: ChangePasswordModalProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  if (!open) return null;

  const handleSave = () => {
    setMessage('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage('Vui lòng điền đầy đủ các trường');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu mới không khớp');
      return;
    }
    if (newPassword.length < 8) {
      setMessage('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setMessage('Mật khẩu phải có ít nhất 1 chữ hoa');
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setMessage('Mật khẩu phải có ít nhất 1 chữ thường');
      return;
    }
    if (!/\d/.test(newPassword)) {
      setMessage('Mật khẩu phải có ít nhất 1 chữ số');
      return;
    }
    if (onSave) {
      onSave(oldPassword, newPassword, confirmPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg overflow-hidden bg-white shadow-lg">
        {/* Header */}
        <div className="bg-blue-600 px-4 py-3 text-white">
          <h3 className="font-semibold text-base">Đổi mật khẩu</h3>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs text-gray-600 font-medium mb-2">
              Mật khẩu cũ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
                placeholder="Nhập mật khẩu cũ"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition flex items-center"
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 font-medium mb-2">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition flex items-center"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 font-medium mb-2">
              Nhập lại mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
                placeholder="Xác nhận mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition flex items-center"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {message && <p className="text-sm text-red-600">{message}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t px-4 py-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
