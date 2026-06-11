import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { TitlesModule } from './modules/titles/titles.module';
import { User } from './modules/users/entities/user.entity';
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
      entities: [User, Role, Permission, Title, RefreshToken, OtpCode],
      synchronize: process.env.TYPEORM_SYNC !== 'false',
    }),
    AuthModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
    TitlesModule,
  ],
})
export class AppModule {}
