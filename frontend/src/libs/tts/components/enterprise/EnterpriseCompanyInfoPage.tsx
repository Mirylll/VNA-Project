"use client";

import { Calendar, Check, ChevronDown, ChevronRight, Eye } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getAuthToken } from '@/libs/core/utils/auth-token';
import ChangeEmailModal from '@/libs/tts/components/ChangeEmailModal';
import { ENTERPRISE_TYPES, HCM_WARDS, INDUSTRIES } from '@/libs/tts/data/hcm-districts';
import AttachmentTable, { AttachmentFile, initialAttachmentFiles } from './AttachmentTable';
import EnterpriseSidebar from './EnterpriseSidebar';

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
      <span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[11px] font-medium text-gray-500">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      <div
        className={`flex h-10 items-center rounded-md border px-3 text-sm shadow-[0_1px_0_rgba(16,24,40,0.02)] transition ${
          disabled
            ? 'border-gray-200 bg-gray-50 text-gray-400'
            : error
              ? 'border-red-300 bg-white text-gray-800 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100'
              : 'border-gray-300 bg-white text-gray-800 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'
        }`}
      >
        {isAutocomplete ? (
          <div
            className="relative min-w-0 flex-1"
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
                className="w-full bg-transparent pr-7 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
              />
            ) : (
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  setSearchTerm('');
                  setAutocompleteOpen(true);
                }}
                className="w-full truncate bg-transparent pr-7 text-left outline-none disabled:cursor-not-allowed"
              >
                {selectedOption?.label || placeholder || `Chọn ${label.toLowerCase()}`}
              </button>
            )}
            {autocompleteOpen && (
              <div className="absolute left-[-13px] right-[-13px] top-8 z-40 max-h-64 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
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
          <select
            value={value}
            disabled={disabled}
            onChange={(event) => onChange?.(event.target.value)}
            className="min-w-0 flex-1 appearance-none bg-transparent pr-7 outline-none disabled:cursor-not-allowed"
          >
            <option value="">{placeholder || `Chọn ${label.toLowerCase()}`}</option>
            {options.map((option) => (
              <option key={`${option.value}-${option.label}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={inputType}
            value={value}
            disabled={disabled}
            max={max}
            placeholder={placeholder}
            onChange={(event) => onChange?.(event.target.value)}
            className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-400 ${
              action ? 'pr-16' : ''
            }`}
          />
        )}
        {action && (
          <button
            type="button"
            onClick={onActionClick}
            className="ml-2 whitespace-nowrap text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            {action}
          </button>
        )}
        {select && <ChevronDown size={17} className="ml-2 flex-shrink-0 text-gray-500" />}
        {calendar && <Calendar size={17} className="ml-2 flex-shrink-0 text-gray-500" />}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </label>
  );
}

type ProvinceApiItem = {
  code: number;
  name: string;
};

type WardApiItem = {
  code: number;
  name: string;
};

type DistrictApiItem = {
  name: string;
  wards?: WardApiItem[];
};

type ProvinceDetailApiItem = ProvinceApiItem & {
  districts?: DistrictApiItem[];
};

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

const VIETNAM_PROVINCES_API = 'https://provinces.open-api.vn/api';
const FALLBACK_PROVINCES: SelectOption[] = [
  { value: '79', label: 'Thành phố Hồ Chí Minh', name: 'Thành phố Hồ Chí Minh' },
];
const FALLBACK_WARDS_BY_PROVINCE: Record<string, SelectOption[]> = {
  '79': [
    { value: '26872', label: 'Phường Hiệp Bình Phước', name: 'Phường Hiệp Bình Phước' },
    { value: '26734', label: 'Phường Tân Định', name: 'Phường Tân Định' },
    { value: '26740', label: 'Phường Bến Nghé', name: 'Phường Bến Nghé' },
    { value: '26743', label: 'Phường Bến Thành', name: 'Phường Bến Thành' },
  ],
};

function toProvinceOptions(items: ProvinceApiItem[]): SelectOption[] {
  return items.map((item) => ({
    value: String(item.code),
    label: item.name,
    name: item.name,
  }));
}

function toWardOptions(districts: DistrictApiItem[] = []): SelectOption[] {
  const wards = districts.flatMap((district) =>
    (district.wards || []).map((ward) => ({
      code: ward.code,
      name: ward.name,
      districtName: district.name,
    })),
  );
  const nameCount = wards.reduce<Record<string, number>>((result, ward) => {
    result[ward.name] = (result[ward.name] || 0) + 1;
    return result;
  }, {});

  return wards.map((ward) => ({
    value: String(ward.code),
    label: nameCount[ward.name] > 1 ? `${ward.name} - ${ward.districtName}` : ward.name,
    name: ward.name,
  }));
}

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
    <div className="grid grid-cols-[minmax(220px,380px)_1fr] gap-8 text-sm leading-6">
      <dt className="font-bold text-gray-900">{label} :</dt>
      <dd className="font-semibold text-gray-800">{value || '-'}</dd>
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
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
            <th className="px-4 py-3">Tên file</th>
            <th className="px-4 py-3">Thông tin file</th>
            <th className="px-4 py-3 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {files.map((file) => (
            <tr key={file.id} className="text-gray-700">
              <td className="px-4 py-3">{file.name}</td>
              <td className="px-4 py-3">{file.info || 'Chưa có file'}</td>
              <td className="px-4 py-3">
                <div className="flex justify-center text-gray-400">
                  <button
                    type="button"
                    className={`transition ${
                      file.url ? 'hover:text-blue-600' : 'cursor-not-allowed opacity-50'
                    }`}
                    aria-label={`Xem ${file.name}`}
                    onClick={() => onViewFile(file)}
                  >
                    <Eye size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
    (row) => !mapped.some((attachment) => attachment.name === row.name),
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
  const [provinceOptions, setProvinceOptions] = useState<SelectOption[]>([]);
  const [registeredWardOptions, setRegisteredWardOptions] = useState<SelectOption[]>([]);
  const [wardOptions, setWardOptions] = useState<SelectOption[]>([]);
  const [registeredWardCode, setRegisteredWardCode] = useState('');
  const [operatingProvinceCode, setOperatingProvinceCode] = useState('');
  const [operatingWardCode, setOperatingWardCode] = useState('');
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [fileMessage, setFileMessage] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState<AttachmentFile[]>(initialAttachmentFiles);
  const objectUrls = useRef<Set<string>>(new Set());
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

    loadEnterpriseTypes();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    function loadRegisteredWards() {
      if (!active) return;
      setRegisteredWardOptions(
        HCM_WARDS.map((ward) => ({
          value: ward.code,
          label: `${ward.name} (${ward.district})`,
          name: ward.name,
        })),
      );
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

    async function loadProvinces() {
      setLoadingProvinces(true);
      setLocationError('');

      try {
        const response = await fetch(`${VIETNAM_PROVINCES_API}/p/`);
        if (!response.ok) throw new Error('Không tải được danh sách tỉnh/thành');

        const data = (await response.json()) as ProvinceApiItem[];
        if (!active) return;
        setProvinceOptions(toProvinceOptions(data));
      } catch {
        if (!active) return;
        setProvinceOptions(FALLBACK_PROVINCES);
        setLocationError('Không tải được danh sách tỉnh/thành đầy đủ, đang dùng dữ liệu dự phòng.');
      } finally {
        if (active) setLoadingProvinces(false);
      }
    }

    loadProvinces();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current.clear();
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
      setLocationError('');

      try {
        const response = await fetch(`${VIETNAM_PROVINCES_API}/p/${operatingProvinceCode}?depth=3`);
        if (!response.ok) throw new Error('Không tải được danh sách phường/xã');

        const data = (await response.json()) as ProvinceDetailApiItem;
        if (!active) return;
        setWardOptions(toWardOptions(data.districts));
      } catch {
        if (!active) return;
        setWardOptions(FALLBACK_WARDS_BY_PROVINCE[operatingProvinceCode] || []);
        setLocationError('Không tải được danh sách phường/xã đầy đủ, đang dùng dữ liệu dự phòng nếu có.');
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
    if (operatingProvinceCode || !form.operatingProvince || provinceOptions.length === 0) return;

    const matchedProvince = provinceOptions.find((option) => option.name === form.operatingProvince);
    if (matchedProvince) {
      setOperatingProvinceCode(matchedProvince.value);
    }
  }, [form.operatingProvince, operatingProvinceCode, provinceOptions]);

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
  }

  function handleRegisteredWardChange(wardCode: string) {
    const ward = registeredWardOptions.find((option) => option.value === wardCode);

    setRegisteredWardCode(wardCode);
    updateField('registeredWard', ward?.name || '');
  }

  function handleIndustryChange(industryValue: string) {
    updateField('mainIndustry', industryValue);
  }

  async function saveEnterpriseChanges() {
    const token = authToken || getAuthToken();
    if (!token || !enterpriseId) {
      setSaveMessage('Không tìm thấy thông tin doanh nghiệp để cập nhật.');
      return;
    }

    const phoneError = getPhoneError(form.officePhone);
    const leaderPhoneError = getPhoneError(form.representativePhone);
    if (phoneError || leaderPhoneError) {
      setSaveMessage('Vui lòng kiểm tra lại số điện thoại trước khi lưu.');
      return;
    }

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
    objectUrls.current.delete(url);
  }

  function handleAttachmentFilesChange(files: AttachmentFile[]) {
    files.forEach((file) => {
      if (file.url) objectUrls.current.add(file.url);
    });
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
  const industryOptions = INDUSTRIES.map((industry) => ({
    value: industry,
    label: industry,
  }));
  const selectedEnterpriseTypeValue = form.businessTypeId || (form.businessType ? `name:${form.businessType}` : '');
  const todayDateValue = getTodayDateValue();
  const officePhoneError = getPhoneError(form.officePhone);
  const representativePhoneError = getPhoneError(form.representativePhone);
  const hasPhoneError = Boolean(officePhoneError || representativePhoneError);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      <EnterpriseSidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">Thông tin doanh nghiệp</h1>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm font-medium text-gray-500 transition hover:text-gray-800"
            >
              {step === 1 ? 'Huỷ bỏ' : 'Trở về'}
            </button>
            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={loadingEnterprise || saveLoading || !enterpriseId || hasPhoneError}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {step === 1 ? (
                <>
                  Tiếp tục
                  <ChevronRight size={17} />
                </>
              ) : (
                <>
                  <Check size={16} />
                  {saveLoading ? 'Đang lưu...' : 'Xác nhận'}
                </>
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Stepper currentStep={step} />

          <div className="mx-auto w-full max-w-[1580px] px-6 pb-8">
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
                <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-lg font-bold text-gray-900">Thêm mới doanh nghiệp</h2>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <Field
                      label="Tên doanh nghiệp"
                      required
                      value={form.companyName}
                      onChange={(value) => updateField('companyName', value)}
                    />
                    <Field label="Mã số thuế" required disabled value={form.taxCode} />
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
                      onChange={handleBusinessTypeChange}
                    />

                    <Field
                      label="Ngành nghề kinh doanh chính"
                      required
                      select
                      value={form.mainIndustry}
                      options={industryOptions}
                      placeholder="Chọn ngành nghề kinh doanh chính"
                      onChange={handleIndustryChange}
                    />
                    <Field
                      label="Ngày cấp GPKD"
                      required
                      calendar
                      inputType="date"
                      value={form.licenseDate}
                      max={todayDateValue}
                      onChange={handleLicenseDateChange}
                    />
                    <Field
                      label="Tỉnh/Thành phố ĐKKD"
                      required
                      disabled
                      value={form.registeredProvince}
                    />

                    <Field
                      label="Phường/Xã ĐKKD"
                      required
                      select
                      value={registeredWardCode}
                      options={registeredWardOptions}
                      placeholder="Chọn Phường/Xã ĐKKD"
                      onChange={handleRegisteredWardChange}
                    />
                    <Field
                      label="Địa chỉ"
                      required
                      className="lg:col-span-2"
                      value={form.address}
                      onChange={(value) => updateField('address', value)}
                    />
                  </div>
                </section>

                <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-lg font-bold text-gray-900">Thông tin liên hệ</h2>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
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
                      onChange={(value) => updateField('email', value)}
                    />
                    <Field
                      label="Số điện thoại cơ quan"
                      placeholder="Số điện thoại cơ quan"
                      value={form.officePhone}
                      error={officePhoneError}
                      onChange={(value) => updateField('officePhone', cleanPhone(value))}
                    />

                    <Field
                      label="Tỉnh/TP hoạt động KD"
                      select
                      placeholder={loadingProvinces ? 'Đang tải tỉnh/thành...' : 'Chọn Tỉnh/TP hoạt động KD'}
                      value={operatingProvinceCode}
                      options={provinceOptions}
                      disabled={loadingProvinces}
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
                      onChange={handleOperatingWardChange}
                    />
                    <Field
                      label="Địa điểm kinh doanh"
                      placeholder="Địa điểm kinh doanh"
                      value={form.businessLocation}
                      onChange={(value) => updateField('businessLocation', value)}
                    />

                    <Field
                      label="Người đứng đầu doanh nghiệp"
                      placeholder="Người đứng đầu doanh nghiệp"
                      value={form.representativeName}
                      onChange={(value) => updateField('representativeName', value)}
                    />
                    <Field
                      label="SĐT liên hệ người đứng đầu"
                      className="lg:col-span-2"
                      placeholder="SĐT liên hệ người đứng đầu"
                      value={form.representativePhone}
                      error={representativePhoneError}
                      onChange={(value) => updateField('representativePhone', cleanPhone(value))}
                    />
                  </div>
                  {locationError && (
                    <p className="mt-3 text-sm font-medium text-amber-600">{locationError}</p>
                  )}
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-lg font-bold text-gray-900">File đính kèm</h2>
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
                <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-lg font-bold text-gray-900">Thông tin về hồ sơ</h2>
                  <dl className="space-y-3">
                    <InfoRow label="Mã số thuế" value={form.taxCode} />
                    <InfoRow label="Tên doanh nghiệp" value={form.companyName} />
                    <InfoRow label="Tên viết bằng tiếng nước ngoài" value={form.foreignName || 'VNA Group'} />
                    <InfoRow label="Email" value={form.email} />
                    <InfoRow label="Ngày cấp GPKD" value={formatDate(form.licenseDate)} />
                    <InfoRow label="Loại hình kinh doanh" value={form.businessType} />
                    <InfoRow label="Ngành nghề kinh doanh" value={form.mainIndustry} />
                    <InfoRow
                      label="Địa chỉ đăng kí giấy phép kinh doanh"
                      value={registeredAddress}
                    />
                    <InfoRow
                      label="Địa điểm kinh doanh"
                      value={operatingAddress}
                    />
                    <InfoRow
                      label="Người đứng đầu doanh nghiệp"
                      value={form.representativeName || '111111'}
                    />
                    <InfoRow
                      label="SĐT người đứng đầu"
                      value={form.representativePhone || '0932768093'}
                    />
                  </dl>
                </section>

                {fileMessage && (
                  <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
                    {fileMessage}
                  </div>
                )}
                <ConfirmAttachmentTable files={attachmentFiles} onViewFile={handleViewAttachment} />
              </>
            )}
          </div>
        </div>
      </main>

      <ChangeEmailModal
        open={showChangeEmailModal}
        onClose={() => setShowChangeEmailModal(false)}
        currentEmail={form.email}
        token={authToken}
        onSuccess={handleEmailChanged}
      />
    </div>
  );
}
