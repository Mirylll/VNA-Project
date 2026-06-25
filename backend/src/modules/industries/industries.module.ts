import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Industry } from './entities/industry.entity';
import { User } from '../users/entities/user.entity';
import { IndustriesController } from './industries.controller';
import { IndustriesService } from './industries.service';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Industry, User])],
  controllers: [IndustriesController],
  providers: [IndustriesService, PermissionsGuard],
  exports: [IndustriesService],
})
export class IndustriesModule {}
