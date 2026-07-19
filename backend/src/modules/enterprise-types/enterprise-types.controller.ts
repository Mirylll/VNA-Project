import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnterpriseTypesService } from './enterprise-types.service';
import { CreateEnterpriseTypeDto } from './dto/create-enterprise-type.dto';
import { UpdateEnterpriseTypeDto } from './dto/update-enterprise-type.dto';
import { RequirePermission } from '../../libs/core/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@ApiTags('Loại hình doanh nghiệp')
@Controller('enterprise-types')
export class EnterpriseTypesController {
  constructor(private readonly service: EnterpriseTypesService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách loại hình doanh nghiệp',
    description: 'Trả về danh sách tất cả loại hình doanh nghiệp.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách loại hình doanh nghiệp.' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy loại hình doanh nghiệp theo ID',
    description: 'Trả về thông tin chi tiết của một loại hình doanh nghiệp.'
  })
  @ApiResponse({ status: 200, description: 'Thông tin loại hình doanh nghiệp.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy loại hình doanh nghiệp.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('ADMIN_C_ENTERPRISE_TYPE_CREATE')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo loại hình doanh nghiệp',
    description: 'Tạo mới một loại hình doanh nghiệp.'
  })
  @ApiResponse({ status: 201, description: 'Tạo loại hình doanh nghiệp thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền thực hiện.' })
  async create(@Body() dto: CreateEnterpriseTypeDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermission('ADMIN_C_ENTERPRISE_TYPE_UPDATE')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật loại hình doanh nghiệp',
    description: 'Cập nhật thông tin loại hình doanh nghiệp theo ID.'
  })
  @ApiResponse({ status: 200, description: 'Cập nhật loại hình doanh nghiệp thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền thực hiện.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy loại hình doanh nghiệp.' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEnterpriseTypeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('ADMIN_C_ENTERPRISE_TYPE_DELETE')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa loại hình doanh nghiệp',
    description: 'Xóa một loại hình doanh nghiệp theo ID.'
  })
  @ApiResponse({ status: 204, description: 'Xóa loại hình doanh nghiệp thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền thực hiện.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy loại hình doanh nghiệp.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
