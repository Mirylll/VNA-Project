import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnterprisesService } from './enterprises.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { RequirePermission } from '../../libs/core/decorators/require-permission.decorator';
import { Public } from '../../libs/core/decorators/public.decorator';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@ApiTags('Doanh nghiệp')
@Controller('enterprises')
@UseGuards(PermissionsGuard)
export class EnterprisesController {
  constructor(private readonly service: EnterprisesService) {}

  @Get()
  @RequirePermission('ADMIN_C_ENTERPRISE_VIEW')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách doanh nghiệp',
    description: 'Trả về danh sách doanh nghiệp có phân trang. Hỗ trợ tìm kiếm theo tên, mã số thuế, email.'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang (mặc định: 1).' })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Số bản ghi mỗi trang (mặc định: 20).' })
  @ApiQuery({ name: 'search', required: false, description: 'Từ khóa tìm kiếm.' })
  @ApiResponse({ status: 200, description: 'Danh sách doanh nghiệp.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xem danh sách doanh nghiệp.' })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAll(Number(page) || 1, Number(pageSize) || 20, search);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông tin doanh nghiệp của tôi',
    description: 'Trả về thông tin doanh nghiệp của người dùng đang đăng nhập.'
  })
  @ApiResponse({ status: 200, description: 'Thông tin doanh nghiệp.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 404, description: 'Người dùng chưa có doanh nghiệp.' })
  async findCurrent(@Headers('authorization') authHeader?: string) {
    return this.service.findCurrent(authHeader);
  }

  @Get(':id')
  @RequirePermission('ADMIN_C_ENTERPRISE_VIEW')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy doanh nghiệp theo ID',
    description: 'Trả về thông tin chi tiết của một doanh nghiệp.'
  })
  @ApiResponse({ status: 200, description: 'Thông tin doanh nghiệp.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xem doanh nghiệp.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy doanh nghiệp.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('ADMIN_C_ENTERPRISE_CREATE')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo doanh nghiệp mới',
    description: 'Tạo mới một doanh nghiệp (yêu cầu quyền ADMIN_C_ENTERPRISE_CREATE).'
  })
  @ApiResponse({ status: 201, description: 'Tạo doanh nghiệp thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền tạo doanh nghiệp.' })
  async create(@Body() dto: CreateEnterpriseDto) {
    return this.service.create(dto);
  }

  @Put('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật doanh nghiệp của tôi',
    description: 'Cập nhật thông tin doanh nghiệp của người dùng đang đăng nhập.'
  })
  @ApiResponse({ status: 200, description: 'Cập nhật doanh nghiệp thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy doanh nghiệp.' })
  async updateCurrent(@Headers('authorization') authHeader: string | undefined, @Body() dto: UpdateEnterpriseDto) {
    return this.service.updateCurrent(authHeader, dto);
  }

  @Put(':id')
  @RequirePermission('ADMIN_C_ENTERPRISE_UPDATE')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật doanh nghiệp',
    description: 'Cập nhật thông tin doanh nghiệp theo ID.'
  })
  @ApiResponse({ status: 200, description: 'Cập nhật doanh nghiệp thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật doanh nghiệp.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy doanh nghiệp.' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEnterpriseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('ADMIN_C_ENTERPRISE_DELETE')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa doanh nghiệp',
    description: 'Xóa một doanh nghiệp theo ID.'
  })
  @ApiResponse({ status: 204, description: 'Xóa doanh nghiệp thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa doanh nghiệp.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy doanh nghiệp.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Get(':id/attachments')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách tệp đính kèm',
    description: 'Trả về danh sách tệp đính kèm của một doanh nghiệp.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách tệp đính kèm.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy doanh nghiệp.' })
  async findAttachments(@Param('id', ParseIntPipe) id: number) {
    return this.service.findAttachments(id);
  }

  @Post(':id/attachments')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tải lên tệp đính kèm',
    description: 'Tải lên tệp đính kèm cho doanh nghiệp (tối đa 10MB).'
  })
  @ApiResponse({ status: 201, description: 'Tải lên tệp thành công.' })
  @ApiResponse({ status: 400, description: 'Lỗi tải lên tệp.' })
  async uploadAttachment(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: any,
    @Body('name') name: string,
  ) {
    return this.service.uploadAttachment(id, file, name);
  }

  @Public()
  @Post(':id/registration-attachments')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  @ApiOperation({
    summary: 'Tải lên tệp đính kèm đăng ký',
    description: 'Tải lên tệp đính kèm trong quá trình đăng ký doanh nghiệp (không cần đăng nhập).'
  })
  @ApiResponse({ status: 201, description: 'Tải lên tệp thành công.' })
  @ApiResponse({ status: 400, description: 'Lỗi tải lên tệp hoặc token không hợp lệ.' })
  async uploadRegistrationAttachment(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: any,
    @Body('name') name: string,
    @Body('uploadToken') uploadToken: string,
  ) {
    return this.service.uploadRegistrationAttachment(id, file, name, uploadToken);
  }

  @Delete(':id/attachments/:attachmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa tệp đính kèm',
    description: 'Xóa một tệp đính kèm của doanh nghiệp theo ID.'
  })
  @ApiResponse({ status: 204, description: 'Xóa tệp đính kèm thành công.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tệp đính kèm.' })
  async removeAttachment(
    @Param('id', ParseIntPipe) id: number,
    @Param('attachmentId', ParseIntPipe) attachmentId: number,
  ) {
    return this.service.removeAttachment(id, attachmentId);
  }
}
