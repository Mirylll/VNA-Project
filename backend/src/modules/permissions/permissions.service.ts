import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.permissionRepo.find({ order: { sortOrder: 'ASC' } });
  }

  async findOne(id: string): Promise<Permission> {
    const perm = await this.permissionRepo.findOne({ where: { id }, relations: ['parent', 'children'] });
    if (!perm) throw new NotFoundException('Permission not found');
    return perm;
  }

  async getTree(): Promise<Permission[]> {
    const all = await this.permissionRepo.find({ relations: ['children'], order: { sortOrder: 'ASC' } });
    return all.filter((p) => p.type === 'Group' && !p.parent);
  }

  async getPermissionCodesForRole(roleId: string): Promise<string[]> {
    const role = await this.permissionRepo.manager
      .createQueryBuilder()
      .relation(Permission, 'roles')
      .of(roleId)
      .loadMany<Permission>();

    return role?.map((p: Permission) => p.code) ?? [];
  }

  async create(dto: CreatePermissionDto): Promise<Permission> {
    const { parentId, ...rest } = dto;
    const parent = parentId
      ? await this.permissionRepo.findOneBy({ id: parentId })
      : undefined;
    const perm = this.permissionRepo.create(rest);
    if (parent) perm.parent = parent;
    return this.permissionRepo.save(perm);
  }

  async update(id: string, dto: UpdatePermissionDto): Promise<Permission> {
    const perm = await this.findOne(id);
    if (dto.parentId !== undefined) {
      perm.parent = dto.parentId
        ? (await this.permissionRepo.findOneBy({ id: dto.parentId })) ?? undefined
        : undefined;
    }
    const { parentId, ...rest } = dto;
    Object.assign(perm, rest);
    return this.permissionRepo.save(perm);
  }

  async remove(id: string): Promise<void> {
    await this.permissionRepo.delete(id);
  }
}
