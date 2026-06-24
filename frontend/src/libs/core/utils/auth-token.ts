export type AuthUser = {
  id: string;
  username: string;
  email?: string | null;
  fullName: string;
  accountType?: 'internal' | 'enterprise';
  role?: {
    id: string;
    code: string;
    name: string;
  } | null;
  title?: {
    id: string;
    name: string;
  } | null;
  permissions?: Array<{
    id: string;
    code: string;
    name: string;
  }>;
};

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export function setAuthSession(token: string, user: AuthUser, remember: boolean) {
  if (typeof window === 'undefined') return;

  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;

  storage.setItem('token', token);
  storage.setItem('authUser', JSON.stringify(user));
  otherStorage.removeItem('token');
  otherStorage.removeItem('authUser');
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function hasPermission(permissionCode: string) {
  const user = getAuthUser();
  return user?.permissions?.some((permission) => permission.code === permissionCode) || false;
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('authUser');
  sessionStorage.removeItem('authUser');
}
