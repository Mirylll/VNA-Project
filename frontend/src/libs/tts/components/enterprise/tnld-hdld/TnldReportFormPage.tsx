"use client";

import { AlertTriangle, ArrowLeft, Check, ChevronDown, ChevronRight, ChevronUp, Eye, Save, Send, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getAuthToken } from '@/libs/core/utils/auth-token';

type StepId = 'company' | 'accident' | 'subsidy' | 'review';
type AccidentTab = 'overview' | 'details';
type TnldInjuryFactor = {
  id: string;
  name: string;
  isActive: boolean;
};
type TnldHierarchicalCategory = {
  code: string;
  name: string;
  level: number;
  parentCode?: string;
};
type EnterpriseCompanyInfo = {
  name: string;
  enterpriseType: string;
  industry: string;
};
type AccidentDetail = {
  cause: string;
  injuryFactor: string;
  occupation: string;
  totalAccidents: string;
  fatalAccidents: string;
  multiVictimAccidents: string;
  totalVictims: string;
  femaleVictims: string;
  deadVictims: string;
  severeVictims: string;
  unmanagedVictims: string;
  unmanagedFemaleVictims: string;
  unmanagedDeadVictims: string;
  unmanagedSevereVictims: string;
  medicalCost: string;
  treatmentSalaryCost: string;
  compensationCost: string;
  workdaysLost: string;
  assetDamage: string;
};

type TnldDraftPayload = {
  form?: Record<string, string>;
  accidentDetails?: AccidentDetail[];
  uploadedFile?: string;
  reportYear?: string;
  step?: StepId;
  accidentTab?: AccidentTab;
  reportRecordId?: number;
};

type ReviewMetricValues = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

type ReviewSummaryRow = {
  code: string;
  label: string;
  metrics: ReviewMetricValues;
};

const STEPS: Array<{ id: StepId; label: string }> = [
  { id: 'company', label: 'Thông tin doanh nghiệp' },
  { id: 'accident', label: '1. Tai nạn lao động' },
  { id: 'subsidy', label: '2. Tai nạn lao động được hưởng trợ cấp theo quy định tại Khoản 2 Điều 39 Luật ATVSLĐ' },
  { id: 'review', label: 'Xem tổng quan báo cáo tai nạn lao động' },
];

const TNLD_DRAFT_STORAGE_PREFIX = 'vna_tnld_hdld_draft';
const BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '';

const DEFAULT_INJURY_FACTORS: TnldInjuryFactor[] = [
  { id: '1', name: 'Điện', isActive: true },
  { id: '2', name: 'Phóng xạ', isActive: true },
  { id: '3', name: 'Thiết bị áp lực', isActive: true },
  { id: '4', name: 'Thiết bị nâng', isActive: true },
  { id: '5', name: 'Bộ phận truyền động, chuyển động của máy, thiết bị gây cán, cuốn, đè, ép, kẹp, cắt, va đập,...', isActive: true },
  { id: '6', name: 'Vật văng bắn', isActive: true },
  { id: '7', name: 'Vật rơi, đổ, sập', isActive: true },
  { id: '8', name: 'Sập đổ công trình, giàn giáo', isActive: true },
  { id: '9', name: 'Sập lò, sập đất đá', isActive: true },
];

const DEFAULT_INJURY_TYPES: TnldHierarchicalCategory[] = [
  { code: '1', name: 'Đầu, mặt, cổ', level: 1 },
  { code: '11', name: 'Các chấn thương sọ não hở hoặc kín', level: 2, parentCode: '1' },
  { code: '110', name: 'Bị thương vào cổ, tác hại đến thanh quản và thực quản', level: 3, parentCode: '11' },
  { code: '2', name: 'Chi trên (vai, cánh tay, bàn tay)', level: 1 },
  { code: '21', name: 'Gãy xương tay', level: 2, parentCode: '2' },
  { code: '211', name: 'Gãy xương cánh tay', level: 3, parentCode: '21' },
];

const DEFAULT_OCCUPATIONS: TnldHierarchicalCategory[] = [
  { code: '1', name: 'Nhà lãnh đạo trong các ngành, các cấp và các đơn vị', level: 1 },
  { code: '11', name: 'Nhà lãnh đạo cơ quan Đảng cộng sản Việt Nam cấp Trung ương và địa phương', level: 2, parentCode: '1' },
  { code: '111', name: 'Nhà lãnh đạo cơ quan Đảng cộng sản Việt Nam cấp Trung ương', level: 3, parentCode: '11' },
  { code: '1111', name: 'Trưởng ban, Phó Trưởng ban và tương đương trở lên thuộc cấp Trung ương', level: 4, parentCode: '111' },
  { code: '2', name: 'Chuyên môn kỹ thuật bậc cao', level: 1 },
  { code: '21', name: 'Chuyên gia trong lĩnh vực khoa học và kỹ thuật', level: 2, parentCode: '2' },
];

const REVIEW_EMPLOYER_CAUSES = [
  { code: '1', label: 'Không có thiết bị an toàn hoặc thiết bị không đảm bảo an toàn' },
  { code: '2', label: 'Không có phương tiện bảo vệ cá nhân hoặc phương tiện bảo vệ cá nhân không tốt' },
  { code: '3', label: 'Tổ chức lao động chưa hợp lý' },
  { code: '4', label: 'Chưa huấn luyện hoặc huấn luyện an toàn, vệ sinh lao động chưa đầy đủ' },
  { code: '5', label: 'Không có quy trình an toàn hoặc biện pháp làm việc an toàn' },
  { code: '6', label: 'Điều kiện làm việc không tốt' },
];

const REVIEW_EMPLOYEE_CAUSES = [
  { code: '7', label: 'Vi phạm nội quy, quy trình, quy chuẩn, biện pháp làm việc an toàn' },
  { code: '8', label: 'Không sử dụng phương tiện bảo vệ cá nhân' },
  { code: '9', label: 'Khách quan khó tránh/ Nguyên nhân chưa kể đến' },
];

function isStepId(value: string | null): value is StepId {
  return value === 'company' || value === 'accident' || value === 'subsidy' || value === 'review';
}

function isAccidentTab(value: unknown): value is AccidentTab {
  return value === 'overview' || value === 'details';
}

function getTnldDraftKey() {
  if (typeof window === 'undefined') return '';

  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const reportId = pathParts.at(-1) || 'new';
  const normalizedReportId = reportId === 'tnld-hdld' ? 'new' : reportId;

  return `${TNLD_DRAFT_STORAGE_PREFIX}:${normalizedReportId}`;
}

function getTnldReportPeriodFromPath() {
  if (typeof window === 'undefined') return '6m';

  const reportId = window.location.pathname.split('/').filter(Boolean).at(-1) || '';
  return reportId.includes('year') || reportId.includes('12m') ? 'year' : '6m';
}

function isDraftAccidentDetail(value: unknown): value is AccidentDetail {
  if (!value || typeof value !== 'object') return false;

  return ['cause', 'injuryFactor', 'occupation', 'totalAccidents', 'medicalCost'].every(
    (key) => typeof (value as Record<string, unknown>)[key] === 'string',
  );
}

function Field({
  label,
  value,
  placeholder,
  required,
  readOnly,
  suffix,
  error,
  type = 'text',
  selectOnFocus,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  suffix?: string;
  error?: string;
  type?: string;
  selectOnFocus?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="relative block">
      <span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[11px] font-medium text-gray-500">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      <div
        className={`flex h-10 items-center rounded-md border px-3 text-sm ${
          error
            ? 'border-red-400 bg-red-50 text-gray-900'
            : readOnly
              ? 'border-gray-200 bg-gray-50 text-gray-500'
              : 'border-gray-300 bg-white text-gray-900'
        }`}
      >
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          inputMode={type === 'number' ? 'numeric' : undefined}
          onFocus={(event) => {
            if (selectOnFocus) event.currentTarget.select();
          }}
          onChange={(event) => onChange?.(event.target.value)}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-400"
        />
        {suffix && <span className="ml-2 shrink-0 text-xs text-gray-400">{suffix}</span>}
      </div>
      {error && <span className="mt-1 block text-xs font-medium text-red-500">{error}</span>}
    </label>
  );
}

function MoneyField({
  label,
  value,
  required,
  error,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative block">
      <span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[11px] font-medium text-gray-500">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      <div
        className={`flex h-10 items-center rounded-md border px-3 text-sm text-gray-900 ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
        }`}
      >
        <input
          type="text"
          inputMode="decimal"
          value={value}
          autoComplete="off"
          onFocus={(event) => event.target.select()}
          onChange={(event) => onChange(formatDecimalVndNumber(event.target.value))}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-400"
        />
        <span className="ml-2 shrink-0 text-xs text-gray-400">VNĐ</span>
      </div>
      {error && <span className="mt-1 block text-xs font-medium text-red-500">{error}</span>}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  required,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="relative block">
      <span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[11px] font-medium text-gray-500">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SectionTitle({
  children,
  hint,
  hintClassName = 'mt-1 text-xs font-medium text-red-500',
}: {
  children: React.ReactNode;
  hint?: string;
  hintClassName?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-bold text-gray-900">{children}</h2>
      {hint && <p className={hintClassName}>{hint}</p>}
    </div>
  );
}

function ReviewRow({ label, values }: { label: string; values: Array<string | number> }) {
  return (
    <tr className="border-b border-gray-100">
      <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-medium text-gray-800">{label}</td>
      {values.map((value, index) => (
        <td key={`${label}-${index}`} className="min-w-20 px-3 py-3 text-center text-sm text-gray-700">
          {value}
        </td>
      ))}
    </tr>
  );
}

function formatVndNumber(value: string) {
  const numberOnly = value.replace(/\D/g, '');

  if (!numberOnly) return '';

  return numberOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDecimalVndNumber(value: string) {
  const cleanValue = value.replace(/[^\d.,]/g, '');
  if (!cleanValue) return '';

  if (cleanValue.includes(',')) {
    const [integerPart, ...decimalParts] = cleanValue.split(',');
    const decimalPart = decimalParts.join('').replace(/\D/g, '');
    return `${formatVndNumber(integerPart)}${cleanValue.endsWith(',') ? ',' : `,${decimalPart}`}`;
  }

  const dotParts = cleanValue.split('.');
  if (dotParts.length === 1) return formatVndNumber(cleanValue);

  const hasTrailingDot = cleanValue.endsWith('.');
  const allMiddleGroupsAreThousands =
    dotParts.length > 1 && dotParts.slice(1).every((part) => part.length === 3);

  if (hasTrailingDot) {
    return `${formatVndNumber(cleanValue.slice(0, -1))}.`;
  }

  if (dotParts.length === 2) {
    const [integerPart, rightPart] = dotParts;
    if (rightPart.length >= 3) return formatVndNumber(cleanValue);
    return `${formatVndNumber(integerPart)}.${rightPart.replace(/\D/g, '')}`;
  }

  if (allMiddleGroupsAreThousands) return formatVndNumber(cleanValue);

  const decimalPart = dotParts.at(-1)?.replace(/\D/g, '') || '';
  const integerPart = dotParts.slice(0, -1).join('');
  return `${formatVndNumber(integerPart)}.${decimalPart}`;
}

function parseInteger(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

function sanitizeIntegerInput(value: string) {
  return value.replace(/\D/g, '');
}

function getRequiredIntegerError(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) return 'Vui lòng nhập số, nếu không có nhập 0';
  if (!/^\d+$/.test(normalizedValue)) return 'Chỉ được nhập số nguyên không âm';

  return '';
}

function getRequiredMoneyError(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) return 'Vui lòng nhập số tiền, nếu không có nhập 0';
  if (!/^[\d.,]+$/.test(normalizedValue) || !/\d/.test(normalizedValue)) {
    return 'Chỉ được nhập số tiền hợp lệ';
  }

  return '';
}

function firstError(...errors: string[]) {
  return errors.find(Boolean) || '';
}

function formatMoneyInput(value: string) {
  return formatVndNumber(value);
}

function readStoredCategory<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;

  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return fallback;
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) && parsedValue.length > 0 ? parsedValue : fallback;
  } catch {
    return fallback;
  }
}

function createAccidentDetail(index: number): AccidentDetail {
  return {
    cause: DEFAULT_INJURY_TYPES[0].name,
    injuryFactor: DEFAULT_INJURY_FACTORS[3].name,
    occupation: DEFAULT_OCCUPATIONS[2].name,
    totalAccidents: '1',
    fatalAccidents: index === 0 ? '1' : '0',
    multiVictimAccidents: '1',
    totalVictims: '10',
    femaleVictims: '5',
    deadVictims: index === 0 ? '5' : '0',
    severeVictims: '10',
    unmanagedVictims: '0',
    unmanagedFemaleVictims: '0',
    unmanagedDeadVictims: '0',
    unmanagedSevereVictims: '0',
    medicalCost: '10.000.000',
    treatmentSalaryCost: '10.000.000',
    compensationCost: '10.000.000',
    workdaysLost: '20',
    assetDamage: '10.000.000',
  };
}

function getAccidentDetailTotalCost(detail: AccidentDetail) {
  const total =
    parseInteger(detail.medicalCost) +
    parseInteger(detail.treatmentSalaryCost) +
    parseInteger(detail.compensationCost);

  return formatVndNumber(String(total));
}

function getAccidentDetailErrors(detail: AccidentDetail) {
  return {
    totalAccidents: getRequiredIntegerError(detail.totalAccidents),
    fatalAccidents:
      firstError(
        getRequiredIntegerError(detail.fatalAccidents),
        parseInteger(detail.fatalAccidents) > parseInteger(detail.totalAccidents)
        ? 'Tổng số vụ có người chết phải nhỏ hơn hoặc bằng Tổng số vụ'
          : '',
      ),
    multiVictimAccidents:
      firstError(
        getRequiredIntegerError(detail.multiVictimAccidents),
        parseInteger(detail.multiVictimAccidents) > parseInteger(detail.totalAccidents)
        ? 'Tổng số vụ có từ 2 người bị nạn trở lên phải nhỏ hơn hoặc bằng Tổng số vụ'
          : '',
      ),
    totalVictims: getRequiredIntegerError(detail.totalVictims),
    femaleVictims:
      firstError(
        getRequiredIntegerError(detail.femaleVictims),
        parseInteger(detail.femaleVictims) > parseInteger(detail.totalVictims)
        ? 'Tổng số lao động nữ bị nạn phải nhỏ hơn hoặc bằng Tổng số người bị nạn'
          : '',
      ),
    deadVictims:
      firstError(
        getRequiredIntegerError(detail.deadVictims),
        parseInteger(detail.deadVictims) > parseInteger(detail.totalVictims)
        ? 'Tổng số người bị chết phải nhỏ hơn hoặc bằng Tổng số người bị nạn'
          : '',
      ),
    severeVictims:
      firstError(
        getRequiredIntegerError(detail.severeVictims),
        parseInteger(detail.severeVictims) > parseInteger(detail.totalVictims)
        ? 'Tổng số người bị thương nặng phải nhỏ hơn hoặc bằng Tổng số người bị nạn'
          : '',
      ),
    unmanagedVictims:
      firstError(
        getRequiredIntegerError(detail.unmanagedVictims),
        parseInteger(detail.unmanagedVictims) > parseInteger(detail.totalVictims)
        ? 'Số người bị nạn không QL phải nhỏ hơn hoặc bằng Tổng số người bị nạn'
          : '',
      ),
    unmanagedFemaleVictims:
      firstError(
        getRequiredIntegerError(detail.unmanagedFemaleVictims),
        parseInteger(detail.unmanagedFemaleVictims) > parseInteger(detail.unmanagedVictims)
        ? 'Lao động nữ bị nạn không QL phải nhỏ hơn hoặc bằng Số người bị nạn không QL'
          : '',
      ),
    unmanagedDeadVictims:
      firstError(
        getRequiredIntegerError(detail.unmanagedDeadVictims),
        parseInteger(detail.unmanagedDeadVictims) > parseInteger(detail.unmanagedVictims)
        ? 'Số người chết không QL phải nhỏ hơn hoặc bằng Số người bị nạn không QL'
          : '',
      ),
    unmanagedSevereVictims:
      firstError(
        getRequiredIntegerError(detail.unmanagedSevereVictims),
        parseInteger(detail.unmanagedSevereVictims) > parseInteger(detail.unmanagedVictims)
        ? 'Người bị thương nặng không QL phải nhỏ hơn hoặc bằng Số người bị nạn không QL'
          : '',
      ),
    medicalCost: getRequiredMoneyError(detail.medicalCost),
    treatmentSalaryCost: getRequiredMoneyError(detail.treatmentSalaryCost),
    compensationCost: getRequiredMoneyError(detail.compensationCost),
    workdaysLost: getRequiredIntegerError(detail.workdaysLost),
    assetDamage: getRequiredMoneyError(detail.assetDamage),
  };
}

function sumAccidentDetailField(details: AccidentDetail[], field: keyof AccidentDetail) {
  return details.reduce((total, detail) => total + parseInteger(String(detail[field] ?? '')), 0);
}

function sumAccidentDetailTotalCost(details: AccidentDetail[]) {
  return details.reduce(
    (total, detail) =>
      total +
      parseInteger(detail.medicalCost) +
      parseInteger(detail.treatmentSalaryCost) +
      parseInteger(detail.compensationCost),
    0,
  );
}

function emptyReviewMetrics(): ReviewMetricValues {
  return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function addReviewMetrics(first: ReviewMetricValues, second: ReviewMetricValues): ReviewMetricValues {
  return first.map((value, index) => value + second[index]) as ReviewMetricValues;
}

function sumAccidentDetailMetrics(details: AccidentDetail[]): ReviewMetricValues {
  if (details.length === 0) return emptyReviewMetrics();

  return [
    sumAccidentDetailField(details, 'totalAccidents'),
    sumAccidentDetailField(details, 'fatalAccidents'),
    sumAccidentDetailField(details, 'multiVictimAccidents'),
    sumAccidentDetailField(details, 'totalVictims'),
    sumAccidentDetailField(details, 'unmanagedVictims'),
    sumAccidentDetailField(details, 'femaleVictims'),
    sumAccidentDetailField(details, 'unmanagedFemaleVictims'),
    sumAccidentDetailField(details, 'deadVictims'),
    sumAccidentDetailField(details, 'unmanagedDeadVictims'),
    sumAccidentDetailField(details, 'severeVictims'),
    sumAccidentDetailField(details, 'unmanagedSevereVictims'),
  ];
}

function hasReviewMetrics(metrics: ReviewMetricValues) {
  return metrics.some((value) => value > 0);
}

function buildFixedReviewRows(
  details: AccidentDetail[],
  field: 'cause' | 'injuryFactor' | 'occupation',
  options: Array<{ code: string; label: string }>,
): ReviewSummaryRow[] {
  return options.map((opt) => {
    const matchingDetails = details.filter((d) => d[field]?.trim() === opt.label.trim());
    return {
      code: opt.code,
      label: opt.label,
      metrics: sumAccidentDetailMetrics(matchingDetails),
    };
  });
}

export default function TnldReportFormPage() {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const draftHydratedRef = useRef(false);

  const [readOnly, setReadOnly] = useState(false);
  const [reportYear, setReportYear] = useState('2026');
  const [step, setStep] = useState<StepId>('company');
  const [accidentTab, setAccidentTab] = useState<AccidentTab>('overview');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [collapsedAccidentDetails, setCollapsedAccidentDetails] = useState<Record<number, boolean>>({});
  const [injuryFactors, setInjuryFactors] = useState<TnldInjuryFactor[]>(DEFAULT_INJURY_FACTORS);
  const [injuryTypes, setInjuryTypes] = useState<TnldHierarchicalCategory[]>(DEFAULT_INJURY_TYPES);
  const [occupations, setOccupations] = useState<TnldHierarchicalCategory[]>(DEFAULT_OCCUPATIONS);
  const [accidentDetails, setAccidentDetails] = useState<AccidentDetail[]>(() => [
    createAccidentDetail(0),
    createAccidentDetail(1),
  ]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState('');
  const [enterpriseId, setEnterpriseId] = useState<number | null>(null);
  const [companyInfo, setCompanyInfo] = useState<EnterpriseCompanyInfo>({
    name: '',
    enterpriseType: '',
    industry: '',
  });
  const [savedReportId, setSavedReportId] = useState<number | null>(null);
  const [isSavingReport, setIsSavingReport] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [form, setForm] = useState({
    totalEmployees: '10',
    femaleEmployees: '5',
    payroll: '',
    totalAccidents: '2',
    fatalAccidents: '1',
    multiVictimAccidents: '1',
    totalVictims: '5',
    femaleVictims: '1',
    deadVictims: '1',
    severeVictims: '1',
    unmanagedVictims: '0',
    unmanagedFemaleVictims: '0',
    unmanagedDeadVictims: '0',
    unmanagedSevereVictims: '0',
    medicalCost: '100.000',
    treatmentSalaryCost: '100.000',
    compensationCost: '100.000',
    workdaysLost: '20',
    assetDamage: '0',
    subsidyTotalAccidents: '1',
    subsidyFatalAccidents: '1',
    subsidyMultiVictimAccidents: '1',
    subsidyTotalVictims: '10',
    subsidyFemaleVictims: '5',
    subsidyDeadVictims: '5',
    subsidySevereVictims: '10',
    subsidyUnmanagedVictims: '0',
    subsidyUnmanagedFemaleVictims: '0',
    subsidyUnmanagedDeadVictims: '0',
    subsidyUnmanagedSevereVictims: '0',
    subsidyMedicalCost: '10.000.000',
    subsidyTreatmentSalaryCost: '10.000.000',
    subsidyCompensationCost: '10.000.000',
    subsidyWorkdaysLost: '20',
    subsidyAssetDamage: '10.000.000',
    subsidyVictims: '5',
    subsidyCost: '100.000',
  });

  const activeStepIndex = STEPS.findIndex((item) => item.id === step);
  const causeOptions = useMemo(
    () => injuryTypes.map((item) => item.name).filter(Boolean),
    [injuryTypes],
  );
  const injuryFactorOptions = useMemo(
    () => injuryFactors.filter((item) => item.isActive).map((item) => item.name).filter(Boolean),
    [injuryFactors],
  );
  const occupationOptions = useMemo(
    () => occupations.map((item) => item.name).filter(Boolean),
    [occupations],
  );
  const totalCost = useMemo(() => {
    const total =
      parseInteger(form.medicalCost) +
      parseInteger(form.treatmentSalaryCost) +
      parseInteger(form.compensationCost);

    return formatVndNumber(String(total));
  }, [form.medicalCost, form.treatmentSalaryCost, form.compensationCost]);
  const subsidyDamageTotal = useMemo(() => {
    const total =
      parseInteger(form.subsidyMedicalCost) +
      parseInteger(form.subsidyTreatmentSalaryCost) +
      parseInteger(form.subsidyCompensationCost);

    return formatVndNumber(String(total));
  }, [form.subsidyMedicalCost, form.subsidyTreatmentSalaryCost, form.subsidyCompensationCost]);
  const reviewDamageTotals = useMemo(
    () => ({
      workdaysLost: parseInteger(form.workdaysLost) + parseInteger(form.subsidyWorkdaysLost),
      totalCost: formatVndNumber(String(parseInteger(totalCost) + parseInteger(subsidyDamageTotal))),
      medicalCost: formatVndNumber(String(parseInteger(form.medicalCost) + parseInteger(form.subsidyMedicalCost))),
      treatmentSalaryCost: formatVndNumber(String(parseInteger(form.treatmentSalaryCost) + parseInteger(form.subsidyTreatmentSalaryCost))),
      compensationCost: formatVndNumber(String(parseInteger(form.compensationCost) + parseInteger(form.subsidyCompensationCost))),
      assetDamage: formatVndNumber(String(parseInteger(form.assetDamage) + parseInteger(form.subsidyAssetDamage))),
    }),
    [
      form.assetDamage,
      form.compensationCost,
      form.medicalCost,
      form.subsidyAssetDamage,
      form.subsidyCompensationCost,
      form.subsidyMedicalCost,
      form.subsidyTreatmentSalaryCost,
      form.subsidyWorkdaysLost,
      form.treatmentSalaryCost,
      form.workdaysLost,
      subsidyDamageTotal,
      totalCost,
    ],
  );
  const accidentCount = parseInteger(form.totalAccidents);
  const activeAccidentDetails = useMemo(
    () => Array.from({ length: accidentCount }, (_, index) => accidentDetails[index] ?? createAccidentDetail(index)),
    [accidentCount, accidentDetails],
  );
  const accidentOverviewMetrics = useMemo<ReviewMetricValues>(
    () => [
      parseInteger(form.totalAccidents),
      parseInteger(form.fatalAccidents),
      parseInteger(form.multiVictimAccidents),
      parseInteger(form.totalVictims),
      parseInteger(form.unmanagedVictims),
      parseInteger(form.femaleVictims),
      parseInteger(form.unmanagedFemaleVictims),
      parseInteger(form.deadVictims),
      parseInteger(form.unmanagedDeadVictims),
      parseInteger(form.severeVictims),
      parseInteger(form.unmanagedSevereVictims),
    ],
    [
      form.deadVictims,
      form.fatalAccidents,
      form.femaleVictims,
      form.multiVictimAccidents,
      form.severeVictims,
      form.totalAccidents,
      form.totalVictims,
      form.unmanagedDeadVictims,
      form.unmanagedFemaleVictims,
      form.unmanagedSevereVictims,
      form.unmanagedVictims,
    ],
  );
  const subsidyMetrics = useMemo<ReviewMetricValues>(
    () => [
      parseInteger(form.subsidyTotalAccidents),
      parseInteger(form.subsidyFatalAccidents),
      parseInteger(form.subsidyMultiVictimAccidents),
      parseInteger(form.subsidyTotalVictims),
      parseInteger(form.subsidyUnmanagedVictims),
      parseInteger(form.subsidyFemaleVictims),
      parseInteger(form.subsidyUnmanagedFemaleVictims),
      parseInteger(form.subsidyDeadVictims),
      parseInteger(form.subsidyUnmanagedDeadVictims),
      parseInteger(form.subsidySevereVictims),
      parseInteger(form.subsidyUnmanagedSevereVictims),
    ],
    [
      form.subsidyDeadVictims,
      form.subsidyFatalAccidents,
      form.subsidyFemaleVictims,
      form.subsidyMultiVictimAccidents,
      form.subsidySevereVictims,
      form.subsidyTotalAccidents,
      form.subsidyTotalVictims,
      form.subsidyUnmanagedDeadVictims,
      form.subsidyUnmanagedFemaleVictims,
      form.subsidyUnmanagedSevereVictims,
      form.subsidyUnmanagedVictims,
    ],
  );
  const reviewTotalMetrics = useMemo(
    () => addReviewMetrics(accidentOverviewMetrics, subsidyMetrics),
    [accidentOverviewMetrics, subsidyMetrics],
  );
  const reviewEmployerCauseRows = useMemo(
    () => buildFixedReviewRows(activeAccidentDetails, 'cause', REVIEW_EMPLOYER_CAUSES),
    [activeAccidentDetails],
  );
  const reviewEmployeeCauseRows = useMemo(
    () => buildFixedReviewRows(activeAccidentDetails, 'cause', REVIEW_EMPLOYEE_CAUSES),
    [activeAccidentDetails],
  );
  const reviewOtherCauseRows = useMemo<ReviewSummaryRow[]>(
    () => [],
    [],
  );
  const reviewInjuryFactorRows = useMemo(
    () => buildFixedReviewRows(activeAccidentDetails, 'injuryFactor', DEFAULT_INJURY_FACTORS.map(f => ({ code: f.id, label: f.name }))),
    [activeAccidentDetails],
  );
  const reviewOccupationRows = useMemo(
    () => buildFixedReviewRows(activeAccidentDetails, 'occupation', DEFAULT_OCCUPATIONS.map(o => ({ code: o.code, label: o.name }))),
    [activeAccidentDetails],
  );

  const hasAccidentDetailErrors = activeAccidentDetails.some((detail) =>
    Object.values(getAccidentDetailErrors(detail)).some(Boolean),
  );
  const accidentDetailSummaryErrors = useMemo(() => {
    if (accidentCount === 0) return [];

    const checks = [
      { label: 'Tổng số vụ', total: parseInteger(form.totalAccidents), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'totalAccidents') },
      { label: 'Tổng số vụ có người chết', total: parseInteger(form.fatalAccidents), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'fatalAccidents') },
      { label: 'Tổng số vụ có từ 2 người bị nạn trở lên', total: parseInteger(form.multiVictimAccidents), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'multiVictimAccidents') },
      { label: 'Tổng số người bị nạn', total: parseInteger(form.totalVictims), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'totalVictims') },
      { label: 'Tổng số lao động nữ bị nạn', total: parseInteger(form.femaleVictims), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'femaleVictims') },
      { label: 'Tổng số người bị chết', total: parseInteger(form.deadVictims), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'deadVictims') },
      { label: 'Tổng số người bị thương nặng', total: parseInteger(form.severeVictims), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'severeVictims') },
      { label: 'Số người bị nạn không QL', total: parseInteger(form.unmanagedVictims), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'unmanagedVictims') },
      { label: 'Lao động nữ bị nạn không QL', total: parseInteger(form.unmanagedFemaleVictims), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'unmanagedFemaleVictims') },
      { label: 'Số người chết không QL', total: parseInteger(form.unmanagedDeadVictims), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'unmanagedDeadVictims') },
      { label: 'Người bị thương nặng không QL', total: parseInteger(form.unmanagedSevereVictims), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'unmanagedSevereVictims') },
      { label: 'Chi phí y tế', total: parseInteger(form.medicalCost), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'medicalCost'), money: true },
      { label: 'Chi phí trả lương trong thời gian điều trị', total: parseInteger(form.treatmentSalaryCost), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'treatmentSalaryCost'), money: true },
      { label: 'Chi phí bồi thường trợ cấp', total: parseInteger(form.compensationCost), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'compensationCost'), money: true },
      { label: 'Tổng số tiền chi phí', total: parseInteger(totalCost), detailTotal: sumAccidentDetailTotalCost(activeAccidentDetails), money: true },
      { label: 'Tổng số ngày nghỉ vì TNLĐ', total: parseInteger(form.workdaysLost), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'workdaysLost') },
      { label: 'Thiệt hại tài sản', total: parseInteger(form.assetDamage), detailTotal: sumAccidentDetailField(activeAccidentDetails, 'assetDamage'), money: true },
    ];

    return checks.filter((item) => item.total !== item.detailTotal);
  }, [
    accidentCount,
    activeAccidentDetails,
    form.assetDamage,
    form.compensationCost,
    form.deadVictims,
    form.fatalAccidents,
    form.femaleVictims,
    form.medicalCost,
    form.multiVictimAccidents,
    form.severeVictims,
    form.totalAccidents,
    form.totalVictims,
    form.treatmentSalaryCost,
    form.unmanagedDeadVictims,
    form.unmanagedFemaleVictims,
    form.unmanagedSevereVictims,
    form.unmanagedVictims,
    form.workdaysLost,
    totalCost,
  ]);
  const totalEmployeesError = getRequiredIntegerError(form.totalEmployees);
  const femaleEmployeesError = firstError(
    getRequiredIntegerError(form.femaleEmployees),
    parseInteger(form.femaleEmployees) > parseInteger(form.totalEmployees)
      ? 'Tổng số lao động nữ phải nhỏ hơn hoặc bằng tổng số lao động của cơ sở'
      : '',
  );
  const payrollError = getRequiredMoneyError(form.payroll);

  const totalAccidentsError = getRequiredIntegerError(form.totalAccidents);
  const fatalAccidentsError = firstError(
    getRequiredIntegerError(form.fatalAccidents),
    parseInteger(form.fatalAccidents) > parseInteger(form.totalAccidents)
      ? 'Tổng số vụ có người chết phải nhỏ hơn hoặc bằng Tổng số vụ TNLD'
      : '',
  );
  const multiVictimAccidentsError = firstError(
    getRequiredIntegerError(form.multiVictimAccidents),
    parseInteger(form.multiVictimAccidents) > parseInteger(form.totalAccidents)
      ? 'Tổng số vụ có từ 2 người bị nạn trở lên phải nhỏ hơn hoặc bằng Tổng số vụ TNLD'
      : '',
  );
  const totalVictimsError = getRequiredIntegerError(form.totalVictims);
  const femaleVictimsError = firstError(
    getRequiredIntegerError(form.femaleVictims),
    parseInteger(form.femaleVictims) > parseInteger(form.totalVictims)
      ? 'Tổng số lao động nữ bị nạn phải nhỏ hơn hoặc bằng Tổng số người bị nạn'
      : '',
  );
  const deadVictimsError = firstError(
    getRequiredIntegerError(form.deadVictims),
    parseInteger(form.deadVictims) > parseInteger(form.totalVictims)
      ? 'Tổng số người bị chết phải nhỏ hơn hoặc bằng Tổng số người bị nạn'
      : '',
  );
  const severeVictimsError = firstError(
    getRequiredIntegerError(form.severeVictims),
    parseInteger(form.severeVictims) > parseInteger(form.totalVictims)
      ? 'Số người bị thương nặng phải nhỏ hơn hoặc bằng Tổng số người bị nạn'
      : '',
  );
  const unmanagedVictimsError = firstError(
    getRequiredIntegerError(form.unmanagedVictims),
    parseInteger(form.unmanagedVictims) > parseInteger(form.totalVictims)
      ? 'Số người bị nạn không QL phải nhỏ hơn hoặc bằng Tổng số người bị nạn'
      : '',
  );
  const unmanagedFemaleVictimsError = firstError(
    getRequiredIntegerError(form.unmanagedFemaleVictims),
    parseInteger(form.unmanagedFemaleVictims) > parseInteger(form.unmanagedVictims)
      ? 'Lao động nữ bị nạn không QL phải nhỏ hơn hoặc bằng Số người bị nạn không QL'
      : '',
  );
  const unmanagedDeadVictimsError = firstError(
    getRequiredIntegerError(form.unmanagedDeadVictims),
    parseInteger(form.unmanagedDeadVictims) > parseInteger(form.unmanagedVictims)
      ? 'Số người chết không QL phải nhỏ hơn hoặc bằng Số người bị nạn không QL'
      : '',
  );
  const unmanagedSevereVictimsError = firstError(
    getRequiredIntegerError(form.unmanagedSevereVictims),
    parseInteger(form.unmanagedSevereVictims) > parseInteger(form.unmanagedVictims)
      ? 'Người bị thương nặng không QL phải nhỏ hơn hoặc bằng Số người bị nạn không QL'
      : '',
  );
  const medicalCostError = getRequiredMoneyError(form.medicalCost);
  const treatmentSalaryCostError = getRequiredMoneyError(form.treatmentSalaryCost);
  const compensationCostError = getRequiredMoneyError(form.compensationCost);
  const workdaysLostError = getRequiredIntegerError(form.workdaysLost);
  const assetDamageError = getRequiredMoneyError(form.assetDamage);

  const subsidyTotalAccidentsError = getRequiredIntegerError(form.subsidyTotalAccidents);
  const subsidyFatalAccidentsError = firstError(
    getRequiredIntegerError(form.subsidyFatalAccidents),
    parseInteger(form.subsidyFatalAccidents) > parseInteger(form.subsidyTotalAccidents)
      ? 'Tổng số vụ có người chết phải nhỏ hơn hoặc bằng Tổng số vụ TNLD'
      : '',
  );
  const subsidyMultiVictimAccidentsError = firstError(
    getRequiredIntegerError(form.subsidyMultiVictimAccidents),
    parseInteger(form.subsidyMultiVictimAccidents) > parseInteger(form.subsidyTotalAccidents)
      ? 'Tổng số vụ có từ 2 người bị nạn trở lên phải nhỏ hơn hoặc bằng Tổng số vụ TNLD'
      : '',
  );
  const subsidyTotalVictimsError = getRequiredIntegerError(form.subsidyTotalVictims);
  const subsidyFemaleVictimsError = firstError(
    getRequiredIntegerError(form.subsidyFemaleVictims),
    parseInteger(form.subsidyFemaleVictims) > parseInteger(form.subsidyTotalVictims)
      ? 'Tổng số lao động nữ bị nạn phải nhỏ hơn hoặc bằng Tổng số người bị nạn'
      : '',
  );
  const subsidyDeadVictimsError = firstError(
    getRequiredIntegerError(form.subsidyDeadVictims),
    parseInteger(form.subsidyDeadVictims) > parseInteger(form.subsidyTotalVictims)
      ? 'Tổng số người bị chết phải nhỏ hơn hoặc bằng Tổng số người bị nạn'
      : '',
  );
  const subsidySevereVictimsError = firstError(
    getRequiredIntegerError(form.subsidySevereVictims),
    parseInteger(form.subsidySevereVictims) > parseInteger(form.subsidyTotalVictims)
      ? 'Số người bị thương nặng phải nhỏ hơn hoặc bằng Tổng số người bị nạn'
      : '',
  );
  const subsidyUnmanagedVictimsError = firstError(
    getRequiredIntegerError(form.subsidyUnmanagedVictims),
    parseInteger(form.subsidyUnmanagedVictims) > parseInteger(form.subsidyTotalVictims)
      ? 'Số người bị nạn không QL phải nhỏ hơn hoặc bằng Tổng số người bị nạn'
      : '',
  );
  const subsidyUnmanagedFemaleVictimsError = firstError(
    getRequiredIntegerError(form.subsidyUnmanagedFemaleVictims),
    parseInteger(form.subsidyUnmanagedFemaleVictims) > parseInteger(form.subsidyUnmanagedVictims)
      ? 'Lao động nữ bị nạn không QL phải nhỏ hơn hoặc bằng Số người bị nạn không QL'
      : '',
  );
  const subsidyUnmanagedDeadVictimsError = firstError(
    getRequiredIntegerError(form.subsidyUnmanagedDeadVictims),
    parseInteger(form.subsidyUnmanagedDeadVictims) > parseInteger(form.subsidyUnmanagedVictims)
      ? 'Số người chết không QL phải nhỏ hơn hoặc bằng Số người bị nạn không QL'
      : '',
  );
  const subsidyUnmanagedSevereVictimsError = firstError(
    getRequiredIntegerError(form.subsidyUnmanagedSevereVictims),
    parseInteger(form.subsidyUnmanagedSevereVictims) > parseInteger(form.subsidyUnmanagedVictims)
      ? 'Người bị thương nặng không QL phải nhỏ hơn hoặc bằng Số người bị nạn không QL'
      : '',
  );
  const subsidyMedicalCostError = getRequiredMoneyError(form.subsidyMedicalCost);
  const subsidyTreatmentSalaryCostError = getRequiredMoneyError(form.subsidyTreatmentSalaryCost);
  const subsidyCompensationCostError = getRequiredMoneyError(form.subsidyCompensationCost);
  const subsidyWorkdaysLostError = getRequiredIntegerError(form.subsidyWorkdaysLost);
  const subsidyAssetDamageError = getRequiredMoneyError(form.subsidyAssetDamage);
  const companyStepErrors = [totalEmployeesError, femaleEmployeesError, payrollError];
  const accidentOverviewErrors = [
    totalAccidentsError,
    fatalAccidentsError,
    multiVictimAccidentsError,
    totalVictimsError,
    femaleVictimsError,
    deadVictimsError,
    severeVictimsError,
    unmanagedVictimsError,
    unmanagedFemaleVictimsError,
    unmanagedDeadVictimsError,
    unmanagedSevereVictimsError,
    medicalCostError,
    treatmentSalaryCostError,
    compensationCostError,
    workdaysLostError,
    assetDamageError,
  ];
  const subsidyStepErrors = [
    subsidyTotalAccidentsError,
    subsidyFatalAccidentsError,
    subsidyMultiVictimAccidentsError,
    subsidyTotalVictimsError,
    subsidyFemaleVictimsError,
    subsidyDeadVictimsError,
    subsidySevereVictimsError,
    subsidyUnmanagedVictimsError,
    subsidyUnmanagedFemaleVictimsError,
    subsidyUnmanagedDeadVictimsError,
    subsidyUnmanagedSevereVictimsError,
    subsidyMedicalCostError,
    subsidyTreatmentSalaryCostError,
    subsidyCompensationCostError,
    subsidyWorkdaysLostError,
    subsidyAssetDamageError,
  ];
  const hasCurrentStepError =
    (step === 'company' && companyStepErrors.some(Boolean)) ||
    (step === 'accident' &&
      accidentTab === 'overview' &&
      accidentOverviewErrors.some(Boolean)) ||
    (step === 'accident' &&
      accidentTab === 'details' &&
      (hasAccidentDetailErrors || accidentDetailSummaryErrors.length > 0)) ||
    (step === 'subsidy' &&
      subsidyStepErrors.some(Boolean));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reportId = window.location.pathname.split('/').filter(Boolean).at(-1) || '';
    const yearFromReportId = reportId.match(/^\d{4}/)?.[0];
    const stepFromUrl = params.get('step');
    const isViewMode = params.get('mode') === 'view';

    if (yearFromReportId) setReportYear(yearFromReportId);
    setReadOnly(isViewMode);

    if (!isViewMode) {
      try {
        const rawDraft = localStorage.getItem(getTnldDraftKey());
        const parsedDraft = rawDraft ? (JSON.parse(rawDraft) as TnldDraftPayload) : null;

        if (parsedDraft?.form && typeof parsedDraft.form === 'object') {
          setForm((current) => ({ ...current, ...parsedDraft.form }));
        }

        if (Array.isArray(parsedDraft?.accidentDetails)) {
          const validDetails = parsedDraft.accidentDetails.filter(isDraftAccidentDetail);
          if (validDetails.length > 0) setAccidentDetails(validDetails);
        }

        if (typeof parsedDraft?.uploadedFile === 'string') setUploadedFile(parsedDraft.uploadedFile);
        if (typeof parsedDraft?.reportRecordId === 'number') setSavedReportId(parsedDraft.reportRecordId);
        if (parsedDraft?.reportYear) setReportYear(parsedDraft.reportYear);
        const draftStep = parsedDraft?.step ?? null;
        if (!isStepId(stepFromUrl) && isStepId(draftStep)) {
          setStep(draftStep);
        }
        if (isAccidentTab(parsedDraft?.accidentTab)) setAccidentTab(parsedDraft.accidentTab);
      } catch {
        localStorage.removeItem(getTnldDraftKey());
      }
    }

    if (isStepId(stepFromUrl)) setStep(stepFromUrl);
    draftHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!draftHydratedRef.current || readOnly) return;

    const draft: TnldDraftPayload = {
      form,
      accidentDetails,
      uploadedFile,
      reportRecordId: savedReportId ?? undefined,
      reportYear,
      step,
      accidentTab,
    };

    localStorage.setItem(getTnldDraftKey(), JSON.stringify(draft));
  }, [accidentDetails, accidentTab, form, readOnly, reportYear, savedReportId, step, uploadedFile]);

  useEffect(() => {
    async function loadReportById() {
      const reportId = window.location.pathname.split('/').filter(Boolean).at(-1) || '';
      if (!/^\d+$/.test(reportId) || !BASE_URL) return;

      try {
        const token = getAuthToken();
        const response = await fetch(`${BASE_URL}/tnld-contract-reports/${reportId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await response.json().catch(() => null);

        if (!response.ok || !data) return;

        const overview = data.overview || {};
        const subsidy = data.subsidy || {};
        const toText = (value: unknown) => (value === null || value === undefined ? '' : String(value));
        const toMoneyText = (value: unknown) => {
          if (value === null || value === undefined || value === '') return '';
          const num = Number(value);
          return Number.isFinite(num) ? formatVndNumber(String(Math.round(num))) : '';
        };

        setSavedReportId(Number(data.id));
        setReportYear(String(data.year || reportYear));
        setUploadedFile(data.attachments?.[0]?.fileName || '');
        setForm((current) => ({
          ...current,
          totalEmployees: toText(overview.totalEmployees),
          femaleEmployees: toText(overview.femaleEmployees),
          payroll: toMoneyText(overview.payroll),
          totalAccidents: toText(overview.totalAccidents),
          fatalAccidents: toText(overview.fatalAccidents),
          multiVictimAccidents: toText(overview.multiVictimAccidents),
          totalVictims: toText(overview.totalVictims),
          femaleVictims: toText(overview.femaleVictims),
          deadVictims: toText(overview.deadVictims),
          severeVictims: toText(overview.severeVictims),
          unmanagedVictims: toText(overview.unmanagedVictims),
          unmanagedFemaleVictims: toText(overview.unmanagedFemaleVictims),
          unmanagedDeadVictims: toText(overview.unmanagedDeadVictims),
          unmanagedSevereVictims: toText(overview.unmanagedSevereVictims),
          medicalCost: toMoneyText(overview.medicalCost),
          treatmentSalaryCost: toMoneyText(overview.treatmentSalaryCost),
          compensationCost: toMoneyText(overview.compensationCost),
          workdaysLost: toText(overview.workdaysLost),
          assetDamage: toMoneyText(overview.assetDamage),
          subsidyTotalAccidents: toText(subsidy.totalAccidents),
          subsidyFatalAccidents: toText(subsidy.fatalAccidents),
          subsidyMultiVictimAccidents: toText(subsidy.multiVictimAccidents),
          subsidyTotalVictims: toText(subsidy.totalVictims),
          subsidyFemaleVictims: toText(subsidy.femaleVictims),
          subsidyDeadVictims: toText(subsidy.deadVictims),
          subsidySevereVictims: toText(subsidy.severeVictims),
          subsidyUnmanagedVictims: toText(subsidy.unmanagedVictims),
          subsidyUnmanagedFemaleVictims: toText(subsidy.unmanagedFemaleVictims),
          subsidyUnmanagedDeadVictims: toText(subsidy.unmanagedDeadVictims),
          subsidyUnmanagedSevereVictims: toText(subsidy.unmanagedSevereVictims),
          subsidyMedicalCost: toMoneyText(subsidy.medicalCost),
          subsidyTreatmentSalaryCost: toMoneyText(subsidy.treatmentSalaryCost),
          subsidyCompensationCost: toMoneyText(subsidy.compensationCost),
          subsidyWorkdaysLost: toText(subsidy.workdaysLost),
          subsidyAssetDamage: toMoneyText(subsidy.assetDamage),
        }));

        const mappedDetails = Array.isArray(data.accidentDetails)
          ? data.accidentDetails.map((detail: any, index: number) => ({
              ...createAccidentDetail(index),
              cause: detail.cause || createAccidentDetail(index).cause,
              injuryFactor: detail.injuryFactor || createAccidentDetail(index).injuryFactor,
              occupation: detail.occupation || createAccidentDetail(index).occupation,
              totalAccidents: toText(detail.totalAccidents),
              fatalAccidents: toText(detail.fatalAccidents),
              multiVictimAccidents: toText(detail.multiVictimAccidents),
              totalVictims: toText(detail.totalVictims),
              femaleVictims: toText(detail.femaleVictims),
              deadVictims: toText(detail.deadVictims),
              severeVictims: toText(detail.severeVictims),
              unmanagedVictims: toText(detail.unmanagedVictims),
              unmanagedFemaleVictims: toText(detail.unmanagedFemaleVictims),
              unmanagedDeadVictims: toText(detail.unmanagedDeadVictims),
              unmanagedSevereVictims: toText(detail.unmanagedSevereVictims),
              medicalCost: toMoneyText(detail.medicalCost),
              treatmentSalaryCost: toMoneyText(detail.treatmentSalaryCost),
              compensationCost: toMoneyText(detail.compensationCost),
              workdaysLost: toText(detail.workdaysLost),
              assetDamage: toMoneyText(detail.assetDamage),
            }))
          : [];

        if (mappedDetails.length > 0) {
          setAccidentDetails(mappedDetails);
        }
      } catch {
        // Keep current form values if the saved report cannot be loaded.
      }
    }

    loadReportById();
  }, []);

  useEffect(() => {
    async function loadCurrentEnterprise() {
      const token = getAuthToken();
      if (!token || !BASE_URL) return;

      try {
        const response = await fetch(`${BASE_URL}/enterprises/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;

        const data = await response.json();
        if (typeof data?.id === 'number') setEnterpriseId(data.id);
        setCompanyInfo({
          name: data?.name || '',
          enterpriseType: data?.enterpriseType?.name || '',
          industry: data?.industry
            ? `${data.industry.code ? `${data.industry.code} - ` : ''}${data.industry.name || ''}`.trim()
            : '',
        });
      } catch {
        // Enterprise id is helpful for admin filtering, but the draft can still be saved without it.
      }
    }

    loadCurrentEnterprise();
  }, []);

  useEffect(() => {
    function loadTnldCategories() {
      setInjuryFactors(readStoredCategory<TnldInjuryFactor>('vna_tnld_factors', DEFAULT_INJURY_FACTORS));
      setInjuryTypes(readStoredCategory<TnldHierarchicalCategory>('vna_tnld_types', DEFAULT_INJURY_TYPES));
      setOccupations(readStoredCategory<TnldHierarchicalCategory>('vna_tnld_occs', DEFAULT_OCCUPATIONS));
    }

    loadTnldCategories();
    window.addEventListener('focus', loadTnldCategories);

    return () => {
      window.removeEventListener('focus', loadTnldCategories);
    };
  }, []);

  useEffect(() => {
    setAccidentDetails((current) =>
      current.map((detail, index) => ({
        ...detail,
        cause: causeOptions.includes(detail.cause) ? detail.cause : causeOptions[0] || createAccidentDetail(index).cause,
        injuryFactor: injuryFactorOptions.includes(detail.injuryFactor)
          ? detail.injuryFactor
          : injuryFactorOptions[0] || createAccidentDetail(index).injuryFactor,
        occupation: occupationOptions.includes(detail.occupation)
          ? detail.occupation
          : occupationOptions[0] || createAccidentDetail(index).occupation,
      })),
    );
  }, [causeOptions, injuryFactorOptions, occupationOptions]);

  useEffect(() => {
    setAccidentDetails((current) => {
      if (current.length === accidentCount) return current;
      if (current.length > accidentCount) return current.slice(0, accidentCount);

      return [
        ...current,
        ...Array.from({ length: accidentCount - current.length }, (_, index) =>
          createAccidentDetail(current.length + index),
        ),
      ];
    });
  }, [accidentCount]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateIntegerField(field: keyof typeof form, value: string) {
    updateField(field, sanitizeIntegerInput(value));
  }

  function updateAccidentDetail(index: number, field: keyof AccidentDetail, value: string) {
    setAccidentDetails((current) => {
      const next = [...current];
      next[index] = {
        ...(next[index] ?? createAccidentDetail(index)),
        [field]: value,
      };
      return next;
    });
  }

  function updateAccidentDetailInteger(index: number, field: keyof AccidentDetail, value: string) {
    updateAccidentDetail(index, field, sanitizeIntegerInput(value));
  }

  function goNext() {
    const nextStep = STEPS[activeStepIndex + 1]?.id;
    if (nextStep) setStep(nextStep);
  }

  function goBack() {
    const previousStep = STEPS[activeStepIndex - 1]?.id;
    if (previousStep) setStep(previousStep);
  }

  function toggleAccidentDetail(index: number) {
    setCollapsedAccidentDetails((current) => ({
      ...current,
      [index]: !current[index],
    }));
  }

  function handleContentScroll(event: React.UIEvent<HTMLDivElement>) {
    setShowScrollTop(event.currentTarget.scrollTop > 240);
  }

  function scrollContentToTop() {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function buildReportPayload(status: 'draft' | 'submitted') {
    return {
      enterpriseId: enterpriseId ?? undefined,
      year: Number(reportYear) || new Date().getFullYear(),
      period: getTnldReportPeriodFromPath(),
      status,
      overview: {
        totalEmployees: parseInteger(form.totalEmployees),
        femaleEmployees: parseInteger(form.femaleEmployees),
        payroll: form.payroll,
        totalAccidents: parseInteger(form.totalAccidents),
        fatalAccidents: parseInteger(form.fatalAccidents),
        multiVictimAccidents: parseInteger(form.multiVictimAccidents),
        totalVictims: parseInteger(form.totalVictims),
        femaleVictims: parseInteger(form.femaleVictims),
        deadVictims: parseInteger(form.deadVictims),
        severeVictims: parseInteger(form.severeVictims),
        unmanagedVictims: parseInteger(form.unmanagedVictims),
        unmanagedFemaleVictims: parseInteger(form.unmanagedFemaleVictims),
        unmanagedDeadVictims: parseInteger(form.unmanagedDeadVictims),
        unmanagedSevereVictims: parseInteger(form.unmanagedSevereVictims),
        medicalCost: form.medicalCost,
        treatmentSalaryCost: form.treatmentSalaryCost,
        compensationCost: form.compensationCost,
        workdaysLost: parseInteger(form.workdaysLost),
        assetDamage: form.assetDamage,
      },
      accidentDetails: activeAccidentDetails.map((detail, index) => ({
        sortOrder: index + 1,
        cause: detail.cause,
        injuryFactor: detail.injuryFactor,
        occupation: detail.occupation,
        totalAccidents: parseInteger(detail.totalAccidents),
        fatalAccidents: parseInteger(detail.fatalAccidents),
        multiVictimAccidents: parseInteger(detail.multiVictimAccidents),
        totalVictims: parseInteger(detail.totalVictims),
        femaleVictims: parseInteger(detail.femaleVictims),
        deadVictims: parseInteger(detail.deadVictims),
        severeVictims: parseInteger(detail.severeVictims),
        unmanagedVictims: parseInteger(detail.unmanagedVictims),
        unmanagedFemaleVictims: parseInteger(detail.unmanagedFemaleVictims),
        unmanagedDeadVictims: parseInteger(detail.unmanagedDeadVictims),
        unmanagedSevereVictims: parseInteger(detail.unmanagedSevereVictims),
        medicalCost: detail.medicalCost,
        treatmentSalaryCost: detail.treatmentSalaryCost,
        compensationCost: detail.compensationCost,
        workdaysLost: parseInteger(detail.workdaysLost),
        assetDamage: detail.assetDamage,
      })),
      subsidy: {
        totalAccidents: parseInteger(form.subsidyTotalAccidents),
        fatalAccidents: parseInteger(form.subsidyFatalAccidents),
        multiVictimAccidents: parseInteger(form.subsidyMultiVictimAccidents),
        totalVictims: parseInteger(form.subsidyTotalVictims),
        femaleVictims: parseInteger(form.subsidyFemaleVictims),
        deadVictims: parseInteger(form.subsidyDeadVictims),
        severeVictims: parseInteger(form.subsidySevereVictims),
        unmanagedVictims: parseInteger(form.subsidyUnmanagedVictims),
        unmanagedFemaleVictims: parseInteger(form.subsidyUnmanagedFemaleVictims),
        unmanagedDeadVictims: parseInteger(form.subsidyUnmanagedDeadVictims),
        unmanagedSevereVictims: parseInteger(form.subsidyUnmanagedSevereVictims),
        medicalCost: form.subsidyMedicalCost,
        treatmentSalaryCost: form.subsidyTreatmentSalaryCost,
        compensationCost: form.subsidyCompensationCost,
        totalCost: subsidyDamageTotal,
        workdaysLost: parseInteger(form.subsidyWorkdaysLost),
        assetDamage: form.subsidyAssetDamage,
        note: 'Không',
      },
      attachments: uploadedFile
        ? [
            {
              fileName: uploadedFile,
              mimeType: 'application/pdf',
            },
          ]
        : [],
    };
  }

  async function saveReport(status: 'draft' | 'submitted') {
    if (isSavingReport || hasCurrentStepError) return;

    setIsSavingReport(true);
    setSaveMessage('');

    try {
      const response = await fetch(
        savedReportId ? `${BASE_URL}/tnld-contract-reports/${savedReportId}` : `${BASE_URL}/tnld-contract-reports`,
        {
          method: savedReportId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildReportPayload(status)),
        },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || 'Không lưu được báo cáo');
      }

      if (typeof data?.id === 'number') setSavedReportId(data.id);
      setSaveMessage(status === 'submitted' ? 'Đã gửi báo cáo' : 'Đã lưu nháp');

      if (status === 'submitted') {
        localStorage.removeItem(getTnldDraftKey());
        router.push('/enterprise/tnld-hdld');
      }
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : 'Lỗi kết nối backend');
    } finally {
      setIsSavingReport(false);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100 text-gray-900">
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/enterprise/tnld-hdld')}
              className="rounded p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              aria-label="Quay lại"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="truncate text-base font-semibold text-gray-900">Báo cáo định kỳ Tai nạn lao động</h1>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={reportYear}
              disabled
              className="h-8 cursor-not-allowed rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-500 outline-none"
              aria-label="Năm báo cáo"
            >
              <option value={reportYear}>{reportYear}</option>
            </select>
            <button
              type="button"
              onClick={() => setShowCancelDialog(true)}
              className="h-8 rounded-md px-3 text-sm font-medium text-gray-500 transition hover:bg-gray-100"
            >
              Hủy bỏ
            </button>
            {!readOnly && (
              <>
                <button
                  type="button"
                  onClick={step === 'review' ? () => saveReport('submitted') : goNext}
                  disabled={(step === 'review' && !uploadedFile) || hasCurrentStepError || isSavingReport}
                  className="inline-flex h-8 items-center gap-2 rounded-md border border-blue-600 bg-white px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-blue-200 disabled:text-blue-300"
                >
                  {step === 'review' ? (
                    <>
                      <Send size={15} />
                      Gửi báo cáo
                    </>
                  ) : (
                    <>
                      <ChevronRight size={16} />
                      Tiếp tục
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => saveReport('draft')}
                  disabled={hasCurrentStepError || isSavingReport}
                  className="inline-flex h-8 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <Save size={15} />
                  {isSavingReport ? 'Đang lưu' : 'Lưu'}
                </button>
              </>
            )}
          </div>
        </header>

        <div ref={contentRef} onScroll={handleContentScroll} className="relative flex-1 overflow-y-auto p-4">
          {saveMessage && (
            <div
              className={`mb-3 rounded-md border px-4 py-2 text-sm font-medium ${
                saveMessage.includes('Đã')
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-600'
              }`}
            >
              {saveMessage}
            </div>
          )}

          <div className="mb-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <label className="relative block w-full max-w-[560px]">
                <span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[11px] font-medium text-gray-500">
                  Chọn mục báo cáo
                </span>
                <select
                  value={step}
                  onChange={(event) => setStep(event.target.value as StepId)}
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {STEPS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {step === 'company' && (
            <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
              <SectionTitle
                hint="*** Lưu ý: nhập tổng quỹ lương 6 tháng khi khai báo TNLD 6 tháng hoặc tổng quỹ lương 12 tháng khi khai báo TNLD cả năm"
                hintClassName="mt-4 text-sm font-semibold text-red-500"
              >
                1. Thông tin công ty
              </SectionTitle>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <Field label="Tên công ty" value={companyInfo.name} placeholder="Chưa có thông tin doanh nghiệp" readOnly />
                <Field label="Loại hình công ty" value={companyInfo.enterpriseType} placeholder="Chưa có loại hình công ty" readOnly />
                <Field label="Ngành nghề kinh doanh" value={companyInfo.industry} placeholder="Chưa có ngành nghề kinh doanh" readOnly />
                <Field
                  label="Tổng số lao động của cơ sở"
                  required
                  value={form.totalEmployees}
                  error={totalEmployeesError}
                  onChange={(value) => updateIntegerField('totalEmployees', value)}
                />
                <Field
                  label="Tổng số lao động nữ"
                  required
                  value={form.femaleEmployees}
                  error={femaleEmployeesError}
                  onChange={(value) => updateIntegerField('femaleEmployees', value)}
                />
                <Field
                  label="Tổng quỹ lương"
                  required
                  value={form.payroll}
                  error={payrollError}
                  readOnly={readOnly}
                  suffix="VNĐ"
                  onChange={(value) => updateField('payroll', formatMoneyInput(value))}
                />
              </div>
            </section>
          )}

          {step === 'accident' && (
            <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
              <SectionTitle hint="Doanh nghiệp kê khai số liệu tai nạn lao động và chi tiết từng vụ phát sinh trong kỳ báo cáo.">
                2. Tai nạn lao động
              </SectionTitle>

              <div className="mb-5 flex border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setAccidentTab('overview')}
                  className={`border-b-2 px-4 py-2 text-sm font-semibold ${
                    accidentTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
                  }`}
                >
                  (1) Tổng số vụ tai nạn lao động
                </button>
                <button
                  type="button"
                  onClick={() => setAccidentTab('details')}
                  className={`border-b-2 px-4 py-2 text-sm font-semibold ${
                    accidentTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
                  }`}
                >
                  (2) Chi tiết các vụ tai nạn lao động
                </button>
              </div>

              {accidentTab === 'overview' ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-sm font-bold text-gray-900">1. Tổng số vụ tai nạn lao động & số nạn nhân tai nạn lao động</h3>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                      <Field
                        label="Tổng số vụ"
                        required
                        value={form.totalAccidents}
                        error={totalAccidentsError}
                        onChange={(value) => updateIntegerField('totalAccidents', value)}
                      />
                      <Field
                        label="Tổng số vụ có người chết"
                        required
                        value={form.fatalAccidents}
                        error={fatalAccidentsError}
                        onChange={(value) => updateIntegerField('fatalAccidents', value)}
                      />
                      <Field
                        label="Tổng số vụ có từ 2 người bị nạn trở lên"
                        required
                        value={form.multiVictimAccidents}
                        error={multiVictimAccidentsError}
                        onChange={(value) => updateIntegerField('multiVictimAccidents', value)}
                      />
                      </div>
                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                      <Field
                        label="Tổng số người bị nạn"
                        required
                        value={form.totalVictims}
                        error={totalVictimsError}
                        onChange={(value) => updateIntegerField('totalVictims', value)}
                      />
                      <Field
                        label="Tổng số lao động nữ bị nạn"
                        required
                        value={form.femaleVictims}
                        error={femaleVictimsError}
                        onChange={(value) => updateIntegerField('femaleVictims', value)}
                      />
                      <Field
                        label="Tổng số người bị chết"
                        required
                        value={form.deadVictims}
                        error={deadVictimsError}
                        onChange={(value) => updateIntegerField('deadVictims', value)}
                      />
                      <Field
                        label="Tổng số người bị thương nặng"
                        required
                        value={form.severeVictims}
                        error={severeVictimsError}
                        onChange={(value) => updateIntegerField('severeVictims', value)}
                      />
                      </div>
                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                      <Field
                        label="Số người bị nạn không QL"
                        required
                        value={form.unmanagedVictims}
                        error={unmanagedVictimsError}
                        onChange={(value) => updateIntegerField('unmanagedVictims', value)}
                      />
                      <Field
                        label="Lao động nữ bị nạn không QL"
                        required
                        value={form.unmanagedFemaleVictims}
                        error={unmanagedFemaleVictimsError}
                        onChange={(value) => updateIntegerField('unmanagedFemaleVictims', value)}
                      />
                      <Field
                        label="Số người chết không QL"
                        required
                        value={form.unmanagedDeadVictims}
                        error={unmanagedDeadVictimsError}
                        onChange={(value) => updateIntegerField('unmanagedDeadVictims', value)}
                      />
                      <Field
                        label="Người bị thương nặng không QL"
                        required
                        value={form.unmanagedSevereVictims}
                        error={unmanagedSevereVictimsError}
                        onChange={(value) => updateIntegerField('unmanagedSevereVictims', value)}
                      />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-sm font-bold text-gray-900">2. Thiệt hại do tai nạn lao động</h3>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                      <Field label="Chi phí y tế" required value={form.medicalCost} error={medicalCostError} suffix="(1.000đ)" onChange={(value) => updateField('medicalCost', formatMoneyInput(value))} />
                      <Field label="Chi phí trả lương trong thời gian điều trị" required value={form.treatmentSalaryCost} error={treatmentSalaryCostError} suffix="(1.000đ)" onChange={(value) => updateField('treatmentSalaryCost', formatMoneyInput(value))} />
                      <Field label="Chi phí bồi thường trợ cấp" required value={form.compensationCost} error={compensationCostError} suffix="(1.000đ)" onChange={(value) => updateField('compensationCost', formatMoneyInput(value))} />
                      <Field label="Tổng số tiền chi phí" required value={totalCost} suffix="(1.000đ)" readOnly />
                      <Field label="Tổng số ngày nghỉ vì TNLD" required value={form.workdaysLost} error={workdaysLostError} onChange={(value) => updateIntegerField('workdaysLost', value)} />
                      <Field label="Thiệt hại tài sản" required value={form.assetDamage} error={assetDamageError} suffix="(1.000đ)" onChange={(value) => updateField('assetDamage', formatMoneyInput(value))} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {accidentCount === 0 ? (
                    <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center text-sm font-medium text-gray-500">
                      Chưa có vụ tai nạn lao động để khai báo chi tiết.
                    </div>
                  ) : (
                    <>
                      {accidentDetailSummaryErrors.length > 0 && (
                        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
                          <p className="mb-2 text-sm font-semibold text-red-600">
                            Tổng số liệu trong các form chi tiết phải bằng số liệu ở mục tổng quan.
                          </p>
                          <div className="grid grid-cols-1 gap-2 text-xs text-red-600 md:grid-cols-2">
                            {accidentDetailSummaryErrors.map((error) => (
                              <div key={error.label} className="rounded border border-red-100 bg-white px-3 py-2">
                                <span className="font-semibold">{error.label}:</span>{' '}
                                chi tiết đang là{' '}
                                <span className="font-semibold">
                                  {error.money ? formatVndNumber(String(error.detailTotal)) : error.detailTotal}
                                </span>
                                , tổng quan là{' '}
                                <span className="font-semibold">
                                  {error.money ? formatVndNumber(String(error.total)) : error.total}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeAccidentDetails.map((detail, index) => {
                      const item = index + 1;
                      const isCollapsed = collapsedAccidentDetails[item] === true;
                      const detailErrors = getAccidentDetailErrors(detail);

                      return (
                        <div key={item} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <p className="mb-4 text-sm font-semibold text-gray-800">
                            **** Doanh nghiệp xảy ra tai nạn lao động vui lòng nhập theo từng bước
                          </p>

                          <button
                            type="button"
                            onClick={() => toggleAccidentDetail(item)}
                            className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900 transition hover:text-blue-600"
                            aria-expanded={!isCollapsed}
                          >
                            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                            Chi tiết vụ tai nạn số {item}
                          </button>

                          {!isCollapsed && (
                            <>
                              <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                                <SelectField
                                  label="1. Phân theo nguyên nhân xảy ra TNLĐ"
                                  value={detail.cause}
                                  options={causeOptions}
                                  disabled={readOnly}
                                  onChange={(value) => updateAccidentDetail(index, 'cause', value)}
                                />
                                <SelectField
                                  label="2. Phân theo yếu tố gây chấn thương"
                                  value={detail.injuryFactor}
                                  options={injuryFactorOptions}
                                  disabled={readOnly}
                                  onChange={(value) => updateAccidentDetail(index, 'injuryFactor', value)}
                                />
                              </div>

                              <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                                <SelectField
                                  label="3. Phân theo nghề nghiệp"
                                  value={detail.occupation}
                                  options={occupationOptions}
                                  disabled={readOnly}
                                  onChange={(value) => updateAccidentDetail(index, 'occupation', value)}
                                />
                              </div>

                              <div className="mb-5">
                                <h4 className="mb-4 text-sm font-bold text-gray-900">4. Chi tiết vụ tai nạn số {item}</h4>
                                <div className="space-y-5">
                                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                                    <Field
                                      label="Tổng số vụ"
                                      required
                                      value={detail.totalAccidents}
                                      error={detailErrors.totalAccidents}
                                      onChange={(value) => updateAccidentDetailInteger(index, 'totalAccidents', value)}
                                    />
                                    <Field
                                      label="Tổng số vụ có người chết"
                                      required
                                      value={detail.fatalAccidents}
                                      error={detailErrors.fatalAccidents}
                                      onChange={(value) => updateAccidentDetailInteger(index, 'fatalAccidents', value)}
                                    />
                                    <Field
                                      label="Tổng số vụ có 2 người bị nạn trở lên"
                                      required
                                      value={detail.multiVictimAccidents}
                                      error={detailErrors.multiVictimAccidents}
                                      onChange={(value) => updateAccidentDetailInteger(index, 'multiVictimAccidents', value)}
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                                    <Field
                                      label="Tổng số người bị nạn"
                                      required
                                      value={detail.totalVictims}
                                      error={detailErrors.totalVictims}
                                      onChange={(value) => updateAccidentDetailInteger(index, 'totalVictims', value)}
                                    />
                                    <Field
                                      label="Tổng số lao động nữ bị nạn"
                                      required
                                      value={detail.femaleVictims}
                                      error={detailErrors.femaleVictims}
                                      onChange={(value) => updateAccidentDetailInteger(index, 'femaleVictims', value)}
                                    />
                                    <Field
                                      label="Tổng số người bị chết"
                                      required
                                      value={detail.deadVictims}
                                      error={detailErrors.deadVictims}
                                      onChange={(value) => updateAccidentDetailInteger(index, 'deadVictims', value)}
                                    />
                                    <Field
                                      label="Tổng số người bị thương nặng"
                                      required
                                      value={detail.severeVictims}
                                      error={detailErrors.severeVictims}
                                      onChange={(value) => updateAccidentDetailInteger(index, 'severeVictims', value)}
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                                    <Field
                                      label="Số người bị nạn không QL"
                                      required
                                      value={detail.unmanagedVictims}
                                      error={detailErrors.unmanagedVictims}
                                      onChange={(value) => updateAccidentDetailInteger(index, 'unmanagedVictims', value)}
                                    />
                                    <Field
                                      label="Lao động nữ bị nạn không QL"
                                      required
                                      value={detail.unmanagedFemaleVictims}
                                      error={detailErrors.unmanagedFemaleVictims}
                                      onChange={(value) => updateAccidentDetailInteger(index, 'unmanagedFemaleVictims', value)}
                                    />
                                    <Field
                                      label="Số người chết không QL"
                                      required
                                      value={detail.unmanagedDeadVictims}
                                      error={detailErrors.unmanagedDeadVictims}
                                      onChange={(value) => updateAccidentDetailInteger(index, 'unmanagedDeadVictims', value)}
                                    />
                                    <Field
                                      label="Người bị thương nặng không QL"
                                      required
                                      value={detail.unmanagedSevereVictims}
                                      error={detailErrors.unmanagedSevereVictims}
                                      onChange={(value) => updateAccidentDetailInteger(index, 'unmanagedSevereVictims', value)}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="mb-4 text-sm font-bold text-gray-900">5. Thiệt hại do tai nạn lao động số {item}</h4>
                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                                  <Field label="Chi phí y tế" required value={detail.medicalCost} error={detailErrors.medicalCost} suffix="(1.000đ)" onChange={(value) => updateAccidentDetail(index, 'medicalCost', formatMoneyInput(value))} />
                                  <Field
                                    label="Chi phí trả lương trong thời gian điều trị"
                                    required
                                    value={detail.treatmentSalaryCost}
                                    error={detailErrors.treatmentSalaryCost}
                                    suffix="(1.000đ)"
                                    onChange={(value) => updateAccidentDetail(index, 'treatmentSalaryCost', formatMoneyInput(value))}
                                  />
                                  <Field
                                    label="Chi phí bồi thường trợ cấp"
                                    required
                                    value={detail.compensationCost}
                                    error={detailErrors.compensationCost}
                                    suffix="(1.000đ)"
                                    onChange={(value) => updateAccidentDetail(index, 'compensationCost', formatMoneyInput(value))}
                                  />
                                  <Field label="Tổng số tiền chi phí" required value={getAccidentDetailTotalCost(detail)} suffix="(1.000đ)" readOnly />
                                  <Field label="Tổng số ngày nghỉ vì TNLĐ" required value={detail.workdaysLost} error={detailErrors.workdaysLost} onChange={(value) => updateAccidentDetailInteger(index, 'workdaysLost', value)} />
                                  <Field label="Thiệt hại tài sản" required value={detail.assetDamage} error={detailErrors.assetDamage} suffix="(1.000đ)" onChange={(value) => updateAccidentDetail(index, 'assetDamage', formatMoneyInput(value))} />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                    </>
                  )}
                </div>
              )}
            </section>
          )}

          {step === 'subsidy' && (
            <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-sm font-bold text-gray-900">1. Tổng số vụ tai nạn lao động & số nạn nhân tai nạn lao động</h3>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                      <Field
                        label="Tổng số vụ"
                        required
                        value={form.subsidyTotalAccidents}
                        error={subsidyTotalAccidentsError}
                        onChange={(value) => updateIntegerField('subsidyTotalAccidents', value)}
                      />
                      <Field
                        label="Tổng số vụ có người chết"
                        required
                        value={form.subsidyFatalAccidents}
                        error={subsidyFatalAccidentsError}
                        onChange={(value) => updateIntegerField('subsidyFatalAccidents', value)}
                      />
                      <Field
                        label="Tổng số vụ có từ 2 người bị nạn trở lên"
                        required
                        value={form.subsidyMultiVictimAccidents}
                        error={subsidyMultiVictimAccidentsError}
                        onChange={(value) => updateIntegerField('subsidyMultiVictimAccidents', value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                      <Field
                        label="Tổng số người bị nạn"
                        required
                        value={form.subsidyTotalVictims}
                        error={subsidyTotalVictimsError}
                        onChange={(value) => updateIntegerField('subsidyTotalVictims', value)}
                      />
                      <Field
                        label="Tổng số lao động nữ bị nạn"
                        required
                        value={form.subsidyFemaleVictims}
                        error={subsidyFemaleVictimsError}
                        onChange={(value) => updateIntegerField('subsidyFemaleVictims', value)}
                      />
                      <Field
                        label="Tổng số người bị chết"
                        required
                        value={form.subsidyDeadVictims}
                        error={subsidyDeadVictimsError}
                        onChange={(value) => updateIntegerField('subsidyDeadVictims', value)}
                      />
                      <Field
                        label="Tổng số người bị thương nặng"
                        required
                        value={form.subsidySevereVictims}
                        error={subsidySevereVictimsError}
                        onChange={(value) => updateIntegerField('subsidySevereVictims', value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                      <Field
                        label="Số người bị nạn không QL"
                        required
                        value={form.subsidyUnmanagedVictims}
                        error={subsidyUnmanagedVictimsError}
                        onChange={(value) => updateIntegerField('subsidyUnmanagedVictims', value)}
                      />
                      <Field
                        label="Lao động nữ bị nạn không QL"
                        required
                        value={form.subsidyUnmanagedFemaleVictims}
                        error={subsidyUnmanagedFemaleVictimsError}
                        onChange={(value) => updateIntegerField('subsidyUnmanagedFemaleVictims', value)}
                      />
                      <Field
                        label="Số người chết không QL"
                        required
                        value={form.subsidyUnmanagedDeadVictims}
                        error={subsidyUnmanagedDeadVictimsError}
                        onChange={(value) => updateIntegerField('subsidyUnmanagedDeadVictims', value)}
                      />
                      <Field
                        label="Người bị thương nặng không QL"
                        required
                        value={form.subsidyUnmanagedSevereVictims}
                        error={subsidyUnmanagedSevereVictimsError}
                        onChange={(value) => updateIntegerField('subsidyUnmanagedSevereVictims', value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-bold text-gray-900">2. Thiệt hại do tai nạn lao động</h3>
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                    <Field label="Chi phí y tế" required value={form.subsidyMedicalCost} error={subsidyMedicalCostError} suffix="(1.000đ)" onChange={(value) => updateField('subsidyMedicalCost', formatMoneyInput(value))} />
                    <Field label="Chi phí trả lương trong thời gian điều trị" required value={form.subsidyTreatmentSalaryCost} error={subsidyTreatmentSalaryCostError} suffix="(1.000đ)" onChange={(value) => updateField('subsidyTreatmentSalaryCost', formatMoneyInput(value))} />
                    <Field label="Chi phí bồi thường trợ cấp" required value={form.subsidyCompensationCost} error={subsidyCompensationCostError} suffix="(1.000đ)" onChange={(value) => updateField('subsidyCompensationCost', formatMoneyInput(value))} />
                    <Field label="Tổng số tiền chi phí" required value={subsidyDamageTotal} suffix="(1.000đ)" readOnly />
                    <Field label="Tổng số ngày nghỉ vì TNLD" required value={form.subsidyWorkdaysLost} error={subsidyWorkdaysLostError} onChange={(value) => updateIntegerField('subsidyWorkdaysLost', value)} />
                    <Field label="Thiệt hại tài sản" required value={form.subsidyAssetDamage} error={subsidyAssetDamageError} suffix="(1.000đ)" onChange={(value) => updateField('subsidyAssetDamage', formatMoneyInput(value))} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 'review' && (
            <section className="space-y-4">
              <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-6 border-b border-gray-200 pb-4">
                  <h2 className="mb-2 text-base font-bold text-[#112D75]">
                    Báo cáo tổng hợp tình hình tai nạn lao động - Kỳ báo cáo: 6 tháng, năm {reportYear}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-red-500 font-bold">
                    <span>**Vui lòng đính kèm báo cáo TNLĐ có dấu mộc công ty:</span>
                    {!readOnly ? (
                      <label className="cursor-pointer font-semibold text-blue-600 hover:underline">
                        Tải đây
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            setUploadedFile(file?.type === 'application/pdf' || file?.name.toLowerCase().endsWith('.pdf') ? file.name : '');
                          }}
                        />
                      </label>
                    ) : (
                      <span className="text-gray-400 font-normal">Tải đây (Chỉ xem)</span>
                    )}
                    <span className={`ml-6 font-medium ${uploadedFile ? 'text-blue-600' : 'text-gray-400'}`}>
                      {uploadedFile || 'Chưa chọn file PDF'}
                    </span>
                  </div>
                </div>

                <div className="overflow-auto max-h-[60vh] border border-slate-200 rounded-lg shadow-inner bg-slate-50/25 p-1">
                  <table className="w-full border-collapse border border-slate-200 text-xs text-slate-700 bg-white">
                    <thead className="sticky top-0 bg-slate-100 z-10">
                      <tr className="border border-slate-200">
                        <th rowSpan={3} className="border border-slate-200 p-2 text-left font-bold min-w-[250px] bg-slate-100">Tên chỉ tiêu thống kê</th>
                        <th rowSpan={3} className="border border-slate-200 p-2 text-center font-bold w-16 bg-slate-100">Mã số</th>
                        <th colSpan={11} className="border border-slate-200 p-1.5 text-center font-bold bg-slate-100">Phân loại TNLĐ theo mức độ thương tật</th>
                      </tr>
                      <tr className="border border-slate-200">
                        <th colSpan={3} className="border border-slate-200 p-1 text-center font-bold bg-slate-50">Số vụ (Vụ)</th>
                        <th colSpan={8} className="border border-slate-200 p-1 text-center font-bold bg-slate-50">Số người bị nạn (Người)</th>
                      </tr>
                      <tr className="border border-slate-200">
                        <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50">Tổng số</th>
                        <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50">Số vụ có người chết</th>
                        <th className="border border-slate-200 p-1 text-center font-bold w-14 bg-slate-50">Số vụ có từ 2 người bị nạn trở lên</th>
                        <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50">Tổng số</th>
                        <th className="border border-slate-200 p-1 text-center font-bold w-16 bg-slate-50 font-medium">NN không thuộc quyền quản lý</th>
                        <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50">Tổng số</th>
                        <th className="border border-slate-200 p-1 text-center font-bold w-16 bg-slate-50 font-medium">NN không thuộc quyền quản lý</th>
                        <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50">Tổng số</th>
                        <th className="border border-slate-200 p-1 text-center font-bold w-16 bg-slate-50 font-medium">NN không thuộc quyền quản lý</th>
                        <th className="border border-slate-200 p-1 text-center font-bold w-12 bg-slate-50">Tổng số</th>
                        <th className="border border-slate-200 p-1 text-center font-bold w-16 bg-slate-50 font-medium">NN không thuộc quyền quản lý</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-slate-100 font-bold">
                        <td className="border border-slate-200 p-2 font-bold">1. Tai nạn lao động</td>
                        <td className="border border-slate-200 p-2 text-center" />
                        <td colSpan={11} className="border border-slate-200" />
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-2 pl-4">Tai nạn lao động</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">2</td>
                        {accidentOverviewMetrics.map((value, index) => (
                          <td key={`accident-overview-${index}`} className="border border-slate-200 p-2 text-center">
                            {value}
                          </td>
                        ))}
                      </tr>

                      <tr className="bg-slate-50 font-bold">
                        <td className="border border-slate-200 p-2 pl-4 font-bold">1.1. Phân theo nguyên nhân xảy ra TNLĐ</td>
                        <td className="border border-slate-200 p-2 text-center" />
                        <td colSpan={11} className="border border-slate-200" />
                      </tr>
                      <tr className="italic text-slate-600 font-semibold bg-slate-50/50">
                        <td className="border border-slate-200 p-2 pl-6">a. Do người sử dụng lao động</td>
                        <td className="border border-slate-200 p-2 text-center" />
                        <td colSpan={11} className="border border-slate-200" />
                      </tr>
                      {reviewEmployerCauseRows.map((row) => (
                        <tr key={`cause-employer-${row.label}`}>
                          <td className="border border-slate-200 p-2 pl-8">{row.label}</td>
                          <td className="border border-slate-200 p-2 text-center font-mono">{row.code}</td>
                          {row.metrics.map((value, index) => (
                            <td key={`${row.label}-${index}`} className="border border-slate-200 p-2 text-center">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="italic text-slate-600 font-semibold bg-slate-50/50">
                        <td className="border border-slate-200 p-2 pl-6">b. Do người lao động</td>
                        <td className="border border-slate-200 p-2 text-center" />
                        <td colSpan={11} className="border border-slate-200" />
                      </tr>
                      {reviewEmployeeCauseRows.map((row) => (
                        <tr key={`cause-employee-${row.label}`}>
                          <td className="border border-slate-200 p-2 pl-8">{row.label}</td>
                          <td className="border border-slate-200 p-2 text-center font-mono">{row.code}</td>
                          {row.metrics.map((value, index) => (
                            <td key={`${row.label}-${index}`} className="border border-slate-200 p-2 text-center">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}

                      <tr className="bg-slate-50 font-bold">
                        <td className="border border-slate-200 p-2 pl-4 font-bold">1.2. Phân theo yếu tố gây chấn thương</td>
                        <td className="border border-slate-200 p-2 text-center" />
                        <td colSpan={11} className="border border-slate-200" />
                      </tr>
                      {reviewInjuryFactorRows.map((row) => (
                        <tr key={`injury-factor-${row.label}`}>
                          <td className="border border-slate-200 p-2 pl-6">{row.label}</td>
                          <td className="border border-slate-200 p-2 text-center font-mono">{row.code}</td>
                          {row.metrics.map((value, index) => (
                            <td key={`${row.label}-${index}`} className="border border-slate-200 p-2 text-center">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}

                      <tr className="bg-slate-50 font-bold">
                        <td className="border border-slate-200 p-2 pl-4 font-bold">1.3. Phân theo nghề nghiệp</td>
                        <td className="border border-slate-200 p-2 text-center" />
                        <td colSpan={11} className="border border-slate-200" />
                      </tr>
                      {reviewOccupationRows.map((row) => (
                        <tr key={`occupation-${row.label}`}>
                          <td className="border border-slate-200 p-2 pl-6">{row.label}</td>
                          <td className="border border-slate-200 p-2 text-center font-mono">{row.code}</td>
                          {row.metrics.map((value, index) => (
                            <td key={`${row.label}-${index}`} className="border border-slate-200 p-2 text-center">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}

                      <tr className="bg-slate-100 font-bold">
                        <td className="border border-slate-200 p-2 font-bold">
                          2. Tai nạn được hưởng trợ cấp theo quy định tại Khoản 2 Điều 39 Luật ATVSLĐ
                        </td>
                        <td className="border border-slate-200 p-2 text-center" />
                        <td colSpan={11} className="border border-slate-200" />
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-2 pl-4">Tai nạn được hưởng trợ cấp</td>
                        <td className="border border-slate-200 p-2 text-center font-mono">10</td>
                        {subsidyMetrics.map((value, index) => (
                          <td key={`subsidy-${index}`} className="border border-slate-200 p-2 text-center">
                            {value}
                          </td>
                        ))}
                      </tr>

                      <tr className="bg-slate-50 font-extrabold text-[#112D75]">
                        <td className="border border-slate-200 p-2 font-extrabold">3. Tổng số</td>
                        <td className="border border-slate-200 p-2 text-center" />
                        <td colSpan={11} className="border border-slate-200" />
                      </tr>
                      <tr className="font-bold">
                        <td className="border border-slate-200 p-2 pl-4">Tổng số (3=1+2)</td>
                        <td className="border border-slate-200 p-2 text-center" />
                        {reviewTotalMetrics.map((value, index) => (
                          <td key={`review-total-${index}`} className="border border-slate-200 p-2 text-center">
                            {value}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-6 space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800">II. Thiệt hại do tai nạn lao động</h3>
                    <table className="w-full border-collapse border border-slate-200 text-xs text-slate-700 bg-white">
                      <thead className="bg-slate-100">
                        <tr className="text-slate-600">
                          <th className="border border-slate-200 p-3 text-center font-semibold" rowSpan={2}>
                            Tổng số ngày nghỉ vì tai nạn lao động (kể cả ngày nghỉ chế độ)
                          </th>
                          <th className="border border-slate-200 p-3 text-center font-semibold" rowSpan={2}>
                            Tổng số tiền chi phí (1.000đ)
                          </th>
                          <th className="border border-slate-200 p-3 text-center font-semibold" colSpan={3}>
                            Khoản chi cụ thể của cơ sở
                          </th>
                          <th className="border border-slate-200 p-3 text-center font-semibold" rowSpan={2}>
                            Thiệt hại tài sản (1.000đ)
                          </th>
                        </tr>
                        <tr className="text-slate-600">
                          <th className="border border-slate-200 p-3 text-center font-medium">Y tế</th>
                          <th className="border border-slate-200 p-3 text-center font-medium">Trả lương trong thời gian điều trị</th>
                          <th className="border border-slate-200 p-3 text-center font-medium">Bồi thường trợ cấp</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-200 p-3 text-center">{reviewDamageTotals.workdaysLost}</td>
                          <td className="border border-slate-200 p-3 text-center font-mono">{reviewDamageTotals.totalCost}</td>
                          <td className="border border-slate-200 p-3 text-center font-mono">{reviewDamageTotals.medicalCost}</td>
                          <td className="border border-slate-200 p-3 text-center font-mono">{reviewDamageTotals.treatmentSalaryCost}</td>
                          <td className="border border-slate-200 p-3 text-center font-mono">{reviewDamageTotals.compensationCost}</td>
                          <td className="border border-slate-200 p-3 text-center font-mono">{reviewDamageTotals.assetDamage}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </section>
          )}

        </div>

        {step === 'accident' && accidentTab === 'details' && showScrollTop && (
          <button
            type="button"
            onClick={scrollContentToTop}
            className="absolute bottom-6 right-6 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700"
            aria-label="Lên đầu trang"
            title="Lên đầu trang"
          >
            <ChevronUp size={22} />
          </button>
        )}
      </main>

      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
              <AlertTriangle size={20} className="text-amber-500" />
              <h3 className="text-base font-bold text-gray-900">Cảnh báo</h3>
              <button
                type="button"
                onClick={() => setShowCancelDialog(false)}
                className="ml-auto rounded p-1 text-gray-400 transition hover:bg-gray-100"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-6 text-center text-sm font-medium text-gray-700">
              Dữ liệu báo cáo đã nhập sẽ không được lưu lại. Bạn có chắc chắn muốn hủy?
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setShowCancelDialog(false)}
                className="rounded-md px-4 py-2 text-sm font-semibold text-gray-500 transition hover:bg-gray-100"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => router.push('/enterprise/tnld-hdld')}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
