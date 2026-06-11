import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('industries')
export class Industry {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => Industry, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Industry;

  @OneToMany(() => Industry, (i) => i.parent)
  children?: Industry[];

  @Column({ default: 1 })
  level: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
