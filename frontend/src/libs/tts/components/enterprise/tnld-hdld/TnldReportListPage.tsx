"use client";

import { Edit3, Eye, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getAuthToken } from '@/libs/core/utils/auth-token';

type ReportStatus = 'CHO_BAO_CAO' | 'DANG_BAO_CAO' | 'CHO_TIEP_NHAN' | 'DA_BAO_CAO';

type ReportRow = {
  id: string;
  backendId?: number;
  companyName: string;
  taxCode: string;
  period: string;
  year: string;
  status: ReportStatus;
};

type ReportStepId = 'company' | 'accident' | 'subsidy' | 'review';

type EnterpriseInfo = {
  id: number;
  name: string;
  taxCode: string;
};

const YEARS = ['2026', '2025', '2024', '2023'];
const BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

const REPORT_CATEGORIES: Array<{ id: ReportStepId; label: string }> = [
  { id: 'company', label: 'Thông tin doanh nghiệp' },
  { id: 'accident', label: '1. Tai nạn lao động' },
  { id: 'subsidy', label: '2. Tai nạn lao động được hưởng trợ cấp theo quy định tại Khoản 2 Điều 39 Luật ATVSLĐ' },
  { id: 'review', label: 'Xem tổng quan báo cáo tai nạn lao động' },
];

function StatusBadge({ status }: { status: ReportStatus }) {
  const config = {
    CHO_BAO_CAO: {
      label: 'Chờ báo cáo',
      className: 'bg-slate-100 text-slate-600',
    },
    DANG_BAO_CAO: {
      label: 'Đang báo cáo',
      className: 'bg-amber-50 text-amber-700',
    },
    CHO_TIEP_NHAN: {
      label: 'Đã tiếp nhận',
      className: 'bg-slate-100 text-slate-600',
    },
    DA_BAO_CAO: {
      label: 'Đã báo cáo',
      className: 'bg-blue-50 text-blue-700',
    },
  }[status];

  return (
    <span className={`inline-flex min-w-[104px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}

function formatReportPeriod(period?: string) {
  if (period === '6m' || period === '6 tháng') return '6 tháng';
  if (period === '12m' || period === 'year' || period === 'Cả năm') return 'Cả năm';
  return period || '6 tháng';
}

function getPeriodSlug(period: string) {
  return period === 'Cả năm' ? 'year' : '6m';
}

function mapReportStatus(status?: string): ReportStatus {
  if (status === 'accepted') return 'DA_BAO_CAO';
  if (status === 'submitted') return 'CHO_TIEP_NHAN';
  if (status === 'draft') return 'DANG_BAO_CAO';
  return 'CHO_BAO_CAO';
}

function makeEmptyReport(year: string, period: '6 tháng' | 'Cả năm', enterprise?: EnterpriseInfo | null): ReportRow {
  return {
    id: `${year}-${getPeriodSlug(period)}`,
    companyName: enterprise?.name || '',
    taxCode: enterprise?.taxCode || '',
    period,
    year,
    status: 'CHO_BAO_CAO',
  };
}

export default function TnldReportListPage() {
  const router = useRouter();
  const [year, setYear] = useState('2026');
  const [keyword, setKeyword] = useState('');
  const [enterprise, setEnterprise] = useState<EnterpriseInfo | null>(null);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedReport, setSelectedReport] = useState<ReportRow | null>(null);

  useEffect(() => {
    async function loadReports() {
      if (!BASE_URL) return;

      setIsLoading(true);
      setErrorMessage('');

      try {
        const token = getAuthToken();
        const enterpriseResponse = await fetch(`${BASE_URL}/enterprises/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const enterpriseData = await enterpriseResponse.json().catch(() => null);

        if (!enterpriseResponse.ok || !enterpriseData?.id) {
          throw new Error(enterpriseData?.message || 'Không tải được thông tin doanh nghiệp');
        }

        const currentEnterprise: EnterpriseInfo = {
          id: enterpriseData.id,
          name: enterpriseData.name || '',
          taxCode: enterpriseData.taxCode || '',
        };
        setEnterprise(currentEnterprise);

        const reportsResponse = await fetch(`${BASE_URL}/tnld-contract-reports/enterprise/${currentEnterprise.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const reportsData = await reportsResponse.json().catch(() => []);

        if (!reportsResponse.ok) {
          throw new Error(reportsData?.message || 'Không tải được danh sách báo cáo');
        }

        const mappedReports: ReportRow[] = Array.isArray(reportsData)
          ? reportsData.map((item) => {
              const period = formatReportPeriod(item.period);
              const reportYear = String(item.year || year);
              return {
                id: `${reportYear}-${getPeriodSlug(period)}`,
                backendId: item.id,
                companyName: item.enterprise?.name || currentEnterprise.name,
                taxCode: item.enterprise?.taxCode || currentEnterprise.taxCode,
                period,
                year: reportYear,
                status: mapReportStatus(item.status),
              };
            })
          : [];

        setReports(mappedReports);
      } catch (error) {
        setReports([]);
        setErrorMessage(error instanceof Error ? error.message : 'Lỗi kết nối backend');
      } finally {
        setIsLoading(false);
      }
    }

    loadReports();
  }, [year]);

  const visibleReports = useMemo(() => {
    const yearReports = reports.filter((report) => report.year === year);
    const sixMonthReport = yearReports.find((report) => report.period === '6 tháng');
    const fullYearReport = yearReports.find((report) => report.period === 'Cả năm');

    return [
      sixMonthReport || makeEmptyReport(year, '6 tháng', enterprise),
      fullYearReport || makeEmptyReport(year, 'Cả năm', enterprise),
    ];
  }, [enterprise, reports, year]);

  const yearOptions = useMemo(() => {
    const reportYears = reports.map((report) => report.year);
    return Array.from(new Set([year, ...YEARS, ...reportYears])).sort((a, b) => Number(b) - Number(a));
  }, [reports, year]);

  const filteredReports = visibleReports.filter((report) => {
    const searchText = `${report.companyName} ${report.taxCode} ${report.period}`.toLowerCase();
    return searchText.includes(keyword.toLowerCase());
  });

  function openReport(report: ReportRow) {
    if (report.status === 'CHO_TIEP_NHAN' || report.status === 'DA_BAO_CAO') {
      const reportId = report.backendId || report.id;
      router.push(`/enterprise/tnld-hdld/${reportId}?mode=view&step=review`);
      return;
    }

    setSelectedReport(report);
  }

  function openReportCategory(step: ReportStepId) {
    if (!selectedReport) return;
    router.push(`/enterprise/tnld-hdld/${selectedReport.id}?mode=edit&step=${step}`);
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100 text-gray-900">
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 shadow-sm">
          <h1 className="text-base font-semibold text-gray-900">Báo cáo định kỳ Tai nạn lao động</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm kiếm"
                className="h-9 w-72 rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <select
              value={year}
              onChange={(event) => setYear(event.target.value)}
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {yearOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section className="flex-1 overflow-auto p-4">
          <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
            <table className="w-full min-w-[920px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="w-28 px-4 py-3 text-center">Thao tác</th>
                  <th className="px-4 py-3">Tên doanh nghiệp</th>
                  <th className="w-40 px-4 py-3">Mã số thuế</th>
                  <th className="w-36 px-4 py-3">Kỳ báo cáo</th>
                  <th className="w-44 px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm font-medium text-gray-400">
                      Đang tải danh sách báo cáo...
                    </td>
                  </tr>
                ) : filteredReports.map((report) => (
                  <tr key={report.id} className="transition hover:bg-blue-50/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3 text-gray-400">
                        <button
                          type="button"
                          onClick={() => openReport(report)}
                          className="rounded p-1 transition hover:bg-white hover:text-blue-600"
                          aria-label={report.status === 'CHO_TIEP_NHAN' || report.status === 'DA_BAO_CAO' ? 'Xem báo cáo' : 'Chỉnh sửa báo cáo'}
                        >
                          {report.status === 'CHO_TIEP_NHAN' || report.status === 'DA_BAO_CAO' ? <Eye size={17} /> : <Edit3 size={17} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{report.companyName}</td>
                    <td className="px-4 py-3 text-gray-700">{report.taxCode}</td>
                    <td className="px-4 py-3 text-gray-700">{report.period}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={report.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {errorMessage && (
              <div className="border-t border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {errorMessage}
              </div>
            )}

            {!isLoading && filteredReports.length === 0 && (
              <div className="flex h-44 items-center justify-center text-sm font-medium text-gray-400">
                Không có kỳ báo cáo trong năm đã chọn
              </div>
            )}

            <div className="flex items-center justify-end gap-4 border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
              <span>1 - {filteredReports.length} / {filteredReports.length}</span>
              <button type="button" className="rounded px-2 py-1 transition hover:bg-gray-100">
                Trước
              </button>
              <button type="button" className="rounded px-2 py-1 transition hover:bg-gray-100">
                Sau
              </button>
            </div>
          </div>
        </section>
      </main>

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[640px] overflow-hidden rounded-md bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h2 className="text-sm font-bold text-gray-900">Danh mục báo cáo TNLD</h2>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-2">
              {REPORT_CATEGORIES.map((category, index) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => openReportCategory(category.id)}
                  className={`block w-full px-5 py-4 text-left text-sm transition ${
                    index === 0
                      ? 'bg-blue-50 font-semibold text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
