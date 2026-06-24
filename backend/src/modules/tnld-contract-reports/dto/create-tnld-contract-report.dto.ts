import { IsArray, IsInt, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TnldReportOverviewDto {
  @IsOptional()
  totalEmployees?: number;

  @IsOptional()
  femaleEmployees?: number;

  @IsOptional()
  payroll?: string | number;

  @IsOptional()
  totalAccidents?: number;

  @IsOptional()
  fatalAccidents?: number;

  @IsOptional()
  multiVictimAccidents?: number;

  @IsOptional()
  totalVictims?: number;

  @IsOptional()
  femaleVictims?: number;

  @IsOptional()
  deadVictims?: number;

  @IsOptional()
  severeVictims?: number;

  @IsOptional()
  unmanagedVictims?: number;

  @IsOptional()
  unmanagedFemaleVictims?: number;

  @IsOptional()
  unmanagedDeadVictims?: number;

  @IsOptional()
  unmanagedSevereVictims?: number;

  @IsOptional()
  medicalCost?: string | number;

  @IsOptional()
  treatmentSalaryCost?: string | number;

  @IsOptional()
  compensationCost?: string | number;

  @IsOptional()
  workdaysLost?: number;

  @IsOptional()
  assetDamage?: string | number;
}

export class TnldReportAccidentDetailDto extends TnldReportOverviewDto {
  @IsOptional()
  sortOrder?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  cause?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  injuryFactor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  occupation?: string;
}

export class TnldReportSubsidyDto {
  @IsOptional()
  totalAccidents?: number;

  @IsOptional()
  fatalAccidents?: number;

  @IsOptional()
  multiVictimAccidents?: number;

  @IsOptional()
  totalVictims?: number;

  @IsOptional()
  femaleVictims?: number;

  @IsOptional()
  deadVictims?: number;

  @IsOptional()
  severeVictims?: number;

  @IsOptional()
  unmanagedVictims?: number;

  @IsOptional()
  unmanagedFemaleVictims?: number;

  @IsOptional()
  unmanagedDeadVictims?: number;

  @IsOptional()
  unmanagedSevereVictims?: number;

  @IsOptional()
  medicalCost?: string | number;

  @IsOptional()
  treatmentSalaryCost?: string | number;

  @IsOptional()
  compensationCost?: string | number;

  @IsOptional()
  totalCost?: string | number;

  @IsOptional()
  workdaysLost?: number;

  @IsOptional()
  assetDamage?: string | number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class TnldReportAttachmentDto {
  @IsString()
  @MaxLength(255)
  fileName: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  fileUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  mimeType?: string;

  @IsOptional()
  fileSize?: number;
}

export class CreateTnldContractReportDto {
  @IsOptional()
  @IsInt()
  enterpriseId?: number;

  @IsInt()
  year: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  period?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  status?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TnldReportOverviewDto)
  overview?: TnldReportOverviewDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TnldReportAccidentDetailDto)
  accidentDetails?: TnldReportAccidentDetailDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => TnldReportSubsidyDto)
  subsidy?: TnldReportSubsidyDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TnldReportAttachmentDto)
  attachments?: TnldReportAttachmentDto[];
}
