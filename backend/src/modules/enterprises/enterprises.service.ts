import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { ILike, Repository } from 'typeorm';
import { Enterprise } from './entities/enterprise.entity';
import { Attachment } from './entities/attachment.entity';
import { EnterpriseType } from '../enterprise-types/entities/enterprise-type.entity';
import { Industry } from '../industries/entities/industry.entity';
import { District } from '../users/entities/district.entity';
import { User, AccountType } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';

@Injectable()
export class EnterprisesService {
  constructor(
    @InjectRepository(Enterprise)
    private readonly repo: Repository<Enterprise>,
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
    @InjectRepository(EnterpriseType)
    private readonly enterpriseTypeRepo: Repository<EnterpriseType>,
    @InjectRepository(Industry)
    private readonly industryRepo: Repository<Industry>,
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  private getUsernameFromAuthHeader(authHeader?: string): string {
    if (!authHeader) throw new UnauthorizedException('Missing authorization header');

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    try {
      const payload = this.jwtService.verify(token);
      if (!payload?.username) {
        throw new UnauthorizedException('Invalid token payload');
      }
      return payload.username;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private makeCode(prefix: string, value: string) {
    const normalized = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toUpperCase();
    return `${prefix}_${normalized}`.slice(0, 50);
  }

  private async findOrCreateEnterpriseType(name?: string) {
    const cleanName = name?.trim();
    if (!cleanName) return null;

    const existing = await this.enterpriseTypeRepo.findOne({
      where: [{ name: cleanName }, { code: cleanName }, { name: ILike(cleanName) }],
    });
    if (existing) return existing;

    return this.enterpriseTypeRepo.save(
      this.enterpriseTypeRepo.create({
        code: this.makeCode('LH', cleanName),
        name: cleanName,
        isActive: true,
      }),
    );
  }

  private parseIndustryValue(value?: string) {
    const cleanValue = value?.trim();
    if (!cleanValue) return null;

    const matched = cleanValue.match(/^(\d{2,10})\s*-\s*(.+)$/);
    if (!matched) {
      return {
        code: this.makeCode('NN', cleanValue),
        name: cleanValue,
      };
    }

    return {
      code: matched[1],
      name: matched[2].trim(),
    };
  }

  private async findOrCreateIndustry(value?: string) {
    const industry = this.parseIndustryValue(value);
    if (!industry) return null;

    const existing = await this.industryRepo.findOne({
      where: [{ code: industry.code }, { name: industry.name }, { name: ILike(industry.name) }],
    });
    if (existing) return existing;

    return this.industryRepo.save(
      this.industryRepo.create({
        code: industry.code,
        name: industry.name,
        isActive: true,
        level: 1,
      }),
    );
  }

  private async findOrCreateHcmWard(name?: string) {
    const cleanName = name?.trim();
    if (!cleanName) return null;

    const existing = await this.districtRepo.findOne({
      where: { name: ILike(cleanName), province: { id: 1 } },
      relations: ['province'],
    });
    if (existing) return existing;

    return this.districtRepo.save(
      this.districtRepo.create({
        name: cleanName,
        province: { id: 1 } as any,
      }),
    );
  }

  private assertLicenseDateNotInFuture(value?: string) {
    if (!value) return;

    const inputDate = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(inputDate.getTime()) || inputDate > today) {
      throw new BadRequestException('Ngày cấp GPKD không được lớn hơn ngày hiện tại');
    }
  }

  async findAll(): Promise<Enterprise[]> {
    return this.repo.find({
      relations: ['enterpriseType', 'industry', 'province', 'ward', 'operationProvince', 'operationWard'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Enterprise> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: [
        'enterpriseType',
        'industry',
        'province',
        'ward',
        'operationProvince',
        'operationWard',
        'attachments',
      ],
    });
    if (!entity) throw new NotFoundException('Doanh nghiệp không tồn tại');
    return entity;
  }

  async findCurrent(authHeader?: string): Promise<Enterprise> {
    const username = this.getUsernameFromAuthHeader(authHeader);
    const entity = await this.repo.findOne({
      where: [{ username }, { taxCode: username }],
      relations: [
        'enterpriseType',
        'industry',
        'province',
        'ward',
        'operationProvince',
        'operationWard',
        'attachments',
      ],
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thông tin doanh nghiệp của tài khoản hiện tại');
    return entity;
  }

  async create(dto: CreateEnterpriseDto): Promise<Enterprise> {
    this.assertLicenseDateNotInFuture(dto.licenseDate);

    const username = dto.username || dto.taxCode;
    if (!username) {
      throw new BadRequestException('Cần có tên đăng nhập hoặc mã số thuế để tạo tài khoản');
    }

    const existingUser = await this.userRepo.findOne({ where: { username } });
    if (existingUser) {
      throw new BadRequestException(`Tên đăng nhập "${username}" đã tồn tại`);
    }

    const entity = new Enterprise();
    entity.name = dto.name;
    entity.taxCode = dto.taxCode;
    entity.licenseDate = dto.licenseDate;
    entity.address = dto.address;
    entity.foreignName = dto.foreignName;
    entity.email = dto.email;
    entity.phone = dto.phone;
    entity.operationAddress = dto.operationAddress;
    entity.leaderName = dto.leaderName;
    entity.leaderPhone = dto.leaderPhone;
    entity.username = username;
    entity.password = dto.password || '12345678';
    entity.isActive = dto.isActive ?? true;
    if (dto.enterpriseTypeId) entity.enterpriseType = { id: dto.enterpriseTypeId } as any;
    if (dto.industryId) entity.industry = { id: dto.industryId } as any;
    if (dto.provinceId) entity.province = { id: dto.provinceId } as any;
    if (dto.wardId) entity.ward = { id: dto.wardId } as any;
    if (dto.operationProvinceId) entity.operationProvince = { id: dto.operationProvinceId } as any;
    if (dto.operationWardId) entity.operationWard = { id: dto.operationWardId } as any;

    const enterpriseRole = await this.roleRepo.findOne({ where: { code: 'ROLE_ENTERPRISE' } });
    const passwordHash = await bcrypt.hash(entity.password, 10);

    const user = this.userRepo.create({
      username,
      passwordHash,
      fullName: dto.name,
      email: dto.email || undefined,
      isActive: dto.isActive ?? true,
      accountType: AccountType.ENTERPRISE,
      role: enterpriseRole || undefined,
    });

    await this.userRepo.save(user);
    return this.repo.save(entity) as unknown as Promise<Enterprise>;
  }

  async update(id: number, dto: UpdateEnterpriseDto): Promise<Enterprise> {
    this.assertLicenseDateNotInFuture(dto.licenseDate);

    const entity = await this.findOne(id);
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.taxCode !== undefined) entity.taxCode = dto.taxCode;
    if (dto.licenseDate !== undefined) entity.licenseDate = dto.licenseDate;
    if (dto.address !== undefined) entity.address = dto.address;
    if (dto.foreignName !== undefined) entity.foreignName = dto.foreignName;
    if (dto.email !== undefined) entity.email = dto.email;
    if (dto.phone !== undefined) entity.phone = dto.phone;
    if (dto.operationAddress !== undefined) entity.operationAddress = dto.operationAddress;
    if (dto.leaderName !== undefined) entity.leaderName = dto.leaderName;
    if (dto.leaderPhone !== undefined) entity.leaderPhone = dto.leaderPhone;
    if (dto.username !== undefined) entity.username = dto.username;
    if (dto.password !== undefined) entity.password = dto.password;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    if (dto.enterpriseTypeId !== undefined) {
      entity.enterpriseType = { id: dto.enterpriseTypeId } as any;
    } else if (dto.enterpriseTypeName !== undefined) {
      const enterpriseType = await this.findOrCreateEnterpriseType(dto.enterpriseTypeName);
      if (enterpriseType) entity.enterpriseType = enterpriseType;
    }
    if (dto.industryId !== undefined) {
      entity.industry = { id: dto.industryId } as any;
    } else if (dto.industryName !== undefined) {
      const industry = await this.findOrCreateIndustry(dto.industryName);
      if (industry) entity.industry = industry;
    }
    if (dto.provinceId !== undefined) entity.province = { id: dto.provinceId } as any;
    if (dto.wardId !== undefined) {
      entity.ward = { id: dto.wardId } as any;
    } else if (dto.wardName !== undefined) {
      const ward = await this.findOrCreateHcmWard(dto.wardName);
      if (ward) entity.ward = ward;
    }
    if (dto.operationProvinceId !== undefined) entity.operationProvince = { id: dto.operationProvinceId } as any;
    if (dto.operationWardId !== undefined) entity.operationWard = { id: dto.operationWardId } as any;
    return this.repo.save(entity);
  }

  async updateCurrent(authHeader: string | undefined, dto: UpdateEnterpriseDto): Promise<Enterprise> {
    const entity = await this.findCurrent(authHeader);
    return this.update(entity.id, dto);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);

    await this.repo.manager.transaction(async (manager) => {
      const enterpriseRepo = manager.getRepository(Enterprise);
      const userRepo = manager.getRepository(User);

      await enterpriseRepo.delete(entity.id);

      const candidateWhere = [
        ...(entity.username ? [{ username: entity.username }] : []),
        ...(entity.taxCode ? [{ username: entity.taxCode }] : []),
        ...(entity.email ? [{ email: entity.email }] : []),
      ];

      const candidateUsers =
        candidateWhere.length > 0
          ? await userRepo.find({
              where: candidateWhere,
              relations: ['role'],
            })
          : [];

      const enterpriseUsers = candidateUsers.filter((user) => {
        const matchesIdentity =
          user.username === entity.username ||
          user.username === entity.taxCode ||
          (!!entity.email && user.email === entity.email);

        return (
          matchesIdentity &&
          (user.accountType === AccountType.ENTERPRISE || user.role?.code === 'ROLE_ENTERPRISE')
        );
      });

      if (enterpriseUsers.length > 0) {
        await userRepo.delete(enterpriseUsers.map((user) => user.id));
      }
    });
  }

  async findAttachments(enterpriseId: number): Promise<Attachment[]> {
    return this.attachmentRepo.find({
      where: { enterprise: { id: enterpriseId } },
      order: { createdAt: 'DESC' },
    });
  }

  async uploadAttachment(
    enterpriseId: number,
    file: any,
    name: string,
  ): Promise<Attachment> {
    await this.findOne(enterpriseId);

    const dir = path.join('uploads', 'enterprises', String(enterpriseId));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const ext = path.extname(file.originalname) || '';
    const destFileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const destPath = path.join(dir, destFileName);

    const srcPath = file.path;
    if (fs.existsSync(srcPath)) {
      fs.renameSync(srcPath, destPath);
    } else {
      fs.writeFileSync(destPath, file.buffer);
    }

    const attachment = this.attachmentRepo.create({
      name,
      fileName: file.originalname,
      filePath: `/uploads/enterprises/${enterpriseId}/${destFileName}`,
      fileSize: file.size,
      enterprise: { id: enterpriseId } as any,
    });
    return this.attachmentRepo.save(attachment);
  }

  async uploadRegistrationAttachment(
    enterpriseId: number,
    file: any,
    name: string,
    uploadToken?: string,
  ): Promise<Attachment> {
    if (!uploadToken) {
      throw new UnauthorizedException('Missing upload token');
    }

    try {
      const payload = this.jwtService.verify(uploadToken) as {
        enterpriseId?: number;
        purpose?: string;
      };

      if (
        payload.purpose !== 'enterprise-registration-upload' ||
        Number(payload.enterpriseId) !== enterpriseId
      ) {
        throw new UnauthorizedException('Invalid upload token');
      }
    } catch {
      throw new UnauthorizedException('Invalid or expired upload token');
    }

    return this.uploadAttachment(enterpriseId, file, name);
  }

  async removeAttachment(enterpriseId: number, attachmentId: number): Promise<void> {
    const attachment = await this.attachmentRepo.findOne({
      where: { id: attachmentId, enterprise: { id: enterpriseId } },
    });
    if (!attachment) throw new NotFoundException('File đính kèm không tồn tại');

    const fullPath = path.join(process.cwd(), attachment.filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await this.attachmentRepo.delete(attachmentId);
  }
}
