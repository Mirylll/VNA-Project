import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

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
  @MinLength(6)
  @MaxLength(100)
  password?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number | null;

  @IsOptional()
  @IsNumber()
  titleId?: number | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
