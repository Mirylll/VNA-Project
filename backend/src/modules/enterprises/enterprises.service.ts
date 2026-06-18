import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { Enterprise } from './entities/enterprise.entity';
import { Attachment } from './entities/attachment.entity';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';

@Injectable()
export class EnterprisesService {
  constructor(
    @InjectRepository(Enterprise)
    private readonly repo: Repository<Enterprise>,
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
  ) {}

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

  async create(dto: CreateEnterpriseDto): Promise<Enterprise> {
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
    entity.username = dto.username;
    entity.password = dto.password;
    entity.isActive = dto.isActive ?? true;
    if (dto.enterpriseTypeId) entity.enterpriseType = { id: dto.enterpriseTypeId } as any;
    if (dto.industryId) entity.industry = { id: dto.industryId } as any;
    if (dto.provinceId) entity.province = { id: dto.provinceId } as any;
    if (dto.wardId) entity.ward = { id: dto.wardId } as any;
    if (dto.operationProvinceId) entity.operationProvince = { id: dto.operationProvinceId } as any;
    if (dto.operationWardId) entity.operationWard = { id: dto.operationWardId } as any;
    return this.repo.save(entity) as unknown as Promise<Enterprise>;
  }

  async update(id: number, dto: UpdateEnterpriseDto): Promise<Enterprise> {
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
    if (dto.enterpriseTypeId !== undefined) entity.enterpriseType = { id: dto.enterpriseTypeId } as any;
    if (dto.industryId !== undefined) entity.industry = { id: dto.industryId } as any;
    if (dto.provinceId !== undefined) entity.province = { id: dto.provinceId } as any;
    if (dto.wardId !== undefined) entity.ward = { id: dto.wardId } as any;
    if (dto.operationProvinceId !== undefined) entity.operationProvince = { id: dto.operationProvinceId } as any;
    if (dto.operationWardId !== undefined) entity.operationWard = { id: dto.operationWardId } as any;
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.delete(entity.id);
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
