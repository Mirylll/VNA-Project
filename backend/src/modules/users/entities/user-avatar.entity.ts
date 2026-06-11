import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_avatars')
export class UserAvatar {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'file_name', length: 255 })
  fileName: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @Column({ name: 'file_size', type: 'int', nullable: true })
  fileSize?: number;

  @Column({ name: 'mime_type', length: 50, nullable: true })
  mimeType?: string;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;
}
