import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/users/entities/user.entity';

const DEFAULT_ROLES = ['Admin', 'User'];

export async function seed(dataSource: DataSource): Promise<void> {
  const roleRepository = dataSource.getRepository(Role);
  const userRepository = dataSource.getRepository(User);

  const roles = new Map<string, Role>();

  for (const name of DEFAULT_ROLES) {
    let role = await roleRepository.findOne({ where: { name } });

    if (!role) {
      role = roleRepository.create({ name });
      await roleRepository.save(role);
    }

    roles.set(name, role);
  }

  const adminUsername = process.env.SEED_ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@vna.local';
  const adminFullName = process.env.SEED_ADMIN_FULL_NAME || 'Administrator';

  const existingAdmin = await userRepository.findOne({
    where: { username: adminUsername },
    relations: { role: true },
  });

  if (existingAdmin) {
    return;
  }

  const adminRole = roles.get('Admin');
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = userRepository.create({
    username: adminUsername,
    passwordHash,
    fullName: adminFullName,
    email: adminEmail,
    isActive: true,
    role: adminRole,
  });

  await userRepository.save(admin);
}
