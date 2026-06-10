import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('otp_codes')
export class OtpCode {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ length: 50 })
  type!: string;

  @Column({ name: 'otp_hash', length: 255 })
  otpHash!: string;

  @Column({ name: 'target_value', length: 255, nullable: true })
  targetValue?: string;

  @Column({ name: 'expires_at' })
  expiresAt!: Date;

  @Column({ name: 'verified_at', nullable: true })
  verifiedAt?: Date;

  @Column({ name: 'attempt_count', default: 0 })
  attemptCount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
