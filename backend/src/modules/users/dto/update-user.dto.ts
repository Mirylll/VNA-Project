import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { AccountType } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'Mật khẩu phải bao gồm chữ hoa, chữ thường và chữ số' })
  password?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number | null;

  @IsOptional()
  titleId?: number | null;

  @IsOptional()
  @IsString()
  titleName?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;

  @IsOptional()
  @IsString()
  dateOfBirth?: string | null;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsOptional()
  @IsNumber()
  provinceId?: number | null;

  @IsOptional()
  @IsNumber()
  districtId?: number | null;
}
