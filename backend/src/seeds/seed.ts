import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Permission } from '../modules/permissions/entities/permission.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/users/entities/user.entity';
import { Title } from '../modules/titles/entities/title.entity';
import { Province } from '../modules/users/entities/province.entity';
import { District } from '../modules/users/entities/district.entity';
import { EnterpriseType } from '../modules/enterprise-types/entities/enterprise-type.entity';
import { Industry } from '../modules/industries/entities/industry.entity';
import { Enterprise } from '../modules/enterprises/entities/enterprise.entity';

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

  // ---- Enterprise Types ----
  const enterpriseTypeRepo = dataSource.getRepository(EnterpriseType);
  const etCount = await enterpriseTypeRepo.count();
  if (etCount === 0) {
    const types = [
      { code: 'CP', name: 'Công ty cổ phần' },
      { code: 'TNHH', name: 'Công ty TNHH' },
      { code: 'TNHH1TV', name: 'Công ty TNHH 1 thành viên' },
      { code: 'DNTN', name: 'Doanh nghiệp tư nhân' },
      { code: 'DNNN', name: 'Doanh nghiệp nhà nước' },
      { code: 'HKD', name: 'Hộ kinh doanh' },
      { code: 'HTX', name: 'Hợp tác xã' },
    ];
    for (const et of types) {
      await enterpriseTypeRepo.save(enterpriseTypeRepo.create(et));
    }
    console.log('✅ Seeded enterprise types');
  }

  // ---- Industries ----
  const industryRepo = dataSource.getRepository(Industry);

  // Luôn reset industries: xóa enterprises trước, rồi industries
  const existingEnts = await dataSource.getRepository(Enterprise).count();
  if (existingEnts > 0) {
    await dataSource.query('DELETE FROM enterprises');
    console.log('🗑️  Cleared existing enterprises before re-seeding industries');
  }
  await dataSource.query('DELETE FROM industries');
  console.log('🗑️  Cleared existing industries, re-seeding...');

  // Level 1 (4 mục)
  const l1 = await industryRepo.save([
    { code: 'LV1-1', name: 'Nông nghiệp, lâm nghiệp và thủy sản', level: 1 },
    { code: 'LV1-2', name: 'Công nghiệp khai khoáng', level: 1 },
    { code: 'LV1-3', name: 'Công nghiệp chế biến, chế tạo', level: 1 },
    { code: 'LV1-4', name: 'Thương mại và dịch vụ', level: 1 },
  ]);

  // Level 2 (5 mục)
  const l2 = await industryRepo.save([
    { code: 'LV2-1', name: 'Trồng trọt và chăn nuôi', parent: l1[0], level: 2 },
    { code: 'LV2-2', name: 'Khai thác dầu thô và khí đốt', parent: l1[1], level: 2 },
    { code: 'LV2-3', name: 'Sản xuất thực phẩm và đồ uống', parent: l1[2], level: 2 },
    { code: 'LV2-4', name: 'Dệt may và da giày', parent: l1[2], level: 2 },
    { code: 'LV2-5', name: 'Bán buôn và bán lẻ', parent: l1[3], level: 2 },
  ]);

  // Level 3 (6 mục)
  const l3 = await industryRepo.save([
    { code: 'LV3-1', name: 'Trồng cây hàng năm', parent: l2[0], level: 3 },
    { code: 'LV3-2', name: 'Chăn nuôi gia súc, gia cầm', parent: l2[0], level: 3 },
    { code: 'LV3-3', name: 'Chế biến và bảo quản thủy sản', parent: l2[2], level: 3 },
    { code: 'LV3-4', name: 'Sản xuất đồ uống không cồn', parent: l2[2], level: 3 },
    { code: 'LV3-5', name: 'May trang phục', parent: l2[3], level: 3 },
    { code: 'LV3-6', name: 'Siêu thị và cửa hàng tiện lợi', parent: l2[4], level: 3 },
  ]);

  // Level 4 (5 mục) — giữ lại LV4-1, LV4-2, LV4-3 cho enterprise seed
  await industryRepo.save([
    { code: 'LV4-1', name: 'Trồng lúa', parent: l3[0], level: 4 },
    { code: 'LV4-2', name: 'Trồng rau, củ, quả', parent: l3[0], level: 4 },
    { code: 'LV4-3', name: 'Chế biến cá tra, cá basa', parent: l3[2], level: 4 },
    { code: 'LV4-4', name: 'Sản xuất nước giải khát', parent: l3[3], level: 4 },
    { code: 'LV4-5', name: 'May áo sơ mi, veston', parent: l3[4], level: 4 },
  ]);
  console.log('✅ Seeded industries (4+5+6+5 = 20 mục)');

  // ---- Enterprises ----
  const enterpriseRepo = dataSource.getRepository(Enterprise);
  const entCount = await enterpriseRepo.count();
  if (entCount === 0) {
    const types = await enterpriseTypeRepo.find();
    const industries = await industryRepo.find();
    const wards = await dataSource.getRepository(District).find({ take: 5 });
    const province = await dataSource.getRepository(Province).findOne({ where: { id: 1 } });

    const enterprises = [
      {
        name: 'Công ty TNHH Thương mại ABC',
        taxCode: '910000888295',
        enterpriseType: types.find((t) => t.code === 'TNHH'),
        industry: industries.find((i) => i.code === 'LV4-1'),
        email: 'abc@thuongmai.vn',
        phone: '02838282891',
        address: '45 Lý Tự Trọng, Quận 1',
        province,
        ward: wards[0],
        username: '910000888295',
        password: '12345678',
        isActive: true,
      },
      {
        name: 'Công ty CP Đầu tư Bình Minh',
        taxCode: '910000888296',
        enterpriseType: types.find((t) => t.code === 'CP'),
        industry: industries.find((i) => i.code === 'LV4-2'),
        email: 'info@binhminh.vn',
        phone: '02838282892',
        address: '88 Nguyễn Đình Chiểu, Quận 3',
        province,
        ward: wards[1],
        username: '910000888296',
        password: '12345678',
        isActive: true,
      },
      {
        name: 'Doanh nghiệp tư nhân Hoàng Anh',
        taxCode: '910000888297',
        enterpriseType: types.find((t) => t.code === 'DNTN'),
        industry: industries.find((i) => i.code === 'LV4-3'),
        email: 'hoanganh@dntn.vn',
        phone: '02838282893',
        address: '12 Pasteur, Quận 1',
        province,
        ward: wards[2],
        username: '910000888297',
        password: 'HoangAnh@2024',
        isActive: true,
      },
      {
        name: 'Công ty TNHH Sản xuất Thực phẩm Xanh',
        taxCode: '910000888298',
        enterpriseType: types.find((t) => t.code === 'TNHH'),
        industry: industries.find((i) => i.code === 'LV4-4'),
        email: 'xanh@thucpham.vn',
        phone: '02838282894',
        address: '67 Võ Văn Tần, Quận 3',
        province,
        ward: wards[3],
        username: '910000888298',
        password: 'Xanh@123',
        isActive: true,
      },
    ];
    for (const e of enterprises) {
      await enterpriseRepo.save(enterpriseRepo.create(e as any));
    }
    console.log('✅ Seeded enterprises');

    // Also create User records so enterprises can log in
    const userCount = await userRepo.count();
    if (userCount < 5) {
      for (const e of enterprises) {
        const exists = await userRepo.findOne({ where: { username: e.username } });
        if (exists) continue;
        const user = userRepo.create({
          username: e.username,
          passwordHash: await bcrypt.hash(e.password, 10),
          fullName: e.name,
          email: e.email,
          isActive: true,
        });
        await userRepo.save(user);
      }
      console.log('✅ Seeded enterprise user accounts');
    }
  }
}
