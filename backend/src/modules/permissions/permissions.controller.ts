import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { RequirePermission } from '../../libs/core/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@Controller('permissions')
@UseGuards(PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @RequirePermission('ADMIN_C_PERMISSION_VIEW')
  async findAll() {
    return this.permissionsService.findAll();
  }

  @Get('tree')
  @RequirePermission('ADMIN_C_PERMISSION_VIEW')
  async getTree() {
    return this.permissionsService.getTree();
  }

  @Get(':id')
  @RequirePermission('ADMIN_C_PERMISSION_VIEW')
  async findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Post()
  @RequirePermission('ADMIN_C_PERMISSION_ASSIGN')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Put(':id')
  @RequirePermission('ADMIN_C_PERMISSION_ASSIGN')
  async update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('ADMIN_C_PERMISSION_ASSIGN')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
