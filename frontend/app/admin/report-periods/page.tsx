"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Pencil, Plus, Calendar, ChevronDown, X, Save } from 'lucide-react';
import DatePicker from '@/libs/tts/components/DatePicker';

interface ReportPeriod {
  id: number;
  year: number;
  name: string;
  period: string;
  startDate: string; // yyyy-mm-dd
  endDate: string;   // yyyy-mm-dd
  isActive: boolean;
}

const DEFAULT_REPORT_PERIODS: ReportPeriod[] = [
  {
    id: 1,
    year: 2022,
    name: 'Báo cáo tai nạn lao động',
    period: '1 năm',
    startDate: '2023-12-15',
    endDate: '2024-01-10',
    isActive: true,
  },
  {
    id: 2,
    year: 2023,
    name: 'Báo cáo tai nạn lao động',
    period: '1 năm',
    startDate: '2024-12-15',
    endDate: '2025-01-10',
    isActive: false,
  }
];

const REPORT_NAME_OPTIONS = [
  'Báo cáo tai nạn lao động'
];

const PERIOD_OPTIONS = [
  '6 tháng đầu năm',
  '1 năm'
];

function formatDateForDisplay(isoString: string): string {
  if (!isoString) return '';
  const parts = isoString.split('-');
  if (parts.length !== 3) return isoString;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export default function ReportPeriodsPage() {
  const [items, setItems] = useState<ReportPeriod[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ReportPeriod | null>(null);

  // Filters state
  const [filterYear, setFilterYear] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modal Form state
  const [formName, setFormName] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formPeriod, setFormPeriod] = useState('');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [formActive, setFormActive] = useState(true);

  // Form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const autoFillDates = (year: string, period: string) => {
    if (!year || year.length !== 4 || !period) return;
    if (period === '6 tháng đầu năm') {
      setFormStart(`${year}-01-01`);
      setFormEnd(`${year}-06-30`);
    } else if (period === 'Cả năm' || period === '1 năm') {
      setFormStart(`${year}-01-01`);
      setFormEnd(`${year}-12-31`);
    }
    setFormErrors((p) => ({ ...p, startDate: '', endDate: '' }));
  };

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vna_report_periods');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as ReportPeriod[];
          const filtered = parsed.filter((item) => {
            const matches2026_2027 =
              String(item.year).includes('2026-2027') ||
              String(item.name).includes('2026-2027') ||
              String(item.period).includes('2026-2027') ||
              (item.startDate && String(item.startDate).includes('2026-2027')) ||
              (item.endDate && String(item.endDate).includes('2026-2027'));
            return !matches2026_2027;
          });
          setItems(filtered);
          if (filtered.length !== parsed.length) {
            localStorage.setItem('vna_report_periods', JSON.stringify(filtered));
          }
        } catch {
          setItems(DEFAULT_REPORT_PERIODS);
        }
      } else {
        setItems(DEFAULT_REPORT_PERIODS);
        localStorage.setItem('vna_report_periods', JSON.stringify(DEFAULT_REPORT_PERIODS));
      }
    }
  }, []);

  // Save to localStorage
  const saveItemsToStorage = (newItems: ReportPeriod[]) => {
    setItems(newItems);
    localStorage.setItem('vna_report_periods', JSON.stringify(newItems));
  };

  // Filter logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filterYear && !String(item.year).includes(filterYear)) return false;
      if (filterName && item.name !== filterName) return false;
      if (filterPeriod && item.period !== filterPeriod) return false;
      
      if (filterStart) {
        const itemStart = formatDateForDisplay(item.startDate);
        if (!itemStart.includes(filterStart)) return false;
      }
      if (filterEnd) {
        const itemEnd = formatDateForDisplay(item.endDate);
        if (!itemEnd.includes(filterEnd)) return false;
      }

      if (filterStatus) {
        const checkActive = filterStatus === 'active';
        if (item.isActive !== checkActive) return false;
      }
      return true;
    });
  }, [items, filterYear, filterName, filterPeriod, filterStart, filterEnd, filterStatus]);

  // Toggle status
  const handleToggleStatus = (id: number) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    saveItemsToStorage(updated);
  };

  // Open Add modal
  const handleAddNew = () => {
    setEditingItem(null);
    setFormName('Báo cáo tai nạn lao động');
    setFormYear(new Date().getFullYear().toString());
    setFormPeriod('');
    setFormStart('');
    setFormEnd('');
    setFormActive(true);
    setFormErrors({});
    setShowModal(true);
  };

  // Open Edit modal
  const handleEdit = (item: ReportPeriod) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormYear(item.year.toString());
    setFormPeriod(item.period);
    setFormStart(item.startDate);
    setFormEnd(item.endDate);
    setFormActive(item.isActive);
    setFormErrors({});
    setShowModal(true);
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formName) errors.name = 'Tên báo cáo không được để trống';
    if (!formYear) errors.year = 'Năm không được để trống';
    if (!formPeriod) errors.period = 'Kỳ báo cáo không được để trống';
    if (!formStart) errors.startDate = 'Ngày bắt đầu không được để trống';
    if (!formEnd) errors.endDate = 'Ngày kết thúc không được để trống';

    if (formStart && formEnd) {
      if (new Date(formStart) > new Date(formEnd)) {
        errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    if (formYear && formPeriod && formName && !editingItem) {
      const isDuplicate = items.some(
        (item) =>
          item.year === parseInt(formYear) &&
          (item.period === formPeriod || (item.period === 'Cả năm' && formPeriod === '1 năm') || (item.period === '1 năm' && formPeriod === 'Cả năm')) &&
          item.name === formName
      );
      if (isDuplicate) {
        errors.period = 'Cấu hình báo cáo cho năm và kỳ báo cáo này đã tồn tại';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save form
  const handleSave = () => {
    if (!validateForm()) return;

    if (editingItem) {
      // Edit mode (Tên báo cáo, Năm, Kỳ báo cáo disabled)
      const updated = items.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              startDate: formStart,
              endDate: formEnd,
              isActive: formActive,
            }
          : item
      );
      saveItemsToStorage(updated);
    } else {
      // Add mode
      const newItem: ReportPeriod = {
        id: items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1,
        year: parseInt(formYear),
        name: formName,
        period: formPeriod,
        startDate: formStart,
        endDate: formEnd,
        isActive: formActive,
      };
      saveItemsToStorage([...items, newItem]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-base font-bold text-slate-800">
          Danh sách cấu hình báo cáo
        </h1>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1D4ED8] text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={16} />
          Thêm mới
        </button>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200">
              <th className="w-16 px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                Thao tác
              </th>
              <th className="w-24 px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Năm báo cáo
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Tên báo cáo
              </th>
              <th className="w-40 px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Kỳ báo cáo
              </th>
              <th className="w-48 px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Thời gian bắt đầu
              </th>
              <th className="w-48 px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Thời gian kết thúc
              </th>
              <th className="w-32 px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                Trạng thái
              </th>
            </tr>

            {/* Filter Row */}
            <tr className="border-b border-slate-200 bg-white">
              <td className="px-4 py-2 text-center" />
              <td className="px-2 py-2">
                <input
                  type="text"
                  placeholder="Lọc năm..."
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-2 py-2">
                <div className="relative">
                  <select
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Tất cả</option>
                    {REPORT_NAME_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                </div>
              </td>
              <td className="px-2 py-2">
                <div className="relative">
                  <select
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value)}
                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Tất cả</option>
                    {PERIOD_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                </div>
              </td>
              <td className="px-2 py-2">
                <input
                  type="text"
                  placeholder="dd/MM/yyyy"
                  value={filterStart}
                  onChange={(e) => setFilterStart(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-2 py-2">
                <input
                  type="text"
                  placeholder="dd/MM/yyyy"
                  value={filterEnd}
                  onChange={(e) => setFilterEnd(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-2 py-2">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Tất cả</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">
                  Không tìm thấy cấu hình báo cáo nào
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-700">
                    {item.year}
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-700 font-medium">
                    {item.name}
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-700">
                    {item.period === 'Cả năm' ? '1 năm' : item.period}
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-700">
                    {formatDateForDisplay(item.startDate)}
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-700">
                    {formatDateForDisplay(item.endDate)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                        item.isActive ? 'bg-[#1D4ED8]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
                          item.isActive ? 'translate-x-[18px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination mock */}
        <div className="flex items-center justify-end gap-4 px-6 py-3 border-t border-slate-200 bg-white text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <span>Hiển thị</span>
            <div className="relative">
              <select className="appearance-none border border-slate-200 rounded px-2 py-0.5 pr-5 bg-white text-slate-600 font-semibold focus:outline-none">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
              <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
            </div>
          </div>
          <span>1 - {filteredItems.length} of {filteredItems.length}</span>
          <div className="flex gap-1.5">
            <button disabled className="p-1 rounded border border-slate-200 opacity-50 cursor-not-allowed">&lt;</button>
            <button disabled className="p-1 rounded border border-slate-200 opacity-50 cursor-not-allowed">&gt;</button>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-slate-800 font-bold text-base">
                {editingItem ? 'Chỉnh sửa' : 'Thêm mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Tên báo cáo */}
              <div className="relative">
                <div className="relative">
                  <select
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (formErrors.name) setFormErrors((p) => ({ ...p, name: '' }));
                    }}
                    disabled={!!editingItem}
                    className={`w-full appearance-none rounded-lg border px-3 py-2 pr-8 text-sm outline-none transition bg-white ${
                      editingItem
                        ? 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed'
                        : formErrors.name
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  >
                    <option value="" disabled hidden>Tên báo cáo *</option>
                    {REPORT_NAME_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {!editingItem && (
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  )}
                </div>
                {formName && (
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                    Tên báo cáo <span className="text-red-500">*</span>
                  </label>
                )}
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Năm and Kỳ báo cáo */}
              <div className="grid grid-cols-2 gap-4">
                {/* Năm */}
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formYear}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setFormYear(cleaned);
                        if (formErrors.year) setFormErrors((p) => ({ ...p, year: '' }));
                        autoFillDates(cleaned, formPeriod);
                      }}
                      placeholder="Năm *"
                      disabled={!!editingItem}
                      className={`w-full rounded-lg border px-3 py-2 pr-8 text-sm outline-none transition ${
                        editingItem
                          ? 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed'
                          : formErrors.year
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                    <Calendar size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  {formYear && (
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                      Năm <span className="text-red-500">*</span>
                    </label>
                  )}
                  {formErrors.year && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.year}</p>
                  )}
                </div>

                {/* Kỳ báo cáo */}
                <div className="relative">
                  <div className="relative">
                    <select
                      value={formPeriod}
                      onChange={(e) => {
                        const period = e.target.value;
                        setFormPeriod(period);
                        if (formErrors.period) setFormErrors((p) => ({ ...p, period: '' }));
                        autoFillDates(formYear, period);
                      }}
                      disabled={!!editingItem}
                      className={`w-full appearance-none rounded-lg border px-3 py-2 pr-8 text-sm outline-none transition bg-white ${
                        editingItem
                          ? 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed'
                          : formErrors.period
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-slate-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    >
                      <option value="" disabled hidden>Kỳ báo cáo *</option>
                      {PERIOD_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {!editingItem && (
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    )}
                  </div>
                  {formPeriod && (
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                      Kỳ báo cáo <span className="text-red-500">*</span>
                    </label>
                  )}
                  {formErrors.period && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.period}</p>
                  )}
                </div>
              </div>

              {/* Ngày bắt đầu and Ngày kết thúc */}
              <div className="grid grid-cols-2 gap-4">
                {/* Ngày bắt đầu */}
                <div className="relative">
                  <DatePicker
                    value={formStart}
                    onChange={(iso) => {
                      setFormStart(iso);
                      if (formErrors.startDate) setFormErrors((p) => ({ ...p, startDate: '' }));
                    }}
                    error={formErrors.startDate}
                    className="w-full"
                  />
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500 z-10">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  {formErrors.startDate && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.startDate}</p>
                  )}
                </div>

                {/* Ngày kết thúc */}
                <div className="relative">
                  <DatePicker
                    value={formEnd}
                    onChange={(iso) => {
                      setFormEnd(iso);
                      if (formErrors.endDate) setFormErrors((p) => ({ ...p, endDate: '' }));
                    }}
                    error={formErrors.endDate}
                    className="w-full"
                  />
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500 z-10">
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  {formErrors.endDate && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Trạng thái */}
              <div className="relative">
                <div className="relative">
                  <select
                    value={formActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormActive(e.target.value === 'active')}
                    className="w-full appearance-none rounded-lg border border-slate-200 px-3 py-2 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                </div>
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                  Trạng thái
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 pt-2 flex items-center justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 bg-[#1D4ED8] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm"
              >
                <Save size={15} />
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
