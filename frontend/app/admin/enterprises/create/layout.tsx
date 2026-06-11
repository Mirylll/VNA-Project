"use client";

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { EnterpriseFormProvider } from '@/libs/tts/contexts/EnterpriseFormContext';

export default function CreateEnterpriseLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = pathname.endsWith('/step-2') ? 2 : 1;

  return (
    <EnterpriseFormProvider>
      <div className="p-6">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              1
            </div>
            <span
              className={`text-sm font-semibold ${
                currentStep === 1 ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              Thông tin doanh nghiệp
            </span>
          </div>
          <div className="w-20 h-px bg-gray-300 mx-3" />
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 2
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              2
            </div>
            <span
              className={`text-sm font-semibold ${
                currentStep === 2 ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              Xác nhận đăng ký
            </span>
          </div>
        </div>
        {children}
      </div>
    </EnterpriseFormProvider>
  );
}
