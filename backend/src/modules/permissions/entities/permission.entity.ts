import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'enum', enum: ['Group', 'Component'] })
  type: 'Group' | 'Component';

  @ManyToOne(() => Permission, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Permission;

  @OneToMany(() => Permission, (p) => p.parent)
  children?: Permission[];

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
