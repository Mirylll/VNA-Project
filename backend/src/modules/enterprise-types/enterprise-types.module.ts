import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnterpriseType } from './entities/enterprise-type.entity';
import { EnterpriseTypesController } from './enterprise-types.controller';
import { EnterpriseTypesService } from './enterprise-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([EnterpriseType])],
  controllers: [EnterpriseTypesController],
  providers: [EnterpriseTypesService],
  exports: [EnterpriseTypesService],
})
export class EnterpriseTypesModule {}
