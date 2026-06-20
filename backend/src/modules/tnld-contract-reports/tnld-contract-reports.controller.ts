import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateTnldContractReportDto } from './dto/create-tnld-contract-report.dto';
import { UpdateTnldContractReportDto } from './dto/update-tnld-contract-report.dto';
import { TnldContractReportsService } from './tnld-contract-reports.service';

@Controller('tnld-contract-reports')
export class TnldContractReportsController {
  constructor(private readonly service: TnldContractReportsService) {}

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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
