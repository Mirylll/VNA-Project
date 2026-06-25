import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Permission } from '../modules/permissions/entities/permission.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { AccountType, User } from '../modules/users/entities/user.entity';
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
    code: 'ADMIN_G_ENTERPRISE_TYPE',
    name: 'Enterprise Type Group',
    type: 'Group',
    children: [
      { code: 'ADMIN_C_ENTERPRISE_TYPE_VIEW', name: 'View Enterprise Type' },
      { code: 'ADMIN_C_ENTERPRISE_TYPE_CREATE', name: 'Create Enterprise Type' },
      { code: 'ADMIN_C_ENTERPRISE_TYPE_UPDATE', name: 'Update Enterprise Type' },
      { code: 'ADMIN_C_ENTERPRISE_TYPE_DELETE', name: 'Delete Enterprise Type' },
    ],
  },
  {
    code: 'ADMIN_G_INDUSTRY',
    name: 'Industry Group',
    type: 'Group',
    children: [
      { code: 'ADMIN_C_INDUSTRY_VIEW', name: 'View Industry' },
      { code: 'ADMIN_C_INDUSTRY_CREATE', name: 'Create Industry' },
      { code: 'ADMIN_C_INDUSTRY_UPDATE', name: 'Update Industry' },
      { code: 'ADMIN_C_INDUSTRY_DELETE', name: 'Delete Industry' },
    ],
  },
  {
    code: 'ADMIN_G_REPORT_PERIOD',
    name: 'Report Period Group',
    type: 'Group',
    children: [
      { code: 'ADMIN_C_REPORT_PERIOD_VIEW', name: 'View Report Period' },
      { code: 'ADMIN_C_REPORT_PERIOD_CREATE', name: 'Create Report Period' },
      { code: 'ADMIN_C_REPORT_PERIOD_UPDATE', name: 'Update Report Period' },
      { code: 'ADMIN_C_REPORT_PERIOD_DELETE', name: 'Delete Report Period' },
    ],
  },
  {
    code: 'ADMIN_G_TNLD_CATEGORY',
    name: 'TNLD Category Group',
    type: 'Group',
    children: [
      { code: 'ADMIN_C_TNLD_CATEGORY_VIEW', name: 'View TNLD Category' },
      { code: 'ADMIN_C_TNLD_CATEGORY_CREATE', name: 'Create TNLD Category' },
      { code: 'ADMIN_C_TNLD_CATEGORY_UPDATE', name: 'Update TNLD Category' },
      { code: 'ADMIN_C_TNLD_CATEGORY_DELETE', name: 'Delete TNLD Category' },
    ],
  },
  {
    code: 'ADMIN_G_TNLD_CONTRACT',
    name: 'TNLD Contract Report Group',
    type: 'Group',
    children: [
      { code: 'ADMIN_C_TNLD_CONTRACT_VIEW', name: 'View TNLD Contract Report' },
      { code: 'ADMIN_C_TNLD_CONTRACT_ACCEPT', name: 'Accept TNLD Contract Report' },
      { code: 'ADMIN_C_TNLD_CONTRACT_PRINT', name: 'Print TNLD Contract Report' },
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
  { code: 'ROLE_SUPER_ADMIN', name: 'Quản trị viên cấp cao' },
  { code: 'ROLE_ADMIN',       name: 'Quản trị viên' },
  { code: 'ROLE_MANAGER',     name: 'Trưởng phòng' },
  { code: 'ROLE_USER',        name: 'Nhân viên' },
  { code: 'ROLE_ENTERPRISE',  name: 'Doanh nghiệp' },
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
  "Phường Sài Gòn (Quận 1)", "Phường Tân Định (Quận 1)", "Phường Bến Thành (Quận 1)", "Phường Cầu Ông Lãnh (Quận 1)",
  "Phường Bàn Cờ (Quận 3)", "Phường Xuân Hòa (Quận 3)", "Phường Nhiêu Lộc (Quận 3)",
  "Phường Xóm Chiếu (Quận 4)", "Phường Khánh Hội (Quận 4)", "Phường Vĩnh Hội (Quận 4)",
  "Phường Chợ Quán (Quận 5)", "Phường An Đông (Quận 5)", "Phường Chợ Lớn (Quận 5)",
  "Phường Bình Tây (Quận 6)", "Phường Bình Tiên (Quận 6)", "Phường Bình Phú (Quận 6)", "Phường Phú Lâm (Quận 6)",
  "Phường Tân Thuận (Quận 7)", "Phường Phú Thuận (Quận 7)", "Phường Tân Mỹ (Quận 7)", "Phường Tân Hưng (Quận 7)",
  "Phường Chánh Hưng (Quận 8)", "Phường Phú Định (Q.8)", "Phường Bình Đông (Q.8)",
  "Phường Diên Hồng (Quận 10)", "Phường Vườn Lài (Quận 10)", "Phường Hòa Hưng (Quận 10)",
  "Phường Minh Phụng (Quận 11)", "Phường Bình Thới (Quận 11)", "Phường Hòa Bình (Quận 11)", "Phường Phú Thọ (Quận 11)",
  "Phường Đông Hưng Thuận (Quận 12)", "Phường Trung Mỹ Tây (Quận 12)", "Phường Tân Thới Hiệp (Quận 12)", "Phường Thới An (Quận 12)", "Phường An Phú Đông (Quận 12)",
  "Phường An Lạc (Quận Bình Tân)", "Phường Bình Tân (Quận Bình Tân)", "Phường Tân Tạo (Quận Bình Tân)", "Phường Bình Trị Đông (Quận Bình Tân)", "Phường Bình Hưng Hòa (Quận Bình Tân)",
  "Phường Gia Định (Quận Bình Thạnh)", "Phường Bình Thạnh (Quận Bình Thạnh)", "Phường Bình Lợi Trung (Quận Bình Thạnh)", "Phường Thạnh Mỹ Tây (Quận Bình Thạnh)", "Phường Bình Quới (Quận Bình Thạnh)",
  "Phường Hạnh Thông (Quận Gò Vấp)", "Phường An Nhơn (Quận Gò Vấp)", "Phường Gò Vấp (Quận Gò Vấp)", "Phường An Hội Đông (Quận Gò Vấp)", "Phường Thông Tây Hội (Quận Gò Vấp)", "Phường An Hội Tây (Quận Gò Vấp)",
  "Phường Đức Nhuận (Quận Phú Nhuận)", "Phường Cầu Kiệu (Quận Phú Nhuận)", "Phường Phú Nhuận (Quận Phú Nhuận)",
  "Phường Tân Sơn Hòa (Quận Tân Bình)", "Phường Tân Sơn Nhất (Quận Tân Bình)", "Phường Tân Hòa (Quận Tân Bình)", "Phường Bảy Hiền (Quận Tân Bình)", "Phường Tân Bình (Quận Tân Bình)", "Phường Tân Sơn (Quận Tân Bình)",
  "Phường Tây Thạnh (Quận Tân Phú)", "Phường Tân Sơn Nhì (Quận Tân Phú)", "Phường Phú Thọ Hòa (Quận Tân Phú)", "Phường Tân Phú (Quận Tân Phú)", "Phường Phú Thạnh (Quận Tân Phú)",
  "Phường Hiệp Bình (TP. Thủ Đức)", "Phường Thủ Đức (TP. Thủ Đức)", "Phường Tam Bình (TP. Thủ Đức)", "Phường Linh Xuân (TP. Thủ Đức)", "Phường Tăng Nhơn Phú (TP. Thủ Đức)", "Phường Long Bình (TP. Thủ Đức)", "Phường Long Phước (TP. Thủ Đức)", "Phường Long Trường (TP. Thủ Đức)", "Phường Cát Lái (TP. Thủ Đức)", "Phường Bình Trưng (TP. Thủ Đức)", "Phường Phước Long (TP. Thủ Đức)", "Phường An Khánh (TP. Thủ Đức)",
  "Phường Đông Hòa (TP. Dĩ An)", "Phường Dĩ An (TP. Dĩ An)", "Phường Tân Đông Hiệp (TP. Dĩ An)",
  "Phường An Phú (TP. Thuận An)", "Phường Bình Hòa (TP. Thuận An)", "Phường Lái Thiêu (TP. Thuận An)", "Phường Thuận An (TP. Thuận An)", "Phường Thuận Giao (TP. Thuận An)",
  "Phường Thủ Dầu Một (TP. Thủ Dầu Một)", "Phường Phú Lợi (TP. Thủ Dầu Một)", "Phường Chánh Hiệp (TP. Thủ Dầu Một)", "Phường Bình Dương (TP. TDM)", "Phường Phú An (TP. Thủ Dầu Một)",
  "Phường Hòa Lợi (TP. Bến Cát)", "Phường Tây Nam (TP. Bến Cát)", "Phường Long Nguyên (TP. Bến Cát)", "Phường Bến Cát (TP. Bến Cát)", "Phường Chánh Phú Hòa (TP. Bến Cát)", "Phường Thới Hòa (TP. Bến Cát)",
  "Phường Vĩnh Tân (TP. Tân Uyên)", "Phường Bình Cơ (TP. Tân Uyên)", "Phường Tân Uyên (TP. Tân Uyên)", "Phường Tân Hiệp (TP. Tân Uyên)", "Phường Tân Khánh (TP. Tân Uyên)",
  "Phường Vũng Tàu (TP. Vũng Tàu)", "Phường Tam Thắng (TP. Vũng Tàu)", "Phường Rạch Dừa (TP. Vũng Tàu)", "Phường Phước Thắng (TP. Vũng Tàu)", "Xã Long Sơn (TP. Vũng Tàu)",
  "Phường Long Hương (TP. Bà Rịa)", "Phường Bà Rịa (TP. Bà Rịa)", "Phường Tam Long (TP. Bà Rịa)",
  "Phường Tân Hải (TP. Phú Mỹ)", "Phường Tân Phước (TP. Phú Mỹ)", "Phường Phú Mỹ (TP. Phú Mỹ)", "Phường Tân Thành (TP. Phú Mỹ)", "Xã Châu Pha (TP. Phú Mỹ)",
  "Xã Vĩnh Lộc (Huyện Bình Chánh)", "Xã Tân Vĩnh Lộc (Huyện Bình Chánh..)", "Xã Bình Lợi (Huyện Bình Chánh)", "Xã Tân Nhựt (Huyện Bình Chánh)", "Xã Bình Chánh (Huyện Bình Chánh..)", "Xã Hưng Long (Huyện Bình Chánh..)", "Xã Bình Hưng (Bình Chánh..)", "Xã Bình Khánh (ấp Bình An 1)", "Xã An Thới Đông (xã An Thới Đông)",
  "Xã Cần Giờ (KP. Giồng Ao)", "Xã Thạnh An (Huyện Cần Giờ)",
  "Xã Củ Chi (Huyện Củ Chi)", "Xã Tân An Hội (Huyện Củ Chi)", "Xã Thái Mỹ (Huyện Củ Chi)", "Xã An Nhơn Tây (Huyện Củ Chi)", "Xã Nhuận Đức (Huyện Củ Chi)", "Xã Phú Hòa Đông (Huyện Củ Chi)", "Xã Bình Mỹ (Huyện Củ Chi)",
  "Xã Đông Thạnh (Huyện Hóc Môn)", "Xã Hóc Môn (Huyện Hóc Môn)", "Xã Xuân Thới Sơn (Huyện Hóc Môn)", "Xã Bà Điểm (Huyện Hóc Môn)",
  "Xã Nhà Bè (Huyện Nhà Bè)", "Xã Hiệp Phước (Huyện Nhà Bè)",
  "Xã Thường Tân (Huyện Bắc Tân Uyên)", "Xã Bắc Tân Uyên (Huyện Bắc Tân Uyên)",
  "Xã Phú Giáo (Huyện Phú Giáo)", "Xã Phước Hòa (Huyện Phú Giáo)", "Xã Phước Thành (Huyện Phú Giáo)", "Xã An Long (Huyện Phú Giáo)",
  "Xã Trừ Văn Thố (Huyện Bàu Bàng)", "Xã Bàu Bàng (Huyện Bàu Bàng)",
  "Xã Long Hòa (Huyện Dầu Tiếng)", "Xã Thanh An (Huyện Dầu Tiếng)", "Xã Dầu Tiếng (Huyện Dầu Tiếng)", "Xã Minh Thạnh (Huyện Dầu Tiếng)",
  "Xã Long Hải (Huyện Long Đất)", "Xã Long Điền (Huyện Long Đất)", "Xã Phước Hải (Huyện Long Đất)", "Xã Đất Đỏ (thị trấn Đất Đỏ)",
  "Xã Nghĩa Thành (Huyện Châu Đức)", "Xã Ngãi Giao (Huyện Châu Đức)", "Xã Kim Long (Huyện Châu Đức)", "Xã Châu Đức (Huyện Châu Đức)", "Xã Bình Giã (Huyện Châu Đức)", "Xã Xuân Sơn (Huyện Châu Đức)",
  "Xã Hồ Tràm (Huyện Xuyên Mộc)", "Xã Xuyên Mộc (Huyện Xuyên Mộc)", "Xã Hòa Hội (Huyện Xuyên Mộc)", "Xã Bàu Lâm (Huyện Xuyên Mộc)", "Xã Bình Châu (Huyện Xuyên Mộc)", "Xã Hòa Hiệp (Huyện Xuyên Mộc)",
  "Đặc khu Côn Đảo (Huyện Côn Đảo)",
].map(name => ({ name }));

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
  let insertedPermissions = 0;
  let sortOrder = 0;
  for (const group of permissionGroups) {
    let savedParent = await permissionRepo.findOne({
      where: { code: group.code },
    });

    if (!savedParent) {
      savedParent = await permissionRepo.save(
        permissionRepo.create({
          code: group.code,
          name: group.name,
          type: 'Group',
          sortOrder,
        }),
      );
      insertedPermissions++;
    } else if (savedParent.type !== 'Group') {
      savedParent.type = 'Group';
      savedParent.name = group.name;
      savedParent.sortOrder = sortOrder;
      savedParent = await permissionRepo.save(savedParent);
    }

    let childSort = 0;
    for (const child of group.children || []) {
      let savedChild = await permissionRepo.findOne({
        where: { code: child.code },
      });

      if (!savedChild) {
        await permissionRepo.save(
          permissionRepo.create({
            code: child.code,
            name: child.name,
            type: 'Component',
            parent: savedParent,
            sortOrder: childSort,
          }),
        );
        insertedPermissions++;
      } else if (
        savedChild.type !== 'Component' ||
        savedChild.name !== child.name ||
        savedChild.sortOrder !== childSort
      ) {
        savedChild.type = 'Component';
        savedChild.name = child.name;
        savedChild.parent = savedParent;
        savedChild.sortOrder = childSort;
        await permissionRepo.save(savedChild);
      }

      childSort++;
    }

    sortOrder++;
  }

  if (insertedPermissions > 0) {
    console.log(`✅ Seeded ${insertedPermissions} missing permissions`);
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
    } else if (role.name !== r.name) {
      role.name = r.name;
      role = await roleRepo.save(role);
    }
    savedRoles.set(r.code, role);
  }
  const newRoleCount = await roleRepo.count();
  console.log(`ℹ️  ${newRoleCount} roles in DB`);

  // ---- Migrate old roles to new roles ----
  const oldToNewCode: Record<string, string> = {
    'CEO': 'ROLE_SUPER_ADMIN',
    'MANAGER': 'ROLE_MANAGER',
    'EMPLOYEE': 'ROLE_USER',
  };
  for (const [oldCode, newCode] of Object.entries(oldToNewCode)) {
    const oldRole = await roleRepo.findOne({ where: { code: oldCode } });
    const newRole = savedRoles.get(newCode);
    if (oldRole && newRole) {
      await dataSource
        .createQueryBuilder()
        .update(User)
        .set({ role: newRole })
        .where('role_id = :id', { id: oldRole.id })
        .execute();
      await roleRepo.remove(oldRole);
      console.log(`↪️  Migrated role ${oldCode} → ${newCode}`);
    }
  }
  const legacyAdmin = await roleRepo.findOne({ where: { code: 'ADMIN' } });
  const roleAdmin = savedRoles.get('ROLE_ADMIN');
  if (legacyAdmin && roleAdmin) {
    await dataSource
      .createQueryBuilder()
      .update(User)
      .set({ role: roleAdmin })
      .where('role_id = :id', { id: legacyAdmin.id })
      .execute();
    await roleRepo.remove(legacyAdmin);
    console.log('↪️  Merged legacy ADMIN → ROLE_ADMIN');
  }

  // ---- Role Permissions ----
  const allComps = await permissionRepo.find({ where: { type: 'Component' } });

  // SUPER_ADMIN gets all permissions
  const superAdminRole = savedRoles.get('ROLE_SUPER_ADMIN');
  if (superAdminRole) {
    superAdminRole.permissions = allComps;
    await roleRepo.save(superAdminRole);
  }

  // ADMIN gets full access to all modules
  const fullAdminRole = savedRoles.get('ROLE_ADMIN');
  if (fullAdminRole) {
    fullAdminRole.permissions = allComps;
    await roleRepo.save(fullAdminRole);
  }

  // MANAGER gets VIEW, CREATE, UPDATE (not DELETE) + ASSIGN + ACCEPT/PRINT
  const managerRole = savedRoles.get('ROLE_MANAGER');
  if (managerRole) {
    managerRole.permissions = allComps.filter((p) =>
      p.code.endsWith('_VIEW') ||
      p.code.endsWith('_CREATE') ||
      p.code.endsWith('_UPDATE') ||
      p.code === 'ADMIN_C_PERMISSION_ASSIGN' ||
      p.code === 'ADMIN_C_REPORT_VIEW' ||
      p.code === 'ADMIN_C_TNLD_CONTRACT_ACCEPT' ||
      p.code === 'ADMIN_C_TNLD_CONTRACT_PRINT',
    );
    await roleRepo.save(managerRole);
  }

  // USER gets VIEW only
  const userRole = savedRoles.get('ROLE_USER');
  if (userRole) {
    userRole.permissions = allComps.filter((p) => p.code.endsWith('_VIEW'));
    await roleRepo.save(userRole);
  }

  // ENTERPRISE gets only ENTERPRISE_* permissions
  const entRole = savedRoles.get('ROLE_ENTERPRISE');
  if (entRole) {
    entRole.permissions = allComps.filter((p) => p.code.startsWith('ENTERPRISE_'));
    await roleRepo.save(entRole);
  }

  console.log('✅ Seeded role_permissions');

  // ---- Admin User ----
  const adminUsername = process.env.SEED_ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@vna.local';
  const adminFullName = process.env.SEED_ADMIN_FULL_NAME || 'Administrator';

  const existingAdmin = await userRepo.findOne({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const adminRole = savedRoles.get('ROLE_SUPER_ADMIN');
    const adminTitle = await titleRepo.findOne({ where: { name: 'Giám đốc' } });
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const admin = userRepo.create({
      username: adminUsername,
      passwordHash,
      fullName: adminFullName,
      email: adminEmail,
      isActive: true,
      accountType: AccountType.INTERNAL,
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
    const wardsToSeed = WARDS;

    // Clean up existing associations and wards first to prevent duplicate/stale records
    await dataSource.query('DELETE FROM tnld_contract_reports');
    await dataSource.query('UPDATE users SET district_id = NULL');
    await dataSource.query('DELETE FROM enterprises');
    await dataSource.query('DELETE FROM districts');
    console.log('🗑️  Cleared existing districts and related enterprise records');

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
      { code: 'CPDC', name: 'Công ty cổ phần đại chúng' },
      { code: 'TNHH', name: 'Công ty TNHH' },
      { code: 'TNHH1TV', name: 'Công ty TNHH 1 thành viên' },
      { code: 'DNTN', name: 'Doanh nghiệp tư nhân' },
      { code: 'DNNN', name: 'Doanh nghiệp nhà nước' },
      { code: 'FDI', name: 'Doanh nghiệp có vốn đầu tư nước ngoài' },
      { code: 'LD', name: 'Công ty liên doanh' },
      { code: 'VPDD', name: 'Văn phòng đại diện' },
      { code: 'CN', name: 'Chi nhánh' },
      { code: 'NH', name: 'Ngân hàng' },
      { code: 'BH', name: 'Công ty bảo hiểm' },
      { code: 'TCT', name: 'Tổng công ty' },
      { code: 'CK', name: 'Công ty chứng khoán' },
      { code: 'QD', name: 'Doanh nghiệp quân đội' },
      { code: 'DNCK', name: 'Doanh nghiệp chế xuất' },
      { code: 'HTXCP', name: 'Hợp tác xã cổ phần' },
      { code: 'DNXH', name: 'Doanh nghiệp xã hội' },
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
    await dataSource.query('DELETE FROM tnld_contract_reports');
    await dataSource.query('DELETE FROM enterprises');
    console.log('🗑️  Cleared existing enterprises before re-seeding industries');
  }
  await dataSource.query('DELETE FROM industries');
  console.log('🗑️  Cleared existing industries, re-seeding...');

  const parsedIndustries: { code: string; name: string }[] = [
    { code: '0111', name: 'Trồng cây lương thực' }, { code: '0112', name: 'Trồng cây công nghiệp' }, { code: '0113', name: 'Trồng cây ăn quả' }, { code: '0114', name: 'Trồng cây lấy sợi' }, { code: '0119', name: 'Trồng cây hàng năm khác' },
    { code: '0121', name: 'Trồng nho và các loại quả có múi' }, { code: '0122', name: 'Trồng cây ăn quả nhiệt đới và cận nhiệt đới' }, { code: '0123', name: 'Trồng cây có múi' }, { code: '0124', name: 'Trồng cây lấy quả có hạt và quả hạch' }, { code: '0125', name: 'Trồng cây ăn quả khác' }, { code: '0126', name: 'Trồng cây lấy dầu' }, { code: '0127', name: 'Trồng cây hương liệu và dược liệu' }, { code: '0128', name: 'Trồng cây công nghiệp lâu năm khác' }, { code: '0129', name: 'Trồng cây lâu năm khác' },
    { code: '0130', name: 'Nhân và chăm sóc cây giống nông nghiệp' },
    { code: '0141', name: 'Chăn nuôi trâu, bò' }, { code: '0142', name: 'Chăn nuôi ngựa, lừa, la, gia cầm' }, { code: '0143', name: 'Chăn nuôi cừu, dê' }, { code: '0144', name: 'Chăn nuôi lợn' }, { code: '0145', name: 'Chăn nuôi gia cầm' }, { code: '0149', name: 'Chăn nuôi khác' },
    { code: '0150', name: 'Trồng trọt, chăn nuôi kết hợp' },
    { code: '0161', name: 'Hoạt động dịch vụ nông nghiệp' }, { code: '0162', name: 'Hoạt động dịch vụ sau thu hoạch' }, { code: '0163', name: 'Xử lý hạt giống' }, { code: '0164', name: 'Xử lý hạt giống phục vụ nhân giống' },
    { code: '1011', name: 'Chế biến và bảo quản thịt' }, { code: '1012', name: 'Chế biến và bảo quản thịt gia cầm' }, { code: '1013', name: 'Sản xuất sản phẩm từ thịt, thịt gia cầm' },
    { code: '1020', name: 'Chế biến và bảo quản thủy sản' }, { code: '1030', name: 'Chế biến và bảo quản rau quả' }, { code: '1040', name: 'Sản xuất dầu, mỡ động, thực vật' }, { code: '1050', name: 'Sản xuất sản phẩm sữa' },
    { code: '1061', name: 'Xay xát và sản xuất bột thô' }, { code: '1062', name: 'Sản xuất tinh bột và các sản phẩm từ tinh bột' },
    { code: '1071', name: 'Sản xuất bánh mì và bánh tươi' }, { code: '1072', name: 'Sản xuất bánh khô và bánh bảo quản được lâu' }, { code: '1073', name: 'Sản xuất mì ống, mì sợi' }, { code: '1074', name: 'Sản xuất các loại bánh từ bột' }, { code: '1075', name: 'Sản xuất bữa ăn và đồ ăn chế biến sẵn' }, { code: '1079', name: 'Sản xuất thực phẩm khác chưa được phân vào đâu' },
    { code: '4511', name: 'Bán buôn ô tô và xe có động cơ khác' }, { code: '4512', name: 'Bán lẻ ô tô và xe có động cơ khác' },
    { code: '4521', name: 'Bảo dưỡng và sửa chữa ô tô và xe có động cơ khác' }, { code: '4522', name: 'Bảo dưỡng và sửa chữa xe máy' },
    { code: '4530', name: 'Bán phụ tùng và các bộ phận phụ trợ của ô tô và xe có động cơ khác' },
    { code: '4610', name: 'Đại lý, môi giới, đấu giá' },
    { code: '4620', name: 'Bán buôn nông, lâm sản nguyên liệu (trừ gỗ, tre, nứa) và động vật sống' },
    { code: '4631', name: 'Bán buôn gạo, ngũ cốc, sản phẩm từ ngũ cốc' }, { code: '4632', name: 'Bán buôn thực phẩm' }, { code: '4633', name: 'Bán buôn đồ uống' }, { code: '4634', name: 'Bán buôn sản phẩm thuốc lá, thuốc lào' }, { code: '4635', name: 'Bán buôn dầu, mỡ, nhiên liệu' }, { code: '4636', name: 'Bán buôn đường, sữa và các sản phẩm sữa' }, { code: '4639', name: 'Bán buôn thực phẩm, đồ uống và thuốc lá, thuốc lào khác' },
    { code: '4641', name: 'Bán buôn vải, hàng may mặc' }, { code: '4642', name: 'Bán buôn giày dép' }, { code: '4643', name: 'Bán buôn đồ dùng trong gia đình' }, { code: '4649', name: 'Bán buôon đồ dùng cá nhân và gia đình khác' },
    { code: '4651', name: 'Bán buôn máy vi tính, thiết bị ngoại vi và phần mềm' }, { code: '4652', name: 'Bán buôn thiết bị và linh kiện điện tử, viễn thông' }, { code: '4659', name: 'Bán buôn máy móc, thiết bị và phụ tùng máy khác' },
    { code: '4661', name: 'Bán buôn nhiên liệu rắn, lỏng, khí và các sản phẩm liên quan' }, { code: '4662', name: 'Bán buôn kim loại và quặng kim loại' }, { code: '4663', name: 'Bán buôn vật liệu xây dựng, thiết bị lắp đặt trong xây dựng' }, { code: '4669', name: 'Bán buôn chuyên doanh khác chưa được phân vào đâu' },
    { code: '4690', name: 'Bán buôn tổng hợp' },
  ];
  console.log(`Seeding ${parsedIndustries.length} industries`);

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
          accountType: AccountType.ENTERPRISE,
          role: enterpriseRole || undefined,
        });
        await userRepo.save(user);
      }
      console.log('✅ Seeded enterprise user accounts');
    }
  }
}
