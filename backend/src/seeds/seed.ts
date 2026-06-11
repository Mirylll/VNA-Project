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
  const indCount = await industryRepo.count();
  if (indCount === 0) {
    // Level 1
    const l1 = await industryRepo.save([
      { code: 'A', name: 'Nông nghiệp, lâm nghiệp và thuỷ sản', level: 1 },
      { code: 'B', name: 'Khai khoáng', level: 1 },
      { code: 'C', name: 'Công nghiệp chế biến, chế tạo', level: 1 },
      { code: 'F', name: 'Xây dựng', level: 1 },
      { code: 'G', name: 'Bán buôn và bán lẻ; sửa chữa ô tô, mô tô, xe máy', level: 1 },
      { code: 'I', name: 'Dịch vụ lưu trú và ăn uống', level: 1 },
      { code: 'J', name: 'Thông tin và truyền thông', level: 1 },
      { code: 'M', name: 'Hoạt động chuyên môn, khoa học và công nghệ', level: 1 },
      { code: 'N', name: 'Dịch vụ hành chính và hỗ trợ', level: 1 },
      { code: 'P', name: 'Giáo dục và đào tạo', level: 1 },
      { code: 'Q', name: 'Y tế và hoạt động trợ giúp xã hội', level: 1 },
      { code: 'R', name: 'Nghệ thuật, vui chơi và giải trí', level: 1 },
      { code: 'S', name: 'Hoạt động dịch vụ khác', level: 1 },
    ]);
    const A = l1[0], B = l1[1], C = l1[2], F = l1[3], G = l1[4], I = l1[5], J = l1[6],
          M = l1[7], N = l1[8], P = l1[9], Q = l1[10], R = l1[11], S = l1[12];

    // Level 2
    const l2 = await industryRepo.save([
      { code: 'A01', name: 'Nông nghiệp và hoạt động dịch vụ có liên quan', parent: A, level: 2 },
      { code: 'A02', name: 'Lâm nghiệp và hoạt động dịch vụ có liên quan', parent: A, level: 2 },
      { code: 'A03', name: 'Khai thác, nuôi trồng thuỷ sản', parent: A, level: 2 },
      { code: 'C10', name: 'Sản xuất chế biến thực phẩm', parent: C, level: 2 },
      { code: 'C11', name: 'Sản xuất đồ uống', parent: C, level: 2 },
      { code: 'C13', name: 'Sản xuất dệt', parent: C, level: 2 },
      { code: 'C14', name: 'Sản xuất trang phục', parent: C, level: 2 },
      { code: 'C15', name: 'Sản xuất da và các sản phẩm có liên quan', parent: C, level: 2 },
      { code: 'C26', name: 'Sản xuất sản phẩm điện tử, máy vi tính và sản phẩm quang học', parent: C, level: 2 },
      { code: 'C27', name: 'Sản xuất thiết bị điện', parent: C, level: 2 },
      { code: 'C28', name: 'Sản xuất máy móc, thiết bị chưa được phân vào đâu', parent: C, level: 2 },
      { code: 'C29', name: 'Sản xuất ô tô và xe có động cơ khác', parent: C, level: 2 },
      { code: 'C30', name: 'Sản xuất phương tiện vận tải khác', parent: C, level: 2 },
      { code: 'F41', name: 'Xây dựng nhà các loại', parent: F, level: 2 },
      { code: 'F42', name: 'Xây dựng công trình kỹ thuật dân dụng', parent: F, level: 2 },
      { code: 'F43', name: 'Hoạt động xây dựng chuyên dụng', parent: F, level: 2 },
      { code: 'G46', name: 'Bán buôn (trừ ô tô, mô tô, xe máy)', parent: G, level: 2 },
      { code: 'G47', name: 'Bán lẻ (trừ ô tô, mô tô, xe máy)', parent: G, level: 2 },
      { code: 'I55', name: 'Dịch vụ lưu trú', parent: I, level: 2 },
      { code: 'I56', name: 'Dịch vụ ăn uống', parent: I, level: 2 },
      { code: 'J58', name: 'Hoạt động xuất bản', parent: J, level: 2 },
      { code: 'J59', name: 'Hoạt động điện ảnh, sản xuất chương trình truyền hình', parent: J, level: 2 },
      { code: 'J61', name: 'Viễn thông', parent: J, level: 2 },
      { code: 'J62', name: 'Lập trình máy vi tính, dịch vụ tư vấn và hoạt động liên quan', parent: J, level: 2 },
      { code: 'J63', name: 'Hoạt động dịch vụ thông tin', parent: J, level: 2 },
      { code: 'M70', name: 'Hoạt động của các trụ sở văn phòng; tư vấn quản lý', parent: M, level: 2 },
      { code: 'M71', name: 'Hoạt động kiến trúc; kiểm tra và phân tích kỹ thuật', parent: M, level: 2 },
      { code: 'M72', name: 'Nghiên cứu khoa học và phát triển', parent: M, level: 2 },
      { code: 'M73', name: 'Quảng cáo và nghiên cứu thị trường', parent: M, level: 2 },
      { code: 'N78', name: 'Hoạt động dịch vụ lao động và việc làm', parent: N, level: 2 },
      { code: 'N80', name: 'Dịch vụ bảo vệ và điều tra', parent: N, level: 2 },
      { code: 'N81', name: 'Dịch vụ vệ sinh nhà cửa, công trình và cảnh quan', parent: N, level: 2 },
      { code: 'P85', name: 'Giáo dục', parent: P, level: 2 },
      { code: 'Q86', name: 'Hoạt động y tế', parent: Q, level: 2 },
      { code: 'R90', name: 'Hoạt động sáng tác, nghệ thuật và giải trí', parent: R, level: 2 },
      { code: 'R93', name: 'Hoạt động thể thao, vui chơi và giải trí', parent: R, level: 2 },
      { code: 'S95', name: 'Sửa chữa máy vi tính, đồ dùng cá nhân và gia đình', parent: S, level: 2 },
      { code: 'S96', name: 'Hoạt động dịch vụ cá nhân khác', parent: S, level: 2 },
    ]);
    const C10 = l2[3], J62 = l2[23];

    // Level 3
    await industryRepo.save([
      { code: 'C101', name: 'Chế biến, bảo quản thịt và các sản phẩm từ thịt', parent: C10, level: 3 },
      { code: 'C102', name: 'Chế biến, bảo quản thuỷ sản và các sản phẩm từ thuỷ sản', parent: C10, level: 3 },
      { code: 'C103', name: 'Chế biến, bảo quản rau quả', parent: C10, level: 3 },
      { code: 'J620', name: 'Lập trình máy vi tính', parent: J62, level: 3 },
      { code: 'J621', name: 'Tư vấn về máy vi tính và quản trị hệ thống máy vi tính', parent: J62, level: 3 },
      { code: 'J622', name: 'Hoạt động dịch vụ công nghệ thông tin khác', parent: J62, level: 3 },
    ]);
    console.log('✅ Seeded industries (multi-level)');
  }

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
        name: 'Công ty Cổ phần Công nghệ Quốc tế VNA',
        taxCode: '910000888292',
        enterpriseType: types.find((t) => t.code === 'CP'),
        industry: industries.find((i) => i.code === 'J620'),
        email: 'info@vna.com',
        phone: '02838282888',
        address: '162 đường số 2, khu đô thị Vạn Phúc',
        province,
        ward: wards[0],
        username: 'vna_admin',
        password: 'Vna@2024',
        isActive: true,
      },
      {
        name: 'Công ty TNHH Xây dựng An Phát',
        taxCode: '910000888293',
        enterpriseType: types.find((t) => t.code === 'TNHH'),
        industry: industries.find((i) => i.code === 'F41'),
        email: 'contact@anphat.vn',
        phone: '02838282889',
        address: '25 Nguyễn Huệ, Quận 1',
        province,
        ward: wards[1],
        username: 'anphat_admin',
        password: 'AnPhat@2024',
        isActive: true,
      },
      {
        name: 'Doanh nghiệp tư nhân Thương mại Sài Gòn',
        taxCode: '910000888294',
        enterpriseType: types.find((t) => t.code === 'DNTN'),
        industry: industries.find((i) => i.code === 'G47'),
        email: 'saigon@dntn.vn',
        phone: '02838282890',
        address: '120 Lê Lợi, Quận 3',
        province,
        ward: wards[2],
        username: 'saigon_dntn',
        password: 'SaiGon@2024',
        isActive: true,
      },
    ];
    for (const e of enterprises) {
      await enterpriseRepo.save(enterpriseRepo.create(e as any));
    }
    console.log('✅ Seeded enterprises');
  }
}
