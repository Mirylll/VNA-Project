import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { User } from '../users/entities/user.entity';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, User])],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsGuard],
  exports: [PermissionsService],
})
export class PermissionsModule {}
