"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Check, Lock, ShieldCheck, UserRound } from "lucide-react";
import {
  getAuthToken,
  getAuthUser,
  setAuthSession,
  type AuthUser,
} from "@/libs/core/utils/auth-token";

type AccountForm = {
  username: string;
  fullName: string;
  email: string;
  accountType: string;
  roleName: string;
  titleName: string;
  permissionCount: string;
};

const BASE_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    : "http://localhost:3001";

const emptyForm: AccountForm = {
  username: "",
  fullName: "",
  email: "",
  accountType: "Nội bộ",
  roleName: "",
  titleName: "",
  permissionCount: "0",
};

const inputClass =
  "h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
const errorInputClass =
  "h-10 w-full rounded border border-red-300 bg-red-50 px-3 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500";
const disabledInputClass =
  "h-10 w-full cursor-not-allowed rounded border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 outline-none";

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "AD";
}

function getAccountTypeLabel(accountType?: AuthUser["accountType"]) {
  if (accountType === "enterprise") return "Doanh nghiệp";
  return "Nội bộ";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function updateStoredAuthUser(user: AuthUser) {
  if (typeof window === "undefined") return;

  const token = getAuthToken();
  if (!token) return;

  const remember = Boolean(window.localStorage.getItem("token"));
  setAuthSession(token, user, remember);
}

export default function AccountPage() {
  const [form, setForm] = useState<AccountForm>(emptyForm);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof AccountForm, string>>>({});

  const avatarText = useMemo(
    () => getInitials(form.fullName || form.username),
    [form.fullName, form.username],
  );

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      const token = getAuthToken();
      const storedUser = getAuthUser();

      if (storedUser) {
        setAuthUser(storedUser);
        setFormFromUser(storedUser);
      }

      if (!token) {
        setLoading(false);
        setError("Bạn cần đăng nhập để xem thông tin tài khoản.");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Không tải được thông tin tài khoản.");
        }

        const data = (await response.json()) as AuthUser;
        if (!active) return;

        setAuthUser(data);
        setFormFromUser(data);
        updateStoredAuthUser(data);
      } catch (loadError: any) {
        if (active) {
          setError(loadError?.message || "Không tải được thông tin tài khoản.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    function setFormFromUser(user: AuthUser) {
      setForm({
        username: user.username || "",
        fullName: user.fullName || "",
        email: user.email || "",
        accountType: getAccountTypeLabel(user.accountType),
        roleName: user.role?.name || "",
        titleName: user.title?.name || "",
        permissionCount: String(user.permissions?.length || 0),
      });
    }

    loadAccount();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
    setError("");
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  }

  function validateForm() {
    const errors: Partial<Record<keyof AccountForm, string>> = {};
    const fullName = form.fullName.trim();
    const email = form.email.trim();

    if (!fullName) {
      errors.fullName = "Vui lòng nhập họ tên.";
    } else if (fullName.length > 150) {
      errors.fullName = "Họ tên tối đa 150 ký tự.";
    }

    if (email && !isValidEmail(email)) {
      errors.email = "Email không đúng định dạng.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) return;

    const token = getAuthToken();
    if (!token) {
      setError("Bạn cần đăng nhập để cập nhật thông tin tài khoản.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const fullName = form.fullName.trim();
      const email = form.email.trim();
      const response = await fetch(`${BASE_URL}/auth/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, email: email || null }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        user?: Partial<AuthUser>;
      };

      if (!response.ok) {
        throw new Error(data.message || "Cập nhật thông tin tài khoản thất bại.");
      }

      const nextUser: AuthUser = {
        ...(authUser || getAuthUser() || {
          id: "",
          username: form.username,
          fullName,
        }),
        ...data.user,
        fullName: data.user?.fullName || fullName,
        email: data.user?.email ?? email,
      } as AuthUser;

      setAuthUser(nextUser);
      updateStoredAuthUser(nextUser);
      setForm((current) => ({
        ...current,
        fullName: nextUser.fullName || fullName,
        email: nextUser.email || "",
      }));
      setMessage(data.message || "Cập nhật thông tin tài khoản thành công.");
      setTimeout(() => setMessage(""), 3000);
    } catch (saveError: any) {
      setError(saveError?.message || "Cập nhật thông tin tài khoản thất bại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Thông tin tài khoản</h1>
            <p className="mt-1 text-sm text-slate-500">
              Thông tin tài khoản đang đăng nhập
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            <Check size={16} />
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>

        {message && (
          <div className="mx-6 mt-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mx-6 mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 p-6 lg:grid-cols-[240px_1fr]">
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
              {avatarText}
            </div>

            <div className="mt-4 text-center">
              <div className="font-semibold text-slate-900">
                {form.fullName || "Người dùng"}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                {form.roleName || "Tài khoản nội bộ"}
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>{form.permissionCount} quyền hiệu lực</span>
              </div>
              <p>
                Các trường vai trò, chức danh và tên đăng nhập được khóa để tránh sai lệch phân quyền.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="mb-4 text-base font-semibold text-slate-900">
                Thông tin cá nhân
              </h2>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="block">
                  <span className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-600">
                    Tên đăng nhập <Lock size={12} />
                  </span>
                  <input value={form.username} disabled className={disabledInputClass} />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    Họ tên <span className="text-red-500">*</span>
                  </span>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ tên"
                    className={fieldErrors.fullName ? errorInputClass : inputClass}
                    maxLength={150}
                  />
                  {fieldErrors.fullName && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>
                  )}
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    Email
                  </span>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                    className={fieldErrors.email ? errorInputClass : inputClass}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                  )}
                </label>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-base font-semibold text-slate-900">
                Thông tin phân quyền
              </h2>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

                <label className="block">
                  <span className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-600">
                    Chức danh <Lock size={12} />
                  </span>
                  <input value={form.titleName} disabled className={disabledInputClass} />
                </label>
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <UserRound size={17} className="mt-0.5 text-slate-500" />
                <p>
                  Muốn đổi mật khẩu thì dùng menu tài khoản ở sidebar. Muốn thay đổi vai trò
                  hoặc quyền, quản trị viên cần thao tác trong màn quản lý người dùng/vai trò.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
