import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DistrictsService } from './districts.service';
import { Public } from '../../libs/core/decorators/public.decorator';

@ApiTags('Danh mục')
@Controller()
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Public()
  @Get('provinces')
  @ApiOperation({
    summary: 'Lấy danh sách tỉnh/thành phố',
    description: 'Trả về danh sách tất cả tỉnh/thành phố.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách tỉnh/thành phố.' })
  async findAllProvinces() {
    return this.districtsService.findAllProvinces();
  }

  @Public()
  @Get('districts')
  @ApiOperation({
    summary: 'Lấy danh sách quận/huyện',
    description: 'Trả về danh sách quận/huyện theo tỉnh/thành phố.'
  })
  @ApiQuery({ name: 'provinceId', required: true, description: 'ID của tỉnh/thành phố.' })
  @ApiResponse({ status: 200, description: 'Danh sách quận/huyện.' })
  @ApiResponse({ status: 400, description: 'Thiếu hoặc sai provinceId.' })
  async findByProvince(@Query('provinceId') provinceId?: string) {
    if (!provinceId) {
      throw new BadRequestException('provinceId is required');
    }
    const id = parseInt(provinceId, 10);
    if (isNaN(id)) {
      throw new BadRequestException('provinceId must be a number');
    }
    return this.districtsService.findByProvince(id);
  }
}
