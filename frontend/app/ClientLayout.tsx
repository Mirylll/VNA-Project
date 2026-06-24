"use client";

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserProfilePopup from '@/libs/tts/components/UserProfilePopup';
import Sidebar from '@/libs/tts/components/Sidebar';
import { getAuthToken, getAuthUser, type AuthUser } from '@/libs/core/utils/auth-token';

const adminRoutePermissions = [
  { route: '/admin/permissions', permission: 'ADMIN_C_PERMISSION_VIEW' },
  { route: '/admin/roles', permission: 'ADMIN_C_ROLE_VIEW' },
  { route: '/admin/users', permission: 'ADMIN_C_USER_VIEW' },
  { route: '/admin/enterprise-types', permission: 'ADMIN_C_ENTERPRISE_TYPE_VIEW' },
  { route: '/admin/industries', permission: 'ADMIN_C_INDUSTRY_VIEW' },
  { route: '/admin/enterprises', permission: 'ADMIN_C_ENTERPRISE_VIEW' },
  { route: '/admin/report-periods', permission: 'ADMIN_C_REPORT_PERIOD_VIEW' },
  { route: '/admin/tnld-categories', permission: 'ADMIN_C_TNLD_CATEGORY_VIEW' },
  { route: '/admin/tnld-contracts', permission: 'ADMIN_C_TNLD_CONTRACT_VIEW' },
];

function getPermissionCodes(user: AuthUser | null) {
  return new Set(user?.permissions?.map((permission) => permission.code) || []);
}

function getFirstAllowedAdminRoute(user: AuthUser | null) {
  const permissionCodes = getPermissionCodes(user);
  return (
    adminRoutePermissions.find((item) => permissionCodes.has(item.permission))?.route ||
    '/admin/account'
  );
}

function getRequiredPermissionForPath(pathname: string) {
  return adminRoutePermissions.find(
    (item) => pathname === item.route || pathname.startsWith(`${item.route}/`),
  )?.permission;
}

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
      const isEnterpriseAccount = user?.accountType === 'enterprise' || user?.role?.code === 'ROLE_ENTERPRISE';

      if (!token && !isLogin) {
        router.replace('/login');
        return;
      }

      if (token && isLogin) {
        router.replace(isEnterpriseAccount ? '/enterprise/company-info' : getFirstAllowedAdminRoute(user));
        return;
      }

      if (token && isEnterpriseAccount && pathname.startsWith('/admin')) {
        router.replace('/enterprise/company-info');
        return;
      }

      if (token && !isEnterpriseAccount && pathname.startsWith('/enterprise')) {
        router.replace(getFirstAllowedAdminRoute(user));
        return;
      }

      if (token && !isEnterpriseAccount && pathname === '/admin') {
        router.replace(getFirstAllowedAdminRoute(user));
        return;
      }

      if (token && !isEnterpriseAccount && pathname.startsWith('/admin')) {
        const requiredPermission = getRequiredPermissionForPath(pathname);
        if (requiredPermission && !getPermissionCodes(user).has(requiredPermission)) {
          router.replace(getFirstAllowedAdminRoute(user));
        }
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
