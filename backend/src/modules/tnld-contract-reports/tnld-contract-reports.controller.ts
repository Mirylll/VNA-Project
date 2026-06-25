import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CreateTnldContractReportDto } from './dto/create-tnld-contract-report.dto';
import { UpdateTnldContractReportDto } from './dto/update-tnld-contract-report.dto';
import { TnldContractReportsService } from './tnld-contract-reports.service';
import { RequirePermission } from '../../libs/core/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@Controller('tnld-contract-reports')
@UseGuards(PermissionsGuard)
export class TnldContractReportsController {
  constructor(private readonly service: TnldContractReportsService) {}

  @Get()
  @RequirePermission('ADMIN_C_TNLD_CONTRACT_VIEW')
  async findAll() {
    return this.service.findAll();
  }

  @Get('enterprise/:enterpriseId')
  async findByEnterprise(@Param('enterpriseId', ParseIntPipe) enterpriseId: number) {
    return this.service.findByEnterprise(enterpriseId);
  }

  @Get(':id')
  @RequirePermission('ADMIN_C_TNLD_CONTRACT_VIEW')
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
  @RequirePermission('ADMIN_C_TNLD_CONTRACT_ACCEPT')
  async accept(@Param('id', ParseIntPipe) id: number) {
    return this.service.accept(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
