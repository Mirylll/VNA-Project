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

    const roleAdmin = savedRoles.get('ROLE_ADMIN');
    if (roleAdmin) {
      roleAdmin.permissions = allComps.filter((p) => p.code.startsWith('ADMIN_'));
      await roleRepo.save(roleAdmin);
    }

    const enterpriseRole = savedRoles.get('ROLE_ENTERPRISE');
    if (enterpriseRole) {
      enterpriseRole.permissions = allComps.filter((p) => p.code.startsWith('ENTERPRISE_'));
      await roleRepo.save(enterpriseRole);
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
    const adminRole = savedRoles.get('ROLE_ADMIN') || savedRoles.get('CEO');
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
    const allWards = await dataSource.getRepository(District).find({ take: 14 });
    const province = await dataSource.getRepository(Province).findOne({ where: { id: 1 } });

    const td = (wardIdx: number) => ({
      province,
      ward: allWards[wardIdx],
      operationProvince: province,
      operationWard: allWards[wardIdx + 7],
    });

    const enterprises = [
      {
        name: 'Công ty TNHH Thương mại ABC',
        taxCode: '910000888295',
        enterpriseType: types.find((t) => t.code === 'TNHH'),
        industry: industries.find((i) => i.code === 'LV4-1'),
        foreignName: 'ABC Trading Company Limited',
        licenseDate: '2020-03-15',
        email: 'abc@thuongmai.vn',
        phone: '02838282891',
        address: '45 Lý Tự Trọng, Phường Bến Thành, Quận 1',
        operationAddress: 'Số 10 Nguyễn Huệ, Phường Bến Thành, Quận 1',
        leaderName: 'Trần Văn An',
        leaderPhone: '0909123456',
        ...td(0),
        username: '910000888295',
        password: '12345678',
        isActive: true,
      },
      {
        name: 'Công ty CP Đầu tư Bình Minh',
        taxCode: '910000888296',
        enterpriseType: types.find((t) => t.code === 'CP'),
        industry: industries.find((i) => i.code === 'LV4-2'),
        foreignName: 'Binh Minh Investment Joint Stock Company',
        licenseDate: '2019-07-20',
        email: 'info@binhminh.vn',
        phone: '02838282892',
        address: '88 Nguyễn Đình Chiểu, Phường Bàn Cờ, Quận 3',
        operationAddress: '25 Lê Lợi, Phường Bàn Cờ, Quận 1',
        leaderName: 'Lê Thị Bình',
        leaderPhone: '0909234567',
        ...td(1),
        username: '910000888296',
        password: '12345678',
        isActive: true,
      },
      {
        name: 'Doanh nghiệp tư nhân Hoàng Anh',
        taxCode: '910000888297',
        enterpriseType: types.find((t) => t.code === 'DNTN'),
        industry: industries.find((i) => i.code === 'LV4-3'),
        foreignName: 'Hoang Anh Private Enterprise',
        licenseDate: '2021-01-10',
        email: 'hoanganh@dntn.vn',
        phone: '02838282893',
        address: '12 Pasteur, Phường Xuân Hòa, Quận 1',
        operationAddress: '78 Hai Bà Trưng, Phường Xuân Hòa, Quận 1',
        leaderName: 'Nguyễn Hoàng Anh',
        leaderPhone: '0909345678',
        ...td(2),
        username: '910000888297',
        password: 'HoangAnh@2024',
        isActive: true,
      },
      {
        name: 'Công ty TNHH Sản xuất Thực phẩm Xanh',
        taxCode: '910000888298',
        enterpriseType: types.find((t) => t.code === 'TNHH'),
        industry: industries.find((i) => i.code === 'LV4-4'),
        foreignName: 'Xanh Food Production Company Limited',
        licenseDate: '2022-05-30',
        email: 'xanh@thucpham.vn',
        phone: '02838282894',
        address: '67 Võ Văn Tần, Phường Khánh Hội, Quận 3',
        operationAddress: '15 Nguyễn Trãi, Phường Khánh Hội, Quận 5',
        leaderName: 'Phạm Thị Xanh',
        leaderPhone: '0909456789',
        ...td(3),
        username: '910000888298',
        password: 'Xanh@123',
        isActive: true,
      },
      // ── New enterprises ──
      {
        name: 'Công ty CP Xây dựng và Đầu tư Nam Phương',
        taxCode: '910000888299',
        enterpriseType: types.find((t) => t.code === 'CP'),
        industry: industries.find((i) => i.code === 'LV4-5'),
        foreignName: 'Nam Phuong Construction & Investment JSC',
        licenseDate: '2018-11-05',
        email: 'info@namphuong.vn',
        phone: '02838282895',
        address: '123 Nguyễn Văn Linh, Phường An Đông, Quận 7',
        operationAddress: '456 Phạm Hùng, Phường An Đông, Quận 8',
        leaderName: 'Hoàng Văn Nam',
        leaderPhone: '0909567890',
        ...td(4),
        username: '910000888299',
        password: 'NamPhuong@2024',
        isActive: true,
      },
      {
        name: 'Công ty TNHH Thương mại Dịch vụ Đông Á',
        taxCode: '910000888300',
        enterpriseType: types.find((t) => t.code === 'TNHH'),
        industry: industries.find((i) => i.code === 'LV4-1'),
        foreignName: 'Dong A Trading Service Company Limited',
        licenseDate: '2020-09-18',
        email: 'contact@donga.vn',
        phone: '02838282896',
        address: '90 Bùi Thị Xuân, Phường Bình Phú, Quận 1',
        operationAddress: '22 Cống Quỳnh, Phường Bình Phú, Quận 1',
        leaderName: 'Trương Minh Đông',
        leaderPhone: '0909678901',
        ...td(5),
        username: '910000888300',
        password: 'DongA@2024',
        isActive: true,
      },
      {
        name: 'Doanh nghiệp tư nhân Minh Phát',
        taxCode: '910000888301',
        enterpriseType: types.find((t) => t.code === 'DNTN'),
        industry: industries.find((i) => i.code === 'LV4-3'),
        foreignName: 'Minh Phat Private Enterprise',
        licenseDate: '2023-02-14',
        email: 'minhphat@dntn.vn',
        phone: '02838282897',
        address: '34 Ngô Gia Tự, Phường Bình Tây, Quận 10',
        operationAddress: '56 Lý Thường Kiệt, Phường Bình Tây, Quận 10',
        leaderName: 'Đặng Minh Phát',
        leaderPhone: '0909789012',
        ...td(6),
        username: '910000888301',
        password: 'MinhPhat@2024',
        isActive: true,
      },
      {
        name: 'Công ty CP Công nghệ Thông tin Sài Gòn',
        taxCode: '910000888302',
        enterpriseType: types.find((t) => t.code === 'CP'),
        industry: industries.find((i) => i.code === 'LV4-5'),
        foreignName: 'Saigon Information Technology JSC',
        licenseDate: '2017-06-01',
        email: 'info@sgontech.vn',
        phone: '02838282898',
        address: '789 Lê Văn Sỹ, Phường Tân Thuận Đông, Quận 3',
        operationAddress: '12 Nguyễn Thị Minh Khai, Phường Tân Thuận Đông, Quận 1',
        leaderName: 'Võ Thành Công',
        leaderPhone: '0909890123',
        ...td(7),
        username: '910000888302',
        password: 'SaiGon@2024',
        isActive: true,
      },
      {
        name: 'Công ty TNHH Vận tải Biển Xanh',
        taxCode: '910000888303',
        enterpriseType: types.find((t) => t.code === 'TNHH'),
        industry: industries.find((i) => i.code === 'LV4-4'),
        foreignName: 'Blue Sea Transport Company Limited',
        licenseDate: '2019-12-20',
        email: 'info@bientrinh.vn',
        phone: '02838282899',
        address: '55 Nguyễn Tất Thành, Phường Bình Đông, Quận 4',
        operationAddress: '200 Lê Văn Lương, Phường Bình Đông, Quận 7',
        leaderName: 'Nguyễn Hải Đăng',
        leaderPhone: '0909901234',
        ...td(8),
        username: '910000888303',
        password: 'BienXanh@2024',
        isActive: true,
      },
      {
        name: 'Công ty TNHH 1TV Sản xuất Bao bì An Khang',
        taxCode: '910000888304',
        enterpriseType: types.find((t) => t.code === 'TNHH1TV'),
        industry: industries.find((i) => i.code === 'LV4-2'),
        foreignName: 'An Khang Packaging Manufacturing Co., Ltd.',
        licenseDate: '2021-08-10',
        email: 'ankhang@baobi.vn',
        phone: '02838282900',
        address: '18 Quốc lộ 13, Phường Tân Thới Nhất, Quận 12',
        operationAddress: '7/2 Tân Thới Nhất, Phường Tân Thới Nhất, Quận 12',
        leaderName: 'Trần An Khang',
        leaderPhone: '0910012345',
        ...td(9),
        username: '910000888304',
        password: 'AnKhang@2024',
        isActive: true,
      },
      {
        name: 'Hộ kinh doanh Thực phẩm Hữu cơ',
        taxCode: '910000888305',
        enterpriseType: types.find((t) => t.code === 'HKD'),
        industry: industries.find((i) => i.code === 'LV4-3'),
        foreignName: '',
        licenseDate: '2024-01-05',
        email: 'huuco@organic.vn',
        phone: '02838282901',
        address: '99 Chợ Lớn, Phường An Phú Đông, Quận 6',
        operationAddress: '99 Chợ Lớn, Phường An Phú Đông, Quận 6',
        leaderName: 'Lý Thị Hương',
        leaderPhone: '0910123456',
        ...td(10),
        username: '910000888305',
        password: 'HuuCo@2024',
        isActive: true,
      },
      {
        name: 'Hợp tác xã Nông nghiệp Công nghệ Cao',
        taxCode: '910000888306',
        enterpriseType: types.find((t) => t.code === 'HTX'),
        industry: industries.find((i) => i.code === 'LV4-1'),
        foreignName: 'High-Tech Agricultural Cooperative',
        licenseDate: '2022-04-22',
        email: 'htx@nncnc.vn',
        phone: '02838282902',
        address: '1 Xa lộ Hà Nội, Phường An Lạc, Quận 9',
        operationAddress: 'Khu CNC, Phường An Lạc, Thành phố Thủ Đức',
        leaderName: 'Ngô Văn Nông',
        leaderPhone: '0910234567',
        ...td(11),
        username: '910000888306',
        password: 'CongNghe@2024',
        isActive: true,
      },
      {
        name: 'Công ty CP Dịch vụ Du lịch Mê Kông',
        taxCode: '910000888307',
        enterpriseType: types.find((t) => t.code === 'CP'),
        industry: industries.find((i) => i.code === 'LV4-5'),
        foreignName: 'Mekong Tourism Services JSC',
        licenseDate: '2016-05-12',
        email: 'info@mekongtravel.vn',
        phone: '02838282903',
        address: '28 Phạm Ngũ Lão, Phường Bình Tân, Quận 1',
        operationAddress: '150 Đề Thám, Phường Bình Tân, Quận 1',
        leaderName: 'Phạm Mê Kông',
        leaderPhone: '0910345678',
        ...td(12),
        username: '910000888307',
        password: 'MeKong@2024',
        isActive: true,
      },
      {
        name: 'Công ty TNHH Thiết kế Xây dựng Hoàn Mỹ',
        taxCode: '910000888308',
        enterpriseType: types.find((t) => t.code === 'TNHH'),
        industry: industries.find((i) => i.code === 'LV4-2'),
        foreignName: 'Hoan My Design & Construction Company Limited',
        licenseDate: '2020-10-30',
        email: 'info@hoanmy.vn',
        phone: '02838282904',
        address: '63 Hoàng Diệu, Phường Bình Hưng Hòa, Quận 4',
        operationAddress: '91 Nguyễn Thị Thập, Phường Bình Hưng Hòa, Quận 7',
        leaderName: 'Đỗ Hoàn Mỹ',
        leaderPhone: '0910456789',
        ...td(13),
        username: '910000888308',
        password: 'HoanMy@2024',
        isActive: true,
      },
    ];
    for (const e of enterprises) {
      await enterpriseRepo.save(enterpriseRepo.create(e as any));
    }
    console.log(`✅ Seeded ${enterprises.length} enterprises`);

    // Also create User records so enterprises can log in
    const dnCount = await userRepo.count();
    if (dnCount < 5) {
      const enterpriseRole = savedRoles.get('ROLE_ENTERPRISE');
      for (const e of enterprises) {
        const exists = await userRepo.findOne({ where: { username: e.username } });
        if (exists) continue;
        const user = userRepo.create({
          username: e.username,
          passwordHash: await bcrypt.hash(e.password, 10),
          fullName: e.name,
          email: e.email,
          isActive: true,
          role: enterpriseRole || undefined,
        });
        await userRepo.save(user);
      }
      console.log('✅ Seeded enterprise user accounts');
    }
  }
}
