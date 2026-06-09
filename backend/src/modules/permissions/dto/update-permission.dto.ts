import { IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEnum(['Group', 'Component'])
  type?: 'Group' | 'Component';

  @IsOptional()
  @IsString()
  parentId?: string | null;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
