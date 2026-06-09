import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepo.find({ relations: ['permissions'] });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { id }, relations: ['permissions'] });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepo.create(dto);
    return this.roleRepo.save(role);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, dto);
    return this.roleRepo.save(role);
  }

  async remove(id: string): Promise<void> {
    const userCount = await this.userRepo.count({ where: { role: { id } } });
    if (userCount > 0) {
      throw new BadRequestException(
        `Không thể xoá vai trò đang được ${userCount} người dùng sử dụng`,
      );
    }
    await this.roleRepo.delete(id);
  }

  async assignPermissions(id: string, dto: AssignPermissionsDto): Promise<Role> {
    const role = await this.findOne(id);
    const permissions = await this.permissionRepo.findByIds(dto.permissionIds);
    role.permissions = permissions;
    return this.roleRepo.save(role);
  }
}
