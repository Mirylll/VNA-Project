import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TitlesService } from './titles.service';
import { CreateTitleDto } from './dto/create-title.dto';

@Controller('titles')
export class TitlesController {
  constructor(private readonly titlesService: TitlesService) {}

  @Get()
  async findAll() {
    return this.titlesService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTitleDto) {
    return this.titlesService.create(dto);
  }
}
