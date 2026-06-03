import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/users/entities/user.entity';
import { OtpCode } from './modules/auth/entities/otp-code.entity';
import { RefreshToken } from './modules/auth/entities/refresh-token.entity';
import { Role } from './modules/roles/entities/role.entity';
import 'dotenv/config';

const dbConfig = process.env.DATABASE_URL || process.env.DB_HOST
  ? {
      type: 'postgres' as const,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    }
  : {
      type: 'sqlite' as const,
      database: 'vna.db',
    };

@Module({
	imports: [
		TypeOrmModule.forRoot({
			...dbConfig,
			entities: [User, Role, RefreshToken, OtpCode],
			synchronize: process.env.TYPEORM_SYNC !== 'false', // Default to true
		}),
		AuthModule,
	],
})
export class AppModule {}
