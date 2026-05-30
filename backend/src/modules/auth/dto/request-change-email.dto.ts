import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestChangeEmailOtpDto {
  @IsEmail()
  @IsNotEmpty()
  newEmail!: string;
}
