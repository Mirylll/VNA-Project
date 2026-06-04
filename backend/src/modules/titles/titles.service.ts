import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Title } from './entities/title.entity';
import { CreateTitleDto } from './dto/create-title.dto';

@Injectable()
export class TitlesService {
  constructor(
    @InjectRepository(Title)
    private readonly titleRepo: Repository<Title>,
  ) {}

  async findAll(): Promise<Title[]> {
    return this.titleRepo.find({ order: { name: 'ASC' } });
  }

  async create(dto: CreateTitleDto): Promise<Title> {
    const title = this.titleRepo.create(dto);
    return this.titleRepo.save(title);
  }
}
