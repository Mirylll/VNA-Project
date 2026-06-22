import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  CreateTnldContractReportDto,
  TnldReportAccidentDetailDto,
  TnldReportAttachmentDto,
  TnldReportOverviewDto,
  TnldReportSubsidyDto,
} from './dto/create-tnld-contract-report.dto';
import { UpdateTnldContractReportDto } from './dto/update-tnld-contract-report.dto';
import { TnldContractReportAccidentDetail } from './entities/tnld-contract-report-accident-detail.entity';
import { TnldContractReportAttachment } from './entities/tnld-contract-report-attachment.entity';
import { TnldContractReportOverview } from './entities/tnld-contract-report-overview.entity';
import { TnldContractReportSubsidy } from './entities/tnld-contract-report-subsidy.entity';
import { TnldContractReport } from './entities/tnld-contract-report.entity';

@Injectable()
export class TnldContractReportsService {
  constructor(
    @InjectRepository(TnldContractReport)
    private readonly reportRepo: Repository<TnldContractReport>,
    private readonly dataSource: DataSource,
  ) {}

  private toInt(value: unknown): number {
    const number = Math.trunc(this.toDecimalNumber(value));
    return Number.isFinite(number) ? number : 0;
  }

  private toDecimal(value: unknown): string {
    const number = this.toDecimalNumber(value);
    return Number.isFinite(number) ? String(number) : '0';
  }

  private toDecimalNumber(value: unknown): number {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;

    const raw = String(value).trim();
    if (!raw) return 0;

    const normalized = raw.includes(',')
      ? raw.replace(/\./g, '').replace(',', '.')
      : /^\d{1,3}(\.\d{3})+$/.test(raw)
        ? raw.replace(/\./g, '')
        : raw;

    const number = Number(normalized.replace(/[^\d.-]/g, ''));
    return Number.isFinite(number) ? number : 0;
  }

  private buildOverview(dto?: TnldReportOverviewDto): Partial<TnldContractReportOverview> {
    return {
      totalEmployees: this.toInt(dto?.totalEmployees),
      femaleEmployees: this.toInt(dto?.femaleEmployees),
      payroll: this.toDecimal(dto?.payroll),
      totalAccidents: this.toInt(dto?.totalAccidents),
      fatalAccidents: this.toInt(dto?.fatalAccidents),
      multiVictimAccidents: this.toInt(dto?.multiVictimAccidents),
      totalVictims: this.toInt(dto?.totalVictims),
      femaleVictims: this.toInt(dto?.femaleVictims),
      deadVictims: this.toInt(dto?.deadVictims),
      severeVictims: this.toInt(dto?.severeVictims),
      unmanagedVictims: this.toInt(dto?.unmanagedVictims),
      unmanagedFemaleVictims: this.toInt(dto?.unmanagedFemaleVictims),
      unmanagedDeadVictims: this.toInt(dto?.unmanagedDeadVictims),
      unmanagedSevereVictims: this.toInt(dto?.unmanagedSevereVictims),
      medicalCost: this.toDecimal(dto?.medicalCost),
      treatmentSalaryCost: this.toDecimal(dto?.treatmentSalaryCost),
      compensationCost: this.toDecimal(dto?.compensationCost),
      workdaysLost: this.toInt(dto?.workdaysLost),
      assetDamage: this.toDecimal(dto?.assetDamage),
    };
  }

  private buildAccidentDetail(dto: TnldReportAccidentDetailDto, index: number): Partial<TnldContractReportAccidentDetail> {
    return {
      ...this.buildOverview(dto),
      sortOrder: this.toInt(dto.sortOrder ?? index + 1),
      cause: dto.cause,
      injuryFactor: dto.injuryFactor,
      occupation: dto.occupation,
    };
  }

  private buildSubsidy(dto?: TnldReportSubsidyDto): Partial<TnldContractReportSubsidy> {
    return {
      totalAccidents: this.toInt(dto?.totalAccidents),
      fatalAccidents: this.toInt(dto?.fatalAccidents),
      multiVictimAccidents: this.toInt(dto?.multiVictimAccidents),
      totalVictims: this.toInt(dto?.totalVictims),
      femaleVictims: this.toInt(dto?.femaleVictims),
      deadVictims: this.toInt(dto?.deadVictims),
      severeVictims: this.toInt(dto?.severeVictims),
      unmanagedVictims: this.toInt(dto?.unmanagedVictims),
      unmanagedFemaleVictims: this.toInt(dto?.unmanagedFemaleVictims),
      unmanagedDeadVictims: this.toInt(dto?.unmanagedDeadVictims),
      unmanagedSevereVictims: this.toInt(dto?.unmanagedSevereVictims),
      medicalCost: this.toDecimal(dto?.medicalCost),
      treatmentSalaryCost: this.toDecimal(dto?.treatmentSalaryCost),
      compensationCost: this.toDecimal(dto?.compensationCost),
      totalCost: this.toDecimal(dto?.totalCost),
      workdaysLost: this.toInt(dto?.workdaysLost),
      assetDamage: this.toDecimal(dto?.assetDamage),
      note: dto?.note,
    };
  }

  private buildAttachment(dto: TnldReportAttachmentDto): Partial<TnldContractReportAttachment> {
    return {
      fileName: dto.fileName,
      fileUrl: dto.fileUrl,
      mimeType: dto.mimeType || 'application/pdf',
      fileSize: dto.fileSize ? this.toInt(dto.fileSize) : undefined,
    };
  }

  private relations() {
    return [
      'enterprise',
      'enterprise.province',
      'enterprise.ward',
      'enterprise.operationProvince',
      'enterprise.operationWard',
      'overview',
      'accidentDetails',
      'subsidy',
      'attachments',
    ];
  }

  async findAll(): Promise<TnldContractReport[]> {
    return this.reportRepo.find({
      relations: this.relations(),
      order: { createdAt: 'DESC' },
    });
  }

  async findByEnterprise(enterpriseId: number): Promise<TnldContractReport[]> {
    return this.reportRepo.find({
      where: { enterpriseId },
      relations: this.relations(),
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TnldContractReport> {
    const report = await this.reportRepo.findOne({
      where: { id },
      relations: this.relations(),
      order: {
        accidentDetails: {
          sortOrder: 'ASC',
        },
      },
    });
    if (!report) throw new NotFoundException('Báo cáo TNLĐ theo HĐLĐ không tồn tại');
    return report;
  }

  async create(dto: CreateTnldContractReportDto): Promise<TnldContractReport> {
    const saved = await this.dataSource.transaction(async (manager) => {
      const report = manager.create(TnldContractReport, {
        enterpriseId: dto.enterpriseId,
        year: dto.year,
        period: dto.period || '6m',
        status: dto.status || 'draft',
        submittedAt: dto.status === 'submitted' ? new Date() : undefined,
      });
      const savedReport = await manager.save(report);

      await manager.save(
        manager.create(TnldContractReportOverview, {
          ...this.buildOverview(dto.overview),
          reportId: savedReport.id,
        }),
      );

      await manager.save(
        manager.create(TnldContractReportSubsidy, {
          ...this.buildSubsidy(dto.subsidy),
          reportId: savedReport.id,
        }),
      );

      const details = (dto.accidentDetails || []).map((detail, index) =>
        manager.create(TnldContractReportAccidentDetail, {
          ...this.buildAccidentDetail(detail, index),
          reportId: savedReport.id,
        }),
      );
      if (details.length) await manager.save(details);

      const attachments = (dto.attachments || []).map((attachment) =>
        manager.create(TnldContractReportAttachment, {
          ...this.buildAttachment(attachment),
          reportId: savedReport.id,
        }),
      );
      if (attachments.length) await manager.save(attachments);

      return savedReport;
    });

    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateTnldContractReportDto): Promise<TnldContractReport> {
    await this.findOne(id);

    await this.dataSource.transaction(async (manager) => {
      await manager.update(TnldContractReport, id, {
        enterpriseId: dto.enterpriseId,
        year: dto.year,
        period: dto.period || '6m',
        status: dto.status || 'draft',
        submittedAt: dto.status === 'submitted' ? new Date() : undefined,
      });

      await manager.delete(TnldContractReportOverview, { reportId: id });
      await manager.delete(TnldContractReportSubsidy, { reportId: id });
      await manager.delete(TnldContractReportAccidentDetail, { reportId: id });
      await manager.delete(TnldContractReportAttachment, { reportId: id });

      await manager.save(
        manager.create(TnldContractReportOverview, {
          ...this.buildOverview(dto.overview),
          reportId: id,
        }),
      );

      await manager.save(
        manager.create(TnldContractReportSubsidy, {
          ...this.buildSubsidy(dto.subsidy),
          reportId: id,
        }),
      );

      const details = (dto.accidentDetails || []).map((detail, index) =>
        manager.create(TnldContractReportAccidentDetail, {
          ...this.buildAccidentDetail(detail, index),
          reportId: id,
        }),
      );
      if (details.length) await manager.save(details);

      const attachments = (dto.attachments || []).map((attachment) =>
        manager.create(TnldContractReportAttachment, {
          ...this.buildAttachment(attachment),
          reportId: id,
        }),
      );
      if (attachments.length) await manager.save(attachments);
    });

    return this.findOne(id);
  }

  async accept(id: number): Promise<TnldContractReport> {
    await this.findOne(id);
    await this.reportRepo.update(id, { status: 'accepted' });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.reportRepo.delete(id);
  }
}
