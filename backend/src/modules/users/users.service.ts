import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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
    const user = this.userRepo.create({ ...dto, passwordHash });
    return this.userRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (dto.password) {
      dto['passwordHash'] = await bcrypt.hash(dto.password, 10);
    }
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async softRemove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepo.softRemove(user);
  }
}
