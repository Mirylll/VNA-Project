import * as fs from 'fs';
import * as path from 'path';
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
import { TnldContractReport } from '../modules/tnld-contract-reports/entities/tnld-contract-report.entity';
import { TnldContractReportOverview } from '../modules/tnld-contract-reports/entities/tnld-contract-report-overview.entity';
import { TnldContractReportSubsidy } from '../modules/tnld-contract-reports/entities/tnld-contract-report-subsidy.entity';
import { TnldContractReportAccidentDetail } from '../modules/tnld-contract-reports/entities/tnld-contract-report-accident-detail.entity';

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

export function mapIndustryCode(rawCode: string): string {
  if (!rawCode) return rawCode;
  const firstChar = rawCode.charAt(0);
  let prefix = '';
  if (firstChar === '0') {
    prefix = 'NLTS';
  } else if (firstChar === '1') {
    prefix = 'CNCB';
  } else if (firstChar === '4') {
    prefix = 'TMDV';
  } else {
    return rawCode;
  }
  
  if (rawCode.length === 1) {
    return prefix;
  }
  return `${prefix}-${rawCode}`;
}

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
    const filePath = path.join(__dirname, '..', '..', '..', 'frontend', 'src', 'libs', 'tts', 'data', 'hcm-districts.ts');
    let parsedWards: { name: string; type?: string }[] = [];

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const regex = /\{\s*code:\s*["']\d+["']\s*,\s*name:\s*["']([^"']+)["']\s*,\s*district:\s*["']([^"']+)["']\s*\}/g;
      let match;
      while ((match = regex.exec(fileContent)) !== null) {
        const name = match[1];
        const district = match[2];
        parsedWards.push({
          name: `${name} (${district})`
        });
      }
      console.log(`Parsed ${parsedWards.length} wards from frontend data file`);
    }

    // Fallback to static list if parsing failed or file doesn't exist
    const wardsToSeed = parsedWards.length > 0 
      ? parsedWards 
      : WARDS.map(w => ({ name: w.name }));

    // Clean up existing associations and wards first to prevent duplicate/stale records
    await dataSource.query('UPDATE users SET district_id = NULL');
    await dataSource.query('DELETE FROM tnld_contract_report_overviews');
    await dataSource.query('DELETE FROM tnld_contract_report_subsidies');
    await dataSource.query('DELETE FROM tnld_contract_report_attachments');
    await dataSource.query('DELETE FROM tnld_contract_report_accident_details');
    await dataSource.query('DELETE FROM tnld_contract_reports');
    await dataSource.query('DELETE FROM enterprises');
    await dataSource.query('DELETE FROM districts');
    console.log('🗑️  Cleared existing districts, reports and related enterprise records');

    let inserted = 0;
    for (const ward of wardsToSeed) {
      await districtRepo.save(districtRepo.create({ name: ward.name, province }));
      inserted++;
    }
    console.log(`✅ HCMC wards seeded: ${inserted} inserted.`);
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

  // Đọc danh sách INDUSTRIES từ frontend
  const frontendPath = path.join(__dirname, '..', '..', '..', 'frontend', 'src', 'libs', 'tts', 'data', 'hcm-districts.ts');
  let parsedIndustries: { code: string; name: string }[] = [];

  if (fs.existsSync(frontendPath)) {
    const fileContent = fs.readFileSync(frontendPath, 'utf-8');
    const regex = /["'](\d{4})\s*-\s*([^"']+)["']/g;
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
      parsedIndustries.push({
        code: match[1],
        name: match[2].trim()
      });
    }
  }

  // Fallback nếu không parse được
  if (parsedIndustries.length === 0) {
    parsedIndustries = [
      { code: '0111', name: 'Trồng cây lương thực' },
      { code: '0112', name: 'Trồng cây công nghiệp' },
      { code: '0113', name: 'Trồng cây ăn quả' },
      { code: '0141', name: 'Chăn nuôi trâu, bò' },
      { code: '1011', name: 'Chế biến và bảo quản thịt' },
    ];
  }

  console.log(`Parsed ${parsedIndustries.length} industries from frontend data file`);

  // Map to store created parent nodes to avoid duplicates and links them correctly
  const lvl1Map = new Map<string, Industry>();
  const lvl2Map = new Map<string, Industry>();
  const lvl3Map = new Map<string, Industry>();

  // Helper names for broad categories
  const categoryNames: Record<string, string> = {
    '01': 'Nông nghiệp và hoạt động dịch vụ liên quan',
    '10': 'Sản xuất, chế biến thực phẩm',
    '45': 'Bán buôn, bán lẻ và sửa chữa ô tô, mô tô',
    '46': 'Bán buôn (trừ ô tô, mô tô, xe máy)',
    '0': 'Nông, lâm nghiệp và thủy sản',
    '1': 'Công nghiệp chế biến, chế tạo',
    '4': 'Bán buôn, bán lẻ, dịch vụ',
  };

  for (const ind of parsedIndustries) {
    const code1 = ind.code.substring(0, 1);
    const code2 = ind.code.substring(0, 2);
    const code3 = ind.code.substring(0, 3);

    // 1. Seed Level 1
    let l1 = lvl1Map.get(code1);
    if (!l1) {
      const name = categoryNames[code1] || `Nhóm ngành cấp 1 (${code1})`;
      l1 = await industryRepo.save(industryRepo.create({ code: mapIndustryCode(code1), name, level: 1 }));
      lvl1Map.set(code1, l1);
    }

    // 2. Seed Level 2
    let l2 = lvl2Map.get(code2);
    if (!l2) {
      const name = categoryNames[code2] || `Nhóm ngành cấp 2 (${code2})`;
      l2 = await industryRepo.save(industryRepo.create({ code: mapIndustryCode(code2), name, level: 2, parent: l1 }));
      lvl2Map.set(code2, l2);
    }

    // 3. Seed Level 3
    let l3 = lvl3Map.get(code3);
    if (!l3) {
      l3 = await industryRepo.save(industryRepo.create({ code: mapIndustryCode(code3), name: `Nhóm ngành cấp 3 (${code3})`, level: 3, parent: l2 }));
      lvl3Map.set(code3, l3);
    }

    // 4. Seed Level 4
    await industryRepo.save(industryRepo.create({ code: mapIndustryCode(ind.code), name: ind.name, level: 4, parent: l3 }));
  }

  console.log('✅ Seeded hierarchical industries from frontend file');

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
        industry: industries.find((i) => i.code === mapIndustryCode('0111')),
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
        industry: industries.find((i) => i.code === mapIndustryCode('0112')),
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
        industry: industries.find((i) => i.code === mapIndustryCode('0113')),
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
        industry: industries.find((i) => i.code === mapIndustryCode('0141')),
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
        industry: industries.find((i) => i.code === mapIndustryCode('1011')),
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
        industry: industries.find((i) => i.code === mapIndustryCode('0111')),
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
        industry: industries.find((i) => i.code === mapIndustryCode('0113')),
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
        industry: industries.find((i) => i.code === mapIndustryCode('1011')),
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
        industry: industries.find((i) => i.code === mapIndustryCode('0141')),
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
        industry: industries.find((i) => i.code === mapIndustryCode('0112')),
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
        industry: industries.find((i) => i.code === mapIndustryCode('0113')),
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
        industry: industries.find((i) => i.code === mapIndustryCode('0111')),
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
        industry: industries.find((i) => i.code === mapIndustryCode('1011')),
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
        industry: industries.find((i) => i.code === mapIndustryCode('0112')),
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

    // ---- TnldContractReports ----
    const reportRepo = dataSource.getRepository(TnldContractReport);
    const reportOverviewRepo = dataSource.getRepository(TnldContractReportOverview);
    const reportSubsidyRepo = dataSource.getRepository(TnldContractReportSubsidy);
    const reportAccidentDetailRepo = dataSource.getRepository(TnldContractReportAccidentDetail);

    const allEnts = await enterpriseRepo.find();
    for (let i = 0; i < Math.min(allEnts.length, 5); i++) {
      const ent = allEnts[i];
      const statusVal = i % 3 === 0 ? 'accepted' : i % 3 === 1 ? 'submitted' : 'draft';
      const report = reportRepo.create({
        enterpriseId: ent.id,
        year: 2026,
        period: i % 2 === 0 ? '6m' : 'y',
        status: statusVal,
        submittedAt: statusVal !== 'draft' ? new Date() : undefined,
      });
      const savedReport = await reportRepo.save(report);

      await reportOverviewRepo.save(
        reportOverviewRepo.create({
          reportId: savedReport.id,
          totalEmployees: 100 + i * 10,
          femaleEmployees: 40 + i * 5,
          payroll: '150000000',
          totalAccidents: 2,
          fatalAccidents: 1,
          multiVictimAccidents: 1,
          totalVictims: 10,
          femaleVictims: 5,
          deadVictims: 5,
          severeVictims: 10,
          workdaysLost: 20,
          medicalCost: '6000000',
          treatmentSalaryCost: '2000000',
          compensationCost: '2000000',
          assetDamage: '20000000',
        })
      );

      await reportSubsidyRepo.save(
        reportSubsidyRepo.create({
          reportId: savedReport.id,
          totalAccidents: 0,
          fatalAccidents: 0,
          multiVictimAccidents: 0,
          totalVictims: 0,
          femaleVictims: 0,
          deadVictims: 0,
          severeVictims: 0,
          medicalCost: '0',
          treatmentSalaryCost: '0',
          compensationCost: '0',
          totalCost: '0',
          workdaysLost: 0,
          assetDamage: '0',
        })
      );

      // Seed detailed accident breakdown rows
      await reportAccidentDetailRepo.save(
        reportAccidentDetailRepo.create({
          reportId: savedReport.id,
          cause: 'Không có thiết bị an toàn hoặc thiết bị không đảm bảo an toàn',
          injuryFactor: 'Thiết bị nâng',
          occupation: 'Nhà lãnh đạo cơ quan Đảng Cộng sản Việt Nam cấp Trung ương',
          totalAccidents: 1,
          fatalAccidents: 1,
          multiVictimAccidents: 1,
          totalVictims: 5,
          femaleVictims: 2,
          deadVictims: 2,
          severeVictims: 5,
          unmanagedVictims: 0,
          unmanagedFemaleVictims: 0,
          unmanagedDeadVictims: 0,
          unmanagedSevereVictims: 0,
          medicalCost: '3000000',
          treatmentSalaryCost: '1000000',
          compensationCost: '1000000',
          workdaysLost: 10,
          assetDamage: '10000000',
        })
      );

      await reportAccidentDetailRepo.save(
        reportAccidentDetailRepo.create({
          reportId: savedReport.id,
          cause: 'Tổ chức lao động không hợp lý',
          injuryFactor: 'Thiết bị nâng',
          occupation: 'Công nhân',
          totalAccidents: 1,
          fatalAccidents: 0,
          multiVictimAccidents: 0,
          totalVictims: 5,
          femaleVictims: 3,
          deadVictims: 3,
          severeVictims: 5,
          unmanagedVictims: 0,
          unmanagedFemaleVictims: 0,
          unmanagedDeadVictims: 0,
          unmanagedSevereVictims: 0,
          medicalCost: '3000000',
          treatmentSalaryCost: '1000000',
          compensationCost: '1000000',
          workdaysLost: 10,
          assetDamage: '10000000',
        })
      );
    }
    console.log('✅ Seeded TnldContractReports mock data (including details)');
  }
}
