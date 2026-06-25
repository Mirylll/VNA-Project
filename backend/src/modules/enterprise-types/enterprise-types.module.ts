import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnterpriseType } from './entities/enterprise-type.entity';
import { User } from '../users/entities/user.entity';
import { EnterpriseTypesController } from './enterprise-types.controller';
import { EnterpriseTypesService } from './enterprise-types.service';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([EnterpriseType, User])],
  controllers: [EnterpriseTypesController],
  providers: [EnterpriseTypesService, PermissionsGuard],
  exports: [EnterpriseTypesService],
})
export class EnterpriseTypesModule {}
