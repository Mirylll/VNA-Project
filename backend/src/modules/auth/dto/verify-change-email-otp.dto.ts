import { IsNotEmpty, Length } from 'class-validator';

export class VerifyChangeEmailOtpDto {
  @IsNotEmpty()
  @Length(6, 6)
  otp!: string;
}
