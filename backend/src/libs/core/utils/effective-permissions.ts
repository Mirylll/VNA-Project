import { Permission } from '../../../modules/permissions/entities/permission.entity';
import { User } from '../../../modules/users/entities/user.entity';

export function getEffectivePermissions(user: User): Permission[] {
  return user.role?.permissions || [];
}
