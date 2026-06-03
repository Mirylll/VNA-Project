import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpCode } from '../entities/otp-code.entity';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpCode)
    private readonly otpRepository: Repository<OtpCode>,
  ) {}

  private async hashOtp(otp: string) {
    return bcrypt.hash(otp, 10);
  }

  private async createTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
    // fallback to Ethereal for development
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  async createChangeEmailOtp(user: User, newEmail: string) {
    const otpPlain = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await this.hashOtp(otpPlain);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const record = this.otpRepository.create({
      user,
      type: 'change_email',
      otpHash,
      targetValue: newEmail,
      expiresAt,
      attemptCount: 0,
    });
    await this.otpRepository.save(record);

    // log OTP for dev and send email with OTP
    // eslint-disable-next-line no-console
    console.log(`Change-email OTP for user ${user.id}: ${otpPlain}`);
    try {
      const transporter = await this.createTransporter();
      const from = process.env.FROM_EMAIL || 'no-reply@example.com';
      const info = await transporter.sendMail({
        from,
        to: user.email || '',
        subject: 'Mã xác thực thay đổi email',
        text: `Mã OTP của bạn là: ${otpPlain}. Hết hạn trong 10 phút.`,
        html: `<p>Mã OTP của bạn là: <b>${otpPlain}</b></p><p>Hết hạn trong 10 phút.</p>`,
      });
      // if using Ethereal, log preview URL
      // eslint-disable-next-line no-console
      if ((nodemailer as any).getTestMessageUrl) {
        // eslint-disable-next-line no-console
        console.log('Preview URL:', (nodemailer as any).getTestMessageUrl(info));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to send OTP email', err);
    }

    return record;
  }

  async findActiveChangeEmailOtpForUser(userId: string) {
    return this.otpRepository.findOne({
      where: { type: 'change_email', user: { id: userId }, verifiedAt: null as any },
      order: { createdAt: 'DESC' },
    });
  }

  async verifyOtp(record: OtpCode, value: string) {
    if (record.expiresAt.getTime() < Date.now()) return false;
    const ok = await bcrypt.compare(value, record.otpHash);
    if (!ok) {
      record.attemptCount = (record.attemptCount || 0) + 1;
      await this.otpRepository.save(record);
      return false;
    }
    record.verifiedAt = new Date();
    await this.otpRepository.save(record);
    return true;
  }

  async sendOtpViaEmail(email: string, otp: string) {
    // eslint-disable-next-line no-console
    console.log(`OTP for email ${email}: ${otp}`);
    try {
      const transporter = await this.createTransporter();
      const from = process.env.FROM_EMAIL || 'no-reply@example.com';
      const info = await transporter.sendMail({
        from,
        to: email,
        subject: 'Mã xác thực thay đổi email',
        text: `Mã OTP của bạn là: ${otp}. Có hiệu lực trong 5 phút.`,
        html: `<p>Mã OTP của bạn là: <b>${otp}</b></p><p>Có hiệu lực trong 5 phút.</p>`,
      });
      // if using Ethereal, log preview URL
      // eslint-disable-next-line no-console
      if ((nodemailer as any).getTestMessageUrl) {
        // eslint-disable-next-line no-console
        console.log('Preview URL:', (nodemailer as any).getTestMessageUrl(info));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to send OTP email', err);
      throw err;
    }
  }
}
