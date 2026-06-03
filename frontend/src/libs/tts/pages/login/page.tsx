"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EyeOff } from "lucide-react";
import { getAuthToken } from "@/libs/core/utils/auth-token";
const baseUrl =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    : "";

export default function LoginPage() {
  const router = useRouter();

  const [formView, setFormView] = useState<
    "login" | "forgot_password" | "reset_password"
  >("login");

  const [showPassword, setShowPassword] = useState(false);

  // login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");

  // forgot/reset
  const [email, setEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [resetError, setResetError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ===== CHECK LOGIN =====
  useEffect(() => {
    const token = getAuthToken();

    if (token) {
      router.push("/user-profile");
    }
  }, [router]);

  // ===== LOGIN API =====
  const handleLogin = async () => {
    if (loading) return;

    setMessage("");

    if (!username) {
      setMessage("Vui lòng nhập tên đăng nhập");
      return;
    }

    if (!password) {
      setMessage("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Đăng nhập thất bại");
        return;
      }

      // remember login
      if (remember) {
        localStorage.setItem("token", data.accessToken);
      } else {
        sessionStorage.setItem("token", data.accessToken);
      }

      setMessage("Đăng nhập thành công");

      router.push("/user-profile");
    } catch (error) {
      setMessage("Lỗi kết nối backend");
    } finally {
      setLoading(false);
    }
  };


  const sendForgotPasswordOtp = async (email: string) => {
    const res = await fetch(`${baseUrl}/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Lỗi gửi email xác thực");
    }

    return data;
  };

  const fakeResetPasswordApi = (password: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password.length < 6) reject("Mật khẩu phải >= 6 ký tự");
        else resolve("OK");
      }, 500);
    });
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    return name.slice(0, 2) + "***@" + domain;
  };
  const handleForgotPassword = async () => {
    setForgotError("");

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

      await sendForgotPasswordOtp(email);


      alert("Đã gửi email xác thực");
      setFormView("reset_password");

    } catch (e: any) {
      setForgotError(e?.message || "Lỗi gửi email xác thực");


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
        <div className="login-illustration-wrap max-w-full">
          <img
            src="/login-illustration.png"
            alt="Login illustration"
            className="h-auto max-w-full object-contain"
          />
          <div className="decor-circle decor-1">1</div>
          <div className="decor-circle decor-2">2</div>
          <div className="decor-circle decor-3">3</div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-white p-4 lg:w-1/2">
        <div className="w-full max-w-md rounded-xl bg-white px-8 pb-8 pt-6 shadow-sm">
          <div className="mb-4 flex justify-center">
            <img src="/emblemofvietnam.png" alt="Emblem of Vietnam" width={72} height={72} className="h-auto w-auto" />
          </div>

          <h1 className="mb-6 text-center text-base font-bold leading-relaxed text-slate-800 md:text-lg">
            Phần Mềm Quản Lý - Tạo Lập Cơ Sở Dữ Liệu An Toàn Vệ Sinh Lao Động
          </h1>

          {formView === "login" ? (
            <>
              <p className="mb-5 text-left text-xs font-bold uppercase text-blue-600">
                ĐĂNG NHẬP
              </p>

              <div className="relative mb-4 floating">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder=" "
                  className=""
                />
                <label>Tên tài khoản <span className="text-red-500">*</span></label>
              </div>

              <div className="relative mb-4 floating">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                />
                <label>Mật khẩu <span className="text-red-500">*</span></label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <img src={showPassword ? '/icons/eye-off.svg' : '/icons/eye.svg'} alt="toggle" />
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

                className="mb-3 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
              {message ? (
                <p className="mb-3 text-sm text-center text-red-600">{message}</p>
              ) : null}

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
                disabled={loading}
                className="mb-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {loading ? "Đang gửi..." : "Gửi xác thực"}
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
