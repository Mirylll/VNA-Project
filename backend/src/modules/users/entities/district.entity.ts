import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Province } from './province.entity';

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Province, (province) => province.districts)
  @JoinColumn({ name: 'province_id' })
  province: Province;
}
