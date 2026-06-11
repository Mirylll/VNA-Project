import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Enterprise } from './enterprise.entity';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'file_name', length: 255 })
  fileName: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @Column({ name: 'file_size', type: 'int', nullable: true })
  fileSize?: number;

  @ManyToOne(() => Enterprise, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'enterprise_id' })
  enterprise: Enterprise;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
