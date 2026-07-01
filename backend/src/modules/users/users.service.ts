import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { existsSync, mkdirSync } from 'fs';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { User } from './entities/user.entity';
import { UserAvatar } from './entities/user-avatar.entity';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { Role } from '../roles/entities/role.entity';
import { Title } from '../titles/entities/title.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validateAvatarFile } from './dto/upload-avatar.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Title)
    private readonly titleRepo: Repository<Title>,
    @InjectRepository(Province)
    private readonly provinceRepo: Repository<Province>,
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
    @InjectRepository(UserAvatar)
    private readonly avatarRepo: Repository<UserAvatar>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find({ relations: ['role', 'title', 'province', 'district'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['role', 'title', 'province', 'district'] });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { roleId, titleId, titleName, provinceId, districtId, ...rest } = dto;
    const user = this.userRepo.create({ ...rest, passwordHash });

    if (roleId) {
      const role = await this.roleRepo.findOne({ where: { id: roleId as any } });
      if (role) user.role = role;
    }
    if (titleId) {
      const title = await this.titleRepo.findOne({ where: { id: titleId as any } });
      if (title) user.title = title;
    } else if (titleName) {
      let title = await this.titleRepo.findOne({ where: { name: titleName } });
      if (!title) {
        title = this.titleRepo.create({ name: titleName });
        title = await this.titleRepo.save(title);
      }
      user.title = title;
    }
    if (provinceId) {
      const province = await this.provinceRepo.findOne({ where: { id: provinceId as any } });
      if (province) user.province = province;
    }
    if (districtId) {
      const district = await this.districtRepo.findOne({ where: { id: districtId as any } });
      if (district) user.district = district;
    }

    return this.userRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const { roleId, titleId, titleName, provinceId, districtId, password, ...rest } = dto;

    Object.assign(user, rest);

    if (password) {
      if (user.passwordHash && (await bcrypt.compare(password, user.passwordHash))) {
        throw new BadRequestException('Mật khẩu mới không được trùng với mật khẩu cũ');
      }
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
    } else if (titleName !== undefined) {
      if (titleName === null) {
        user.title = undefined;
      } else {
        let title = await this.titleRepo.findOne({ where: { name: titleName } });
        if (!title) {
          title = this.titleRepo.create({ name: titleName });
          title = await this.titleRepo.save(title);
        }
        user.title = title;
      }
    }

    if (provinceId !== undefined) {
      if (provinceId === null) {
        user.province = undefined;
      } else {
        const province = await this.provinceRepo.findOne({ where: { id: provinceId as any } });
        if (province) user.province = province;
      }
    }

    if (districtId !== undefined) {
      if (districtId === null) {
        user.district = undefined;
      } else {
        const district = await this.districtRepo.findOne({ where: { id: districtId as any } });
        if (district) user.district = district;
      }
    }

    return this.userRepo.save(user);
  }

  async softRemove(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.email = user.email ? `deleted-${user.id}-${user.email}` : undefined;
    user.username = `deleted-${user.id}-${user.username}`.slice(0, 50);
    await this.userRepo.save(user);
    await this.userRepo.softRemove(user);
  }

  async updateAvatar(id: string, file: any, currentUserId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['avatar'],
    });
    if (!user) throw new NotFoundException('User not found');

    // Validate file
    const validationError = validateAvatarFile(file.mimetype, file.size);
    if (validationError) {
      throw new BadRequestException(validationError);
    }

    const uploadDir = join('uploads', 'avatars', id);
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Delete old file from disk if exists
    if (user.avatar) {
      const oldPath = join(process.cwd(), user.avatar.filePath);
      if (existsSync(oldPath)) {
        await unlink(oldPath).catch(() => {});
      }
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const relativePath = join(uploadDir, fileName);
    const absolutePath = join(process.cwd(), relativePath);

    await writeFile(absolutePath, file.buffer);

    // Upsert avatar metadata
    if (user.avatar) {
      user.avatar.fileName = fileName;
      user.avatar.filePath = relativePath;
      user.avatar.fileSize = file.size;
      user.avatar.mimeType = file.mimetype;
      await this.avatarRepo.save(user.avatar);
    } else {
      const avatar = this.avatarRepo.create({
        user,
        fileName,
        filePath: relativePath,
        fileSize: file.size,
        mimeType: file.mimetype,
      });
      await this.avatarRepo.save(avatar);
      user.avatar = avatar;
    }

    // TODO: swap to S3.upload() when ready
    // import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

    user.avatarUrl = `/${relativePath.replace(/\\/g, '/')}`;
    return this.userRepo.save(user);
  }
}
