"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Eye, ChevronDown, Printer, FileText, ArrowLeft, Download, Upload, X } from 'lucide-react';

interface ReportData {
  casesTotal: number;
  casesDeath: number;
  casesMultiple: number;
  peopleTotal: number;
  peopleFemale: number;
  peopleDeath: number;
  peopleSevere: number;
  daysOff: number;
  costTotal: number;
  costMedical: number;
  costSalary: number;
  costCompensation: number;
  propertyDamage: number;
}

interface CompanyReport {
  id: string;
  name: string;
  taxCode: string;
  period: string; // e.g. "6 tháng", "Cả năm"
  year: number; // e.g. 2022
  status: 'draft' | 'submitted'; // draft = Đang báo cáo, submitted = Đã tiếp nhận
  data: ReportData;
}

const SEED_REPORTS: CompanyReport[] = [
  {
    id: '1',
    name: 'CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ VẬN TẢI PHẠM THIÊN ÂN',
    taxCode: '0317118106',
    period: '6 tháng',
    year: 2022,
    status: 'draft',
    data: {
      casesTotal: 1,
      casesDeath: 0,
      casesMultiple: 0,
      peopleTotal: 2,
      peopleFemale: 1,
      peopleDeath: 0,
      peopleSevere: 1,
      daysOff: 5,
      costTotal: 1500000,
      costMedical: 500000,
      costSalary: 500000,
      costCompensation: 500000,
      propertyDamage: 5000000
    }
  },
  {
    id: '2',
    name: 'CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ VẬN TẢI PHẠM THIÊN ÂN',
    taxCode: '0317118106',
    period: 'Cả năm',
    year: 2022,
    status: 'submitted',
    data: {
      casesTotal: 2,
      casesDeath: 1,
      casesMultiple: 1,
      peopleTotal: 10,
      peopleFemale: 5,
      peopleDeath: 5,
      peopleSevere: 10,
      daysOff: 20,
      costTotal: 6000000,
      costMedical: 2000000,
      costSalary: 2000000,
      costCompensation: 2000000,
      propertyDamage: 20000000
    }
  },
  {
    id: '3',
    name: 'CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ VẬN TẢI PHẠM THIÊN',
    taxCode: '0317118107',
    period: 'Cả năm',
    year: 2022,
    status: 'submitted',
    data: {
      casesTotal: 1,
      casesDeath: 0,
      casesMultiple: 0,
      peopleTotal: 3,
      peopleFemale: 1,
      peopleDeath: 0,
      peopleSevere: 3,
      daysOff: 10,
      costTotal: 3000000,
      costMedical: 1000000,
      costSalary: 1000000,
      costCompensation: 1000000,
      propertyDamage: 10000000
    }
  },
  {
    id: '4',
    name: 'CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ VẬN TẢI PHẠM THIÊN',
    taxCode: '0317118106',
    period: 'Cả năm',
    year: 2022,
    status: 'submitted',
    data: {
      casesTotal: 3,
      casesDeath: 1,
      casesMultiple: 1,
      peopleTotal: 15,
      peopleFemale: 8,
      peopleDeath: 6,
      peopleSevere: 15,
      daysOff: 35,
      costTotal: 9000000,
      costMedical: 3000000,
      costSalary: 3000000,
      costCompensation: 3000000,
      propertyDamage: 30000000
    }
  }
];

export default function TnldContractsPage() {
  // Navigation view state: 'list' | 'detail' | 'summary'
  const [viewState, setViewState] = useState<'list' | 'detail' | 'summary'>('list');
  const [reports, setReports] = useState<CompanyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CompanyReport | null>(null);

  // PDF Preview State
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Filters for listing
  const [filterYear, setFilterYear] = useState('2022');
  const [filterProvince, setFilterProvince] = useState('Hồ Chí Minh');
  const [filterWard, setFilterWard] = useState('Tất cả');

  // Table filters
  const [tableFilterName, setTableFilterName] = useState('');
  const [tableFilterTax, setTableFilterTax] = useState('');
  const [tableFilterPeriod, setTableFilterPeriod] = useState('');
  const [tableFilterStatus, setTableFilterStatus] = useState('');

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Load database
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vna_tnld_contracts');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Check if parsed data is valid and contains the necessary 'data' field
          const needsUpgrade = !Array.isArray(parsed) || parsed.length === 0 || parsed.some(r => !r || !r.data || typeof r.data.casesTotal !== 'number');
          if (needsUpgrade) {
            setReports(SEED_REPORTS);
            localStorage.setItem('vna_tnld_contracts', JSON.stringify(SEED_REPORTS));
          } else {
            setReports(parsed);
          }
        } catch (e) {
          setReports(SEED_REPORTS);
          localStorage.setItem('vna_tnld_contracts', JSON.stringify(SEED_REPORTS));
        }
      } else {
        setReports(SEED_REPORTS);
        localStorage.setItem('vna_tnld_contracts', JSON.stringify(SEED_REPORTS));
      }
    }
  }, []);

  // Filtered reports list
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // Top filter year check
      if (filterYear && String(r.year) !== filterYear) return false;

      // Table filters
      if (tableFilterName && !r.name.toLowerCase().includes(tableFilterName.toLowerCase())) return false;
      if (tableFilterTax && !r.taxCode.includes(tableFilterTax)) return false;
      if (tableFilterPeriod && r.period !== tableFilterPeriod) return false;
      if (tableFilterStatus && r.status !== tableFilterStatus) return false;

      return true;
    });
  }, [reports, filterYear, tableFilterName, tableFilterTax, tableFilterPeriod, tableFilterStatus]);

  // Open detail view
  const handleOpenDetail = (report: CompanyReport) => {
    setSelectedReport(report);
    setViewState('detail');
  };

  // Switch to summary report
  const handleOpenSummary = () => {
    setViewState('summary');
  };

  const handleExportSummary = () => {
    const { totals, countSubmitted } = summaryCalculations;
    let csvContent = "\uFEFF"; // UTF-8 BOM
    csvContent += `Báo cáo tổng hợp tình hình tai nạn lao động năm ${filterYear}\n`;
    csvContent += `Tổng số doanh nghiệp đã tiếp nhận: ${countSubmitted}\n\n`;
    
    csvContent += "Chỉ tiêu,Số vụ/Số người/Số ngày/Chi phí\n";
    csvContent += `1. Số vụ tai nạn lao động,${totals.casesTotal}\n`;
    csvContent += `- Trong đó có người chết,${totals.casesDeath}\n`;
    csvContent += `- Vụ có từ 2 người bị nạn,${totals.casesMultiple}\n`;
    csvContent += `2. Số người bị nạn,${totals.peopleTotal}\n`;
    csvContent += `- Lao động nữ,${totals.peopleFemale}\n`;
    csvContent += `- Người bị chết,${totals.peopleDeath}\n`;
    csvContent += `- Bị thương nặng,${totals.peopleSevere}\n`;
    csvContent += `3. Tổng số ngày nghỉ vì tai nạn lao động,${totals.daysOff}\n`;
    csvContent += "4. Chi phí (VNĐ)\n";
    csvContent += `- Tổng chi phí,${totals.costTotal}\n`;
    csvContent += `- Chi phí y tế,${totals.costMedical}\n`;
    csvContent += `- Trả lương thời gian điều trị,${totals.costSalary}\n`;
    csvContent += `- Chi phí bồi thường trợ cấp,${totals.costCompensation}\n`;
    csvContent += `- Thiệt hại tài sản,${totals.propertyDamage}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Báo cáo tổng hợp tai nạn lao động năm ${filterYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic calculations for aggregate summary
  const summaryCalculations = useMemo(() => {
    const submitted = reports.filter((r) => r.status === 'submitted' && String(r.year) === filterYear);
    const countSubmitted = submitted.length;

    const totals: ReportData = {
      casesTotal: 0,
      casesDeath: 0,
      casesMultiple: 0,
      peopleTotal: 0,
      peopleFemale: 0,
      peopleDeath: 0,
      peopleSevere: 0,
      daysOff: 0,
      costTotal: 0,
      costMedical: 0,
      costSalary: 0,
      costCompensation: 0,
      propertyDamage: 0
    };

    submitted.forEach((r) => {
      const d = r.data || {
        casesTotal: 0, casesDeath: 0, casesMultiple: 0, peopleTotal: 0, peopleFemale: 0,
        peopleDeath: 0, peopleSevere: 0, daysOff: 0, costTotal: 0, costMedical: 0,
        costSalary: 0, costCompensation: 0, propertyDamage: 0
      };
      totals.casesTotal += d.casesTotal || 0;
      totals.casesDeath += d.casesDeath || 0;
      totals.casesMultiple += d.casesMultiple || 0;
      totals.peopleTotal += d.peopleTotal || 0;
      totals.peopleFemale += d.peopleFemale || 0;
      totals.peopleDeath += d.peopleDeath || 0;
      totals.peopleSevere += d.peopleSevere || 0;
      totals.daysOff += d.daysOff || 0;
      totals.costTotal += d.costTotal || 0;
      totals.costMedical += d.costMedical || 0;
      totals.costSalary += d.costSalary || 0;
      totals.costCompensation += d.costCompensation || 0;
      totals.propertyDamage += d.propertyDamage || 0;
    });

    return {
      countSubmitted,
      totals
    };
  }, [reports, filterYear]);

  // Formatter for values
  const formatNumber = (num: number) => {
    return num.toLocaleString('vi-VN');
  };

  return (
    <div className="p-6">
      {/* Media print style overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          aside, header, nav, button, .no-print, [role="navigation"] {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .ml-64 {
            margin-left: 0 !important;
          }
          .p-6 {
            padding: 0 !important;
          }
          .printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-height: none !important;
            overflow: visible !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          table {
            page-break-inside: auto;
            border-color: #cbd5e1 !important;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      ` }} />

      {/* 1. LIST VIEW */}
      {viewState === 'list' && (
        <div className="space-y-4">
          {/* Header Panel */}
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100">
            <h1 className="text-base font-bold text-slate-800">
              Báo cáo định kỳ Tai nạn lao động
            </h1>
            <div className="flex items-center gap-3">
              {/* Year Selector */}
              <div className="relative">
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="appearance-none border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm font-semibold outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-700 shadow-sm"
                >
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
              </div>
              {/* Summary Report button */}
              <button
                onClick={handleOpenSummary}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-blue-600 bg-white text-blue-600 text-sm font-semibold hover:bg-blue-50 transition shadow-sm"
              >
                Báo cáo tổng hợp
              </button>
            </div>
          </div>

          {/* Regional Selection Row */}
          <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            {/* Tỉnh/ thành phố */}
            <div className="relative">
              <select
                value={filterProvince}
                onChange={(e) => setFilterProvince(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 px-3 py-2 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                Tỉnh/ thành phố
              </label>
            </div>

            {/* Phường/ Xã */}
            <div className="relative">
              <select
                value={filterWard}
                onChange={(e) => setFilterWard(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 px-3 py-2 pr-8 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                <option value="Phường Bến Thành">Phường Bến Thành</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500">
                Phường/ Xã
              </label>
            </div>
          </div>

          {/* Table Container */}
          <div className="w-full overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200">
                  <th className="w-12 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={filteredReports.length > 0 && selectedIds.length === filteredReports.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(filteredReports.map((r) => r.id));
                        else setSelectedIds([]);
                      }}
                      className="rounded text-[#1D4ED8] focus:ring-[#1D4ED8]"
                    />
                  </th>
                  <th className="w-16 px-2 py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                    Thao tác
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Tên doanh nghiệp
                  </th>
                  <th className="w-48 px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Mã số thuế
                  </th>
                  <th className="w-40 px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Kỳ báo cáo
                  </th>
                  <th className="w-48 px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Trạng thái
                  </th>
                </tr>

                {/* Filter Inputs Row */}
                <tr className="border-b border-slate-200 bg-white">
                  <td className="px-4 py-2" />
                  <td className="px-2 py-2" />
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      placeholder=""
                      value={tableFilterName}
                      onChange={(e) => setTableFilterName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      placeholder=""
                      value={tableFilterTax}
                      onChange={(e) => setTableFilterTax(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <div className="relative">
                      <select
                        value={tableFilterPeriod}
                        onChange={(e) => setTableFilterPeriod(e.target.value)}
                        className="w-full appearance-none border border-slate-200 rounded-lg px-2.5 py-1.5 pr-8 text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-600"
                      >
                        <option value="">Tất cả</option>
                        <option value="6 tháng">6 tháng</option>
                        <option value="Cả năm">Cả năm</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="relative">
                      <select
                        value={tableFilterStatus}
                        onChange={(e) => setTableFilterStatus(e.target.value)}
                        className="w-full appearance-none border border-slate-200 rounded-lg px-2.5 py-1.5 pr-8 text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-600"
                      >
                        <option value="">Tất cả</option>
                        <option value="draft">Đang báo cáo</option>
                        <option value="submitted">Đã tiếp nhận</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(report.id)}
                        onChange={() => {
                          setSelectedIds((prev) =>
                            prev.includes(report.id) ? prev.filter((id) => id !== report.id) : [...prev, report.id]
                          );
                        }}
                        className="rounded text-[#1D4ED8] focus:ring-[#1D4ED8]"
                      />
                    </td>
                    <td className="px-2 py-3.5 text-center">
                      <button
                        onClick={() => handleOpenDetail(report)}
                        className="text-slate-400 hover:text-blue-600 transition"
                        title="Xem báo cáo"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-700 font-medium">
                      {report.name}
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600 font-mono">
                      {report.taxCode}
                    </td>
                    <td className="px-3 py-3.5 text-sm text-slate-600">
                      {report.period}
                    </td>
                    <td className="px-3 py-3.5 text-sm">
                      {report.status === 'draft' ? (
                        <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                          <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                          Đang báo cáo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-blue-600 font-medium">
                          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                          Đã tiếp nhận
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-4 px-6 py-3 border-t border-slate-200 bg-white text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1">
                <span>Hiển thị</span>
                <div className="relative">
                  <select className="appearance-none border border-slate-200 rounded px-2 py-0.5 pr-5 bg-white text-slate-600 font-semibold focus:outline-none">
                    <option>10</option>
                  </select>
                  <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                </div>
              </div>
              <span>1 - {filteredReports.length} of {filteredReports.length}</span>
              <div className="flex gap-1.5">
                <button disabled className="p-1 rounded border border-slate-200 opacity-50 cursor-not-allowed">&lt;</button>
                <button disabled className="p-1 rounded border border-slate-200 opacity-50 cursor-not-allowed">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPANY REPORT DETAIL VIEW (Eye Icon clicked) */}
      {viewState === 'detail' && selectedReport && (
        <div className="space-y-4 printable-report">
          {/* Header */}
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100 no-print">
            <h1 className="text-base font-bold text-slate-800">
              Báo cáo định kỳ Tai nạn lao động
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewState('list')}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Huỷ bỏ
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1D4ED8] text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
              >
                <Printer size={15} />
                In báo cáo
              </button>
            </div>
          </div>

          {/* Details Wrapper */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#112D75] print:text-black">
                Báo cáo tổng hợp tình hình tai nạn lao động - Kỳ báo cáo: {selectedReport.period} năm {selectedReport.year}
              </h2>
              <p className="text-sm mt-1 no-print">
                <span className="text-red-500 font-bold">**Vui lòng đính kèm báo cáo TNLĐ có dấu mộc công ty:</span>{' '}
                <button
                  onClick={() => setShowPdfPreview(true)}
                  className="text-blue-600 underline font-medium hover:text-blue-800 transition bg-transparent border-none p-0 cursor-pointer"
                >
                  baocaoTNLD.pdf
                </button>
              </p>
            </div>

            {/* SCROLLABLE TABLE PANEL - Max height constraint in browser, full viewport during printing */}
            <div className="overflow-auto max-h-[60vh] print:max-h-none print:overflow-visible border border-slate-200 rounded-lg shadow-inner bg-slate-50/25 p-1">
              <table className="w-full border-collapse border border-slate-200 text-xs text-slate-700 bg-white">
                <thead className="sticky top-0 bg-slate-100 z-10 print:static print:bg-white">
                  <tr className="border border-slate-200">
                    <th rowSpan={3} className="border border-slate-200 p-2 text-left font-bold min-w-[250px] bg-slate-100 print:bg-white">Tên chỉ tiêu thống kê</th>
                    <th rowSpan={3} className="border border-slate-200 p-2 text-center font-bold w-16 bg-slate-100 print:bg-white">Mã số</th>
                    <th colSpan={11} className="border border-slate-200 p-1.5 text-center font-bold bg-slate-100 print:bg-white">Phân loại TNLĐ theo mức độ thương tật</th>
                  </tr>
                  <tr className="border border-slate-200">
                    <th colSpan={3} className="border border-slate-200 p-1 text-center font-bold bg-slate-50 print:bg-white">Số vụ (Vụ)</th>
                    <th colSpan={8} className="border border-slate-200 p-1 text-center font-bold bg-slate-50 print:bg-white">Số người bị nạn (Người)</th>
                  </tr>
                  <tr className="border border-slate-200">
                    <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50 print:bg-white">Tổng số</th>
                    <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50 print:bg-white">Số vụ có người chết</th>
                    <th className="border border-slate-200 p-1 text-center font-bold w-14 bg-slate-50 print:bg-white">Số vụ có từ 2 người bị nạn trở lên</th>

                    <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50 print:bg-white">Tổng số</th>
                    <th className="border border-slate-200 p-1 text-center font-bold w-16 bg-slate-50 print:bg-white font-medium">NN không thuộc quyền quản lý</th>

                    <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50 print:bg-white">Tổng số</th>
                    <th className="border border-slate-200 p-1 text-center font-bold w-16 bg-slate-50 print:bg-white font-medium">NN không thuộc quyền quản lý</th>

                    <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50 print:bg-white font-bold">Tổng số</th>
                    <th className="border border-slate-200 p-1 text-center font-bold w-16 bg-slate-50 print:bg-white font-medium">NN không thuộc quyền quản lý</th>

                    <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50 print:bg-white">Tổng số</th>
                    <th className="border border-slate-200 p-1 text-center font-bold w-16 bg-slate-50 print:bg-white font-medium">NN không thuộc quyền quản lý</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Category 1 */}
                  <tr className="bg-slate-100 print:bg-white font-bold">
                    <td className="border border-slate-200 p-2 font-bold">1. Tai nạn lao động</td>
                    <td className="border border-slate-200 p-2 text-center" />
                    <td colSpan={11} className="border border-slate-200" />
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 pl-4">Tai nạn lao động</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">{selectedReport.data.casesTotal}</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.casesDeath}</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.casesMultiple}</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.peopleTotal}</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.peopleFemale}</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.peopleDeath}</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.peopleSevere}</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                  </tr>

                  {/* Category 1.1 */}
                  <tr className="bg-slate-50 print:bg-white font-bold">
                    <td className="border border-slate-200 p-2 pl-4 font-bold">1.1 Phân theo nguyên nhân xảy ra TNLĐ</td>
                    <td className="border border-slate-200 p-2 text-center" />
                    <td colSpan={11} className="border border-slate-200" />
                  </tr>
                  <tr className="italic text-slate-600 font-semibold bg-slate-50/50 print:bg-white">
                    <td className="border border-slate-200 p-2 pl-6">a. Do người sử dụng lao động</td>
                    <td className="border border-slate-200 p-2 text-center" />
                    <td colSpan={11} className="border border-slate-200" />
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 pl-8">Không có thiết bị an toàn hoặc thiết bị không đảm bảo an toàn</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">1</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.casesDeath}</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.casesMultiple}</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.casesMultiple}</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.peopleFemale}</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.peopleFemale}</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.peopleFemale}</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.peopleFemale}</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 pl-8">Không có phương tiện bảo vệ cá nhân hoặc phương tiện bảo vệ cá nhân không tốt</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">2</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 pl-8">Tổ chức lao động không hợp lý</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">3</td>
                    <td className="border border-slate-200 p-2 text-center">1</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">5</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">5</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 pl-8">Chưa huấn luyện hoặc huấn luyện an toàn vệ sinh lao động chưa đầy đủ</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">4</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 pl-8">Không có quy trình an toàn hoặc biện pháp làm việc an toàn</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">5</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 pl-8">Điều kiện làm việc không tốt</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">6</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                  </tr>
                  <tr className="italic text-slate-600 font-semibold bg-slate-50/50 print:bg-white">
                    <td className="border border-slate-200 p-2 pl-6">b. Do người lao động</td>
                    <td className="border border-slate-200 p-2 text-center" />
                    <td colSpan={11} className="border border-slate-200" />
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 pl-8">Quy phạm nội quy, quy trình, quy chuẩn, biện pháp làm việc an toàn</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">7</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 pl-8">Không sử dụng phương tiện bảo vệ cá nhân</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">8</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 pl-8">Khách quan khó tránh/ Nguyên nhân chưa kể đến</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">9</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                  </tr>

                  {/* Category 1.2 */}
                  <tr className="bg-slate-50 print:bg-white font-bold">
                    <td className="border border-slate-200 p-2 pl-4 font-bold">1.2 Phân theo yếu tố gây chấn thương</td>
                    <td className="border border-slate-200 p-2 text-center" />
                    <td colSpan={11} className="border border-slate-200" />
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 pl-6">Thiết bị nâng</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">101</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.casesTotal}</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.casesDeath}</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.casesMultiple}</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.peopleTotal}</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.peopleFemale}</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.peopleDeath}</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">{selectedReport.data.peopleSevere}</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                  </tr>

                  {/* Category 1.3 */}
                  <tr className="bg-slate-50 print:bg-white font-bold">
                    <td className="border border-slate-200 p-2 pl-4 font-bold">1.3 Phân theo nghề nghiệp</td>
                    <td className="border border-slate-200 p-2 text-center" />
                    <td colSpan={11} className="border border-slate-200" />
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 pl-6">Nhà lãnh đạo cơ quan Đảng Cộng sản Việt Nam cấp Trung ương</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">102</td>
                    <td className="border border-slate-200 p-2 text-center">1</td>
                    <td className="border border-slate-200 p-2 text-center">1</td>
                    <td className="border border-slate-200 p-2 text-center">1</td>
                    <td className="border border-slate-200 p-2 text-center">5</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">5</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">5</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">5</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2 pl-6">Công nhân</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">103</td>
                    <td className="border border-slate-200 p-2 text-center">1</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">5</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">5</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">5</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                  </tr>

                  {/* Category 2 */}
                  <tr className="bg-slate-100 print:bg-white font-bold">
                    <td className="border border-slate-200 p-2 font-bold">2. Tai nạn được hưởng trợ cấp theo quy định tại Khoản 2 Điều 39 Luật ATVSLĐ</td>
                    <td className="border border-slate-200 p-2 text-center font-mono">10</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                    <td className="border border-slate-200 p-2 text-center">0</td>
                  </tr>

                  {/* Category 3 */}
                  <tr className="bg-slate-150 print:bg-white font-extrabold text-[#112D75]">
                    <td className="border border-slate-200 p-2 font-bold">3. Tổng số (3=1+2)</td>
                    <td className="border border-slate-200 p-2 text-center" />
                    <td className="border border-slate-200 p-2 text-center font-bold">{selectedReport.data.casesTotal}</td>
                    <td className="border border-slate-200 p-2 text-center font-bold">{selectedReport.data.casesDeath}</td>
                    <td className="border border-slate-200 p-2 text-center font-bold">{selectedReport.data.casesMultiple}</td>
                    <td className="border border-slate-200 p-2 text-center font-bold">{selectedReport.data.peopleTotal}</td>
                    <td className="border border-slate-200 p-2 text-center font-bold">0</td>
                    <td className="border border-slate-200 p-2 text-center font-bold">{selectedReport.data.peopleFemale}</td>
                    <td className="border border-slate-200 p-2 text-center font-bold">0</td>
                    <td className="border border-slate-200 p-2 text-center font-bold">{selectedReport.data.peopleDeath}</td>
                    <td className="border border-slate-200 p-2 text-center font-bold">0</td>
                    <td className="border border-slate-200 p-2 text-center font-bold">{selectedReport.data.peopleSevere}</td>
                    <td className="border border-slate-200 p-2 text-center font-bold">0</td>
                  </tr>
                </tbody>
              </table>

              {/* Sub-table II: Thiệt hại do tai nạn lao động */}
              <div className="mt-6 space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">II. Thiệt hại do tai nạn lao động</h3>
                <table className="w-full border-collapse border border-slate-200 text-xs text-slate-700 bg-white">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 print:bg-white">
                      <th rowSpan={2} className="border border-slate-200 p-2 text-center font-bold min-w-[200px]">Tổng số ngày nghỉ vì tai nạn lao động (kể cả ngày nghỉ chế độ)</th>
                      <th colSpan={4} className="border border-slate-200 p-1.5 text-center font-bold">Tổng số ngày nghỉ vì TNLĐ (1.000đ)</th>
                      <th rowSpan={2} className="border border-slate-200 p-2 text-center font-bold w-40">Thiệt hại tài sản (1.000đ)</th>
                    </tr>
                    <tr className="bg-slate-50 border-b border-slate-200 print:bg-white">
                      <th className="border border-slate-200 p-1 text-center font-bold w-28">Tổng số</th>
                      <th className="border border-slate-200 p-1 text-center font-bold w-24">Y tế</th>
                      <th className="border border-slate-200 p-1 text-center font-bold w-32 font-medium">Trả lương trong thời gian điều trị</th>
                      <th className="border border-slate-200 p-1 text-center font-bold w-28">Bồi thường trợ cấp</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 p-3 text-center font-bold text-slate-800">{selectedReport.data.daysOff}</td>
                      <td className="border border-slate-200 p-3 text-center font-mono">{formatNumber(selectedReport.data.costTotal)}</td>
                      <td className="border border-slate-200 p-3 text-center font-mono">{formatNumber(selectedReport.data.costMedical)}</td>
                      <td className="border border-slate-200 p-3 text-center font-mono">{formatNumber(selectedReport.data.costSalary)}</td>
                      <td className="border border-slate-200 p-3 text-center font-mono">{formatNumber(selectedReport.data.costCompensation)}</td>
                      <td className="border border-slate-200 p-3 text-center font-mono">{formatNumber(selectedReport.data.propertyDamage)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. AGGREGATE SUMMARY REPORT VIEW */}
      {viewState === 'summary' && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100">
            <h1 className="text-base font-bold text-slate-800">
              Báo cáo tổng hợp
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewState('list')}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Huỷ bỏ
              </button>
              <button 
                onClick={handleExportSummary}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1D4ED8] text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
              >
                <Download size={14} />
                Xuất dữ liệu
              </button>
            </div>
          </div>

          {/* Details Wrapper */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
            {/* SCROLLABLE SUMMARY PANEL */}
            <div className="overflow-auto max-h-[68vh] border border-slate-200 rounded-lg shadow-inner bg-slate-50/25 p-2 space-y-6">
              
              {/* Section I. Thông tin tổng quan */}
              <div className="space-y-2">
                <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">I. Thông tin tổng quan:</h2>
                <table className="w-full border-collapse border border-slate-200 text-xs text-slate-700 bg-white">
                  <thead className="sticky top-0 bg-slate-100 z-10">
                    <tr className="border border-slate-200 bg-slate-100">
                      <th rowSpan={3} className="border border-slate-200 p-2 text-left font-bold min-w-[200px]">Loại hình cơ sở</th>
                      <th rowSpan={3} className="border border-slate-200 p-2 text-center font-bold w-16">Mã số</th>
                      <th colSpan={2} className="border border-slate-200 p-1.5 text-center font-bold">Cơ sở</th>
                      <th colSpan={3} className="border border-slate-200 p-1.5 text-center font-bold">Lực lượng lao động</th>
                      <th colSpan={3} className="border border-slate-200 p-1.5 text-center font-bold">Tổng số tai nạn lao động</th>
                      <th colSpan={2} className="border border-slate-200 p-1.5 text-center font-bold">Tần suất tai nạn lao động</th>
                      <th rowSpan={3} className="border border-slate-200 p-2 text-center font-bold w-24">Ghi chú</th>
                    </tr>
                    <tr className="border border-slate-200 bg-slate-50">
                      <th rowSpan={2} className="border border-slate-200 p-1 text-center font-bold w-16">Tổng số</th>
                      <th rowSpan={2} className="border border-slate-200 p-1 text-center font-bold w-16">Số cơ sở tham gia</th>
                      <th rowSpan={2} className="border border-slate-200 p-1 text-center font-bold w-16">Tổng số lao động</th>
                      <th rowSpan={2} className="border border-slate-200 p-1 text-center font-bold w-20">Số LĐ của cơ sở tham gia báo cáo</th>
                      <th rowSpan={2} className="border border-slate-200 p-1 text-center font-bold w-16">Số lao động nữ</th>
                      <th colSpan={3} className="border border-slate-200 p-1 text-center font-bold">Số người bị TNLĐ</th>
                      <th rowSpan={2} className="border border-slate-200 p-1 text-center font-bold w-14">KTNLD</th>
                      <th rowSpan={2} className="border border-slate-200 p-1 text-center font-bold w-14">KChết</th>
                    </tr>
                    <tr className="border border-slate-200 bg-slate-50">
                      <th className="border border-slate-200 p-1 text-center font-bold w-16">Tổng số</th>
                      <th className="border border-slate-200 p-1 text-center font-bold w-16">Số người chết</th>
                      <th className="border border-slate-200 p-1 text-center font-bold w-18">Số người bị thương nặng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Tổng số', code: '' },
                      { name: 'Doanh nghiệp nhà nước', code: '1' },
                      { name: 'Công ty trách nhiệm hữu hạn', code: '2' },
                      { name: 'Công ty cổ phần', code: '3' },
                      { name: 'Công ty hợp danh', code: '4' },
                      { name: 'Doanh nghiệp tư nhân', code: '5' },
                      { name: 'Doanh nghiệp có vốn đầu tư nước ngoài', code: '6' },
                      { name: 'Đơn vị kinh tế tập thể', code: '7' },
                      { name: 'Đơn vị kinh tế cá thể', code: '8' },
                      { name: 'Đơn vị hành chính sự nghiệp, đảng, đoàn thể, hiệp hội', code: '9' }
                    ].map((row, idx) => (
                      <tr key={idx} className={row.code === '' ? 'bg-slate-100 font-bold text-slate-800' : 'hover:bg-slate-50 transition-colors'}>
                        <td className="border border-slate-200 p-2 font-medium">{row.name}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{row.code}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.countSubmitted * 2}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.countSubmitted}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.totals.peopleTotal * 2}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.totals.peopleTotal}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.totals.peopleFemale}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.totals.peopleTotal}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.totals.peopleDeath}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.totals.peopleSevere}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">2</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">2</td>
                        <td className="border border-slate-200 p-2 text-center" />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Section II. Phân loại TNLĐ */}
              <div className="space-y-2">
                <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">II. Phân loại TNLĐ:</h2>
                <table className="w-full border-collapse border border-slate-200 text-xs text-slate-700 bg-white">
                  <thead className="sticky top-0 bg-slate-100 z-10">
                    <tr className="border border-slate-200 bg-slate-100">
                      <th rowSpan={3} className="border border-slate-200 p-2 text-left font-bold min-w-[200px]">Tên chỉ tiêu thống kê</th>
                      <th rowSpan={3} className="border border-slate-200 p-2 text-center font-bold w-16">Mã số</th>
                      <th colSpan={7} className="border border-slate-200 p-1.5 text-center font-bold">Phân loại TNLĐ theo mức độ thương tật</th>
                      <th colSpan={6} className="border border-slate-200 p-1.5 text-center font-bold">Theo mức độ thương tật</th>
                    </tr>
                    <tr className="border border-slate-200 bg-slate-50">
                      <th colSpan={3} className="border border-slate-200 p-1 text-center font-bold w-24">Số vụ TNLĐ</th>
                      <th colSpan={4} className="border border-slate-200 p-1 text-center font-bold w-36">Số người bị nạn (Người)</th>
                      <th rowSpan={2} className="border border-slate-200 p-1 text-center font-bold w-20">Tổng số ngày nghỉ vì TNLĐ</th>
                      <th colSpan={4} className="border border-slate-200 p-1 text-center font-bold w-36">Tổng số tiền</th>
                      <th rowSpan={2} className="border border-slate-200 p-1 text-center font-bold w-20">Thiệt hại tài sản (1.000 đ)</th>
                    </tr>
                    <tr className="border border-slate-200 bg-slate-50">
                      <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50">Tổng số</th>
                      <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50 font-medium">Số vụ có người chết</th>
                      <th className="border border-slate-200 p-1 text-center font-bold w-14 bg-slate-50 font-medium">Số vụ có từ 2 người bị nạn trở lên</th>

                      <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50">Tổng số</th>
                      <th className="border border-slate-200 p-1 text-center font-bold w-14 bg-slate-50 font-medium">Số LĐ nữ</th>
                      <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50 font-medium">Số người bị chết</th>
                      <th className="border border-slate-200 p-1 text-center font-bold w-16 bg-slate-50 font-medium">Số người bị thương nặng</th>

                      <th className="border border-slate-200 p-1 text-center font-bold w-16 bg-slate-50">Tổng số</th>
                      <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50 font-medium">Y Tế</th>
                      <th className="border border-slate-200 p-1 text-center font-bold w-16 bg-slate-50 font-medium">Trả lương thời gian điều trị</th>
                      <th className="border border-slate-200 p-1 text-center font-bold w-16 bg-slate-50 font-medium">Bồi thường/Trợ cấp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* General Total Row */}
                    <tr className="bg-slate-100 font-bold text-slate-800">
                      <td className="border border-slate-200 p-2 font-bold">Tổng số</td>
                      <td className="border border-slate-200 p-2 text-center" />
                      <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.totals.casesTotal}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.totals.casesDeath}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.totals.casesMultiple}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.totals.peopleTotal}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.totals.peopleFemale}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.totals.peopleDeath}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.totals.peopleSevere}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">{summaryCalculations.totals.daysOff}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">{formatNumber(summaryCalculations.totals.costTotal)}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">{formatNumber(summaryCalculations.totals.costMedical)}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">{formatNumber(summaryCalculations.totals.costSalary)}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">{formatNumber(summaryCalculations.totals.costCompensation)}</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">{formatNumber(summaryCalculations.totals.propertyDamage)}</td>
                    </tr>

                    {/* Section: Phân theo ngành nghề */}
                    <tr className="bg-slate-50 font-bold">
                      <td className="border border-slate-200 p-2 font-bold">Phân theo ngành nghề</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">1</td>
                      <td colSpan={13} className="border border-slate-200" />
                    </tr>
                    {[
                      'Nông nghiệp, lâm nghiệp và thủy sản',
                      'Khai khoáng',
                      'Công nghiệp chế biến, chế tạo',
                      'Sản xuất và phân phối điện, khí đốt',
                      'Xây dựng',
                      'Bán buôn và bán lẻ; sửa chữa ô tô'
                    ].map((name, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="border border-slate-200 p-2 pl-6">{name}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">1</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 2 ? summaryCalculations.totals.casesTotal : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 2 ? summaryCalculations.totals.casesDeath : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 2 ? summaryCalculations.totals.casesMultiple : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 2 ? summaryCalculations.totals.peopleTotal : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 2 ? summaryCalculations.totals.peopleFemale : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 2 ? summaryCalculations.totals.peopleDeath : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 2 ? summaryCalculations.totals.peopleSevere : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 2 ? summaryCalculations.totals.daysOff : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 2 ? formatNumber(summaryCalculations.totals.costTotal) : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 2 ? formatNumber(summaryCalculations.totals.costMedical) : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 2 ? formatNumber(summaryCalculations.totals.costSalary) : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 2 ? formatNumber(summaryCalculations.totals.costCompensation) : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 2 ? formatNumber(summaryCalculations.totals.propertyDamage) : 0}</td>
                      </tr>
                    ))}

                    {/* Section: Phân theo nguyên nhân */}
                    <tr className="bg-slate-50 font-bold">
                      <td className="border border-slate-200 p-2 font-bold">Phân theo nguyên nhân</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">1</td>
                      <td colSpan={13} className="border border-slate-200" />
                    </tr>
                    {[
                      'Thiết bị không an toàn',
                      'Thiếu phương tiện bảo vệ cá nhân',
                      'Tổ chức lao động không hợp lý',
                      'Ý thức kỷ luật lao động kém'
                    ].map((name, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="border border-slate-200 p-2 pl-6">{name}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">1</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 0 ? summaryCalculations.totals.casesTotal : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 0 ? summaryCalculations.totals.casesDeath : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 0 ? summaryCalculations.totals.casesMultiple : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 0 ? summaryCalculations.totals.peopleTotal : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 0 ? summaryCalculations.totals.peopleFemale : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 0 ? summaryCalculations.totals.peopleDeath : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 0 ? summaryCalculations.totals.peopleSevere : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 0 ? summaryCalculations.totals.daysOff : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 0 ? formatNumber(summaryCalculations.totals.costTotal) : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 0 ? formatNumber(summaryCalculations.totals.costMedical) : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 0 ? formatNumber(summaryCalculations.totals.costSalary) : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 0 ? formatNumber(summaryCalculations.totals.costCompensation) : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 0 ? formatNumber(summaryCalculations.totals.propertyDamage) : 0}</td>
                      </tr>
                    ))}

                    {/* Section: Phân theo yếu tố gây chấn thương */}
                    <tr className="bg-slate-50 font-bold">
                      <td className="border border-slate-200 p-2 font-bold">Phân theo yếu tố gây chấn thương</td>
                      <td className="border border-slate-200 p-2 text-center font-mono">1</td>
                      <td colSpan={13} className="border border-slate-200" />
                    </tr>
                    {[
                      'Điện',
                      'Thiết bị nâng',
                      'Vật rơi, đổ sập',
                      'Vật văng bắn'
                    ].map((name, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="border border-slate-200 p-2 pl-6">{name}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">1</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 1 ? summaryCalculations.totals.casesTotal : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 1 ? summaryCalculations.totals.casesDeath : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 1 ? summaryCalculations.totals.casesMultiple : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 1 ? summaryCalculations.totals.peopleTotal : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 1 ? summaryCalculations.totals.peopleFemale : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 1 ? summaryCalculations.totals.peopleDeath : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 1 ? summaryCalculations.totals.peopleSevere : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 1 ? summaryCalculations.totals.daysOff : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 1 ? formatNumber(summaryCalculations.totals.costTotal) : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 1 ? formatNumber(summaryCalculations.totals.costMedical) : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 1 ? formatNumber(summaryCalculations.totals.costSalary) : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 1 ? formatNumber(summaryCalculations.totals.costCompensation) : 0}</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">{idx === 1 ? formatNumber(summaryCalculations.totals.propertyDamage) : 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Viewer Overlay Modal */}
      {showPdfPreview && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[1px] no-print">
          <div className="w-full max-w-4xl h-[90vh] bg-slate-100 rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#112D75] text-white px-6 py-4">
              <div className="flex items-center gap-2">
                <FileText size={18} />
                <h3 className="font-bold text-sm">Xem trước tệp đính kèm: baocaoTNLD.pdf</h3>
              </div>
              <button
                onClick={() => setShowPdfPreview(false)}
                className="text-white/80 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Document Viewer Area */}
            <div className="flex-1 overflow-y-auto p-12 bg-white flex justify-center shadow-inner">
              {/* Simulated Paper A4 document */}
              <div className="w-[210mm] min-h-[297mm] p-[20mm] bg-white border border-slate-300 shadow-lg relative text-slate-800 text-xs leading-relaxed font-sans">
                {/* Red Circular Stamp Mock */}
                <div className="absolute right-24 bottom-32 border-4 border-red-500/80 rounded-full w-24 h-24 flex items-center justify-center text-center font-bold text-red-500/80 uppercase text-[9px] tracking-wider rotate-[-12deg] select-none pointer-events-none">
                  Đã Đóng Dấu<br />Mộc Đỏ
                </div>

                {/* Document Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="text-center font-bold uppercase w-1/2">
                    {selectedReport.name}<br />
                    <span className="text-[10px] lowercase italic font-normal">Mã số thuế: {selectedReport.taxCode}</span>
                  </div>
                  <div className="text-center font-bold w-1/2">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br />
                    <span className="border-b border-slate-800 pb-0.5 tracking-wider font-semibold">Độc lập - Tự do - Hạnh phúc</span>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                  <h2 className="text-sm font-bold uppercase tracking-wide">BÁO CÁO TAI NẠN LAO ĐỘNG ĐỊNH KỲ</h2>
                  <p className="italic text-[10px] mt-1">Kỳ báo cáo: {selectedReport.period} - Năm {selectedReport.year}</p>
                </div>

                {/* Body Content */}
                <div className="space-y-4">
                  <p>Kính gửi: Sở Lao động - Thương binh và Xã hội Thành phố Hồ Chí Minh.</p>
                  <p>Công ty chúng tôi xin báo cáo tình hình tai nạn lao động trong kỳ báo cáo như sau:</p>

                  {/* Summary grid */}
                  <div className="grid grid-cols-2 gap-4 border border-slate-200 p-4 rounded bg-slate-50/50">
                    <div>
                      <p><strong>1. Số vụ tai nạn lao động:</strong> {selectedReport.data.casesTotal} vụ</p>
                      <p><strong>- Trong đó có người chết:</strong> {selectedReport.data.casesDeath} vụ</p>
                      <p><strong>- Vụ có từ 2 người bị nạn:</strong> {selectedReport.data.casesMultiple} vụ</p>
                    </div>
                    <div>
                      <p><strong>2. Số người bị nạn:</strong> {selectedReport.data.peopleTotal} người</p>
                      <p><strong>- Lao động nữ:</strong> {selectedReport.data.peopleFemale} người</p>
                      <p><strong>- Người bị chết:</strong> {selectedReport.data.peopleDeath} người</p>
                      <p><strong>- Bị thương nặng:</strong> {selectedReport.data.peopleSevere} người</p>
                    </div>
                  </div>

                  <p><strong>3. Tổng số ngày nghỉ vì tai nạn lao động:</strong> {selectedReport.data.daysOff} ngày.</p>
                  
                  <div className="space-y-1">
                    <p><strong>4. Chi phí thiệt hại (VNĐ):</strong></p>
                    <ul className="list-disc pl-6 space-y-0.5">
                      <li>Tổng chi phí: {formatNumber(selectedReport.data.costTotal)} VNĐ</li>
                      <li>Chi phí y tế: {formatNumber(selectedReport.data.costMedical)} VNĐ</li>
                      <li>Trả lương thời gian điều trị: {formatNumber(selectedReport.data.costSalary)} VNĐ</li>
                      <li>Chi phí bồi thường trợ cấp: {formatNumber(selectedReport.data.costCompensation)} VNĐ</li>
                      <li>Thiệt hại tài sản: {formatNumber(selectedReport.data.propertyDamage)} VNĐ</li>
                    </ul>
                  </div>

                  <p className="pt-6">Chúng tôi cam đoan các số liệu báo cáo trên là đúng sự thật và hoàn toàn chịu trách nhiệm trước pháp luật.</p>
                </div>

                {/* Signatures */}
                <div className="flex justify-between items-start mt-20">
                  <div className="w-1/2" />
                  <div className="text-center w-1/2">
                    <p className="italic text-[10px] mb-1">TP. Hồ Chí Minh, ngày 15 tháng 12 năm {selectedReport.year}</p>
                    <p className="font-bold uppercase">Đại diện doanh nghiệp</p>
                    <p className="text-[10px] text-slate-400 mt-1">(Ký tên và đóng dấu)</p>
                    <div className="h-16" />
                    <p className="font-bold underline">Phạm Thiên Ân</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer buttons */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-200">
              <button
                onClick={() => setShowPdfPreview(false)}
                className="px-5 py-2 rounded-lg bg-[#112D75] hover:bg-blue-900 text-white font-semibold transition text-sm shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
