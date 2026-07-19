import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTnldContractReportDto } from './dto/create-tnld-contract-report.dto';
import { UpdateTnldContractReportDto } from './dto/update-tnld-contract-report.dto';
import { TnldContractReportsService } from './tnld-contract-reports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Báo cáo TNLĐ')
@Controller('tnld-contract-reports')
export class TnldContractReportsController {
  constructor(private readonly service: TnldContractReportsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tải lên tệp báo cáo',
    description: 'Tải lên tệp báo cáo TNLĐ (tối đa 10MB).'
  })
  @ApiResponse({ status: 201, description: 'Tải lên tệp thành công.' })
  @ApiResponse({ status: 400, description: 'Không tìm thấy tệp hoặc lỗi tải lên.' })
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Không tìm thấy file để tải lên');
    }
    const dir = path.join('uploads', 'tnld-contract-reports');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const ext = path.extname(file.originalname) || '';
    const destFileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const destPath = path.join(dir, destFileName);
    fs.writeFileSync(destPath, file.buffer);
    return {
      fileName: file.originalname,
      fileUrl: `/uploads/tnld-contract-reports/${destFileName}`,
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách báo cáo TNLĐ',
    description: 'Trả về danh sách tất cả báo cáo TNLĐ.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách báo cáo TNLĐ.' })
  async findAll() {
    return this.service.findAll();
  }

  @Get('enterprise/:enterpriseId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy báo cáo TNLĐ theo doanh nghiệp',
    description: 'Trả về danh sách báo cáo TNLĐ của một doanh nghiệp.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách báo cáo TNLĐ của doanh nghiệp.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy doanh nghiệp.' })
  async findByEnterprise(@Param('enterpriseId', ParseIntPipe) enterpriseId: number) {
    return this.service.findByEnterprise(enterpriseId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy báo cáo TNLĐ theo ID',
    description: 'Trả về thông tin chi tiết của một báo cáo TNLĐ.'
  })
  @ApiResponse({ status: 200, description: 'Thông tin báo cáo TNLĐ.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy báo cáo.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo báo cáo TNLĐ mới',
    description: 'Tạo mới một báo cáo TNLĐ.'
  })
  @ApiResponse({ status: 201, description: 'Tạo báo cáo TNLĐ thành công.' })
  async create(@Body() dto: CreateTnldContractReportDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật báo cáo TNLĐ',
    description: 'Cập nhật thông tin báo cáo TNLĐ theo ID.'
  })
  @ApiResponse({ status: 200, description: 'Cập nhật báo cáo TNLĐ thành công.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy báo cáo.' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTnldContractReportDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/accept')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Duyệt báo cáo TNLĐ',
    description: 'Duyệt/chấp nhận một báo cáo TNLĐ.'
  })
  @ApiResponse({ status: 200, description: 'Duyệt báo cáo TNLĐ thành công.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy báo cáo.' })
  async accept(@Param('id', ParseIntPipe) id: number) {
    return this.service.accept(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa báo cáo TNLĐ',
    description: 'Xóa một báo cáo TNLĐ theo ID.'
  })
  @ApiResponse({ status: 204, description: 'Xóa báo cáo TNLĐ thành công.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy báo cáo.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
