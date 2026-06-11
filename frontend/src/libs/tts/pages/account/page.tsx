"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { getAuthToken } from "@/libs/core/utils/auth-token";

type AccountForm = {
  code: string;
  username: string;
  name: string;
  dob: string;
  gender: string;
  position: string;
  role: string;
  email: string;
  city: string;
  district: string;
  address: string;
  active: boolean;
};

const inputClass =
  "h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

export default function AccountPage() {
  const [user, setUser] = useState<AccountForm>({
    code: "Vna25112020",
    username: "admin",
    name: "Phan Thanh Tùng",
    dob: "1995-04-01",
    gender: "Nam",
    position: "Quản trị viên",
    role: "Quản trị viên",
    email: "phantung@gmail.com",
    city: "TP Hồ Chí Minh",
    district: "Gò Vấp",
    address: "",
    active: true,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    if (!token) return;

    fetch(`${baseUrl}/auth/me`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setUser((prev) => ({
          ...prev,
          code: data.username || prev.code,
          username: data.username || prev.username,
          name: data.fullName || prev.name,
          email: data.email || prev.email,
        }));
      })
      .catch(() => undefined);
  }, []);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    setMessage("Thông tin tài khoản đã được cập nhật trên giao diện");
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Chi tiết người dùng
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Thông tin tài khoản đang đăng nhập
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="rounded bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>

        {message && (
          <div className="mx-6 mt-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 p-6 lg:grid-cols-[220px_1fr]">
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
              {user.name
                .split(" ")
                .filter(Boolean)
                .slice(-2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()}
            </div>

            <div className="mt-4 text-center">
              <div className="font-semibold text-slate-900">{user.name}</div>
              <div className="mt-1 text-sm text-slate-500">{user.role}</div>
            </div>

            <label className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={user.active}
                onChange={() =>
                  setUser((prev) => ({ ...prev, active: !prev.active }))
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Kích hoạt
            </label>
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="mb-4 text-base font-semibold text-slate-900">
                Thông tin cá nhân
              </h2>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    Mã người dùng
                  </span>
                  <input
                    name="code"
                    value={user.code}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    Tên đăng nhập
                  </span>
                  <input
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    className={`${inputClass} bg-slate-100 text-slate-500`}
                    disabled
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    Họ tên
                  </span>
                  <input
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    Ngày sinh
                  </span>
                  <input
                    type="date"
                    name="dob"
                    value={user.dob}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    Giới tính
                  </span>
                  <select
                    name="gender"
                    value={user.gender}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Nam</option>
                    <option>Nữ</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    Chức danh
                  </span>
                  <input
                    name="position"
                    value={user.position}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    Vai trò
                  </span>
                  <select
                    name="role"
                    value={user.role}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Quản trị viên</option>
                    <option>Nhân viên</option>
                  </select>
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    Email
                  </span>
                  <input
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-base font-semibold text-slate-900">
                Thông tin liên hệ
              </h2>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    Tỉnh/Thành phố
                  </span>
                  <select
                    name="city"
                    value={user.city}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>TP Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    Quận/Huyện
                  </span>
                  <select
                    name="district"
                    value={user.district}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Gò Vấp</option>
                    <option>Quận 1</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    Địa chỉ
                  </span>
                  <input
                    name="address"
                    value={user.address}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                    className={inputClass}
                  />
                </label>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
