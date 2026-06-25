import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TnldContractReportAccidentDetail } from './entities/tnld-contract-report-accident-detail.entity';
import { TnldContractReportAttachment } from './entities/tnld-contract-report-attachment.entity';
import { TnldContractReportOverview } from './entities/tnld-contract-report-overview.entity';
import { TnldContractReportSubsidy } from './entities/tnld-contract-report-subsidy.entity';
import { TnldContractReport } from './entities/tnld-contract-report.entity';
import { User } from '../users/entities/user.entity';
import { TnldContractReportsController } from './tnld-contract-reports.controller';
import { TnldContractReportsService } from './tnld-contract-reports.service';
import { PermissionsGuard } from '../../libs/core/guards/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TnldContractReport,
      TnldContractReportOverview,
      TnldContractReportAccidentDetail,
      TnldContractReportSubsidy,
      TnldContractReportAttachment,
      User,
    ]),
  ],
  controllers: [TnldContractReportsController],
  providers: [TnldContractReportsService, PermissionsGuard],
  exports: [TnldContractReportsService],
})
export class TnldContractReportsModule {}
