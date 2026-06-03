import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
