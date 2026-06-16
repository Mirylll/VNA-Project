import { Permission } from '../../../modules/permissions/entities/permission.entity';
import { User } from '../../../modules/users/entities/user.entity';

const MANAGER_ADMIN_PERMISSIONS = new Set([
  'ADMIN_C_DEPARTMENT_VIEW',
  'ADMIN_C_DEPARTMENT_CREATE',
  'ADMIN_C_DEPARTMENT_UPDATE',
  'ADMIN_C_ROLE_VIEW',
  'ADMIN_C_USER_VIEW',
  'ADMIN_C_USER_CREATE',
  'ADMIN_C_USER_UPDATE',
  'ADMIN_C_PERMISSION_VIEW',
  'ADMIN_C_REPORT_VIEW',
  'ADMIN_C_ENTERPRISE_VIEW',
  'ADMIN_C_ENTERPRISE_CREATE',
  'ADMIN_C_ENTERPRISE_UPDATE',
]);

const EMPLOYEE_ADMIN_PERMISSIONS = new Set([
  'ADMIN_C_DEPARTMENT_VIEW',
  'ADMIN_C_USER_VIEW',
  'ADMIN_C_REPORT_VIEW',
  'ADMIN_C_ENTERPRISE_VIEW',
]);

export function getEffectivePermissions(user: User): Permission[] {
  const permissions = user.role?.permissions || [];
  const roleCode = user.role?.code;
  const titleName = user.title?.name;

  if (roleCode !== 'ROLE_ADMIN') {
    return permissions;
  }

  if (titleName === 'CEO') {
    return permissions.filter((permission) => permission.code.startsWith('ADMIN_'));
  }

  if (titleName === 'Manager') {
    return permissions.filter((permission) => MANAGER_ADMIN_PERMISSIONS.has(permission.code));
  }

  if (titleName === 'Employee') {
    return permissions.filter((permission) => EMPLOYEE_ADMIN_PERMISSIONS.has(permission.code));
  }

  return [];
}
