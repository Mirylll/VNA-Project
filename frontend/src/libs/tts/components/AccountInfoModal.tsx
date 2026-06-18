"use client";

import { X } from 'lucide-react';

interface DetailModalProps {
  open: boolean;
  currentAccount: any;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs text-slate-400 min-w-[120px] shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-800 font-medium">{value ?? '-'}</span>
    </div>
  );
}

export default function DetailModal({
  open,
  currentAccount,
  onClose,
}: DetailModalProps) {
  if (!open || !currentAccount) return null;

  const e = currentAccount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-blue-600 px-6 py-3 flex items-center justify-between shrink-0">
          <h2 className="text-white font-semibold text-base">
            Thông tin doanh nghiệp
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Thông tin chung</h3>
            <DetailRow label="Tên doanh nghiệp" value={e.name} />
            <DetailRow label="Tên nước ngoài" value={e.foreignName} />
            <DetailRow label="Mã số thuế" value={e.taxCode} />
            <DetailRow label="Loại hình" value={e.enterpriseType?.name} />
            <DetailRow label="Ngành nghề" value={e.industry?.name} />
            <DetailRow label="Ngày cấp phép" value={e.licenseDate} />
            <DetailRow label="Trạng thái" value={e.isActive ? 'Hoạt động' : 'Ngừng hoạt động'} />
          </div>

          <div className="border-t border-slate-200" />

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Địa chỉ</h3>
            <DetailRow label="Địa chỉ trụ sở" value={e.address} />
            <DetailRow label="Tỉnh/Thành phố" value={e.province?.name} />
            <DetailRow label="Phường/Xã" value={e.ward?.name} />
            <DetailRow label="Địa chỉ hoạt động" value={e.operationAddress} />
            <DetailRow label="Tỉnh (hoạt động)" value={e.operationProvince?.name} />
            <DetailRow label="Phường/Xã (hoạt động)" value={e.operationWard?.name} />
          </div>

          <div className="border-t border-slate-200" />

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Liên hệ</h3>
            <DetailRow label="Email" value={e.email} />
            <DetailRow label="Số điện thoại" value={e.phone} />
            <DetailRow label="Tên lãnh đạo" value={e.leaderName} />
            <DetailRow label="SĐT lãnh đạo" value={e.leaderPhone} />
          </div>

          <div className="border-t border-slate-200" />

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tài khoản</h3>
            <DetailRow label="Tên đăng nhập" value={e.username} />
            <DetailRow label="Mật khẩu" value={e.password} />
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-end border-t border-slate-200 shrink-0">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
