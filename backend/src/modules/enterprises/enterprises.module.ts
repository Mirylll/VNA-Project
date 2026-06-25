import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enterprise } from './entities/enterprise.entity';
import { Attachment } from './entities/attachment.entity';
import { EnterpriseType } from '../enterprise-types/entities/enterprise-type.entity';
import { Industry } from '../industries/entities/industry.entity';
import { District } from '../users/entities/district.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { EnterprisesController } from './enterprises.controller';
import { EnterprisesService } from './enterprises.service';

@Module({
  imports: [TypeOrmModule.forFeature([Enterprise, Attachment, EnterpriseType, Industry, District, User, Role])],
  controllers: [EnterprisesController],
  providers: [EnterprisesService],
  exports: [EnterprisesService],
})
export class EnterprisesModule {}
