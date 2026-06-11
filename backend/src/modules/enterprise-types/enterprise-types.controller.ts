import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { EnterpriseTypesService } from './enterprise-types.service';
import { CreateEnterpriseTypeDto } from './dto/create-enterprise-type.dto';
import { UpdateEnterpriseTypeDto } from './dto/update-enterprise-type.dto';

@Controller('enterprise-types')
export class EnterpriseTypesController {
  constructor(private readonly service: EnterpriseTypesService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateEnterpriseTypeDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEnterpriseTypeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
