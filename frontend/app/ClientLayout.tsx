"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserProfilePopup from '@/libs/tts/components/UserProfilePopup';
import Sidebar from '@/libs/tts/components/Sidebar';
import EnterpriseSidebar from '@/libs/tts/components/enterprise/EnterpriseSidebar';
import { getAuthToken, getAuthUser } from '@/libs/core/utils/auth-token';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEnterprise, setIsEnterprise] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = getAuthToken();
      const user = getAuthUser();
      const enterprise = user?.accountType === 'enterprise' || user?.role?.code === 'ROLE_ENTERPRISE';
      setIsAuthenticated(!!token);
      setIsEnterprise(enterprise);
      setIsLoginPage(pathname === '/login');
      setChecking(false);
    }
  }, [pathname]);

  if (checking) return null;

  const sidebarWidth = isEnterprise ? 'ml-[260px]' : 'ml-64';

  return (
    <>
      {!isLoginPage && isAuthenticated && (isEnterprise ? <EnterpriseSidebar /> : <Sidebar />)}
      <div className={!isLoginPage && isAuthenticated ? sidebarWidth : ''}>{children}</div>
      {!isLoginPage && isAuthenticated && <UserProfilePopup />}
    </>
  );
}
