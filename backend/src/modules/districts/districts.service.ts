import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from '../users/entities/district.entity';
import { Province } from '../users/entities/province.entity';

@Injectable()
export class DistrictsService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
    @InjectRepository(Province)
    private readonly provinceRepo: Repository<Province>,
  ) {}

  async findAllProvinces(): Promise<Province[]> {
    return this.provinceRepo.find({ order: { name: 'ASC' } });
  }

  async findByProvince(provinceId: number): Promise<District[]> {
    return this.districtRepo.find({
      where: { province: { id: provinceId } },
      order: { name: 'ASC' },
    });
  }
}
