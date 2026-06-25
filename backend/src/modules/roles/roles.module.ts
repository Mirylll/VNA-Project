import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User])],
  controllers: [RolesController],
  providers: [RolesService, PermissionsGuard],
  exports: [RolesService],
})
export class RolesModule {}
