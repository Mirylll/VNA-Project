import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../libs/core/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';
import { RequirePermission } from '../../libs/core/decorators/require-permission.decorator';

@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermission('ADMIN_C_USER_VIEW')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(Number(page) || 1, Number(pageSize) || 20, search);
  }

  @Get(':id')
  @RequirePermission('ADMIN_C_USER_VIEW')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('ADMIN_C_USER_CREATE')
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Put(':id')
  @RequirePermission('ADMIN_C_USER_UPDATE')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('ADMIN_C_USER_DELETE')
  async remove(@Param('id') id: string) {
    return this.usersService.softRemove(id);
  }

  @Patch(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async updateAvatar(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Req() req: any,
  ) {
    return this.usersService.updateAvatar(id, file, req.user.id);
  }
}
