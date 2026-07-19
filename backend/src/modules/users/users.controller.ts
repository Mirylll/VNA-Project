import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../libs/core/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';
import { RequirePermission } from '../../libs/core/decorators/require-permission.decorator';

@ApiTags('Người dùng')
@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermission('ADMIN_C_USER_VIEW')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách người dùng',
    description: 'Trả về danh sách người dùng có phân trang. Hỗ trợ tìm kiếm theo tên, email, username.'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang (mặc định: 1).' })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Số bản ghi mỗi trang (mặc định: 20).' })
  @ApiQuery({ name: 'search', required: false, description: 'Từ khóa tìm kiếm.' })
  @ApiResponse({ status: 200, description: 'Danh sách người dùng.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xem danh sách người dùng.' })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(Number(page) || 1, Number(pageSize) || 20, search);
  }

  @Get(':id')
  @RequirePermission('ADMIN_C_USER_VIEW')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy người dùng theo ID',
    description: 'Trả về thông tin chi tiết của một người dùng.'
  })
  @ApiResponse({ status: 200, description: 'Thông tin người dùng.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xem người dùng.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng.' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('ADMIN_C_USER_CREATE')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo người dùng mới',
    description: 'Tạo mới một người dùng trong hệ thống.'
  })
  @ApiResponse({ status: 201, description: 'Tạo người dùng thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền tạo người dùng.' })
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Put(':id')
  @RequirePermission('ADMIN_C_USER_UPDATE')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật người dùng',
    description: 'Cập nhật thông tin người dùng theo ID.'
  })
  @ApiResponse({ status: 200, description: 'Cập nhật người dùng thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật người dùng.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng.' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('ADMIN_C_USER_DELETE')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa người dùng',
    description: 'Xóa (soft delete) một người dùng theo ID.'
  })
  @ApiResponse({ status: 204, description: 'Xóa người dùng thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa người dùng.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng.' })
  async remove(@Param('id') id: string) {
    return this.usersService.softRemove(id);
  }

  @Patch(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật ảnh đại diện',
    description: 'Cập nhật ảnh đại diện cho người dùng (tối đa 10MB).'
  })
  @ApiResponse({ status: 200, description: 'Cập nhật ảnh đại diện thành công.' })
  @ApiResponse({ status: 400, description: 'Lỗi tải lên tệp.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật ảnh đại diện.' })
  async updateAvatar(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Req() req: any,
  ) {
    return this.usersService.updateAvatar(id, file, req.user.id);
  }
}
