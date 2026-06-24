import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Enterprise } from '../../enterprises/entities/enterprise.entity';
import { TnldContractReportAccidentDetail } from './tnld-contract-report-accident-detail.entity';
import { TnldContractReportAttachment } from './tnld-contract-report-attachment.entity';
import { TnldContractReportOverview } from './tnld-contract-report-overview.entity';
import { TnldContractReportSubsidy } from './tnld-contract-report-subsidy.entity';

@Entity('tnld_contract_reports')
export class TnldContractReport {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ name: 'enterprise_id', type: 'int', nullable: true })
  enterpriseId?: number;

  @ManyToOne(() => Enterprise, { nullable: true })
  @JoinColumn({ name: 'enterprise_id' })
  enterprise?: Enterprise;

  @Column({ type: 'int' })
  year: number;

  @Column({ length: 20, default: '6m' })
  period: string;

  @Column({ length: 30, default: 'draft' })
  status: string;

  @Column({ name: 'submitted_at', type: 'timestamp', nullable: true })
  submittedAt?: Date;

  @OneToOne(() => TnldContractReportOverview, (overview) => overview.report, { cascade: true })
  overview?: TnldContractReportOverview;

  @OneToMany(() => TnldContractReportAccidentDetail, (detail) => detail.report, { cascade: true })
  accidentDetails: TnldContractReportAccidentDetail[];

  @OneToOne(() => TnldContractReportSubsidy, (subsidy) => subsidy.report, { cascade: true })
  subsidy?: TnldContractReportSubsidy;

  @OneToMany(() => TnldContractReportAttachment, (attachment) => attachment.report, { cascade: true })
  attachments: TnldContractReportAttachment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
