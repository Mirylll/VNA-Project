"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { getAuthToken } from '@/libs/core/utils/auth-token';

const BASE_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    : "http://localhost:3001";

// ─── Autocomplete Dropdown Component ──────────────────────────────────────────
interface AutocompleteDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: boolean;
}

function AutocompleteDropdown({ options, value, onChange, placeholder = "Chọn...", error }: AutocompleteDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    const query = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    if (!query) return options;
    return options.filter((opt) => 
      opt.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query) ||
      opt.value.toLowerCase().includes(query)
    );
  }, [options, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => setIsOpen(true)}
        className={`w-full flex items-center justify-between rounded-lg border ${
          error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
        } px-3 py-2 text-sm text-gray-800 cursor-pointer hover:border-gray-400 transition-colors`}
      >
        {isOpen ? (
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={selectedOption ? selectedOption.label : placeholder}
            autoFocus
            className="w-full text-sm outline-none border-none p-0 text-gray-800 focus:ring-0 focus:border-none bg-transparent"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={`text-sm ${value ? "text-gray-800 font-medium" : "text-gray-400"}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        )}
        <div className="flex items-center gap-1">
          {value && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setSearch("");
              }}
              className="p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>
          )}
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg z-50 py-1">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400 italic">
              Không tìm thấy kết quả
            </div>
          ) : (
            filteredOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${
                  opt.value === value ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Validate MST ─────────────────────────────────────────────────────────────
// Mã số thuế VN: tối thiểu 10 chữ số, tối đa 15 chữ số không tính dấu "-"
const validateMST = (mst: string): string => {
  if (!mst) return "Mã số thuế không được để trống";
  const cleanMst = mst.replace(/-/g, "");
  if (!/^\d+$/.test(cleanMst)) return "Mã số thuế chỉ được chứa chữ số và dấu gạch ngang";
  if (cleanMst.length < 10 || cleanMst.length > 15)
    return "Mã số thuế phải có từ 10 đến 15 chữ số (không tính dấu gạch ngang)";
  return "";
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getTodayDateValue = () => new Date().toISOString().slice(0, 10);

const validatePhone = (phone: string, label: string): string => {
  const value = phone.trim();
  if (!value) return `Vui lòng nhập ${label}`;
  if (!/^\d+$/.test(value)) return `${label} chỉ được chứa chữ số`;
  if (!/^0\d{8,10}$/.test(value)) return `${label} phải bắt đầu bằng 0 và có 9-11 chữ số`;
  return "";
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface FileEntry {
  label: string;
  file: File | null;
  url: string | null;
}

interface FormData {
  tenDN: string;
  mst: string;
  loaiHinhKD: string;
  nganhNghe: string;
  ngayCap: string;
  tinhTP: string;
  phuongXa: string;
  diaChi: string;
  tenNuocNgoai: string;
  email: string;
  sdtCoQuan: string;
  nguoiDungDau: string;
  sdtNguoiDungDau: string;
  tinhTPHoatDong: string;
  phuongXaHoatDong: string;
  diaDiemKD: string;
}

interface Props {
  onClose: () => void;
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      {/* Step 1 */}
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
            currentStep === 1
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-blue-600 border-blue-600 text-white"
          }`}
        >
          {currentStep > 1 ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            "1"
          )}
        </div>
        <span className={`text-sm font-medium ${currentStep === 1 ? "text-blue-600" : "text-blue-600"}`}>
          Thông tin doanh nghiệp
        </span>
      </div>

      <div className="flex-1 h-px bg-gray-300 max-w-[80px]" />

      {/* Step 2 */}
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
            currentStep === 2
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-gray-200 border-gray-300 text-gray-400"
          }`}
        >
          2
        </div>
        <span className={`text-sm font-medium ${currentStep === 2 ? "text-blue-600" : "text-gray-400"}`}>
          Xác nhận đăng ký
        </span>
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function BusinessRegistrationModal({ onClose }: Props) {
  // ── modal stage: "form" | "otp" | "confirm" | "account"
  const [stage, setStage] = useState<"form" | "otp" | "confirm" | "account">("form");

  // ── API data
  const [enterpriseTypes, setEnterpriseTypes] = useState<{ id: number; name: string }[]>([]);
  const [industries, setIndustries] = useState<{ id: number; code: string; name: string }[]>([]);
  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);
  const [registrationWards, setRegistrationWards] = useState<{ id: number; name: string }[]>([]);
  const [operationWards, setOperationWards] = useState<{ id: number; name: string }[]>([]);

  // ── form
  const [form, setForm] = useState<FormData>({
    tenDN: "",
    mst: "",
    loaiHinhKD: "",
    nganhNghe: "",
    ngayCap: "",
    tinhTP: "Thành phố Hồ Chí Minh",
    phuongXa: "",
    diaChi: "",
    tenNuocNgoai: "",
    email: "",
    sdtCoQuan: "",
    nguoiDungDau: "",
    sdtNguoiDungDau: "",
    tinhTPHoatDong: "Thành phố Hồ Chí Minh",
    phuongXaHoatDong: "",
    diaDiemKD: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const enterpriseTypeOptions = useMemo(() => 
    enterpriseTypes.map((t) => ({ value: t.name, label: t.name })),
    [enterpriseTypes]
  );

  const industryOptions = useMemo(() => 
    industries.map((ind) => ({ value: `${ind.code} - ${ind.name}`, label: `${ind.code} - ${ind.name}` })),
    [industries]
  );

  const registrationWardOptions = useMemo(() => 
    registrationWards.map((w) => ({ value: String(w.id), label: w.name })),
    [registrationWards]
  );

  const operationWardOptions = useMemo(() => 
    operationWards.map((w) => ({ value: String(w.id), label: w.name })),
    [operationWards]
  );

  // ── files
  const [files, setFiles] = useState<FileEntry[]>([
    { label: "Giấy phép kinh doanh", file: null, url: null },
    { label: "Giấy tờ khác", file: null, url: null },
  ]);

  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── OTP
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [verifiedOtp, setVerifiedOtp] = useState(""); // OTP đã xác thực thành công
  const [confirmLoading, setConfirmLoading] = useState(false); // loading khi gọi register API

  // ── cleanup file URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => { if (f.url) URL.revokeObjectURL(f.url); });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── load reference data from API (public endpoints)
  useEffect(() => {
    fetch(`${BASE_URL}/auth/enterprise-types`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setEnterpriseTypes(data.filter((t: any) => t.isActive !== false)))
      .catch(() => {});

    fetch(`${BASE_URL}/auth/industries`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setIndustries(data.filter((d: any) => d.isActive !== false && d.level === 4)))
      .catch(() => {});

    fetch(`${BASE_URL}/provinces`)
      .then((res) => res.ok ? res.json() : [])
      .then(setProvinces)
      .catch(() => {});
  }, []);

  // ── load HCMC wards when provinces ready (public endpoint)
  useEffect(() => {
    if (provinces.length === 0) return;
    const hcmc = provinces.find((p) => p.name.includes('Hồ Chí Minh'));
    if (!hcmc) return;

    fetch(`${BASE_URL}/districts?provinceId=${hcmc.id}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setRegistrationWards(data);
        setOperationWards(data);
      })
      .catch(() => {});
  }, [provinces]);

  // ── start OTP countdown
  const startCountdown = () => {
    setCountdown(60);
    setCanResend(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  // ── form helpers
  const setField = <K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleLicenseDateChange = (value: string) => {
    const today = getTodayDateValue();
    setField("ngayCap", (value > today ? today : value) as FormData["ngayCap"]);
  };

  // ── file handlers
  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      alert("Chỉ chấp nhận file PDF");
      return;
    }
    const newUrl = URL.createObjectURL(f);
    setFiles((prev) => {
      const updated = [...prev];
      if (updated[index].url) URL.revokeObjectURL(updated[index].url!);
      updated[index] = { ...updated[index], file: f, url: newUrl };
      return updated;
    });
    // reset input so same file can re-trigger
    e.target.value = "";
  };

  const handleViewFile = (entry: FileEntry) => {
    if (!entry.url) return;
    window.open(entry.url, "_blank");
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      if (updated[index].url) URL.revokeObjectURL(updated[index].url!);
      updated[index] = { ...updated[index], file: null, url: null };
      return updated;
    });
  };

  const uploadRegistrationFiles = async (enterpriseId: number) => {
    const selectedFiles = files.filter((entry) => entry.file);
    if (selectedFiles.length === 0) return;

    await Promise.all(
      selectedFiles.map(async (entry) => {
        const body = new FormData();
        body.append("name", entry.label);
        body.append("file", entry.file as File);

        const res = await fetch(`${BASE_URL}/enterprises/${enterpriseId}/attachments`, {
          method: "POST",
          body,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || `Không tải lên được file ${entry.file?.name}`);
        }
      }),
    );
  };

  // ── validate step 1
  const validateForm = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.tenDN.trim()) errs.tenDN = "Vui lòng nhập tên doanh nghiệp";
    const mstErr = validateMST(form.mst.trim());
    if (mstErr) errs.mst = mstErr;
    if (!form.loaiHinhKD) errs.loaiHinhKD = "Vui lòng chọn loại hình kinh doanh";
    if (!form.nganhNghe) errs.nganhNghe = "Vui lòng chọn ngành nghề kinh doanh";
    if (!form.ngayCap) {
      errs.ngayCap = "Vui lòng chọn ngày cấp GPKD";
    } else if (form.ngayCap > getTodayDateValue()) {
      errs.ngayCap = "Ngày cấp GPKD không được lớn hơn ngày hiện tại";
    }
    if (!form.tinhTP) errs.tinhTP = "Vui lòng chọn tỉnh/thành phố ĐKKD";
    if (!form.phuongXa) errs.phuongXa = "Vui lòng chọn phường/xã ĐKKD";
    if (!form.diaChi.trim()) errs.diaChi = "Vui lòng nhập địa chỉ";
    if (!form.email.trim()) {
      errs.email = "Vui lòng nhập email";
    } else if (!isValidEmail(form.email.trim())) {
      errs.email = "Email không đúng định dạng";
    }
    const officePhoneErr = validatePhone(form.sdtCoQuan, "Số điện thoại cơ quan");
    if (officePhoneErr) errs.sdtCoQuan = officePhoneErr;
    if (!form.nguoiDungDau.trim()) errs.nguoiDungDau = "Vui lòng nhập người đứng đầu doanh nghiệp";
    const leaderPhoneErr = validatePhone(form.sdtNguoiDungDau, "SĐT liên hệ người đứng đầu");
    if (leaderPhoneErr) errs.sdtNguoiDungDau = leaderPhoneErr;
    if (!form.tinhTPHoatDong) errs.tinhTPHoatDong = "Vui lòng chọn tỉnh/thành phố hoạt động KD";
    if (!form.phuongXaHoatDong) errs.phuongXaHoatDong = "Vui lòng chọn phường/xã hoạt động KD";
    if (!form.diaDiemKD.trim()) errs.diaDiemKD = "Vui lòng nhập địa điểm kinh doanh";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── send OTP API (also used by "Gửi lại")
  const sendOtp = async () => {
    setOtpError("");
    // Luôn start countdown ngay lập tức, không chờ API
    startCountdown();
    try {
      setSendLoading(true);
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), type: "register" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Lỗi gửi email xác thực");
      // OTP đã gửi thành công, không cần làm gì thêm
    } catch (e: any) {
      // Nếu backend chưa chạy (Failed to fetch / NetworkError) → không báo lỗi,
      // chỉ báo lỗi khi backend trả về lỗi nghiệp vụ cụ thể
      const msg = e?.message || "";
      const isNetworkErr =
        msg.includes("Failed to fetch") ||
        msg.includes("NetworkError") ||
        msg.includes("fetch");
      if (!isNetworkErr) {
        setOtpError(msg || "Lỗi gửi OTP");
      }
      // Khi network error: countdown vẫn chạy, user vẫn có thể nhập OTP
    } finally {
      setSendLoading(false);
    }
  };

  // ── "Tiếp tục" click
  const handleContinue = async () => {
    if (!validateForm()) return;
    setOtp("");
    setOtpError("");
    setStage("otp");
    // Gọi sendOtp (đã tự startCountdown bên trong)
    await sendOtp();
  };

  // ── verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || !/^\d{6}$/.test(otp)) {
      setOtpError("OTP phải gồm 6 chữ số");
      return;
    }
    try {
      setOtpLoading(true);
      setOtpError("");
      const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), otp }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Mã OTP không đúng");
      }
      // OTP hợp lệ → lưu lại để dùng khi register
      setVerifiedOtp(otp);
      if (timerRef.current) clearInterval(timerRef.current);
      setStage("confirm");
    } catch (e: any) {
      const msg = e?.message || "";
      const isNetworkErr =
        msg.includes("Failed to fetch") ||
        msg.includes("NetworkError") ||
        msg.includes("Load failed");
      if (isNetworkErr) {
        // Backend không chạy → hiển thị lỗi kết nối
        setOtpError("⚠️ Không kết nối được đến server. Kiểm tra lại backend.");
      } else {
        setOtpError(msg || "Mã OTP không đúng hoặc đã hết hạn");
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // ── confirm → gọi API tạo tài khoản
  const handleConfirm = async () => {
    try {
      setConfirmLoading(true);
      const selectedWardObj = registrationWards.find((w) => String(w.id) === form.phuongXa);
      const selectedOperationWardObj = operationWards.find((w) => String(w.id) === form.phuongXaHoatDong);
      const phuongXaTen = selectedWardObj ? selectedWardObj.name : "";
      const phuongXaHoatDongTen = selectedOperationWardObj ? selectedOperationWardObj.name : "";

      const res = await fetch(`${BASE_URL}/auth/register-enterprise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mst: form.mst.trim(),
          tenDN: form.tenDN.trim(),
          email: form.email.trim(),
          otp: verifiedOtp,
          loaiHinhKD: form.loaiHinhKD,
          nganhNghe: form.nganhNghe,
          diaChi: form.diaChi,
          nguoiDungDau: form.nguoiDungDau,
          sdtNguoiDungDau: form.sdtNguoiDungDau,
          tenNuocNgoai: form.tenNuocNgoai,
          ngayCap: form.ngayCap,
          tinhTP: form.tinhTP,
          phuongXaCode: form.phuongXa,
          phuongXaTen,
          sdtCoQuan: form.sdtCoQuan,
          tinhTPHoatDong: form.tinhTPHoatDong,
          phuongXaHoatDongCode: form.phuongXaHoatDong,
          phuongXaHoatDongTen,
          diaDiemKD: form.diaDiemKD,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Lỗi tạo tài khoản");
      }

      if (data.enterprise?.id) {
        try {
          await uploadRegistrationFiles(data.enterprise.id);
        } catch (uploadError: any) {
          // Bỏ qua lỗi upload file đính kèm vì không bắt buộc
        }
      }

      setStage("account");
    } catch (e: any) {
      const msg = e?.message || "";
      const isNetworkErr = msg.includes("Failed to fetch") || msg.includes("NetworkError");
      if (isNetworkErr) {
        alert("⚠️ Không kết nối được đến server. Hãy kiểm tra backend đang chạy.");
      } else {
        alert("Lỗi: " + msg);
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  // ── build address display
  const selectedWard = registrationWards.find((w) => String(w.id) === form.phuongXa);
  const selectedOpWard = operationWards.find((w) => String(w.id) === form.phuongXaHoatDong);
  const addressDisplay = [
    form.diaChi,
    selectedWard?.name,
    form.tinhTP,
  ]
    .filter(Boolean)
    .join(", ");

  const opAddressDisplay = [
    form.diaDiemKD,
    selectedOpWard?.name,
    form.tinhTPHoatDong,
  ]
    .filter(Boolean)
    .join(", ");

  const formatDate = (d: string) => {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  };

  const countdownDisplay = `00:${String(countdown).padStart(2, "0")}`;

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  /* ───── Account info popup ───── */
  if (stage === "account") {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl overflow-hidden">
          {/* Header xanh */}
          <div className="bg-blue-600 px-6 py-5 text-center">
            <h2 className="text-lg font-bold text-white">Thông tin tài khoản</h2>
          </div>
          {/* Body */}
          <div className="px-6 py-5 space-y-2">
            <p className="text-sm text-gray-700">
              <span className="font-medium">• Tài khoản:</span>{" "}
              <span className="font-bold">{form.mst}</span>
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">• Mật khẩu:</span>{" "}
              <span className="font-bold">12345678</span>
            </p>
          </div>
          {/* Footer */}
          <div className="px-6 pb-5 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ───── OTP popup ───── */
  if (stage === "otp") {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl p-6">
          {/* Title */}
          <h2 className="text-xl font-bold text-blue-600 text-center mb-1">
            XÁC THỰC EMAIL
          </h2>
          <p className="text-sm text-gray-500 text-center mb-1">
            Chúng tôi đã gửi mã xác minh qua email
          </p>
          <p className="text-sm font-semibold text-gray-800 text-center mb-1">
            {form.email}
          </p>
          <p className="text-sm text-gray-500 text-center mb-5">
            Bạn vui lòng kiểm tra và điền mã xác thực
          </p>

          {/* OTP input */}
          <div className="relative mb-4">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">
              OTP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                setOtpError("");
              }}
              maxLength={6}
              inputMode="numeric"
              placeholder="6 chữ số"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {otpError && (
            <p className="text-red-500 text-xs mb-3 text-center">{otpError}</p>
          )}

          {/* Countdown */}
          <p className="text-center text-sm font-bold text-blue-600 mb-1">
            {countdownDisplay}
          </p>
          <p className="text-center text-xs text-gray-400 mb-5">
            Chưa nhận được mã?{" "}
            <button
              type="button"
              disabled={!canResend || sendLoading}
              onClick={sendOtp}
              className={`font-semibold ${
                canResend ? "text-blue-600 hover:underline cursor-pointer" : "text-gray-300 cursor-not-allowed"
              }`}
            >
              {sendLoading ? "Đang gửi..." : "Gửi lại"}
            </button>
          </p>

          {/* Buttons */}
          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={otpLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300 mb-3"
          >
            {otpLoading ? "Đang xác nhận..." : "Xác nhận"}
          </button>
          <button
            type="button"
            onClick={() => setStage("form")}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    );
  }

  /* ───── Confirm popup (Step 2/2) ───── */
  if (stage === "confirm") {
    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 p-4 overflow-auto">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl my-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <StepIndicator currentStep={2} />
            <button
              type="button"
              onClick={onClose}
              className="ml-4 text-gray-400 hover:text-gray-600 text-lg font-bold flex-shrink-0"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
            <h3 className="text-base font-bold text-gray-800 mb-4">Thông tin về hồ sơ</h3>

            <div className="space-y-3 text-sm">
              <InfoRow label="Tên đăng nhập" value={form.mst} />
              <InfoRow label="Mã số thuế" value={form.mst} />
              <InfoRow label="Tên doanh nghiệp" value={form.tenDN} />
              <InfoRow label="Tên viết bằng tiếng nước ngoài" value={form.tenNuocNgoai} />
              <InfoRow label="Email" value={form.email} />
              <InfoRow label="Ngày cấp GPKD" value={formatDate(form.ngayCap)} />
              <InfoRow label="Loại hình kinh doanh" value={form.loaiHinhKD} />
              <InfoRow label="Ngành nghề kinh doanh" value={form.nganhNghe} />
              <InfoRow label="Địa chỉ đăng ký giấy phép kinh doanh" value={addressDisplay} />
              <InfoRow label="Địa điểm kinh doanh" value={opAddressDisplay} />
              <InfoRow label="Người đứng đầu doanh nghiệp" value={form.nguoiDungDau} />
              <InfoRow label="SĐT người đứng đầu" value={form.sdtNguoiDungDau} />
            </div>

            {/* Files table */}
            <div className="mt-5">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Tên file</th>
                    <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Thông tin file</th>
                    <th className="text-right px-4 py-2.5 text-gray-600 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((f, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="px-4 py-3 text-gray-700">{f.label}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {f.file ? f.file.name : <span className="italic text-gray-300">Chưa có file</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {f.file && (
                          <button
                            type="button"
                            onClick={() => handleViewFile(f)}
                            title="Xem file"
                            className="text-gray-400 hover:text-blue-600 transition p-1"
                          >
                            <EyeIcon />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={() => setStage("form")}
              className="text-sm text-gray-600 font-medium hover:text-gray-800"
            >
              Trở về
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={confirmLoading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
            >
              {confirmLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang tạo tài khoản...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Xác nhận
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ───── FORM (Step 1/2) ───── */
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 p-4 overflow-auto">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 px-6 pt-5 pb-3">
          <div className="flex-1">
            <StepIndicator currentStep={1} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-1 ml-4 text-gray-400 hover:text-gray-600 text-lg font-bold flex-shrink-0"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto max-h-[75vh] px-6 py-5 space-y-6">
          {/* ── Section 1: Thêm mới doanh nghiệp ── */}
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-4">Thêm mới doanh nghiệp</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tên doanh nghiệp */}
              <FieldWrap label="Tên doanh nghiệp" required error={errors.tenDN}>
                <input
                  type="text"
                  value={form.tenDN}
                  onChange={(e) => setField("tenDN", e.target.value)}
                  placeholder=""
                  className={inputCls(!!errors.tenDN)}
                />
              </FieldWrap>

              {/* Mã số thuế */}
              <FieldWrap label="Mã số thuế" required error={errors.mst}>
                <input
                  type="text"
                  value={form.mst}
                  onChange={(e) => setField("mst", e.target.value.replace(/[^0-9-]/g, "").slice(0, 15))}
                  placeholder="Mã số thuế tối thiểu 10, tối đa 15 chữ số"
                  inputMode="numeric"
                  maxLength={16}
                  className={inputCls(!!errors.mst)}
                />
              </FieldWrap>

              {/* Loại hình kinh doanh */}
              <FieldWrap label="Loại hình kinh doanh" required error={errors.loaiHinhKD}>
                <AutocompleteDropdown
                  options={enterpriseTypeOptions}
                  value={form.loaiHinhKD}
                  onChange={(val) => setField("loaiHinhKD", val)}
                  placeholder="-- Chọn loại hình --"
                  error={!!errors.loaiHinhKD}
                />
              </FieldWrap>

              {/* Ngành nghề kinh doanh */}
              <FieldWrap label="Ngành nghề kinh doanh chính" required error={errors.nganhNghe}>
                <AutocompleteDropdown
                  options={industryOptions}
                  value={form.nganhNghe}
                  onChange={(val) => setField("nganhNghe", val)}
                  placeholder="-- Chọn ngành nghề --"
                  error={!!errors.nganhNghe}
                />
              </FieldWrap>

              {/* Ngày cấp GPKD */}
              <FieldWrap label="Ngày cấp GPKD" required error={errors.ngayCap}>
                <input
                  type="date"
                  value={form.ngayCap}
                  max={getTodayDateValue()}
                  onChange={(e) => handleLicenseDateChange(e.target.value)}
                  className={inputCls(!!errors.ngayCap)}
                />
              </FieldWrap>

              {/* Tỉnh/Thành phố ĐKKD (hardcode HCM) */}
              <FieldWrap label="Tỉnh/Thành phố ĐKKD" required error={errors.tinhTP}>
                <input
                  type="text"
                  value={form.tinhTP}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
                />
              </FieldWrap>

              {/* Phường/Xã ĐKKD */}
              <FieldWrap label="Phường/Xã ĐKKD" required error={errors.phuongXa}>
                <AutocompleteDropdown
                  options={registrationWardOptions}
                  value={form.phuongXa}
                  onChange={(val) => setField("phuongXa", val)}
                  placeholder="-- Chọn phường/xã --"
                  error={!!errors.phuongXa}
                />
              </FieldWrap>

              {/* Địa chỉ */}
              <FieldWrap label="Địa chỉ" required error={errors.diaChi} className="md:col-span-2">
                <input
                  type="text"
                  value={form.diaChi}
                  onChange={(e) => setField("diaChi", e.target.value)}
                  placeholder="Số nhà, tên đường, tổ, khu phố..."
                  className={inputCls(!!errors.diaChi)}
                />
              </FieldWrap>
            </div>
          </div>

          {/* ── Section 2: Thông tin liên hệ ── */}
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-4">Thông tin liên hệ</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tên tiếng nước ngoài */}
              <FieldWrap label="Tên viết bằng tiếng nước ngoài">
                <input
                  type="text"
                  value={form.tenNuocNgoai}
                  onChange={(e) => setField("tenNuocNgoai", e.target.value)}
                  placeholder=""
                  className={inputCls(false)}
                />
              </FieldWrap>

              {/* Email */}
              <FieldWrap label="Email" required error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="contact@company.com"
                  className={inputCls(!!errors.email)}
                />
              </FieldWrap>

              {/* SĐT cơ quan */}
              <FieldWrap label="Số điện thoại cơ quan" required error={errors.sdtCoQuan}>
                <input
                  type="tel"
                  value={form.sdtCoQuan}
                  onChange={(e) => setField("sdtCoQuan", e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="Ví dụ: 028XXXXXXXX"
                  className={inputCls(!!errors.sdtCoQuan)}
                />
              </FieldWrap>

              {/* Người đứng đầu */}
              <FieldWrap label="Người đứng đầu doanh nghiệp" required error={errors.nguoiDungDau}>
                <input
                  type="text"
                  value={form.nguoiDungDau}
                  onChange={(e) => setField("nguoiDungDau", e.target.value)}
                  placeholder=""
                  className={inputCls(!!errors.nguoiDungDau)}
                />
              </FieldWrap>

              {/* SĐT người đứng đầu */}
              <FieldWrap label="SĐT liên hệ người đứng đầu" required error={errors.sdtNguoiDungDau}>
                <input
                  type="tel"
                  value={form.sdtNguoiDungDau}
                  onChange={(e) => setField("sdtNguoiDungDau", e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="Ví dụ: 09XXXXXXXX"
                  className={inputCls(!!errors.sdtNguoiDungDau)}
                />
              </FieldWrap>

              {/* Tỉnh/TP hoạt động KD */}
              <FieldWrap label="Tỉnh/TP hoạt động KD" required error={errors.tinhTPHoatDong}>
                <input
                  type="text"
                  value={form.tinhTPHoatDong}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
                />
              </FieldWrap>

              {/* Phường/xã hoạt động KD */}
              <FieldWrap label="Phường/xã hoạt động KD" required error={errors.phuongXaHoatDong}>
                <AutocompleteDropdown
                  options={operationWardOptions}
                  value={form.phuongXaHoatDong}
                  onChange={(val) => setField("phuongXaHoatDong", val)}
                  placeholder="-- Chọn phường/xã --"
                  error={!!errors.phuongXaHoatDong}
                />
              </FieldWrap>

              {/* Địa điểm kinh doanh */}
              <FieldWrap label="Địa điểm kinh doanh" required error={errors.diaDiemKD} className="md:col-span-2">
                <input
                  type="text"
                  value={form.diaDiemKD}
                  onChange={(e) => setField("diaDiemKD", e.target.value)}
                  placeholder="Số nhà, tên đường, tổ, khu phố..."
                  className={inputCls(!!errors.diaDiemKD)}
                />
              </FieldWrap>
            </div>
          </div>

          {/* ── Section 3: File đính kèm ── */}
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-4">File đính kèm</h3>
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Tên file</th>
                  <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Thông tin file</th>
                  <th className="text-right px-4 py-2.5 text-gray-600 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f, i) => (
                  <tr key={i} className="border-t border-gray-200">
                    <td className="px-4 py-3 text-gray-700">{f.label}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {f.file
                        ? f.file.name
                        : <span className="italic text-gray-300">Chưa có file</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* View */}
                        <button
                          type="button"
                          onClick={() => handleViewFile(f)}
                          disabled={!f.file}
                          title="Xem file"
                          className={`p-1.5 rounded transition ${
                            f.file
                              ? "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                              : "text-gray-200 cursor-not-allowed"
                          }`}
                        >
                          <EyeIcon />
                        </button>
                        {/* Upload / ghi đè */}
                        <button
                          type="button"
                          title="Tải lên"
                          onClick={() => fileRefs.current[i]?.click()}
                          className="p-1.5 rounded text-gray-500 hover:text-green-600 hover:bg-green-50 transition"
                        >
                          <UploadIcon />
                        </button>
                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(i)}
                          disabled={!f.file}
                          title="Xóa file"
                          className={`p-1.5 rounded transition ${
                            f.file
                              ? "text-gray-500 hover:text-red-600 hover:bg-red-50"
                              : "text-gray-200 cursor-not-allowed"
                          }`}
                        >
                          <TrashIcon />
                        </button>
                        {/* Hidden file input */}
                        <input
                          type="file"
                          accept="application/pdf"
                          ref={(el) => { fileRefs.current[i] = el; }}
                          className="hidden"
                          onChange={(e) => handleFileChange(i, e)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-600 font-medium hover:text-gray-800 px-4 py-2"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Tiếp tục
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────
function FieldWrap({
  label,
  required,
  error,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10 leading-none">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="w-60 text-gray-500 flex-shrink-0">{label}:</span>
      <span className="font-semibold text-gray-800">{value || "—"}</span>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full rounded-lg border ${
    hasError ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
  } px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100`;
}

function selectCls(hasError: boolean) {
  return `w-full rounded-lg border ${
    hasError ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
  } px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none`;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
