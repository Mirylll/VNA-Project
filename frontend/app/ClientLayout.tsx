"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserProfilePopup from '@/libs/tts/components/UserProfilePopup';
import Sidebar from '@/libs/tts/components/Sidebar';
import { getAuthToken } from '@/libs/core/utils/auth-token';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Only run once on client side
    if (typeof window !== 'undefined') {
      const token = getAuthToken();
      setIsAuthenticated(!!token);
      setIsLoginPage(pathname === '/login');
      setChecking(false); // Only set to false after auth check is complete
    }
  }, [pathname]);

  // While checking auth, render nothing to prevent redirect loop
  if (checking) return null;

  return (
    <>
      {!isLoginPage && isAuthenticated && <Sidebar />}
      <div className={!isLoginPage && isAuthenticated ? 'ml-64' : ''}>{children}</div>
      {!isLoginPage && isAuthenticated && <UserProfilePopup />}
    </>
  );
}
