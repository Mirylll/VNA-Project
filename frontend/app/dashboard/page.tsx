"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/libs/core/utils/auth-token';

type User = { id: string; username: string; email?: string; fullName?: string };

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const baseUrl = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') : '';

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetch(`${baseUrl}/auth/me`, { headers: { authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setUser(d))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Đang tải...</div>;
  if (!user) return <div className="p-8">Không có người dùng. Vui lòng đăng nhập.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-blue-800 text-white min-h-screen p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">VN</div>
            <div>
              <div className="text-sm font-semibold">Ủy ban nhân dân tỉnh ABC</div>
            </div>
          </div>
          <nav className="space-y-2">
            <div className="px-2 py-2 bg-blue-700 rounded">Trang chủ</div>
            <div className="px-2 py-2">Quản lý người dùng</div>
            <div className="px-2 py-2">Cấu hình</div>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chi tiết người dùng</h2>
            <div className="flex items-center gap-3">
              <div className="text-sm">{user.username}</div>
            </div>
          </div>

          <div className="rounded bg-white p-6 shadow">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-gray-500">Tên đăng nhập</label>
                <input className="w-full rounded border px-3 py-2" value={user.username} disabled />
              </div>
              <div>
                <label className="text-xs text-gray-500">Họ và tên</label>
                <input className="w-full rounded border px-3 py-2" defaultValue={user.fullName || ''} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <input className="w-full rounded border px-3 py-2" value={user.email || ''} disabled />
              </div>
              <div>
                <label className="text-xs text-gray-500">Kích hoạt</label>
                <div className="mt-2"> <input type="checkbox" checked readOnly /> </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="rounded bg-blue-600 px-4 py-2 text-white">Lưu</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
