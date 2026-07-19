import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { RequirePermission } from '../../libs/core/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@ApiTags('Quyền')
@Controller('permissions')
@UseGuards(PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @RequirePermission('ADMIN_C_PERMISSION_VIEW')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách quyền',
    description: 'Trả về danh sách tất cả quyền trong hệ thống.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách quyền.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xem danh sách quyền.' })
  async findAll() {
    return this.permissionsService.findAll();
  }

  @Get('tree')
  @RequirePermission('ADMIN_C_PERMISSION_VIEW')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy cây quyền',
    description: 'Trả về cấu trúc cây phân cấp của tất cả quyền.'
  })
  @ApiResponse({ status: 200, description: 'Cấu trúc cây quyền.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xem cây quyền.' })
  async getTree() {
    return this.permissionsService.getTree();
  }

  @Get(':id')
  @RequirePermission('ADMIN_C_PERMISSION_VIEW')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy quyền theo ID',
    description: 'Trả về thông tin chi tiết của một quyền.'
  })
  @ApiResponse({ status: 200, description: 'Thông tin quyền.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xem quyền.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quyền.' })
  async findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Post()
  @RequirePermission('ADMIN_C_PERMISSION_ASSIGN')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo quyền mới',
    description: 'Tạo mới một quyền trong hệ thống.'
  })
  @ApiResponse({ status: 201, description: 'Tạo quyền thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền tạo quyền.' })
  async create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Put(':id')
  @RequirePermission('ADMIN_C_PERMISSION_ASSIGN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật quyền',
    description: 'Cập nhật thông tin một quyền theo ID.'
  })
  @ApiResponse({ status: 200, description: 'Cập nhật quyền thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật quyền.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quyền.' })
  async update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('ADMIN_C_PERMISSION_ASSIGN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa quyền',
    description: 'Xóa một quyền theo ID.'
  })
  @ApiResponse({ status: 204, description: 'Xóa quyền thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa quyền.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quyền.' })
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
