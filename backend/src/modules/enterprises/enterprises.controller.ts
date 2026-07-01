import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { EnterprisesService } from './enterprises.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { RequirePermission } from '../../libs/core/decorators/require-permission.decorator';
import { Public } from '../../libs/core/decorators/public.decorator';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@Controller('enterprises')
@UseGuards(PermissionsGuard)
export class EnterprisesController {
  constructor(private readonly service: EnterprisesService) {}

  @Get()
  @RequirePermission('ADMIN_C_ENTERPRISE_VIEW')
  async findAll() {
    return this.service.findAll();
  }

  @Get('me')
  async findCurrent(@Headers('authorization') authHeader?: string) {
    return this.service.findCurrent(authHeader);
  }

  @Get(':id')
  @RequirePermission('ADMIN_C_ENTERPRISE_VIEW')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('ADMIN_C_ENTERPRISE_CREATE')
  async create(@Body() dto: CreateEnterpriseDto) {
    return this.service.create(dto);
  }

  @Put('me')
  async updateCurrent(@Headers('authorization') authHeader: string | undefined, @Body() dto: UpdateEnterpriseDto) {
    return this.service.updateCurrent(authHeader, dto);
  }

  @Put(':id')
  @RequirePermission('ADMIN_C_ENTERPRISE_UPDATE')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEnterpriseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('ADMIN_C_ENTERPRISE_DELETE')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Get(':id/attachments')
  async findAttachments(@Param('id', ParseIntPipe) id: number) {
    return this.service.findAttachments(id);
  }

  @Post(':id/attachments')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
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
  async removeAttachment(
    @Param('id', ParseIntPipe) id: number,
    @Param('attachmentId', ParseIntPipe) attachmentId: number,
  ) {
    return this.service.removeAttachment(id, attachmentId);
  }
}
