import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpCode } from '../entities/otp-code.entity';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpCode)
    private readonly otpRepository: Repository<OtpCode>,
  ) { }

  private async hashOtp(otp: string) {
    return bcrypt.hash(otp, 10);
  }

  private async createTransporter() {
    const host = process.env.MAIL_HOST || process.env.SMTP_HOST;
    const port = process.env.MAIL_PORT || process.env.SMTP_PORT || 587;
    const user = process.env.MAIL_USER || process.env.SMTP_USER;
    const pass = process.env.MAIL_PASSWORD || process.env.SMTP_PASS;
    const secure = process.env.MAIL_SECURE || process.env.SMTP_SECURE;

    if (host && user && pass) {
      return nodemailer.createTransport({
        host,
        port: Number(port),
        secure: secure === 'true',
        auth: {
          user,
          pass,
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

  private buildOtpEmailTemplate(options: {
    recipientName?: string;
    username?: string;
    otp: string;
    expiryMinutes: number;
    purpose: string;
  }) {
    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    const recipientName = options.recipientName || 'Quý khách';
    const username = options.username || 'tên đăng nhập';
    const safeRecipientName = escapeHtml(recipientName);
    const safeUsername = escapeHtml(username);
    const safeOtp = escapeHtml(options.otp);
    const safePurpose = escapeHtml(options.purpose);

    return {
      text: [
        `Xin chào, ${recipientName}`,
        '',
        `Bạn vừa yêu cầu ${options.purpose} cho tài khoản ${username}. Dưới đây là mã OTP của bạn: ${options.otp}`,
        `Lưu ý quan trọng: Mã OTP có hiệu lực trong ${options.expiryMinutes} phút`,
        'Không chia sẻ mã này với bất kỳ ai, kể cả nhân viên hỗ trợ.',
        `Nếu bạn không yêu cầu ${options.purpose}, vui lòng bỏ qua email này`,
      ].join('\n'),
      html: `
        <div style="margin:0;padding:24px;background:#b3b3b3;font-family:Arial,Helvetica,sans-serif;color:#111827;">
          <div style="max-width:720px;margin:0 auto;background:#ffffff;padding:24px 28px;">
            <div style="text-align:center;margin-bottom:24px;">
              <div style="font-size:42px;line-height:38px;font-style:italic;font-weight:700;color:#d8ad2f;letter-spacing:-3px;">VNA</div>
              <div style="font-size:11px;line-height:14px;font-weight:700;color:#111827;margin-top:2px;letter-spacing:.4px;">VNA GROUP</div>
            </div>

            <h1 style="margin:0 0 28px;font-size:28px;line-height:34px;font-weight:700;color:#111827;">
              Xin chào, ${safeRecipientName}
            </h1>

            <p style="margin:0 0 12px;font-size:14px;line-height:24px;color:#111827;">
              Bạn vừa yêu cầu ${safePurpose} cho tài khoản <strong>${safeUsername}</strong>. Dưới đây là mã OTP của bạn:
              <strong>${safeOtp}</strong>
            </p>

            <p style="margin:0 0 12px;font-size:14px;line-height:24px;color:#111827;">
              Lưu ý quan trọng: Mã OTP có hiệu lực trong <strong>${options.expiryMinutes} phút</strong>
            </p>

            <p style="margin:0 0 12px;font-size:14px;line-height:24px;color:#111827;">
              Không chia sẻ mã này với bất kỳ ai, kể cả nhân viên hỗ trợ.
            </p>

            <p style="margin:0;font-size:14px;line-height:24px;color:#111827;">
              Nếu bạn không yêu cầu ${safePurpose}, vui lòng bỏ qua email này
            </p>
          </div>
        </div>
      `,
    };
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
      const from = process.env.MAIL_FROM || process.env.FROM_EMAIL || 'no-reply@example.com';
      const emailContent = this.buildOtpEmailTemplate({
        recipientName: user.fullName,
        username: user.username,
        otp: otpPlain,
        expiryMinutes: 10,
        purpose: 'thay đổi email',
      });
      const info = await transporter.sendMail({
        from,
        to: user.email || '',
        subject: 'Mã xác thực thay đổi email',
        text: emailContent.text,
        html: emailContent.html,
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

  async sendOtpViaEmail(
    email: string,
    otp: string,
    context?: { fullName?: string; username?: string; isRegister?: boolean },
  ) {
    // eslint-disable-next-line no-console
    console.log(`OTP for email ${email}: ${otp}`);

    const ctx = context || {
      fullName: 'Doanh nghiệp',
      username: email,
      isRegister: true,
    };

    // Determine subject
    const subject = ctx.isRegister
      ? 'Mã xác thực đăng ký tài khoản doanh nghiệp - VNA Group'
      : 'Mã xác thực khôi phục mật khẩu - VNA Group';

    // Build email template with logo path resolver
    const logoPath = path.resolve(process.cwd(), 'assets/logo.png');
    const attachments: any[] = [];
    if (fs.existsSync(logoPath)) {
      attachments.push({
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo_vna',
      });
    }

    const htmlContent = `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #000; line-height: 1.6;">
  <div style="text-align: center; margin-bottom: 30px;">
    ${fs.existsSync(logoPath) ? '<img src="cid:logo_vna" style="width: 140px; height: auto; display: inline-block;" alt="Công ty Cổ phần Công nghệ Quốc tế VNA" />' : '<h2 style="color: #d4af37; margin: 0;">VNA</h2>'}
  </div>
  
  <h2 style="font-size: 24px; font-weight: bold; margin-top: 0; margin-bottom: 20px; color: #000;">
    Xin chào, ${ctx.fullName}
  </h2>
  
  <p style="font-size: 16px; margin-bottom: 20px; color: #000;">
    ${ctx.isRegister
        ? `Bạn vừa yêu cầu đăng ký tài khoản doanh nghiệp trên hệ thống <strong>Công ty Cổ phần Công nghệ Quốc tế VNA</strong>. Dưới đây là mã OTP của bạn:`
        : `Bạn vừa yêu cầu khôi phục mật khẩu cho tài khoản <strong>${ctx.username}</strong>. Dưới đây là mã OTP của bạn:`
      }
  </p>
  
  <p style="font-size: 18px; margin-bottom: 20px; color: #000;">
    Mã OTP của bạn là: <strong style="font-size: 20px; letter-spacing: 1px; color: #000;">${otp}</strong>
  </p>
  
  <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #000;">
    <p style="margin: 0 0 8px 0; font-weight: normal;">Lưu ý quan trọng: Mã OTP có hiệu lực trong <strong>1 phút</strong></p>
    <p style="margin: 0 0 8px 0; font-weight: normal;">Không chia sẻ mã này với bất kỳ ai, kể cả nhân viên hỗ trợ.</p>
    <p style="margin: 0; color: #555;">
      ${ctx.isRegister
        ? 'Nếu bạn không thực hiện yêu cầu đăng ký này, vui lòng bỏ qua email này.'
        : 'Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.'
      }
    </p>
  </div>
</div>
    `;

    try {
      const transporter = await this.createTransporter();
      const from = process.env.MAIL_FROM || process.env.FROM_EMAIL || 'no-reply@example.com';
      const info = await transporter.sendMail({
        from,
        to: email,
        subject,
        text: `Mã OTP của bạn là: ${otp}. Có hiệu lực trong 5 phút.`,
        html: htmlContent,
        attachments,
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
