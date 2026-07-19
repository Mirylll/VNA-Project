import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Get, BadRequestException, BadGatewayException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RequestChangeEmailOtpDto } from '../dto/request-change-email.dto';
import { VerifyChangeEmailOtpDto } from '../dto/verify-change-email-otp.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập',
    description: 'Xác thực người dùng bằng email/username và mật khẩu, trả về JWT token.'
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công, trả về token và thông tin người dùng.' })
  @ApiResponse({ status: 401, description: 'Sai email/username hoặc mật khẩu.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông tin người dùng hiện tại',
    description: 'Trả về thông tin chi tiết của người dùng đang đăng nhập dựa trên JWT token.'
  })
  @ApiResponse({ status: 200, description: 'Thông tin người dùng hiện tại.' })
  @ApiResponse({ status: 401, description: 'Token không hợp lệ hoặc đã hết hạn.' })
  async me(@Headers('authorization') authHeader?: string) {
    const userId = await this.authService.extractUserIdFromAuthHeader(authHeader);
    return this.authService.getProfile(userId);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Đổi mật khẩu',
    description: 'Cho phép người dùng đang đăng nhập đổi mật khẩu.'
  })
  @ApiResponse({ status: 200, description: 'Đổi mật khẩu thành công.' })
  @ApiResponse({ status: 400, description: 'Mật khẩu xác nhận không khớp.' })
  @ApiResponse({ status: 401, description: 'Mật khẩu hiện tại không đúng hoặc token không hợp lệ.' })
  async changePassword(@Body() dto: ChangePasswordDto, @Headers('authorization') authHeader?: string) {
    const userId = await this.authService.extractUserIdFromAuthHeader(authHeader);
    if (dto.newPassword !== dto.confirmNewPassword) throw new BadRequestException('Xác nhận mật khẩu không khớp');
    return this.authService.changePassword(userId, dto.currentPassword, dto.newPassword);
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Gửi mã OTP',
    description: 'Gửi mã OTP qua email cho mục đích đăng ký tài khoản hoặc quên mật khẩu.'
  })
  @ApiResponse({ status: 200, description: 'OTP đã được gửi qua email.' })
  @ApiResponse({ status: 400, description: 'Email không hợp lệ hoặc lỗi gửi OTP.' })
  async sendOtp(@Body() body: { email: string; type?: 'register' | 'forgot_password' }) {
    try {
      return await this.authService.sendOtpEmail(body.email, body.type);
    } catch (error) {
      throw new BadRequestException(error.message || 'Lỗi gửi OTP');
    }
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xác thực mã OTP',
    description: 'Xác thực mã OTP đã được gửi qua email.'
  })
  @ApiResponse({ status: 200, description: 'Xác thực OTP thành công.' })
  @ApiResponse({ status: 400, description: 'Mã OTP không đúng hoặc đã hết hạn.' })
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    try {
      const result = await this.authService.verifyOtpEmail(body.email, body.otp);
      return result;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  @Post('register-enterprise')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Đăng ký tài khoản doanh nghiệp',
    description: 'Đăng ký tài khoản doanh nghiệp mới với thông tin đăng ký và mã OTP.'
  })
  @ApiResponse({ status: 201, description: 'Đăng ký tài khoản doanh nghiệp thành công.' })
  @ApiResponse({ status: 400, description: 'Thông tin đăng ký không hợp lệ hoặc OTP sai.' })
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
    tinhTP?: string;
    phuongXaCode?: string;
    phuongXaTen?: string;
    sdtCoQuan?: string;
    tinhTPHoatDong?: string;
    phuongXaHoatDongCode?: string;
    phuongXaHoatDongTen?: string;
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
  @ApiOperation({
    summary: 'Đặt lại mật khẩu',
    description: 'Đặt lại mật khẩu mới bằng mã OTP đã xác thực.'
  })
  @ApiResponse({ status: 200, description: 'Đặt lại mật khẩu thành công.' })
  @ApiResponse({ status: 400, description: 'OTP không hợp lệ hoặc mật khẩu xác nhận không khớp.' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException('Xác nhận mật khẩu không khớp');
    }

    return this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
  }

  @Post('request-change-email')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Yêu cầu đổi email',
    description: 'Gửi yêu cầu đổi email kèm OTP xác thực đến email mới.'
  })
  @ApiResponse({ status: 200, description: 'OTP xác thực đã được gửi đến email mới.' })
  @ApiResponse({ status: 401, description: 'Token không hợp lệ.' })
  async requestChangeEmail(
    @Body() dto: RequestChangeEmailOtpDto,
    @Headers('authorization') authHeader?: string,
  ) {
    const userId = await this.authService.extractUserIdFromAuthHeader(authHeader);
    return this.authService.requestChangeEmailOtp(userId, dto.newEmail);
  }

  @Post('verify-change-email-otp')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xác thực OTP đổi email',
    description: 'Xác thực mã OTP để hoàn tất quá trình đổi email.'
  })
  @ApiResponse({ status: 200, description: 'Đổi email thành công.' })
  @ApiResponse({ status: 400, description: 'Mã OTP không đúng.' })
  async verifyChangeEmailOtp(
    @Body() dto: VerifyChangeEmailOtpDto,
    @Headers('authorization') authHeader?: string,
  ) {
    const userId = await this.authService.extractUserIdFromAuthHeader(authHeader);
    return this.authService.verifyChangeEmailOtp(userId, dto.otp);
  }

  @Post('profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật thông tin cá nhân',
    description: 'Cập nhật thông tin hồ sơ của người dùng đang đăng nhập.'
  })
  @ApiResponse({ status: 200, description: 'Cập nhật thông tin thành công.' })
  @ApiResponse({ status: 401, description: 'Token không hợp lệ.' })
  async updateProfile(
    @Body() body: any,
    @Headers('authorization') authHeader?: string,
  ) {
    const userId = await this.authService.extractUserIdFromAuthHeader(authHeader);
    return this.authService.updateProfile(userId, body);
  }

  @Get('enterprise-types')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách loại hình doanh nghiệp',
    description: 'Trả về danh sách tất cả loại hình doanh nghiệp.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách loại hình doanh nghiệp.' })
  async getEnterpriseTypes() {
    return this.authService.getEnterpriseTypes();
  }

  @Get('industries')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách ngành nghề',
    description: 'Trả về danh sách tất cả ngành nghề kinh doanh.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách ngành nghề.' })
  async getIndustries() {
    return this.authService.getIndustries();
  }
}
