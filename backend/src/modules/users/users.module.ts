import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { UserAvatar } from './entities/user-avatar.entity';
import { Role } from '../roles/entities/role.entity';
import { Title } from '../titles/entities/title.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Province, District, UserAvatar, Role, Title])],
  controllers: [UsersController],
  providers: [UsersService, PermissionsGuard],
  exports: [UsersService, PermissionsGuard],
})
export class UsersModule {}
