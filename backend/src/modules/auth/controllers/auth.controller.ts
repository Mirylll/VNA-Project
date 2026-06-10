import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Get, BadRequestException, BadGatewayException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RequestChangeEmailOtpDto } from '../dto/request-change-email.dto';
import { VerifyChangeEmailOtpDto } from '../dto/verify-change-email-otp.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@Headers('authorization') authHeader?: string) {
    const userId = await this.authService.extractUserIdFromAuthHeader(authHeader);
    return this.authService.getProfile(userId);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Body() dto: ChangePasswordDto, @Headers('authorization') authHeader?: string) {
    const userId = await this.authService.extractUserIdFromAuthHeader(authHeader);
    if (dto.newPassword !== dto.confirmNewPassword) throw new BadRequestException('Xác nhận mật khẩu không khớp');
    return this.authService.changePassword(userId, dto.currentPassword, dto.newPassword);
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() body: { email: string }) {
    try {
      return await this.authService.sendOtpEmail(body.email);
    } catch (error) {
      throw new BadRequestException(error.message || 'Lỗi gửi OTP');
    }
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    try {
      const result = await this.authService.verifyOtpEmail(body.email, body.otp);
      return result;
    } catch (error) {
      // Return 400 error response with success: false
      throw new BadGatewayException(error.message);
    }
  }

  @Post('register-enterprise')
  @HttpCode(HttpStatus.CREATED)
  async registerEnterprise(@Body() body: {
    mst: string;
    tenDN: string;
    email: string;
    otp: string;
    loaiHinhKD?: string;
    nganhNghe?: string;
    diaChi?: string;
    nguoiDungDau?: string;
    sdtNguoiDungDau?: string;
    tenNuocNgoai?: string;
    ngayCap?: string;
    phuongXaTen?: string;
    diaDiemKD?: string;
  }) {
    try {
      return await this.authService.registerEnterprise(body);
    } catch (error) {
      throw new BadRequestException(error.message || 'Lỗi tạo tài khoản doanh nghiệp');
    }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException('Xác nhận mật khẩu không khớp');
    }

    return this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
  }

  @Post('request-change-email')
  @HttpCode(HttpStatus.OK)
  async requestChangeEmail(
    @Body() dto: RequestChangeEmailOtpDto,
    @Headers('authorization') authHeader?: string,
  ) {
    const userId = await this.authService.extractUserIdFromAuthHeader(authHeader);
    return this.authService.requestChangeEmailOtp(userId, dto.newEmail);
  }

  @Post('verify-change-email-otp')
  @HttpCode(HttpStatus.OK)
  async verifyChangeEmailOtp(
    @Body() dto: VerifyChangeEmailOtpDto,
    @Headers('authorization') authHeader?: string,
  ) {
    const userId = await this.authService.extractUserIdFromAuthHeader(authHeader);
    return this.authService.verifyChangeEmailOtp(userId, dto.otp);
  }

  @Post('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body() body: any,
    @Headers('authorization') authHeader?: string,
  ) {
    const userId = await this.authService.extractUserIdFromAuthHeader(authHeader);
    return this.authService.updateProfile(userId, body);
  }
}
