import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnterpriseType } from './entities/enterprise-type.entity';
import { CreateEnterpriseTypeDto } from './dto/create-enterprise-type.dto';
import { UpdateEnterpriseTypeDto } from './dto/update-enterprise-type.dto';

@Injectable()
export class EnterpriseTypesService {
  constructor(
    @InjectRepository(EnterpriseType)
    private readonly repo: Repository<EnterpriseType>,
  ) {}

  async findAll(): Promise<EnterpriseType[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<EnterpriseType> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Loại hình kinh doanh không tồn tại');
    return entity;
  }

  async create(dto: CreateEnterpriseTypeDto): Promise<EnterpriseType> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateEnterpriseTypeDto): Promise<EnterpriseType> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
