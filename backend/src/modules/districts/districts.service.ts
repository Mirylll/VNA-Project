import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from '../users/entities/district.entity';

@Injectable()
export class DistrictsService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
  ) {}

  async findByProvince(provinceId: number): Promise<District[]> {
    return this.districtRepo.find({
      where: { province: { id: provinceId } },
      order: { name: 'ASC' },
    });
  }
}
