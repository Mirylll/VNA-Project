"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface AttachmentFile {
  name: string;
  fileName: string;
  url?: string;
  size?: string;
  file?: File;
  id?: number;
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
  deletedAttachmentIds: number[];
  markAttachmentForDelete: (id: number) => void;
  clearDeletedAttachments: () => void;
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
  attachments: [],
};

const EnterpriseFormContext = createContext<EnterpriseFormContextType | null>(null);

export function EnterpriseFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<EnterpriseFormData>(defaultFormData);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<number[]>([]);

  const updateField = useCallback((field: keyof EnterpriseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateAttachments = useCallback((files: AttachmentFile[]) => {
    setFormData((prev) => ({ ...prev, attachments: files }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setDeletedAttachmentIds([]);
  }, []);

  const loadFromApi = useCallback((data: Partial<EnterpriseFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const markAttachmentForDelete = useCallback((id: number) => {
    setDeletedAttachmentIds((prev) => [...prev, id]);
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== id),
    }));
  }, []);

  const clearDeletedAttachments = useCallback(() => {
    setDeletedAttachmentIds([]);
  }, []);

  return (
    <EnterpriseFormContext.Provider
      value={{
        formData,
        updateField,
        updateAttachments,
        resetForm,
        loadFromApi,
        deletedAttachmentIds,
        markAttachmentForDelete,
        clearDeletedAttachments,
      }}
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
