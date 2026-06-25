import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TnldContractReport } from './tnld-contract-report.entity';

@Entity('tnld_contract_report_attachments')
export class TnldContractReportAttachment {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ name: 'report_id', type: 'int' })
  reportId: number;

  @ManyToOne(() => TnldContractReport, (report) => report.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: TnldContractReport;

  @Column({ name: 'file_name', length: 255 })
  fileName: string;

  @Column({ name: 'file_url', length: 500, nullable: true })
  fileUrl?: string;

  @Column({ name: 'mime_type', length: 100, default: 'application/pdf' })
  mimeType: string;

  @Column({ name: 'file_size', type: 'int', nullable: true })
  fileSize?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
