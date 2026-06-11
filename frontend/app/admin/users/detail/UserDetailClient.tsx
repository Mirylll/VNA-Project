"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { getAuthToken } from '@/libs/core/utils/auth-token';

interface TitleItem {
  id: number;
  name: string;
}

interface RoleItem {
  id: number;
  name: string;
}

interface DistrictItem {
  id: number;
  name: string;
}

interface UserFormData {
  username: string;
  password: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  titleId: number | '';
  roleId: number | '';
  email: string;
  provinceId: number;
  districtId: number | '';
  address: string;
  isActive: boolean;
}

const emptyForm: UserFormData = {
  username: '',
  password: '',
  fullName: '',
  dateOfBirth: '',
  gender: 'Nam',
  titleId: '',
  roleId: '',
  email: '',
  provinceId: 1,
  districtId: '',
  address: '',
  isActive: true,
};

const baseUrl =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

export default function UserDetailClient({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const isAdd = !searchParams?.id;
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [titles, setTitles] = useState<TitleItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const t = getAuthToken();
    if (!t) {
      router.push('/login');
      return;
    }
    setToken(t);

    const headers = { authorization: `Bearer ${t}` };

    const promises: Promise<void>[] = [
      fetch(`${baseUrl}/titles`, { headers })
        .then((r) => (r.ok ? r.json() : []))
        .then(setTitles),
      fetch(`${baseUrl}/roles`, { headers })
        .then((r) => (r.ok ? r.json() : []))
        .then(setRoles),
      fetch(`${baseUrl}/districts?provinceId=1`, { headers })
        .then((r) => (r.ok ? r.json() : []))
        .then(setDistricts),
    ];

    if (!isAdd) {
      promises.push(
        fetch(`${baseUrl}/users/${searchParams.id}`, { headers })
          .then((r) => (r.ok ? r.json() : null))
          .then((user) => {
            if (!user) return;
            setFormData({
              username: user.username || '',
              password: '',
              fullName: user.fullName || '',
              dateOfBirth: user.dateOfBirth || '',
              gender: user.gender || 'Nam',
              titleId: user.title?.id ?? '',
              roleId: user.role?.id ?? '',
              email: user.email || '',
              provinceId: 1,
              districtId: '',
              address: user.address || '',
              isActive: user.isActive ?? true,
            });
          }),
      );
    }

    Promise.all(promises)
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, [router, isAdd, searchParams.id]);

  if (!token) return null;
  if (loading) {
    return <div className="p-6 text-gray-500 text-sm">Đang tải...</div>;
  }
  if (fetchError) {
    return (
      <div className="p-6 text-red-500 text-sm">
        Không thể tải dữ liệu. Vui lòng thử lại.
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.username.trim()) errs.username = 'Tên đăng nhập không được để trống';
    else if (formData.username.length > 50) errs.username = 'Tên đăng nhập tối đa 50 ký tự';
    if (!formData.fullName.trim()) errs.fullName = 'Họ và tên không được để trống';
    else if (formData.fullName.length > 150) errs.fullName = 'Họ và tên tối đa 150 ký tự';
    if (isAdd) {
      if (!formData.password) errs.password = 'Mật khẩu không được để trống';
      else if (formData.password.length < 6) errs.password = 'Mật khẩu tối thiểu 6 ký tự';
      else if (formData.password.length > 100) errs.password = 'Mật khẩu tối đa 100 ký tự';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Email không hợp lệ';
    }
    if (formData.roleId === '') errs.roleId = 'Vui lòng chọn vai trò';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const body: Record<string, any> = {
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        isActive: formData.isActive,
      };

      if (formData.roleId !== '') body.roleId = Number(formData.roleId);
      if (formData.titleId !== '') body.titleId = Number(formData.titleId);

      if (isAdd) {
        body.password = formData.password;
        const res = await fetch(`${baseUrl}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Lỗi tạo người dùng');
      } else {
        await fetch(`${baseUrl}/users/${searchParams.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/admin/users');
      }, 1500);
    } catch {
      alert('Lỗi lưu người dùng');
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = (field: string, extra = '') =>
    `w-full rounded-lg border px-3 py-2 text-sm text-slate-700 outline-none transition focus:ring-2 ${
      errors[field]
        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
    } ${extra}`;

  const labelClass = 'absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400';

  const errMsg = (field: string) =>
    errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;

  const handleCancel = () => {
    router.push('/admin/users');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-900">
          {isAdd ? 'Thêm người dùng' : 'Sửa người dùng'}
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
          ✓ Cập nhật thành công
        </div>
      )}

      {/* PERSONAL INFO CARD */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-6 pb-3 border-b border-slate-200">
          Thông tin cá nhân
        </h3>

        <div className="flex gap-8">
          {/* LEFT - Avatar */}
          <div className="flex-shrink-0 w-56">
            <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-3 mx-auto text-3xl">
              📷
            </div>
            <p className="text-center text-sm text-gray-800 font-medium mb-2">
              Tải ảnh đại diện
            </p>
            <p className="text-center text-xs text-gray-500 mb-1">
              *.jpeg, *.jpg, *.png.
            </p>
            <p className="text-center text-xs text-gray-500 mb-4">
              Kích thước tối đa 5 MB
            </p>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 font-medium">
                Kích hoạt
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          </div>

          {/* RIGHT - Form Fields */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              {/* EDIT MODE */}
              {!isAdd ? (
                <>
                  {/* Row 1: Tên đăng nhập (readonly) | Họ và tên */}
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      readOnly
                      placeholder="Tên đăng nhập"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-gray-50 cursor-not-allowed outline-none"
                    />
                    <label className={labelClass}>
                      Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      maxLength={150}
                      placeholder="Họ và tên"
                      className={fieldClass('fullName')}
                    />
                    <label className={labelClass}>
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    {errMsg('fullName')}
                  </div>

                  {/* Row 2: Ngày tháng năm sinh | Giới tính */}
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      placeholder="Ngày tháng năm sinh"
                      className={fieldClass('dateOfBirth')}
                    />
                    <label className={labelClass}>Ngày tháng năm sinh</label>
                  </div>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={fieldClass('gender')}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                    <label className={labelClass}>Giới tính</label>
                  </div>

                  {/* Row 3: Chức danh | Vai trò */}
                  <div className="relative">
                    <select
                      name="titleId"
                      value={formData.titleId}
                      onChange={handleInputChange}
                      className={fieldClass('titleId')}
                    >
                      <option value="">-- Chọn chức danh --</option>
                      {titles.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <label className={labelClass}>Chức danh</label>
                  </div>
                  <div className="relative">
                    <select
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleInputChange}
                      className={fieldClass('roleId')}
                    >
                      <option value="">-- Chọn vai trò --</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                    <label className={labelClass}>
                      Vai trò <span className="text-red-500">*</span>
                    </label>
                    {errMsg('roleId')}
                  </div>

                  {/* Row 4: Email — full width, readonly */}
                  <div className="col-span-2 relative">
                    <input
                      type="text"
                      value={formData.email || ''}
                      readOnly
                      placeholder="Email"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-gray-50 cursor-not-allowed outline-none"
                    />
                    <label className={labelClass}>Email</label>
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 text-sm font-medium bg-white px-1"
                    >
                      Thay đổi
                    </button>
                  </div>
                </>
              ) : (
                /* CREATE MODE */
                <>
                  {/* Row 1: Tên đăng nhập | Mật khẩu */}
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      maxLength={50}
                      placeholder="Tên đăng nhập"
                      className={fieldClass('username')}
                    />
                    <label className={labelClass}>
                      Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                    {errMsg('username')}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      maxLength={100}
                      placeholder="Mật khẩu"
                      className={`${fieldClass('password')} pr-10`}
                    />
                    <label className={labelClass}>
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errMsg('password')}
                  </div>

                  {/* Row 2: Họ và tên | Ngày tháng năm sinh */}
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      maxLength={150}
                      placeholder="Họ và tên"
                      className={fieldClass('fullName')}
                    />
                    <label className={labelClass}>
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    {errMsg('fullName')}
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      placeholder="Ngày tháng năm sinh"
                      className={fieldClass('dateOfBirth')}
                    />
                    <label className={labelClass}>Ngày tháng năm sinh</label>
                  </div>

                  {/* Row 3: Giới tính | Chức danh */}
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={fieldClass('gender')}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                    <label className={labelClass}>Giới tính</label>
                  </div>
                  <div className="relative">
                    <select
                      name="titleId"
                      value={formData.titleId}
                      onChange={handleInputChange}
                      className={fieldClass('titleId')}
                    >
                      <option value="">-- Chọn chức danh --</option>
                      {titles.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <label className={labelClass}>Chức danh</label>
                  </div>

                  {/* Row 4: Vai trò | Email */}
                  <div className="relative">
                    <select
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleInputChange}
                      className={fieldClass('roleId')}
                    >
                      <option value="">-- Chọn vai trò --</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                    <label className={labelClass}>
                      Vai trò <span className="text-red-500">*</span>
                    </label>
                    {errMsg('roleId')}
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className={fieldClass('email')}
                    />
                    <label className={labelClass}>Email</label>
                    {errMsg('email')}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT INFO CARD */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-base font-bold text-gray-800 mb-6 pb-3 border-b border-slate-200">
          Thông tin liên hệ
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <select
              name="provinceId"
              value={formData.provinceId}
              onChange={handleInputChange}
              className={fieldClass('provinceId')}
            >
              <option value={1}>Thành phố Hồ Chí Minh</option>
            </select>
            <label className={labelClass}>Tỉnh/thành phố</label>
          </div>

          <div className="relative">
            <select
              name="districtId"
              value={formData.districtId}
              onChange={handleInputChange}
              className={fieldClass('districtId')}
            >
              <option value="">-- Chọn phường/xã --</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <label className={labelClass}>Phường/xã</label>
          </div>

          <div className="col-span-2 relative">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Địa chỉ"
              className={fieldClass('address')}
            />
            <label className={labelClass}>Địa chỉ</label>
          </div>
        </div>
      </div>
    </div>
  );
}
