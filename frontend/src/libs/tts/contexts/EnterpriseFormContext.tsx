"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AttachmentFile {
  name: string;
  fileName: string;
}

export interface EnterpriseFormData {
  name: string;
  taxCode: string;
  enterpriseTypeId: string;
  industryId: string;
  licenseDate: string;
  provinceId: string;
  wardId: string;
  address: string;
  foreignName: string;
  email: string;
  phone: string;
  operationProvinceId: string;
  operationWardId: string;
  operationAddress: string;
  leaderName: string;
  leaderPhone: string;
  attachments: AttachmentFile[];
}

interface EnterpriseFormContextType {
  formData: EnterpriseFormData;
  updateField: (field: keyof EnterpriseFormData, value: any) => void;
  updateAttachments: (files: AttachmentFile[]) => void;
  resetForm: () => void;
  loadFromApi: (data: Partial<EnterpriseFormData>) => void;
}

const defaultFormData: EnterpriseFormData = {
  name: '',
  taxCode: '',
  enterpriseTypeId: '',
  industryId: '',
  licenseDate: '',
  provinceId: '',
  wardId: '',
  address: '',
  foreignName: '',
  email: '',
  phone: '',
  operationProvinceId: '',
  operationWardId: '',
  operationAddress: '',
  leaderName: '',
  leaderPhone: '',
  attachments: [
    { name: 'Giấy phép kinh doanh', fileName: 'GPKD.pdf' },
    { name: 'Giấy tờ khác', fileName: 'GTK1.pdf' },
  ],
};

const EnterpriseFormContext = createContext<EnterpriseFormContextType | null>(null);

export function EnterpriseFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<EnterpriseFormData>(defaultFormData);

  const updateField = useCallback((field: keyof EnterpriseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateAttachments = useCallback((files: AttachmentFile[]) => {
    setFormData((prev) => ({ ...prev, attachments: files }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
  }, []);

  const loadFromApi = useCallback((data: Partial<EnterpriseFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  return (
    <EnterpriseFormContext.Provider
      value={{ formData, updateField, updateAttachments, resetForm, loadFromApi }}
    >
      {children}
    </EnterpriseFormContext.Provider>
  );
}

export function useEnterpriseForm() {
  const ctx = useContext(EnterpriseFormContext);
  if (!ctx) throw new Error('useEnterpriseForm must be used within EnterpriseFormProvider');
  return ctx;
}
