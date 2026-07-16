import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { CreateTnldContractReportDto } from './dto/create-tnld-contract-report.dto';
import { UpdateTnldContractReportDto } from './dto/update-tnld-contract-report.dto';
import { TnldContractReportsService } from './tnld-contract-reports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@Controller('tnld-contract-reports')
export class TnldContractReportsController {
  constructor(private readonly service: TnldContractReportsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
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
  async findAll() {
    return this.service.findAll();
  }

  @Get('enterprise/:enterpriseId')
  async findByEnterprise(@Param('enterpriseId', ParseIntPipe) enterpriseId: number) {
    return this.service.findByEnterprise(enterpriseId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTnldContractReportDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTnldContractReportDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/accept')
  async accept(@Param('id', ParseIntPipe) id: number) {
    return this.service.accept(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
