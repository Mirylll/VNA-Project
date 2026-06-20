import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { OtpService } from './services/otp.service';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { OtpCode } from './entities/otp-code.entity';
import { Role } from '../roles/entities/role.entity';
import { Enterprise } from '../enterprises/entities/enterprise.entity';
import { EnterpriseType } from '../enterprise-types/entities/enterprise-type.entity';
import { Industry } from '../industries/entities/industry.entity';
import { Province } from '../users/entities/province.entity';
import { District } from '../users/entities/district.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      RefreshToken,
      OtpCode,
      Role,
      Enterprise,
      EnterpriseType,
      Industry,
      Province,
      District,
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET || 'dev-secret',
      signOptions: { expiresIn: (process.env.JWT_ACCESS_EXPIRES || '15m') as any },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, OtpService],
  exports: [AuthService],
})
export class AuthModule {}
