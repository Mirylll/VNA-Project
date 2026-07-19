import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TitlesService } from './titles.service';
import { CreateTitleDto } from './dto/create-title.dto';

@ApiTags('Chức danh')
@Controller('titles')
export class TitlesController {
  constructor(private readonly titlesService: TitlesService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách chức danh',
    description: 'Trả về danh sách tất cả chức danh.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách chức danh.' })
  async findAll() {
    return this.titlesService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo chức danh mới',
    description: 'Tạo mới một chức danh.'
  })
  @ApiResponse({ status: 201, description: 'Tạo chức danh thành công.' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập.' })
  async create(@Body() dto: CreateTitleDto) {
    return this.titlesService.create(dto);
  }
}
