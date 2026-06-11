import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { District } from './district.entity';

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => District, (district) => district.province)
  districts: District[];
}
