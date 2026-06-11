"use client";

import { EyeOff } from 'lucide-react';

interface AccountInfoModalProps {
  open: boolean;
  currentAccount: any;
  onClose: () => void;
}

export default function AccountInfoModal({
  open,
  currentAccount,
  onClose,
}: AccountInfoModalProps) {
  if (!open || !currentAccount) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-3 flex items-center justify-between">
          <h2 className="text-white font-semibold text-base">
            Thông tin tài khoản
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <EyeOff size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs text-slate-400 mb-1">Tên doanh nghiệp</p>
            <p className="text-sm text-slate-800 font-medium">{currentAccount.name}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs text-slate-400 mb-1">Tên đăng nhập</p>
              <p className="text-sm text-slate-800 font-mono">{currentAccount.username}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Mật khẩu</p>
              <p className="text-sm text-slate-800 font-mono">{currentAccount.password}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-end border-t border-slate-200">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm"
          >
            Huỷ bỏ
          </button>
        </div>
      </div>
    </div>
  );
}
