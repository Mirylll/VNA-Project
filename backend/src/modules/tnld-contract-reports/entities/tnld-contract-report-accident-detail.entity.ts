import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TnldContractReport } from './tnld-contract-report.entity';

@Entity('tnld_contract_report_accident_details')
export class TnldContractReportAccidentDetail {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ name: 'report_id', type: 'int' })
  reportId: number;

  @ManyToOne(() => TnldContractReport, (report) => report.accidentDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: TnldContractReport;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Column({ length: 500, nullable: true })
  cause?: string;

  @Column({ name: 'injury_factor', length: 500, nullable: true })
  injuryFactor?: string;

  @Column({ length: 500, nullable: true })
  occupation?: string;

  @Column({ name: 'total_accidents', type: 'int', default: 0 })
  totalAccidents: number;

  @Column({ name: 'fatal_accidents', type: 'int', default: 0 })
  fatalAccidents: number;

  @Column({ name: 'multi_victim_accidents', type: 'int', default: 0 })
  multiVictimAccidents: number;

  @Column({ name: 'total_victims', type: 'int', default: 0 })
  totalVictims: number;

  @Column({ name: 'female_victims', type: 'int', default: 0 })
  femaleVictims: number;

  @Column({ name: 'dead_victims', type: 'int', default: 0 })
  deadVictims: number;

  @Column({ name: 'severe_victims', type: 'int', default: 0 })
  severeVictims: number;

  @Column({ name: 'unmanaged_victims', type: 'int', default: 0 })
  unmanagedVictims: number;

  @Column({ name: 'unmanaged_female_victims', type: 'int', default: 0 })
  unmanagedFemaleVictims: number;

  @Column({ name: 'unmanaged_dead_victims', type: 'int', default: 0 })
  unmanagedDeadVictims: number;

  @Column({ name: 'unmanaged_severe_victims', type: 'int', default: 0 })
  unmanagedSevereVictims: number;

  @Column({ name: 'medical_cost', type: 'numeric', precision: 18, scale: 2, default: 0 })
  medicalCost: string;

  @Column({ name: 'treatment_salary_cost', type: 'numeric', precision: 18, scale: 2, default: 0 })
  treatmentSalaryCost: string;

  @Column({ name: 'compensation_cost', type: 'numeric', precision: 18, scale: 2, default: 0 })
  compensationCost: string;

  @Column({ name: 'workdays_lost', type: 'int', default: 0 })
  workdaysLost: number;

  @Column({ name: 'asset_damage', type: 'numeric', precision: 18, scale: 2, default: 0 })
  assetDamage: string;
}
