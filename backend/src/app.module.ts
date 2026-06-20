import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { TitlesModule } from './modules/titles/titles.module';
import { DistrictsModule } from './modules/districts/districts.module';
import { EnterpriseTypesModule } from './modules/enterprise-types/enterprise-types.module';
import { IndustriesModule } from './modules/industries/industries.module';
import { EnterprisesModule } from './modules/enterprises/enterprises.module';
import { TnldContractReportsModule } from './modules/tnld-contract-reports/tnld-contract-reports.module';
import { EnterpriseType } from './modules/enterprise-types/entities/enterprise-type.entity';
import { Industry } from './modules/industries/entities/industry.entity';
import { Enterprise } from './modules/enterprises/entities/enterprise.entity';
import { Attachment } from './modules/enterprises/entities/attachment.entity';
import { TnldContractReportAccidentDetail } from './modules/tnld-contract-reports/entities/tnld-contract-report-accident-detail.entity';
import { TnldContractReportAttachment } from './modules/tnld-contract-reports/entities/tnld-contract-report-attachment.entity';
import { TnldContractReportOverview } from './modules/tnld-contract-reports/entities/tnld-contract-report-overview.entity';
import { TnldContractReportSubsidy } from './modules/tnld-contract-reports/entities/tnld-contract-report-subsidy.entity';
import { TnldContractReport } from './modules/tnld-contract-reports/entities/tnld-contract-report.entity';
import { User } from './modules/users/entities/user.entity';
import { Province } from './modules/users/entities/province.entity';
import { District } from './modules/users/entities/district.entity';
import { UserAvatar } from './modules/users/entities/user-avatar.entity';
import { Role } from './modules/roles/entities/role.entity';
import { Permission } from './modules/permissions/entities/permission.entity';
import { Title } from './modules/titles/entities/title.entity';
import { OtpCode } from './modules/auth/entities/otp-code.entity';
import { RefreshToken } from './modules/auth/entities/refresh-token.entity';
import 'dotenv/config';

const dbConfig = process.env.DATABASE_URL
  ? {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
    }
  : {
      type: 'postgres' as const,
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME || 'vna_user',
      password: process.env.DB_PASSWORD || 'vna_password',
      database: process.env.DB_NAME || 'vna_db',
    };

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbConfig,
      entities: [
        User,
        Province,
        District,
        UserAvatar,
        Role,
        Permission,
        Title,
        RefreshToken,
        OtpCode,
        EnterpriseType,
        Industry,
        Enterprise,
        Attachment,
        TnldContractReport,
        TnldContractReportOverview,
        TnldContractReportAccidentDetail,
        TnldContractReportSubsidy,
        TnldContractReportAttachment,
      ],
      synchronize: process.env.TYPEORM_SYNC !== 'false',
    }),
    AuthModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
    TitlesModule,
    DistrictsModule,
    EnterpriseTypesModule,
    IndustriesModule,
    EnterprisesModule,
    TnldContractReportsModule,
  ],
})
export class AppModule {}
