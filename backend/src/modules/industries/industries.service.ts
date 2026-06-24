import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Industry } from './entities/industry.entity';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';

@Injectable()
export class IndustriesService {
  constructor(
    @InjectRepository(Industry)
    private readonly repo: Repository<Industry>,
  ) {}

  async findAll(): Promise<Industry[]> {
    return this.repo.find({ relations: ['parent', 'children'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Industry> {
    const entity = await this.repo.findOne({ where: { id }, relations: ['parent'] });
    if (!entity) throw new NotFoundException('Ngành nghề không tồn tại');
    return entity;
  }

  async create(dto: CreateIndustryDto): Promise<Industry> {
    const { parentId, ...rest } = dto;
    const entity = this.repo.create(rest);
    if (parentId) {
      entity.parent = await this.findOne(parentId);
    }
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateIndustryDto): Promise<Industry> {
    const { parentId, ...rest } = dto;
    const entity = await this.findOne(id);
    Object.assign(entity, rest);
    if (parentId !== undefined) {
      entity.parent = parentId ? await this.findOne(parentId) : undefined;
    }
    return this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    const childCount = await this.repo.count({ where: { parent: { id } } });
    if (childCount > 0) {
      throw new NotFoundException('Không thể xoá ngành nghề đang có ngành nghề con');
    }
    await this.repo.delete(id);
  }
}
