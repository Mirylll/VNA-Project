import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Title } from '../titles/entities/title.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Title)
    private readonly titleRepo: Repository<Title>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find({ relations: ['role', 'title'] });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['role', 'title'] });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { roleId, titleId, ...rest } = dto;
    const user = this.userRepo.create({ ...rest, passwordHash });

    if (roleId) {
      const role = await this.roleRepo.findOne({ where: { id: roleId as any } });
      if (role) user.role = role;
    }
    if (titleId) {
      const title = await this.titleRepo.findOne({ where: { id: titleId as any } });
      if (title) user.title = title;
    }

    return this.userRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const { roleId, titleId, password, ...rest } = dto;

    Object.assign(user, rest);

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    if (roleId !== undefined) {
      if (roleId === null) {
        user.role = undefined;
      } else {
        const role = await this.roleRepo.findOne({ where: { id: roleId as any } });
        if (role) user.role = role;
      }
    }

    if (titleId !== undefined) {
      if (titleId === null) {
        user.title = undefined;
      } else {
        const title = await this.titleRepo.findOne({ where: { id: titleId as any } });
        if (title) user.title = title;
      }
    }

    return this.userRepo.save(user);
  }

  async softRemove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepo.softRemove(user);
  }
}
