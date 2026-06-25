"use client";

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Check, Lock, UserRound } from 'lucide-react';
import { getAuthToken, getAuthUser, setAuthSession, type AuthUser } from '@/libs/core/utils/auth-token';

const BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : 'http://localhost:3001';

type EnterpriseInfo = {
  id?: number;
  name?: string;
  taxCode?: string;
  email?: string;
};

type AccountForm = {
  username: string;
  fullName: string;
  email: string;
  accountType: string;
  roleName: string;
  enterpriseName: string;
  taxCode: string;
};

const emptyForm: AccountForm = {
  username: '',
  fullName: '',
  email: '',
  accountType: 'Doanh nghiệp',
  roleName: 'Doanh nghiệp',
  enterpriseName: '',
  taxCode: '',
};

const inputClass =
  'h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
const disabledInputClass =
  'h-10 w-full cursor-not-allowed rounded border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 outline-none';

function getInitials(name: string) {
  const words = name.split(' ').filter(Boolean);
  const lastWord = words[words.length - 1] || '';
  return lastWord.slice(0, 3).toUpperCase() || 'DN';
}

function updateStoredAuthUser(user: AuthUser) {
  if (typeof window === 'undefined') return;

  const remember = Boolean(window.localStorage.getItem('token'));
  const token = getAuthToken();
  if (!token) return;

  setAuthSession(token, user, remember);
}

export default function EnterpriseAccountPage() {
  const [form, setForm] = useState<AccountForm>(emptyForm);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const avatarText = useMemo(() => getInitials(form.fullName || form.enterpriseName), [form.fullName, form.enterpriseName]);

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      const token = getAuthToken();
      const storedUser = getAuthUser();
      setAuthUser(storedUser);

      if (storedUser) {
        setForm((current) => ({
          ...current,
          username: storedUser.username || '',
          fullName: storedUser.fullName || '',
          email: storedUser.email || '',
          accountType: storedUser.accountType === 'enterprise' ? 'Doanh nghiệp' : 'Nội bộ',
          roleName: storedUser.role?.name || 'Doanh nghiệp',
        }));
        setAvatarUrl(storedUser?.avatarUrl || null);
      }

      if (!token) {
        setLoading(false);
        setError('Bạn cần đăng nhập để xem thông tin tài khoản.');
        return;
      }

      try {
        const [profileResponse, enterpriseResponse] = await Promise.all([
          fetch(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/enterprises/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const profile = profileResponse.ok ? ((await profileResponse.json()) as AuthUser) : null;
        const enterprise = enterpriseResponse.ok ? ((await enterpriseResponse.json()) as EnterpriseInfo) : null;

        if (!active) return;

        const nextUser = profile || storedUser;
        setAuthUser(nextUser);
        setForm({
          username: nextUser?.username || '',
          fullName: nextUser?.fullName || '',
          email: nextUser?.email || enterprise?.email || '',
          accountType: nextUser?.accountType === 'enterprise' ? 'Doanh nghiệp' : 'Nội bộ',
          roleName: nextUser?.role?.name || 'Doanh nghiệp',
          enterpriseName: enterprise?.name || '',
          taxCode: enterprise?.taxCode || '',
        });
        setAvatarUrl(nextUser?.avatarUrl || null);
      } catch {
        if (active) setError('Không tải được thông tin tài khoản.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAccount();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
    setMessage('');
  }

  async function handleSave() {
    const fullName = form.fullName.trim();
    if (!fullName) {
      setError('Vui lòng nhập họ tên người dùng.');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError('Bạn cần đăng nhập để cập nhật thông tin tài khoản.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const response = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName }),
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string; user?: Partial<AuthUser> };

      if (!response.ok) {
        throw new Error(data.message || 'Cập nhật thông tin tài khoản thất bại');
      }

      const nextUser: AuthUser = {
        ...(authUser || getAuthUser() || {
          id: '',
          username: form.username,
          fullName,
        }),
        ...data.user,
        fullName: data.user?.fullName || fullName,
      } as AuthUser;

      setAuthUser(nextUser);
      updateStoredAuthUser(nextUser);
      setForm((current) => ({ ...current, fullName: nextUser.fullName }));
      setMessage(data.message || 'Cập nhật thông tin tài khoản thành công.');
      setTimeout(() => setMessage(''), 3000);
    } catch (saveError: any) {
      setError(saveError?.message || 'Cập nhật thông tin tài khoản thất bại');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main>
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Thông tin tài khoản</h1>
            <p className="mt-0.5 text-sm text-slate-500">Thông tin tài khoản đang đăng nhập</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            <Check size={16} />
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </header>

        <div className="p-6">
          {message && (
            <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-6 p-6 lg:grid-cols-[240px_1fr]">
              <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-2xl font-bold text-white">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl.startsWith('http') ? avatarUrl : `${BASE_URL}${avatarUrl}`}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    avatarText
                  )}
                </div>

                <div className="mt-4 text-center">
                  <div className="font-semibold text-slate-900">{form.fullName || 'Người dùng doanh nghiệp'}</div>
                  <div className="mt-1 text-sm text-slate-500">{form.roleName}</div>
                </div>

                <div className="mt-6 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                  Chỉ cho phép chỉnh thông tin cơ bản. Các thông tin định danh được khóa để tránh sai lệch dữ liệu.
                </div>
              </section>

              <section className="space-y-6">
                <div>
                  <h2 className="mb-4 text-base font-semibold text-slate-900">Thông tin cá nhân</h2>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Tên đăng nhập</span>
                      <input value={form.username} disabled className={disabledInputClass} />
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Họ tên người dùng</span>
                      <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Nhập họ tên"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-600">Email</span>
                      <input value={form.email} disabled className={disabledInputClass} />
                    </label>

                    <label className="block">
                      <span className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-600">
                        Loại tài khoản <Lock size={12} />
                      </span>
                      <input value={form.accountType} disabled className={disabledInputClass} />
                    </label>

                    <label className="block">
                      <span className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-600">
                        Vai trò <Lock size={12} />
                      </span>
                      <input value={form.roleName} disabled className={disabledInputClass} />
                    </label>
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-base font-semibold text-slate-900">Thông tin doanh nghiệp</h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-600">
                        Tên doanh nghiệp <Lock size={12} />
                      </span>
                      <input value={form.enterpriseName} disabled className={disabledInputClass} />
                    </label>

                    <label className="block">
                      <span className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-600">
                        Mã số thuế <Lock size={12} />
                      </span>
                      <input value={form.taxCode} disabled className={disabledInputClass} />
                    </label>
                  </div>
                </div>

                <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <UserRound size={17} className="mt-0.5 text-slate-500" />
                    <p>
                      Nếu cần đổi email, mã số thuế hoặc thông tin doanh nghiệp, hãy dùng màn
                      {' '}
                      <span className="font-semibold text-slate-800">Thông tin doanh nghiệp</span>
                      {' '}
                      để đi đúng luồng xác thực.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
