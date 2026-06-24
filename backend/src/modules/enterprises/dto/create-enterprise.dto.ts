import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateEnterpriseDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  taxCode?: string;

  @IsOptional()
  @IsNumber()
  enterpriseTypeId?: number;

  @IsOptional()
  @IsNumber()
  industryId?: number;

  @IsOptional()
  @IsDateString()
  licenseDate?: string;

  @IsOptional()
  @IsNumber()
  provinceId?: number;

  @IsOptional()
  @IsNumber()
  wardId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  foreignName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsNumber()
  operationProvinceId?: number;

  @IsOptional()
  @IsNumber()
  operationWardId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  operationAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  leaderName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  leaderPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'Mật khẩu phải bao gồm chữ hoa, chữ thường và chữ số' })
  password?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
