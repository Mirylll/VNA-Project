"use client";

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserProfilePopup from '@/libs/tts/components/UserProfilePopup';
import Sidebar from '@/libs/tts/components/Sidebar';
import { getAuthToken, getAuthUser } from '@/libs/core/utils/auth-token';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [checking, setChecking] = useState(true);
  const isEnterprisePage = pathname.startsWith('/enterprise');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = getAuthToken();
      const user = getAuthUser();
      const isLogin = pathname === '/login';

      setIsAuthenticated(!!token);
      setIsLoginPage(isLogin);
      setChecking(false);

      if (!token && !isLogin) {
        router.replace('/login');
        return;
      }

      if (token && isLogin) {
        router.replace(user?.role?.code === 'ROLE_ENTERPRISE' ? '/enterprise/company-info' : '/admin/permissions');
        return;
      }

      if (token && user?.role?.code === 'ROLE_ENTERPRISE' && pathname.startsWith('/admin')) {
        router.replace('/enterprise/company-info');
        return;
      }

      if (token && user?.role?.code === 'ROLE_ADMIN' && pathname.startsWith('/enterprise')) {
        router.replace('/admin/permissions');
      }
    }
  }, [pathname, router]);

  if (checking) return null;

  return (
    <>
      {!isLoginPage && !isEnterprisePage && isAuthenticated && <Sidebar />}
      <div className={!isLoginPage && !isEnterprisePage && isAuthenticated ? 'ml-64' : ''}>
        {children}
      </div>
      {!isLoginPage && isAuthenticated && <UserProfilePopup />}
    </>
  );
}
