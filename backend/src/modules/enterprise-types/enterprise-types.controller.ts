import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { EnterpriseTypesService } from './enterprise-types.service';
import { CreateEnterpriseTypeDto } from './dto/create-enterprise-type.dto';
import { UpdateEnterpriseTypeDto } from './dto/update-enterprise-type.dto';
import { RequirePermission } from '../../libs/core/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

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
  @UseGuards(PermissionsGuard)
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('ADMIN_C_ENTERPRISE_TYPE_CREATE')
  async create(@Body() dto: CreateEnterpriseTypeDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermission('ADMIN_C_ENTERPRISE_TYPE_UPDATE')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEnterpriseTypeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('ADMIN_C_ENTERPRISE_TYPE_DELETE')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
