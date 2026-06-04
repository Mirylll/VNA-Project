"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/libs/core/utils/auth-token';

interface UserFormData {
  username: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  position: string;
  role: string;
  email: string;
  province: string;
  ward: string;
  address: string;
  isActive: boolean;
}

const initialFormData: UserFormData = {
  username: 'Vna25112020',
  fullName: 'Phan Thanh Tùng',
  dateOfBirth: '1995-06-01',
  gender: 'Nam',
  position: '',
  role: 'Quản trị viên',
  email: 'phanthanhtung093@gmail.com',
  province: 'Thành phố Hồ Chí Minh',
  ward: 'Phường Gò Vấp',
  address: '',
  isActive: true,
};

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

export default function UserProfilePage() {
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = getAuthToken();
      setToken(t);
      if (!t) {
        router.push('/login');
        return;
      }

      fetch(`${baseUrl}/auth/me`, {
        headers: { authorization: `Bearer ${t}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((user) => {
          if (!user) return;

          setFormData((prev) => ({
            ...prev,
            username: user.username || prev.username,
            fullName: user.fullName || prev.fullName,
            email: user.email || prev.email,
          }));
        })
        .catch(() => undefined);
    }
  }, [router]);

  useEffect(() => {
    const handleEmailChanged = (event: Event) => {
      const email = (event as CustomEvent<{ email?: string }>).detail?.email;
      if (!email) return;
      setFormData((prev) => ({ ...prev, email }));
    };

    window.addEventListener('user-email-changed', handleEmailChanged);
    return () => window.removeEventListener('user-email-changed', handleEmailChanged);
  }, []);

  if (!token) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div>
        {/* TOP BAR */}
        <header className="fixed top-0 right-0 left-64 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <button className="p-2 rounded hover:bg-gray-100">☰</button>
              <img src="/logo.svg" alt="logo" className="h-8 w-8" />
              <span className="font-medium text-gray-800">Ủy ban nhân dân tỉnh ABC</span>
            </div>
            
            <div className="text-lg font-bold text-gray-800">Chi tiết người dùng</div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium text-sm flex items-center gap-2"
              >
                💾 Lưu
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="pt-20 px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Success Message */}
            {showSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
                ✓ Cập nhật thành công
              </div>
            )}

            {/* PERSONAL INFO CARD */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-base font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                Thông tin cá nhân
              </h3>

              <div className="flex gap-8">
                {/* LEFT COLUMN - Avatar */}
                <div className="flex-shrink-0 w-56">
                  <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-3 mx-auto text-3xl">
                    📷
                  </div>
                  <p className="text-center text-sm text-gray-800 font-medium mb-2">Tải ảnh đại diện</p>
                  <p className="text-center text-xs text-gray-500 mb-1">*.jpeg, *.jpg, *.png.</p>
                  <p className="text-center text-xs text-gray-500 mb-4">Kích thước tối đa 5 MB</p>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700 font-medium">Kích hoạt</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* RIGHT COLUMN - Form Fields */}
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 font-medium mb-2">
                        Tên đăng nhập (*) 🔒
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          disabled
                          readOnly
                          title="Tên đăng nhập không thể thay đổi"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                          style={{
                            backgroundColor: '#f5f5f5',
                            color: '#9e9e9e',
                            cursor: 'not-allowed',
                            border: '1px solid #e0e0e0'
                          }}
                        />
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                          Tên đăng nhập không thể thay đổi
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 font-medium mb-2">
                        Họ và tên (*)
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 font-medium mb-2">
                        Ngày tháng năm sinh
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 font-medium mb-2">
                        Giới tính
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option>Nam</option>
                        <option>Nữ</option>
                        <option>Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 font-medium mb-2">
                        Chức danh
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 font-medium mb-2">
                        Vai trò (*)
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option>Quản trị viên</option>
                        <option>Người dùng</option>
                        <option>Nhân viên</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs text-gray-600 font-medium mb-2">
                        Email
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-600"
                        />
                        <button 
                          onClick={() => window.dispatchEvent(new CustomEvent('open-user-popup', { detail: { action: 'changeEmail' } }))}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap"
                        >
                          Thay đổi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTACT INFO CARD */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                Thông tin liên hệ
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 font-medium mb-2">
                    Tỉnh/thành phố
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Thành phố Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Đà Nẵng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 font-medium mb-2">
                    Phường/xã
                  </label>
                  <select
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Phường Gò Vấp</option>
                    <option>Phường 1</option>
                    <option>Phường 2</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 font-medium mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
