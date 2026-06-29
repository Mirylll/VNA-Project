import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { IndustriesService } from './industries.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { RequirePermission } from '../../libs/core/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@Controller('industries')
export class IndustriesController {
  constructor(private readonly service: IndustriesService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('ADMIN_C_INDUSTRY_CREATE')
  async create(@Body() dto: CreateIndustryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermission('ADMIN_C_INDUSTRY_UPDATE')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIndustryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('ADMIN_C_INDUSTRY_DELETE')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
