import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { RequirePermission } from '../../libs/core/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@ApiTags('Vai trò')
@Controller('roles')
@UseGuards(PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermission('ADMIN_C_ROLE_VIEW')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách vai trò',
    description: 'Trả về danh sách tất cả vai trò trong hệ thống.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách vai trò.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xem danh sách vai trò.' })
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @RequirePermission('ADMIN_C_ROLE_VIEW')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy vai trò theo ID',
    description: 'Trả về thông tin chi tiết của một vai trò.'
  })
  @ApiResponse({ status: 200, description: 'Thông tin vai trò.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xem vai trò.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò.' })
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @RequirePermission('ADMIN_C_ROLE_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo vai trò mới',
    description: 'Tạo mới một vai trò trong hệ thống.'
  })
  @ApiResponse({ status: 201, description: 'Tạo vai trò thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền tạo vai trò.' })
  async create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Put(':id')
  @RequirePermission('ADMIN_C_ROLE_UPDATE')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật vai trò',
    description: 'Cập nhật thông tin một vai trò theo ID.'
  })
  @ApiResponse({ status: 200, description: 'Cập nhật vai trò thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật vai trò.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò.' })
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('ADMIN_C_ROLE_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa vai trò',
    description: 'Xóa một vai trò theo ID.'
  })
  @ApiResponse({ status: 204, description: 'Xóa vai trò thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa vai trò.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò.' })
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Post(':id/permissions')
  @RequirePermission('ADMIN_C_PERMISSION_ASSIGN')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gán quyền cho vai trò',
    description: 'Gán danh sách quyền cho một vai trò.'
  })
  @ApiResponse({ status: 200, description: 'Gán quyền cho vai trò thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền gán quyền.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò.' })
  async assignPermissions(@Param('id') id: string, @Body() dto: AssignPermissionsDto) {
    return this.rolesService.assignPermissions(id, dto);
  }
}
