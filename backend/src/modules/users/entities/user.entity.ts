import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Title } from '../../titles/entities/title.entity';
import { Province } from './province.entity';
import { District } from './district.entity';
import { UserAvatar } from './user-avatar.entity';

export enum Gender {
  MALE = 'Nam',
  FEMALE = 'Nữ',
  OTHER = 'Khác',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ name: 'full_name', length: 150 })
  fullName: string;

  @Column({ length: 150, nullable: true, unique: true })
  email?: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: string;

  @Column({ type: 'varchar', length: 10, default: Gender.MALE, nullable: true })
  gender?: string;

  @Column({ name: 'avatar_url', length: 500, nullable: true })
  avatarUrl?: string;

  @Column({ length: 255, nullable: true })
  address?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role?: Role;

  @ManyToOne(() => Title, { nullable: true })
  @JoinColumn({ name: 'title_id' })
  title?: Title;

  @ManyToOne(() => Province, { nullable: true })
  @JoinColumn({ name: 'province_id' })
  province?: Province;

  @ManyToOne(() => District, { nullable: true })
  @JoinColumn({ name: 'district_id' })
  district?: District;

  @OneToOne(() => UserAvatar, { nullable: true })
  @JoinColumn({ name: 'avatar_id' })
  avatar?: UserAvatar;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
