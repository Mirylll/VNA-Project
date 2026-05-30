"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import loginIllustration from "@/assets/images/login-illustration.png";
import emblem from "@/assets/images/emblemofvietnam.png";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formView, setFormView] = useState<"login" | "forgot_password" | "reset_password">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [resetError, setResetError] = useState("");
  //fake api
  const fakeForgotPasswordApi = (email: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@gmail.com") {
          resolve("OK");
        } else {
          reject("Email không tồn tại");
        }
      }, 1000);
    });
  };
  const fakeResetPasswordApi = (newPassword: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // giả lập lỗi
        if (newPassword.length < 6) {
          reject("Mật khẩu phải >= 6 ký tự");
        } else {
          resolve("OK");
        }
      }, 1000);
    });
  };
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    return name.slice(0, 2) + "***@" + domain;
  };
  const handleLogin = async () => {
    if (!username) {
      alert("Vui lòng nhập tên đăng nhập");
      return;
    }
    if (remember) {
      localStorage.setItem("token", "fake-token");
    } else {
      sessionStorage.setItem("token", "fake-token");
    }
    if (!password) {
      alert("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      setLoading(true);
      // const res = await loginApi({ username, password });

      if (username !== "admin" || password !== "123456") {
        throw new Error("Sai tài khoản hoặc mật khẩu");
      }

      alert("Đăng nhập thành công");

    } catch (error: any) {
      alert(error.message || "Sai tài khoản hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async () => {
    if (!email) {
      setForgotError("Vui lòng nhập email");
      return;
    }

    if (!isValidEmail(email)) {
      setForgotError("Email không đúng định dạng");
      return;
    }

    try {
      setLoading(true);

      await fakeForgotPasswordApi(email);


      alert("Đã gửi email xác thực");
      setFormView("reset_password");

    } catch (e: any) {
      alert("Email không tồn tại");


    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async () => {
    setResetError("");

    // validate
    if (!newPassword || !confirmPassword) {
      setResetError("Vui lòng nhập đầy đủ mật khẩu");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Mật khẩu không khớp");
      return;
    }
    try {
      setLoading(true);

      await fakeResetPasswordApi(newPassword);

      alert("Đổi mật khẩu thành công");

      setFormView("login");

    } catch (e) {
      setResetError("Lỗi khôi phục mật khẩu");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-white p-8">
        <Image
          src={loginIllustration}
          alt="Login illustration"
          className="h-auto max-w-full object-contain"
          priority
        />
      </div>

      <div className="flex w-full items-center justify-center bg-white p-4 lg:w-1/2">
        <div className="w-full max-w-md rounded-xl bg-white px-8 pb-8 pt-6 shadow-sm">
          <div className="mb-4 flex justify-center">
            <Image src={emblem} alt="Emblem of Vietnam" width={72} height={72} />
          </div>

          <h1 className="mb-6 text-center text-base font-bold leading-relaxed text-slate-800 md:text-lg">
            Phần Mềm Quản Lý - Tạo Lập Cơ Sở Dữ Liệu An Toàn Vệ Sinh Lao Động
          </h1>

          {formView === "login" ? (
            <>
              <p className="mb-5 text-left text-xs font-bold uppercase text-blue-600">
                ĐĂNG NHẬP
              </p>

              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="nguyenvanb@gmail.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400">
                  Tên tài khoản <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-10 text-sm text-slate-700 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="mb-6 flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-600"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Nhớ đăng nhập
                </label>
                <button
                  type="button"
                  onClick={() => setFormView("forgot_password")}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Quên mật khẩu
                </button>
              </div>

              <button
                type="button"
                className="mb-3 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
                onClick={handleLogin}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <button
                type="button"
                className="w-full rounded-lg border border-blue-600 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 active:bg-blue-100"
              >
                Đăng ký tài khoản doanh nghiệp
              </button>
            </>
          ) : formView === "forgot_password" ? (
            <>
              <p className="mb-2 text-center text-lg font-bold text-blue-600">
                QUÊN MẬT KHẨU
              </p>

              <p className="mb-5 text-center text-sm text-slate-400">
                Vui lòng nhập email đã đăng ký tài khoản
              </p>

              <div className="relative mb-6">
                <input
                  type="email"
                  value={email}
                  placeholder="nguyenvanb@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400">
                  Email <span className="text-red-500">*</span>
                </label>
                {forgotError && (
                  <p className="text-red-500 text-sm mt-1">{forgotError}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleForgotPassword()}
                className="mb-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
              >
                Gửi xác thực
              </button>

              <p className="text-center text-sm text-slate-500">
                Bạn đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => setFormView("login")}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            </>
          ) : (
            <>
              <p className="mb-2 text-center text-lg font-bold text-blue-600">
                QUÊN MẬT KHẨU
              </p>

              <p className="mb-1 text-center text-sm text-slate-400">
                Chúng tôi đã gửi mã xác minh qua email
              </p>
              <p className="mb-1 text-center text-sm font-bold text-slate-700">
                Email: <span>{maskEmail(email)}</span>
              </p>
              <p className="mb-5 text-center text-sm text-slate-400">
                Bạn vui lòng kiểm tra và điền mã xác thực
              </p>

              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-10 text-sm text-slate-700 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400">
                  Nhập mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <EyeOff size={18} />
                </button>
              </div>

              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-10 text-sm text-slate-700 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400">
                  Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <EyeOff size={18} />
                </button>
              </div>

              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="122456"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400">
                  OTP <span className="text-red-500">*</span>
                </label>
              </div>

              <p className="mb-1 text-center text-sm font-semibold text-blue-600">
                00:60
              </p>
              <p className="mb-6 text-center text-xs text-slate-400">
                Chưa nhận được mã? Gửi lại
              </p>

              <button
                type="button"
                onClick={handleResetPassword}
                className="mb-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
              >
                Khôi phục mật khẩu
              </button>

              <p className="text-center text-sm text-slate-500">
                Bạn đã có tài khoản{" "}
                <button
                  type="button"
                  onClick={() => setFormView("login")}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
              {resetError && (
                <p className="text-red-500 text-sm">{resetError}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
