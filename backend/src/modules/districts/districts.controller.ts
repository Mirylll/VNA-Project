import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { DistrictsService } from './districts.service';

@Controller()
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Get('provinces')
  async findAllProvinces() {
    return this.districtsService.findAllProvinces();
  }

  @Get('districts')
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
