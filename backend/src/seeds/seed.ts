import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Permission } from '../modules/permissions/entities/permission.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/users/entities/user.entity';
import { Title } from '../modules/titles/entities/title.entity';

interface PermissionSeed {
  code: string;
  name: string;
  type: 'Group' | 'Component';
  children?: { code: string; name: string }[];
}

const permissionGroups: PermissionSeed[] = [
  {
    code: 'ADMIN_G_DEPARTMENT',
    name: 'Department Group',
    type: 'Group',
    children: [
      { code: 'ADMIN_C_DEPARTMENT_VIEW', name: 'View Department' },
      { code: 'ADMIN_C_DEPARTMENT_CREATE', name: 'Create Department' },
      { code: 'ADMIN_C_DEPARTMENT_UPDATE', name: 'Update Department' },
      { code: 'ADMIN_C_DEPARTMENT_DELETE', name: 'Delete Department' },
    ],
  },
  {
    code: 'ADMIN_G_ROLE',
    name: 'Role Group',
    type: 'Group',
    children: [
      { code: 'ADMIN_C_ROLE_VIEW', name: 'View Role' },
      { code: 'ADMIN_C_ROLE_CREATE', name: 'Create Role' },
      { code: 'ADMIN_C_ROLE_UPDATE', name: 'Update Role' },
      { code: 'ADMIN_C_ROLE_DELETE', name: 'Delete Role' },
    ],
  },
  {
    code: 'ADMIN_G_USER',
    name: 'User Group',
    type: 'Group',
    children: [
      { code: 'ADMIN_C_USER_VIEW', name: 'View User' },
      { code: 'ADMIN_C_USER_CREATE', name: 'Create User' },
      { code: 'ADMIN_C_USER_UPDATE', name: 'Update User' },
      { code: 'ADMIN_C_USER_DELETE', name: 'Delete User' },
    ],
  },
  {
    code: 'ADMIN_G_PERMISSION',
    name: 'Permission Group',
    type: 'Group',
    children: [
      { code: 'ADMIN_C_PERMISSION_VIEW', name: 'View Permission' },
      { code: 'ADMIN_C_PERMISSION_ASSIGN', name: 'Assign Permission' },
    ],
  },
  {
    code: 'ADMIN_G_REPORT',
    name: 'Report Group',
    type: 'Group',
    children: [
      { code: 'ADMIN_C_REPORT_VIEW', name: 'View Report' },
    ],
  },
  {
    code: 'ADMIN_G_ENTERPRISE',
    name: 'Enterprise Management Group',
    type: 'Group',
    children: [
      { code: 'ADMIN_C_ENTERPRISE_VIEW', name: 'View Enterprise' },
      { code: 'ADMIN_C_ENTERPRISE_CREATE', name: 'Create Enterprise' },
      { code: 'ADMIN_C_ENTERPRISE_UPDATE', name: 'Update Enterprise' },
      { code: 'ADMIN_C_ENTERPRISE_DELETE', name: 'Delete Enterprise' },
    ],
  },
  {
    code: 'ENTERPRISE_G_PROFILE',
    name: 'Enterprise Profile Group',
    type: 'Group',
    children: [
      { code: 'ENTERPRISE_C_PROFILE_VIEW', name: 'View Enterprise Profile' },
      { code: 'ENTERPRISE_C_PROFILE_UPDATE', name: 'Update Enterprise Profile' },
    ],
  },
  {
    code: 'ENTERPRISE_G_ATTACHMENT',
    name: 'Enterprise Attachment Group',
    type: 'Group',
    children: [
      { code: 'ENTERPRISE_C_ATTACHMENT_VIEW', name: 'View Enterprise Attachment' },
      { code: 'ENTERPRISE_C_ATTACHMENT_UPLOAD', name: 'Upload Enterprise Attachment' },
      { code: 'ENTERPRISE_C_ATTACHMENT_DELETE', name: 'Delete Enterprise Attachment' },
    ],
  },
  {
    code: 'ENTERPRISE_G_CONTRACT',
    name: 'Enterprise Contract Group',
    type: 'Group',
    children: [
      { code: 'ENTERPRISE_C_CONTRACT_VIEW', name: 'View Enterprise Contract' },
      { code: 'ENTERPRISE_C_CONTRACT_CREATE', name: 'Create Enterprise Contract' },
      { code: 'ENTERPRISE_C_CONTRACT_UPDATE', name: 'Update Enterprise Contract' },
    ],
  },
  {
    code: 'ENTERPRISE_G_REPORT',
    name: 'Enterprise Report Group',
    type: 'Group',
    children: [
      { code: 'ENTERPRISE_C_REPORT_VIEW', name: 'View Enterprise Report' },
      { code: 'ENTERPRISE_C_REPORT_SUBMIT', name: 'Submit Enterprise Report' },
    ],
  },
];

const roleSeeds = [
  { code: 'ROLE_ADMIN', name: 'Admin' },
  { code: 'ROLE_ENTERPRISE', name: 'Enterprise' },
];

const titleSeeds = [
  'CEO',
  'Manager',
  'Employee',
];

const userSeeds = [
  {
    username: 'ceo',
    password: 'ceo123',
    fullName: 'CEO Account',
    email: 'ceo@vna.local',
    roleCode: 'ROLE_ADMIN',
    titleName: 'CEO',
  },
  {
    username: 'manager',
    password: 'manager123',
    fullName: 'Manager Account',
    email: 'manager@vna.local',
    roleCode: 'ROLE_ADMIN',
    titleName: 'Manager',
  },
  {
    username: 'employee',
    password: 'employee123',
    fullName: 'Employee Account',
    email: 'employee@vna.local',
    roleCode: 'ROLE_ADMIN',
    titleName: 'Employee',
  },
  {
    username: 'enterprise',
    password: 'enterprise123',
    fullName: 'Enterprise Account',
    email: 'enterprise@vna.local',
    roleCode: 'ROLE_ENTERPRISE',
  },
];

export async function seed(dataSource: DataSource): Promise<void> {
  const permissionRepo = dataSource.getRepository(Permission);
  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);
  const titleRepo = dataSource.getRepository(Title);

  // ---- Permissions ----
  let sortOrder = 0;
  for (const group of permissionGroups) {
    let parent = await permissionRepo.findOne({ where: { code: group.code } });
    if (!parent) {
      parent = permissionRepo.create({
        code: group.code,
        name: group.name,
        type: 'Group',
        sortOrder,
      });
      parent = await permissionRepo.save(parent);
    }

    if (group.children) {
      let childSort = 0;
      for (const child of group.children) {
        const existingChild = await permissionRepo.findOne({ where: { code: child.code } });
        if (!existingChild) {
          const childPerm = permissionRepo.create({
            code: child.code,
            name: child.name,
            type: 'Component',
            parent,
            sortOrder: childSort,
          });
          await permissionRepo.save(childPerm);
        }
        childSort++;
      }
    }
    sortOrder++;
  }
  console.log('✅ Seeded permissions');

  // ---- Titles ----
  for (const name of titleSeeds) {
    const title = await titleRepo.findOne({ where: { name } });
    if (!title) {
      await titleRepo.save(titleRepo.create({ name }));
    }
  }
  console.log('✅ Seeded titles');

  // ---- Roles ----
  const savedRoles = new Map<string, Role>();
  for (const r of roleSeeds) {
    let role = await roleRepo.findOne({ where: { code: r.code } });
    if (!role) {
      role = roleRepo.create({ code: r.code, name: r.name });
      role = await roleRepo.save(role);
    }
    savedRoles.set(r.code, role);
  }
  const newRoleCount = await roleRepo.count();
  console.log(`ℹ️  ${newRoleCount} roles in DB`);

  // ---- Role Permissions ----
  const allComps = await permissionRepo.find({ where: { type: 'Component' } });

  const adminRole = await roleRepo.findOne({
    where: { code: 'ROLE_ADMIN' },
    relations: ['permissions'],
  });
  if (adminRole) {
    adminRole.permissions = allComps.filter((p) => p.code.startsWith('ADMIN_'));
    await roleRepo.save(adminRole);
  }

  const enterpriseRole = await roleRepo.findOne({
    where: { code: 'ROLE_ENTERPRISE' },
    relations: ['permissions'],
  });
  if (enterpriseRole) {
    enterpriseRole.permissions = allComps.filter((p) => p.code.startsWith('ENTERPRISE_'));
    await roleRepo.save(enterpriseRole);
  }
  console.log('✅ Seeded role_permissions');

  // ---- Users ----
  for (const item of userSeeds) {
    const existingUser = await userRepo.findOne({
      where: { username: item.username },
    });

    if (!existingUser) {
      const role = savedRoles.get(item.roleCode);
      const title = item.titleName
        ? await titleRepo.findOne({ where: { name: item.titleName } })
        : null;
      const passwordHash = await bcrypt.hash(item.password, 10);

      await userRepo.save(
        userRepo.create({
          username: item.username,
          passwordHash,
          fullName: item.fullName,
          email: item.email,
          isActive: true,
          role: role || undefined,
          title: title || undefined,
        }),
      );
    }
  }
  console.log('✅ Seeded users');
}
