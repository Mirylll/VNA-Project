import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EnterpriseType } from '../../enterprise-types/entities/enterprise-type.entity';
import { Industry } from '../../industries/entities/industry.entity';
import { Province } from '../../users/entities/province.entity';
import { District } from '../../users/entities/district.entity';
import { Attachment } from './attachment.entity';

@Entity('enterprises')
export class Enterprise {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'tax_code', length: 50, nullable: true })
  taxCode?: string;

  @ManyToOne(() => EnterpriseType, { nullable: true })
  @JoinColumn({ name: 'enterprise_type_id' })
  enterpriseType?: EnterpriseType;

  @ManyToOne(() => Industry, { nullable: true })
  @JoinColumn({ name: 'industry_id' })
  industry?: Industry;

  @Column({ name: 'license_date', type: 'date', nullable: true })
  licenseDate?: string;

  @ManyToOne(() => Province, { nullable: true })
  @JoinColumn({ name: 'province_id' })
  province?: Province;

  @ManyToOne(() => District, { nullable: true })
  @JoinColumn({ name: 'ward_id' })
  ward?: District;

  @Column({ length: 500, nullable: true })
  address?: string;

  @Column({ name: 'foreign_name', length: 255, nullable: true })
  foreignName?: string;

  @Column({ length: 200, nullable: true })
  email?: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @ManyToOne(() => Province, { nullable: true })
  @JoinColumn({ name: 'operation_province_id' })
  operationProvince?: Province;

  @ManyToOne(() => District, { nullable: true })
  @JoinColumn({ name: 'operation_ward_id' })
  operationWard?: District;

  @Column({ name: 'operation_address', length: 500, nullable: true })
  operationAddress?: string;

  @Column({ name: 'leader_name', length: 100, nullable: true })
  leaderName?: string;

  @Column({ name: 'leader_phone', length: 20, nullable: true })
  leaderPhone?: string;

  @Column({ unique: true, length: 50, nullable: true })
  username?: string;

  @Column({ length: 255, nullable: true })
  password?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => Attachment, (a) => a.enterprise)
  attachments: Attachment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
