"use client";

import { useState } from "react";

export default function AccountPage() {
    const [user, setUser] = useState({
        code: "Vna25112020",
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

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-blue-900 text-white p-4 relative">
                <h2 className="text-lg font-bold mb-6">VNA</h2>

                <ul className="space-y-3 text-sm">
                    <li>Trang chủ</li>
                    <li className="font-semibold">Quản lý người dùng</li>
                    <li>Tiếp nhận</li>
                    <li>Chuyên ngành nghề nghiệp</li>
                    <li>Báo cáo thống kê</li>
                </ul>

                <div className="absolute bottom-4 left-4 text-sm">
                    Phan Thanh Tùng
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
                <div className="bg-white rounded-xl shadow p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                            Chi tiết người dùng
                        </h2>

                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                            Lưu
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                Ảnh
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <span>Kích hoạt</span>
                                <input
                                    type="checkbox"
                                    checked={user.active}
                                    onChange={() =>
                                        setUser((prev) => ({
                                            ...prev,
                                            active: !prev.active,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        {/* Form */}
                        <div className="col-span-3">
                            {/* PERSONAL */}
                            <h3 className="font-semibold mb-3">
                                Thông tin cá nhân
                            </h3>

                            <div className="grid grid-cols-3 gap-4">
                                <input
                                    name="code"
                                    value={user.code}
                                    onChange={handleChange}
                                    placeholder="Mã người dùng"
                                    className="input"
                                />

                                <input
                                    name="name"
                                    value={user.name}
                                    onChange={handleChange}
                                    placeholder="Họ tên"
                                    className="input"
                                />

                                <input
                                    type="date"
                                    name="dob"
                                    value={user.dob}
                                    onChange={handleChange}
                                    className="input"
                                />

                                <select
                                    name="gender"
                                    value={user.gender}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option>Nam</option>
                                    <option>Nữ</option>
                                </select>

                                <input
                                    name="position"
                                    value={user.position}
                                    onChange={handleChange}
                                    placeholder="Chức danh"
                                    className="input"
                                />

                                <select
                                    name="role"
                                    value={user.role}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option>Quản trị viên</option>
                                    <option>Nhân viên</option>
                                </select>

                                <input
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="input col-span-3"
                                />
                            </div>

                            {/* CONTACT */}
                            <h3 className="font-semibold mt-6 mb-3">
                                Thông tin liên hệ
                            </h3>

                            <div className="grid grid-cols-3 gap-4">
                                <select
                                    name="city"
                                    value={user.city}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option>TP Hồ Chí Minh</option>
                                    <option>Hà Nội</option>
                                </select>

                                <select
                                    name="district"
                                    value={user.district}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option>Gò Vấp</option>
                                    <option>Quận 1</option>
                                </select>

                                <input
                                    name="address"
                                    value={user.address}
                                    onChange={handleChange}
                                    placeholder="Địa chỉ"
                                    className="input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}