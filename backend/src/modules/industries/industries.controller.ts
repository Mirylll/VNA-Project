import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndustriesService } from './industries.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { RequirePermission } from '../../libs/core/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@ApiTags('Ngành nghề')
@Controller('industries')
export class IndustriesController {
  constructor(private readonly service: IndustriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách ngành nghề',
    description: 'Trả về danh sách tất cả ngành nghề kinh doanh.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách ngành nghề.' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy ngành nghề theo ID',
    description: 'Trả về thông tin chi tiết của một ngành nghề.'
  })
  @ApiResponse({ status: 200, description: 'Thông tin ngành nghề.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy ngành nghề.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('ADMIN_C_INDUSTRY_CREATE')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo ngành nghề mới',
    description: 'Tạo mới một ngành nghề kinh doanh.'
  })
  @ApiResponse({ status: 201, description: 'Tạo ngành nghề thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền thực hiện.' })
  async create(@Body() dto: CreateIndustryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermission('ADMIN_C_INDUSTRY_UPDATE')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật ngành nghề',
    description: 'Cập nhật thông tin ngành nghề theo ID.'
  })
  @ApiResponse({ status: 200, description: 'Cập nhật ngành nghề thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền thực hiện.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy ngành nghề.' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIndustryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('ADMIN_C_INDUSTRY_DELETE')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa ngành nghề',
    description: 'Xóa một ngành nghề theo ID.'
  })
  @ApiResponse({ status: 204, description: 'Xóa ngành nghề thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền thực hiện.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy ngành nghề.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
