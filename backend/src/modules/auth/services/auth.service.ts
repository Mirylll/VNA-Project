import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OtpCode } from '../entities/otp-code.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OtpCode)
    private readonly otpRepository: Repository<OtpCode>,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  async extractUserIdFromAuthHeader(authHeader?: string) {
    if (!authHeader) throw new UnauthorizedException('Missing authorization header');
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') throw new UnauthorizedException('Invalid authorization header');
    const token = parts[1];
    try {
      const payload = this.jwtService.verify(token);
      return payload.sub as string;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async login(dto: LoginDto) {
    const { username, password } = dto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng. Xin vui lòng thử lại');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên');
    }
    const matched = await bcrypt.compare(password, user.passwordHash);
    if (!matched) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng. Xin vui lòng thử lại');
    }
    await this.userRepository.save(user);
    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName } };
  }

  async requestChangeEmailOtp(userId: string, newEmail: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');
    if (!user.email) throw new BadRequestException('Tài khoản hiện không có email để xác thực');
    if (user.email === newEmail) throw new BadRequestException('Email mới giống với email hiện tại');
    const otp = await this.otpService.createChangeEmailOtp(user, newEmail);
    return { message: 'Mã OTP đã được gửi tới email hiện tại', otpSent: true };
  }

  async verifyChangeEmailOtp(userId: string, otpValue: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');
    const otpRecord = await this.otpService.findActiveChangeEmailOtpForUser(userId);
    if (!otpRecord) throw new BadRequestException('Không tìm thấy mã OTP hợp lệ hoặc đã hết hạn');
    const valid = await this.otpService.verifyOtp(otpRecord, otpValue);
    if (!valid) throw new BadRequestException('Mã OTP không đúng');
    user.email = otpRecord.targetValue;
    await this.userRepository.save(user);
    otpRecord.verifiedAt = new Date();
    await this.otpRepository.save(otpRecord);
    return { message: 'Email đã được cập nhật' };
  }

  async updateProfile(userId: string, data: any) {
    if (data.username) {
      throw new BadRequestException('Không được phép thay đổi tên đăng nhập');
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');
    if (data.fullName !== undefined) user.fullName = data.fullName;
    if (data.email !== undefined) user.email = data.email;
    await this.userRepository.save(user);
    return { message: 'Cập nhật thông tin thành công', user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName, avatarUrl: user.avatarUrl, titleName: user.title?.name || null, roleName: user.role?.name || null } };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['title', 'role'],
    });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      titleName: user.title?.name || null,
      roleName: user.role?.name || null,
    };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) throw new BadRequestException('Mật khẩu hiện tại không đúng');
    const newHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newHash;
    await this.userRepository.save(user);
    return { message: 'Mật khẩu đã được cập nhật' };
  }

  async sendOtpEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Email không tồn tại trong hệ thống');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    
    try {
      await this.otpService.sendOtpViaEmail(email, otp);
      // Store OTP in memory with expiry (in production, use Redis or DB)
      const otpStore = (global as any).otpStore || {};
      otpStore[email] = { code: otp, expiresAt };
      (global as any).otpStore = otpStore;
      
      return { success: true, message: 'OTP đã được gửi' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không xác định';
      throw new BadRequestException('Lỗi gửi OTP: ' + message);
    }
  }

  async verifyOtpEmail(email: string, otp: string) {
    const otpStore = (global as any).otpStore || {};
    const otpData = otpStore[email];
    
    if (!otpData) {
      throw new BadRequestException('Mã OTP không tồn tại hoặc đã hết hạn');
    }
    
    if (Date.now() > otpData.expiresAt.getTime()) {
      delete otpStore[email];
      (global as any).otpStore = otpStore;
      throw new BadRequestException('Mã OTP đã hết hạn, vui lòng gửi lại');
    }
    
    if (otpData.code !== otp) {
      throw new BadRequestException('Mã OTP không đúng');
    }
    
    delete otpStore[email];
    (global as any).otpStore = otpStore;
    
    return { success: true, message: 'Xác minh thành công' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Email không tồn tại trong hệ thống');

    const otpStore = (global as any).otpStore || {};
    const otpData = otpStore[email];

    if (!otpData) {
      throw new BadRequestException('Mã OTP không tồn tại hoặc đã hết hạn');
    }

    if (Date.now() > otpData.expiresAt.getTime()) {
      delete otpStore[email];
      (global as any).otpStore = otpStore;
      throw new BadRequestException('Mã OTP đã hết hạn, vui lòng gửi lại');
    }

    if (otpData.code !== otp) {
      throw new BadRequestException('Mã OTP không đúng');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    delete otpStore[email];
    (global as any).otpStore = otpStore;

    return { success: true, message: 'Mật khẩu đã được đặt lại thành công' };
  }
}
