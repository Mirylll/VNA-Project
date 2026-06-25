"use client";

import { Check, ChevronDown, ChevronRight, Eye, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getAuthToken, getAuthUser } from '@/libs/core/utils/auth-token';
import ChangeEmailModal from '@/libs/tts/components/ChangeEmailModal';
import DatePicker from '@/libs/tts/components/DatePicker';
import { ENTERPRISE_TYPES } from '@/libs/tts/data/hcm-districts';
import AttachmentTable, { AttachmentFile, initialAttachmentFiles } from './AttachmentTable';

const BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : 'http://localhost:3001';

type FieldProps = {
  label: string;
  value: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  select?: boolean;
  options?: Array<{ label: string; value: string }>;
  calendar?: boolean;
  inputType?: React.HTMLInputTypeAttribute;
  action?: string;
  onActionClick?: () => void;
  className?: string;
  max?: string;
  error?: string;
  onChange?: (value: string) => void;
};

function Field({
  label,
  value,
  required = false,
  disabled = false,
  placeholder = '',
  select = false,
  options,
  calendar = false,
  inputType = 'text',
  action,
  onActionClick,
  className = '',
  max,
  error,
  onChange,
}: FieldProps) {
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const autocompleteOptions = options || [];
  const isAutocomplete = select && autocompleteOptions.length > 10;
  const selectedOption = autocompleteOptions.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return autocompleteOptions.slice(0, 80);

    return autocompleteOptions
      .filter((option) => option.label.toLowerCase().includes(keyword))
      .slice(0, 80);
  }, [autocompleteOptions, searchTerm]);

  return (
    <label className={`relative block ${className}`}>
      <span className="absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs text-slate-500">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      <div
        className={`relative border rounded-lg h-11 px-3 pt-2 pb-1.5 ${
          disabled
            ? 'border-slate-200 bg-gray-50'
            : error
              ? 'border-red-400'
              : 'border-slate-200'
        }`}
      >
        {isAutocomplete ? (
          <div
            className="relative"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setAutocompleteOpen(false);
              }
            }}
          >
            {autocompleteOpen ? (
              <input
                type="text"
                autoFocus
                value={searchTerm}
                disabled={disabled}
                placeholder={placeholder || `Tìm ${label.toLowerCase()}`}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300 disabled:cursor-not-allowed"
              />
            ) : (
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  setSearchTerm('');
                  setAutocompleteOpen(true);
                }}
                className="w-full truncate border-none bg-transparent text-left text-sm py-0.5 outline-none disabled:cursor-not-allowed"
              >
                {selectedOption?.label || placeholder || `Chọn ${label.toLowerCase()}`}
              </button>
            )}
            {autocompleteOpen && (
              <div className="absolute left-[-13px] right-[-13px] top-8 z-40 max-h-64 overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <button
                      key={`${option.value}-${option.label}`}
                      type="button"
                      className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-blue-50 ${
                        option.value === value ? 'bg-blue-50 font-semibold text-blue-700' : 'text-gray-700'
                      }`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        onChange?.(option.value);
                        setAutocompleteOpen(false);
                        setSearchTerm('');
                      }}
                    >
                      {option.label}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-400">Không tìm thấy dữ liệu</div>
                )}
              </div>
            )}
          </div>
        ) : select && options ? (
          <div className="relative">
            <select
              value={value}
              disabled={disabled}
              onChange={(event) => onChange?.(event.target.value)}
              className="w-full appearance-none border-none outline-none text-sm py-0.5 bg-transparent pr-6 disabled:cursor-not-allowed"
            >
              <option value="">{placeholder || `Chọn ${label.toLowerCase()}`}</option>
              {options.map((option) => (
                <option key={`${option.value}-${option.label}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
            />
          </div>
        ) : (
          <input
            type={inputType}
            value={value}
            disabled={disabled}
            max={max}
            placeholder={placeholder}
            onChange={(event) => onChange?.(event.target.value)}
            className={`w-full border-none outline-none text-sm py-0.5 placeholder:text-gray-300 disabled:cursor-not-allowed ${
              action ? 'pr-16' : ''
            }`}
          />
        )}
        {action && (
          <button
            type="button"
            onClick={onActionClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            {action}
          </button>
        )}

      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </label>
  );
}

type SelectOption = {
  value: string;
  label: string;
  name: string;
};

type EnterpriseTypeOption = {
  id?: number;
  name: string;
  isActive?: boolean;
};

type EnterpriseAttachment = {
  id: number;
  name: string;
  fileName: string;
  filePath: string;
};

type EnterpriseApiData = {
  id: number;
  name?: string;
  taxCode?: string;
  enterpriseType?: { id: number; name: string };
  industry?: { id: number; code: string; name: string };
  licenseDate?: string;
  province?: { id: number; name: string };
  ward?: { id: number; name: string };
  address?: string;
  foreignName?: string;
  email?: string;
  phone?: string;
  operationProvince?: { id: number; name: string };
  operationWard?: { id: number; name: string };
  operationAddress?: string;
  leaderName?: string;
  leaderPhone?: string;
  attachments?: EnterpriseAttachment[];
};

const ADMIN_PROVINCES: SelectOption[] = [
  { value: '1', label: 'Thành phố Hồ Chí Minh', name: 'Thành phố Hồ Chí Minh' },
  { value: '2', label: 'Hà Nội', name: 'Hà Nội' },
  { value: '3', label: 'Đà Nẵng', name: 'Đà Nẵng' },
];

const PROVINCE_NAME_TO_ID: Record<string, string> = {
  'Thành phố Hồ Chí Minh': '1',
  'Hà Nội': '2',
  'Đà Nẵng': '3',
};

function Stepper({ currentStep }: { currentStep: 1 | 2 }) {
  const isConfirmStep = currentStep === 2;

  return (
    <div className="flex items-center justify-center py-6">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
            {isConfirmStep ? <Check size={14} /> : '1'}
          </span>
          <span className="text-sm font-medium text-blue-600">Thông tin doanh nghiệp</span>
        </div>
        <div className="mx-4 h-px w-52 bg-gray-200" />
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white ${
              isConfirmStep ? 'bg-blue-600' : 'bg-gray-400'
            }`}
          >
            2
          </span>
          <span className={`text-sm font-medium ${isConfirmStep ? 'text-blue-600' : 'text-gray-400'}`}>
            Xác nhận chỉnh sửa
          </span>
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  if (!value) return '';

  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;

  return `${day}/${month}/${year}`;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-56 shrink-0 text-sm font-semibold text-gray-800">
        {label}
        <span className="ml-0.5">:</span>
      </div>
      <div className="flex-1 text-sm text-gray-600">{value || '-'}</div>
    </div>
  );
}

function ConfirmAttachmentTable({
  files,
  onViewFile,
}: {
  files: AttachmentFile[];
  onViewFile: (file: AttachmentFile) => void;
}) {
  return (
    <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
      <thead className="bg-gray-50">
        <tr>
          <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Tên file</th>
          <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Thông tin file</th>
          <th className="text-right px-4 py-2.5 text-gray-600 font-medium">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <tr key={file.id} className="border-t border-gray-200 bg-white">
            <td className="px-4 py-3 text-gray-700">{file.name}</td>
            <td className="px-4 py-3 text-gray-500">{file.info || <span className="italic text-gray-300">Chưa có file</span>}</td>
            <td className="px-4 py-3 text-right">
              {file.url && (
                <button
                  type="button"
                  onClick={() => onViewFile(file)}
                  title="Xem file"
                  className="text-gray-400 hover:text-blue-600 transition p-1 inline-flex"
                >
                  <Eye size={17} />
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function buildFileUrl(filePath: string) {
  if (!filePath) return '';
  if (filePath.startsWith('http')) return filePath;
  return `${BASE_URL}${filePath}`;
}

function mapEnterpriseAttachments(attachments: EnterpriseAttachment[] = []): AttachmentFile[] {
  if (attachments.length === 0) return initialAttachmentFiles;

  const mapped = attachments.map((attachment) => ({
    id: String(attachment.id),
    name: attachment.name,
    info: attachment.fileName,
    url: buildFileUrl(attachment.filePath),
  }));

  const missingDefaultRows = initialAttachmentFiles.filter(
    (row: AttachmentFile) => !mapped.some((attachment) => attachment.name === row.name),
  );

  return [...mapped, ...missingDefaultRows];
}

function updateStoredAuthEmail(newEmail: string) {
  if (typeof window === 'undefined') return;

  ['localStorage', 'sessionStorage'].forEach((storageName) => {
    const storage = storageName === 'localStorage' ? window.localStorage : window.sessionStorage;
    const rawUser = storage.getItem('authUser');
    if (!rawUser) return;

    try {
      const user = JSON.parse(rawUser);
      storage.setItem('authUser', JSON.stringify({ ...user, email: newEmail }));
    } catch {
      // Ignore malformed auth storage.
    }
  });
}

function mergeEnterpriseTypeOptions(apiTypes: EnterpriseTypeOption[]) {
  const byName = new Map<string, EnterpriseTypeOption>();

  ENTERPRISE_TYPES.forEach((name) => {
    byName.set(name, { name });
  });

  apiTypes.forEach((type) => {
    if (!type.name || type.isActive === false) return;
    byName.set(type.name, type);
  });

  return Array.from(byName.values());
}

function enterpriseTypeOptionValue(type: EnterpriseTypeOption) {
  return type.id ? String(type.id) : `name:${type.name}`;
}

function getTodayDateValue() {
  return new Date().toISOString().slice(0, 10);
}

function cleanPhone(value: string) {
  return value.replace(/\D/g, '').slice(0, 11);
}

function getPhoneError(value: string) {
  if (!value) return '';
  return /^0\d{8,10}$/.test(value) ? '' : 'Số điện thoại phải bắt đầu bằng 0 và có 9-11 chữ số';
}

function getRequiredPhoneError(value: string, label: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return `Vui lòng nhập ${label}`;
  return getPhoneError(trimmedValue);
}

function getTaxCodeError(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return 'Vui lòng nhập mã số thuế';
  const taxDigits = trimmedValue.replace(/-/g, '');
  if (taxDigits.length < 10) {
    return 'Mã số thuế phải có ít nhất 10 ký tự (không tính dấu gạch ngang)';
  } else if (taxDigits.length > 15) {
    return 'Mã số thuế tối đa 15 ký tự (không tính dấu gạch ngang)';
  }
  return '';
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function updateStoredEnterpriseName(name: string) {
  if (typeof window === 'undefined') return;

  ['localStorage', 'sessionStorage'].forEach((storageName) => {
    const storage = storageName === 'localStorage' ? window.localStorage : window.sessionStorage;
    const rawUser = storage.getItem('authUser');
    if (!rawUser) return;

    try {
      const user = JSON.parse(rawUser);
      storage.setItem('authUser', JSON.stringify({ ...user, enterpriseName: name }));
    } catch {
      // Ignore malformed auth storage.
    }
  });
}

export default function EnterpriseCompanyInfoPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [enterpriseId, setEnterpriseId] = useState<number | null>(null);
  const [loadingEnterprise, setLoadingEnterprise] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [enterpriseTypes, setEnterpriseTypes] = useState<EnterpriseTypeOption[]>([]);
  const [industries, setIndustries] = useState<{ id: number; code: string; name: string }[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<SelectOption[]>(ADMIN_PROVINCES);
  const [registeredWardOptions, setRegisteredWardOptions] = useState<SelectOption[]>([]);
  const [wardOptions, setWardOptions] = useState<SelectOption[]>([]);
  const [registeredWardCode, setRegisteredWardCode] = useState('');
  const [operatingProvinceCode, setOperatingProvinceCode] = useState('');
  const [operatingWardCode, setOperatingWardCode] = useState('');
  const [loadingWards, setLoadingWards] = useState(false);
  const [fileMessage, setFileMessage] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState<AttachmentFile[]>(initialAttachmentFiles);
  const [form, setForm] = useState({
    companyName: '',
    taxCode: '',
    businessTypeId: '',
    businessType: '',
    mainIndustry: '',
    licenseDate: '',
    registeredProvince: '',
    registeredWard: '',
    address: '',
    foreignName: '',
    email: '',
    officePhone: '',
    operatingProvince: '',
    operatingWard: '',
    businessLocation: '',
    representativeName: '',
    representativePhone: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  useEffect(() => {
    let active = true;

    async function loadEnterpriseTypes() {
      try {
        const response = await fetch(`${BASE_URL}/enterprise-types`);
        if (!response.ok) throw new Error('Không tải được loại hình doanh nghiệp');
        const data = (await response.json()) as EnterpriseTypeOption[];
        if (!active) return;
        setEnterpriseTypes(mergeEnterpriseTypeOptions(data));
      } catch {
        if (active) {
          setEnterpriseTypes(mergeEnterpriseTypeOptions([]));
        }
      }
    }

    async function loadIndustries() {
      const token = getAuthToken();
      if (!token) return;
      try {
        const response = await fetch(`${BASE_URL}/industries`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Không tải được ngành nghề');
        const data = await response.json();
        if (!active) return;
        setIndustries(data.filter((d: any) => d.isActive !== false && d.level === 4));
      } catch {
        if (active) setIndustries([]);
      }
    }

    loadEnterpriseTypes();
    loadIndustries();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadRegisteredWards() {
      const token = getAuthToken();
      if (!token) return;
      try {
        const response = await fetch(`${BASE_URL}/districts?provinceId=1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Không tải được phường/xã');
        const data = await response.json();
        if (!active) return;
        setRegisteredWardOptions(
          data.map((ward: any) => ({
            value: String(ward.id),
            label: ward.name,
            name: ward.name,
          })),
        );
      } catch {
        if (active) setRegisteredWardOptions([]);
      }
    }

    loadRegisteredWards();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadCurrentEnterprise() {
      const token = getAuthToken();
      setAuthToken(token);
      setLoadingEnterprise(true);
      setSaveMessage('');

      if (!token) {
        setLoadingEnterprise(false);
        setSaveMessage('Bạn cần đăng nhập để xem thông tin doanh nghiệp.');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/enterprises/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = (await response.json().catch(() => ({}))) as EnterpriseApiData & { message?: string };
        if (!response.ok) {
          throw new Error(data.message || 'Không tải được thông tin doanh nghiệp');
        }
        if (!active) return;

        setEnterpriseId(data.id);
        setForm({
          companyName: data.name || '',
          taxCode: data.taxCode || '',
          businessTypeId: data.enterpriseType?.id ? String(data.enterpriseType.id) : '',
          businessType: data.enterpriseType?.name || '',
          mainIndustry: data.industry ? `${data.industry.code} - ${data.industry.name}` : '',
          licenseDate: data.licenseDate || '',
          registeredProvince: data.province?.name || '',
          registeredWard: data.ward?.name || '',
          address: data.address || '',
          foreignName: data.foreignName || '',
          email: data.email || '',
          officePhone: data.phone || '',
          operatingProvince: data.operationProvince?.name || '',
          operatingWard: data.operationWard?.name || '',
          businessLocation: data.operationAddress || '',
          representativeName: data.leaderName || '',
          representativePhone: data.leaderPhone || '',
        });
        setAttachmentFiles(mapEnterpriseAttachments(data.attachments));
        if (data.name) {
          updateStoredEnterpriseName(data.name);
          window.dispatchEvent(new CustomEvent('enterprise-name-changed', { detail: { name: data.name } }));
        }
      } catch (error: any) {
        if (active) {
          setSaveMessage(error?.message || 'Không tải được thông tin doanh nghiệp');
        }
      } finally {
        if (active) setLoadingEnterprise(false);
      }
    }

    loadCurrentEnterprise();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadWards() {
      if (!operatingProvinceCode) {
        setWardOptions([]);
        return;
      }

      setLoadingWards(true);

      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await fetch(`${BASE_URL}/districts?provinceId=${operatingProvinceCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Không tải được danh sách phường/xã');

        const data = await response.json();
        if (!active) return;
        setWardOptions(
          data.map((ward: any) => ({
            value: String(ward.id),
            label: ward.name,
            name: ward.name,
          })),
        );
      } catch {
        if (active) setWardOptions([]);
      } finally {
        if (active) setLoadingWards(false);
      }
    }

    loadWards();

    return () => {
      active = false;
    };
  }, [operatingProvinceCode]);

  useEffect(() => {
    if (operatingProvinceCode || !form.operatingProvince || !ADMIN_PROVINCES.length) return;

    const matchedId = PROVINCE_NAME_TO_ID[form.operatingProvince];
    if (matchedId) {
      setOperatingProvinceCode(matchedId);
    }
  }, [form.operatingProvince, operatingProvinceCode]);

  useEffect(() => {
    if (operatingWardCode || !form.operatingWard || wardOptions.length === 0) return;

    const matchedWard = wardOptions.find((option) => option.name === form.operatingWard);
    if (matchedWard) {
      setOperatingWardCode(matchedWard.value);
    }
  }, [form.operatingWard, operatingWardCode, wardOptions]);

  useEffect(() => {
    if (registeredWardCode || !form.registeredWard || registeredWardOptions.length === 0) return;

    const matchedWard = registeredWardOptions.find((option) => option.name === form.registeredWard);
    if (matchedWard) {
      setRegisteredWardCode(matchedWard.value);
    }
  }, [form.registeredWard, registeredWardCode, registeredWardOptions]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => {
      if (!current[field]) return current;
      return { ...current, [field]: '' };
    });

    if (field === 'companyName') {
      window.dispatchEvent(new CustomEvent('enterprise-name-changed', { detail: { name: value } }));
      updateStoredEnterpriseName(value);
    }
  }

  function handleLicenseDateChange(value: string) {
    const today = getTodayDateValue();
    updateField('licenseDate', value > today ? today : value);
  }

  function handleBusinessTypeChange(typeId: string) {
    const selectedType = enterpriseTypes.find((type) => enterpriseTypeOptionValue(type) === typeId);
    setForm((current) => ({
      ...current,
      businessTypeId: selectedType?.id ? String(selectedType.id) : '',
      businessType: selectedType?.name || '',
    }));
    setFormErrors((current) => ({ ...current, businessType: '' }));
  }

  function handleRegisteredWardChange(wardCode: string) {
    const ward = registeredWardOptions.find((option) => option.value === wardCode);

    setRegisteredWardCode(wardCode);
    updateField('registeredWard', ward?.name || '');
  }

  function handleIndustryChange(industryValue: string) {
    updateField('mainIndustry', industryValue);
  }

  function validateEnterpriseForm() {
    const errors: Partial<Record<keyof typeof form, string>> = {};
    const requireText = (field: keyof typeof form, message: string) => {
      if (!String(form[field] || '').trim()) errors[field] = message;
    };

    requireText('companyName', 'Vui lòng nhập tên doanh nghiệp');

    const taxCodeError = getTaxCodeError(form.taxCode);
    if (taxCodeError) errors.taxCode = taxCodeError;

    if (!form.businessTypeId && !form.businessType.trim()) {
      errors.businessType = 'Vui lòng chọn loại hình kinh doanh';
    }
    requireText('mainIndustry', 'Vui lòng chọn ngành nghề kinh doanh chính');

    if (!form.licenseDate) {
      errors.licenseDate = 'Vui lòng chọn ngày cấp GPKD';
    } else if (form.licenseDate > getTodayDateValue()) {
      errors.licenseDate = 'Ngày cấp GPKD không được lớn hơn ngày hiện tại';
    }

    requireText('registeredProvince', 'Vui lòng chọn tỉnh/thành phố ĐKKD');
    if (!registeredWardCode && !form.registeredWard.trim()) {
      errors.registeredWard = 'Vui lòng chọn phường/xã ĐKKD';
    }
    requireText('address', 'Vui lòng nhập địa chỉ');

    if (!form.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!isValidEmail(form.email.trim())) {
      errors.email = 'Email không đúng định dạng';
    }

    const officePhoneError = getRequiredPhoneError(form.officePhone, 'số điện thoại cơ quan');
    if (officePhoneError) errors.officePhone = officePhoneError;

    if (!operatingProvinceCode && !form.operatingProvince.trim()) {
      errors.operatingProvince = 'Vui lòng chọn tỉnh/thành phố hoạt động KD';
    }
    if (!operatingWardCode && !form.operatingWard.trim()) {
      errors.operatingWard = 'Vui lòng chọn phường/xã hoạt động KD';
    }
    requireText('businessLocation', 'Vui lòng nhập địa điểm kinh doanh');
    requireText('representativeName', 'Vui lòng nhập người đứng đầu doanh nghiệp');

    const representativePhoneError = getRequiredPhoneError(form.representativePhone, 'SĐT liên hệ người đứng đầu');
    if (representativePhoneError) errors.representativePhone = representativePhoneError;

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setSaveMessage('Vui lòng kiểm tra lại các trường bắt buộc.');
      return false;
    }

    setSaveMessage('');
    return true;
  }

  async function saveEnterpriseChanges() {
    const token = authToken || getAuthToken();
    if (!token || !enterpriseId) {
      setSaveMessage('Không tìm thấy thông tin doanh nghiệp để cập nhật.');
      return;
    }

    if (!validateEnterpriseForm()) return;

    try {
      setSaveLoading(true);
      setSaveMessage('');

      const registeredWardId =
        registeredWardCode && Number(registeredWardCode) < 10000 ? Number(registeredWardCode) : undefined;

      const payload = {
        name: form.companyName,
        taxCode: form.taxCode,
        enterpriseTypeId: form.businessTypeId ? Number(form.businessTypeId) : undefined,
        enterpriseTypeName: form.businessTypeId ? undefined : form.businessType || undefined,
        industryName: form.mainIndustry || undefined,
        licenseDate: form.licenseDate || undefined,
        wardId: registeredWardId,
        wardName: registeredWardId ? undefined : form.registeredWard || undefined,
        address: form.address,
        foreignName: form.foreignName,
        email: form.email,
        phone: form.officePhone,
        operationAddress: form.businessLocation,
        leaderName: form.representativeName,
        leaderPhone: form.representativePhone,
      };

      const response = await fetch(`${BASE_URL}/enterprises/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as EnterpriseApiData & { message?: string };

      if (!response.ok) {
        throw new Error(data.message || 'Cập nhật thông tin doanh nghiệp thất bại');
      }

      setSaveMessage('Cập nhật thông tin doanh nghiệp thành công.');
      updateStoredEnterpriseName(form.companyName);
      window.dispatchEvent(new CustomEvent('enterprise-name-changed', { detail: { name: form.companyName } }));
      setStep(1);
    } catch (error: any) {
      setSaveMessage(error?.message || 'Cập nhật thông tin doanh nghiệp thất bại');
    } finally {
      setSaveLoading(false);
    }
  }

  function handlePrimaryAction() {
    if (step === 1) {
      if (!validateEnterpriseForm()) return;
      setStep(2);
      return;
    }

    void saveEnterpriseChanges();
  }

  function handleOperatingProvinceChange(provinceCode: string) {
    const province = provinceOptions.find((option) => option.value === provinceCode);

    setOperatingProvinceCode(provinceCode);
    setOperatingWardCode('');
    updateField('operatingProvince', province?.name || '');
    updateField('operatingWard', '');
    setFormErrors((current) => ({ ...current, operatingProvince: '', operatingWard: '' }));
  }

  function handleOperatingWardChange(wardCode: string) {
    const ward = wardOptions.find((option) => option.value === wardCode);

    setOperatingWardCode(wardCode);
    updateField('operatingWard', ward?.name || '');
  }

  function openChangeEmailModal() {
    setAuthToken(getAuthToken());
    setShowChangeEmailModal(true);
  }

  function handleEmailChanged(newEmail: string) {
    updateField('email', newEmail);
    updateStoredAuthEmail(newEmail);
    window.dispatchEvent(new CustomEvent('user-email-changed', { detail: { email: newEmail } }));
    setSaveMessage('Email đã được cập nhật thành công.');
    setShowChangeEmailModal(false);
    setTimeout(() => setSaveMessage(''), 3000);
  }

  function revokeFileUrl(url: string) {
    URL.revokeObjectURL(url);
  }

  function handleAttachmentFilesChange(files: AttachmentFile[]) {
    setAttachmentFiles(files);
  }

  function handleViewAttachment(file: AttachmentFile) {
    if (!file.url) {
      setFileMessage('Bạn cần tải lên file PDF trước khi xem.');
      return;
    }

    setFileMessage('');
    window.open(file.url, '_blank', 'noopener,noreferrer');
  }

  const registeredAddress = [form.address, form.registeredWard, form.registeredProvince]
    .filter(Boolean)
    .join(', ');
  const operatingAddress =
    [form.businessLocation, form.operatingWard, form.operatingProvince].filter(Boolean).join(', ') ||
    registeredAddress;
  const enterpriseTypeOptions = enterpriseTypes.map((type) => ({
    value: enterpriseTypeOptionValue(type),
    label: type.name,
    name: type.name,
  }));
  const industryOptions = industries.map((industry) => {
    const label = `${industry.code} - ${industry.name}`;
    return { value: label, label };
  });
  const selectedEnterpriseTypeValue = form.businessTypeId || (form.businessType ? `name:${form.businessType}` : '');
  const todayDateValue = getTodayDateValue();
  const officePhoneError = formErrors.officePhone || getPhoneError(form.officePhone);
  const representativePhoneError = formErrors.representativePhone || getPhoneError(form.representativePhone);

  return (
    <div className="flex h-screen flex-col bg-gray-50 text-gray-900">
      <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">Thông tin doanh nghiệp</h1>
          {step === 1 && (
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Huỷ bỏ
              </button>
              <button
                type="button"
                onClick={handlePrimaryAction}
                disabled={loadingEnterprise || saveLoading || !enterpriseId}
                className="flex items-center gap-1.5 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
              >
                Tiếp tục
                <ChevronDown size={15} className="rotate-[-90deg]" />
              </button>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto">
          <Stepper currentStep={step} />

          <div className={`mx-auto w-full px-6 pb-8 ${step === 1 ? 'max-w-[1580px]' : 'max-w-3xl'}`}>
            {loadingEnterprise && (
              <div className="mb-4 rounded-md border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                Đang tải thông tin doanh nghiệp...
              </div>
            )}
            {saveMessage && (
              <div className="mb-4 rounded-md border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                {saveMessage}
              </div>
            )}
            {step === 1 ? (
              <>
                <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-6 pb-3 border-b border-slate-200 text-base font-bold text-gray-800">Thông tin doanh nghiệp</h2>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Field
                      label="Tên doanh nghiệp"
                      required
                      value={form.companyName}
                      error={formErrors.companyName}
                      onChange={(value) => updateField('companyName', value)}
                    />
                    <Field label="Mã số thuế" required disabled value={form.taxCode} error={formErrors.taxCode} />
                    <Field
                      label="Loại hình kinh doanh"
                      required
                      select
                      value={selectedEnterpriseTypeValue}
                      options={enterpriseTypeOptions}
                      placeholder={
                        enterpriseTypeOptions.length === 0
                          ? form.businessType || 'Chưa có loại hình doanh nghiệp'
                          : 'Chọn loại hình kinh doanh'
                      }
                      error={formErrors.businessType}
                      onChange={handleBusinessTypeChange}
                    />

                    <Field
                      label="Ngành nghề kinh doanh chính"
                      required
                      select
                      value={form.mainIndustry}
                      options={industryOptions}
                      placeholder="Chọn ngành nghề kinh doanh chính"
                      error={formErrors.mainIndustry}
                      onChange={handleIndustryChange}
                    />
                    <div className="relative w-full">
                      <label className="absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs text-slate-500">
                        Ngày cấp GPKD <span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        value={form.licenseDate}
                        onChange={handleLicenseDateChange}
                        placeholder="dd/mm/yyyy"
                        className="w-full"
                      />
                      {formErrors.licenseDate && <p className="text-red-500 text-xs mt-1">{formErrors.licenseDate}</p>}
                    </div>
                    <Field
                      label="Tỉnh/Thành phố ĐKKD"
                      required
                      disabled
                      value={form.registeredProvince}
                      error={formErrors.registeredProvince}
                    />

                    <Field
                      label="Phường/Xã ĐKKD"
                      required
                      select
                      value={registeredWardCode}
                      options={registeredWardOptions}
                      placeholder="Chọn Phường/Xã ĐKKD"
                      error={formErrors.registeredWard}
                      onChange={handleRegisteredWardChange}
                    />
                    <Field
                      label="Địa chỉ"
                      required
                      className="lg:col-span-2"
                      value={form.address}
                      error={formErrors.address}
                      onChange={(value) => updateField('address', value)}
                    />
                  </div>
                </section>

                <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-6 pb-3 border-b border-slate-200 text-base font-bold text-gray-800">Thông tin liên hệ</h2>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Field
                      label="Tên viết bằng tiếng nước ngoài"
                      placeholder="Tên viết bằng tiếng nước ngoài"
                      value={form.foreignName}
                      onChange={(value) => updateField('foreignName', value)}
                    />
                    <Field
                      label="Email"
                      required
                      action="Thay đổi"
                      onActionClick={openChangeEmailModal}
                      value={form.email}
                      error={formErrors.email}
                      onChange={(value) => updateField('email', value)}
                    />
                    <Field
                      label="Số điện thoại cơ quan"
                      required
                      placeholder="Số điện thoại cơ quan"
                      value={form.officePhone}
                      error={officePhoneError}
                      onChange={(value) => updateField('officePhone', cleanPhone(value))}
                    />

                    <Field
                      label="Tỉnh/TP hoạt động KD"
                      select
                      placeholder="Chọn Tỉnh/TP hoạt động KD"
                      value={operatingProvinceCode}
                      options={provinceOptions}
                      required
                      error={formErrors.operatingProvince}
                      onChange={handleOperatingProvinceChange}
                    />
                    <Field
                      label="Phường/xã hoạt động KD"
                      select
                      placeholder={
                        operatingProvinceCode
                          ? loadingWards
                            ? 'Đang tải phường/xã...'
                            : 'Chọn Phường/xã hoạt động KD'
                          : 'Chọn tỉnh/thành trước'
                      }
                      value={operatingWardCode}
                      options={wardOptions}
                      disabled={!operatingProvinceCode || loadingWards}
                      required
                      error={formErrors.operatingWard}
                      onChange={handleOperatingWardChange}
                    />
                    <Field
                      label="Địa điểm kinh doanh"
                      placeholder="Địa điểm kinh doanh"
                      value={form.businessLocation}
                      required
                      error={formErrors.businessLocation}
                      onChange={(value) => updateField('businessLocation', value)}
                    />

                    <Field
                      label="Người đứng đầu doanh nghiệp"
                      placeholder="Người đứng đầu doanh nghiệp"
                      value={form.representativeName}
                      required
                      error={formErrors.representativeName}
                      onChange={(value) => updateField('representativeName', value)}
                    />
                    <Field
                      label="SĐT liên hệ người đứng đầu"
                      className="lg:col-span-2"
                      required
                      placeholder="SĐT liên hệ người đứng đầu"
                      value={form.representativePhone}
                      error={representativePhoneError}
                      onChange={(value) => updateField('representativePhone', cleanPhone(value))}
                    />
                  </div>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-6 pb-3 border-b border-slate-200 text-base font-bold text-gray-800">File đính kèm</h2>
                  <AttachmentTable
                    files={attachmentFiles}
                    onFilesChange={handleAttachmentFilesChange}
                    onViewFile={handleViewAttachment}
                    onRevokeFileUrl={revokeFileUrl}
                  />
                </section>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Thông tin về hồ sơ</h2>

                {saveMessage && (
                  <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                    {saveMessage}
                  </div>
                )}

                <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                  <div className="space-y-4">
                    <InfoRow label="Mã số thuế" value={form.taxCode} />
                    <InfoRow label="Tên doanh nghiệp" value={form.companyName} />
                    <InfoRow label="Tên viết bằng tiếng nước ngoài" value={form.foreignName} />
                    <InfoRow label="Email" value={form.email} />
                    <InfoRow label="Số điện thoại cơ quan" value={form.officePhone} />
                    <InfoRow label="Ngày cấp GPKD" value={formatDate(form.licenseDate)} />
                    <InfoRow label="Loại hình kinh doanh" value={form.businessType} />
                    <InfoRow label="Ngành nghề kinh doanh" value={form.mainIndustry} />
                    <InfoRow label="Địa chỉ đăng kí giấy phép kinh doanh" value={registeredAddress} />
                    <InfoRow label="Địa điểm kinh doanh" value={operatingAddress} />
                    <InfoRow label="Người đứng đầu doanh nghiệp" value={form.representativeName} />
                    <InfoRow label="SĐT người đứng đầu" value={form.representativePhone} />
                  </div>
                </div>

                {fileMessage && (
                  <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
                    {fileMessage}
                  </div>
                )}

                <div className="mt-5 mb-6">
                  <h3 className="text-base font-bold text-gray-800 mb-4">File đính kèm</h3>
                  <ConfirmAttachmentTable files={attachmentFiles} onViewFile={handleViewAttachment} />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={saveLoading}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                  >
                    Trở về
                  </button>
                  <button
                    type="button"
                    onClick={handlePrimaryAction}
                    disabled={loadingEnterprise || saveLoading || !enterpriseId}
                    className="flex items-center gap-1.5 bg-blue-600 text-white font-semibold px-6 py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                  >
                    {saveLoading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Check size={15} />
                        Xác nhận
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      <ChangeEmailModal
        open={showChangeEmailModal}
        onClose={() => setShowChangeEmailModal(false)}
        currentEmail={form.email}
        userId={String(getAuthUser()?.id ?? '')}
        onSuccess={handleEmailChanged}
      />
    </div>
  );
}
