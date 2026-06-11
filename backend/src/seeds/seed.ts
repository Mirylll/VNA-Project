import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Permission } from '../modules/permissions/entities/permission.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/users/entities/user.entity';
import { Title } from '../modules/titles/entities/title.entity';
import { Province } from '../modules/users/entities/province.entity';
import { District } from '../modules/users/entities/district.entity';

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
];

const roleSeeds = [
  { code: 'ADMIN', name: 'Quản trị viên' },
  { code: 'MANAGER', name: 'Manager' },
  { code: 'EMPLOYEE', name: 'Employee' },
  { code: 'CEO', name: 'CEO' },
];

const titleSeeds = [
  'Giám đốc',
  'Trưởng phòng',
  'Nhân viên',
  'Kế toán',
  'Quản trị viên',
];

// 20 phường + 10 xã phổ biến TP.HCM (post-merger 2025 structure)
// To add more: insert new { name, type } entries and re-run seeder
const WARDS = [
  { name: 'Bến Thành',     type: 'phuong' },
  { name: 'Bàn Cờ',        type: 'phuong' },
  { name: 'Xuân Hòa',      type: 'phuong' },
  { name: 'Khánh Hội',     type: 'phuong' },
  { name: 'An Đông',       type: 'phuong' },
  { name: 'Bình Phú',      type: 'phuong' },
  { name: 'Bình Tây',      type: 'phuong' },
  { name: 'Tân Thuận Đông',type: 'phuong' },
  { name: 'Bình Đông',     type: 'phuong' },
  { name: 'Tân Thới Nhất', type: 'phuong' },
  { name: 'An Phú Đông',   type: 'phuong' },
  { name: 'An Lạc',        type: 'phuong' },
  { name: 'Bình Tân',      type: 'phuong' },
  { name: 'Bình Hưng Hòa', type: 'phuong' },
  { name: 'Bình Quới',     type: 'phuong' },
  { name: 'Bình Lợi Trung',type: 'phuong' },
  { name: 'An Nhơn',       type: 'phuong' },
  { name: 'An Hội Tây',    type: 'phuong' },
  { name: 'Bảy Hiền',      type: 'phuong' },
  { name: 'An Khánh',      type: 'phuong' },
  { name: 'Bình Hưng',     type: 'xa'    },
  { name: 'Vĩnh Lộc A',    type: 'xa'    },
  { name: 'Vĩnh Lộc B',    type: 'xa'    },
  { name: 'Lê Minh Xuân',  type: 'xa'    },
  { name: 'Tân Kiên',      type: 'xa'    },
  { name: 'Phước Kiển',    type: 'xa'    },
  { name: 'Phú Xuân',      type: 'xa'    },
  { name: 'Nhơn Đức',      type: 'xa'    },
  { name: 'Tân Thới Nhì',  type: 'xa'    },
  { name: 'An Phú',        type: 'xa'    },
];

export async function seed(dataSource: DataSource): Promise<void> {
  const permissionRepo = dataSource.getRepository(Permission);
  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);
  const titleRepo = dataSource.getRepository(Title);

  // ---- Permissions ----
  const permCount = await permissionRepo.count();
  if (permCount === 0) {
    let sortOrder = 0;
    for (const group of permissionGroups) {
      const parent = permissionRepo.create({
        code: group.code,
        name: group.name,
        type: 'Group',
        sortOrder: sortOrder++,
      });
      const savedParent = await permissionRepo.save(parent);

      if (group.children) {
        let childSort = 0;
        for (const child of group.children) {
          const childPerm = permissionRepo.create({
            code: child.code,
            name: child.name,
            type: 'Component',
            parent: savedParent,
            sortOrder: childSort++,
          });
          await permissionRepo.save(childPerm);
        }
      }
    }
    console.log('✅ Seeded permissions');
  }

  // ---- Titles ----
  const titleCount = await titleRepo.count();
  if (titleCount === 0) {
    for (const name of titleSeeds) {
      await titleRepo.save(titleRepo.create({ name }));
    }
    console.log('✅ Seeded titles');
  }

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
  const rpCount = await dataSource.getRepository('role_permissions').count();
  if (rpCount === 0) {
    const allComps = await permissionRepo.find({ where: { type: 'Component' } });

    // CEO gets all permissions
    const ceoRole = savedRoles.get('CEO');
    if (ceoRole) {
      ceoRole.permissions = allComps;
      await roleRepo.save(ceoRole);
    }

    // Manager gets VIEW, CREATE, UPDATE (not DELETE) + REPORT
    const managerRole = savedRoles.get('MANAGER');
    if (managerRole) {
      managerRole.permissions = allComps.filter((p) =>
        p.code.endsWith('_VIEW') ||
        p.code.endsWith('_CREATE') ||
        p.code.endsWith('_UPDATE') ||
        p.code === 'ADMIN_C_PERMISSION_ASSIGN' ||
        p.code === 'ADMIN_C_REPORT_VIEW',
      );
      await roleRepo.save(managerRole);
    }

    // Employee gets VIEW only + REPORT
    const employeeRole = savedRoles.get('EMPLOYEE');
    if (employeeRole) {
      employeeRole.permissions = allComps.filter((p) =>
        p.code.endsWith('_VIEW') || p.code === 'ADMIN_C_REPORT_VIEW',
      );
      await roleRepo.save(employeeRole);
    }

    // Legacy Admin role gets all permissions
    const adminRole = await roleRepo.findOne({ where: { code: 'ADMIN' } });
    if (adminRole) {
      adminRole.permissions = allComps;
      await roleRepo.save(adminRole);
    }

    console.log('✅ Seeded role_permissions');
  }

  // ---- Admin User ----
  const adminUsername = process.env.SEED_ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@vna.local';
  const adminFullName = process.env.SEED_ADMIN_FULL_NAME || 'Administrator';

  const existingAdmin = await userRepo.findOne({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const adminRole = savedRoles.get('CEO');
    const adminTitle = await titleRepo.findOne({ where: { name: 'Giám đốc' } });
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const admin = userRepo.create({
      username: adminUsername,
      passwordHash,
      fullName: adminFullName,
      email: adminEmail,
      isActive: true,
      role: adminRole || undefined,
      title: adminTitle || undefined,
    });

    await userRepo.save(admin);
    console.log('✅ Seeded admin user');
  }

  // ---- Province ----
  const provinceRepo = dataSource.getRepository(Province);
  const provinceCount = await provinceRepo.count();
  if (provinceCount === 0) {
    await provinceRepo.save(provinceRepo.create({ id: 1, name: 'Thành phố Hồ Chí Minh' }));
    console.log('✅ Seeded province: Thành phố Hồ Chí Minh');
  }

  // ---- HCMC Wards ----
  const districtRepo = dataSource.getRepository(District);
  const province = await provinceRepo.findOne({ where: { id: 1 } });
  if (!province) {
    console.warn('⚠️  Province id=1 not found, skipping HCMC wards seed');
  } else {
    let inserted = 0;
    let skipped = 0;
    for (const ward of WARDS) {
      const exists = await districtRepo.findOne({
        where: { name: ward.name, province: { id: 1 } },
      });
      if (exists) { skipped++; continue; }
      await districtRepo.save(districtRepo.create({ name: ward.name, province }));
      inserted++;
    }
    if (inserted > 0 || skipped > 0) {
      console.log(`✅ HCMC wards seeded: ${inserted} inserted, ${skipped} skipped.`);
    }
  }
}
