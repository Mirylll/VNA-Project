import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { AccountType, User } from '../../users/entities/user.entity';
import { OtpCode } from '../entities/otp-code.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { OtpService } from './otp.service';
import { getEffectivePermissions } from '../../../libs/core/utils/effective-permissions';
import { Role } from '../../roles/entities/role.entity';
import { Enterprise } from '../../enterprises/entities/enterprise.entity';
import { EnterpriseType } from '../../enterprise-types/entities/enterprise-type.entity';
import { Industry } from '../../industries/entities/industry.entity';
import { Province } from '../../users/entities/province.entity';
import { District } from '../../users/entities/district.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OtpCode)
    private readonly otpRepository: Repository<OtpCode>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
    @InjectRepository(EnterpriseType)
    private readonly enterpriseTypeRepository: Repository<EnterpriseType>,
    @InjectRepository(Industry)
    private readonly industryRepository: Repository<Industry>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
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
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role', 'role.permissions', 'title'],
    });
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
    const accountType =
      user.role?.code === 'ROLE_ENTERPRISE'
        ? AccountType.ENTERPRISE
        : user.accountType || AccountType.INTERNAL;
    const payload = { sub: user.id, username: user.username, role: user.role?.code, accountType };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: this.toAuthUser(user),
    };
  }

  async requestChangeEmailOtp(userId: string, newEmail: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');
    if (!user.email) throw new BadRequestException('Tài khoản hiện không có email để xác thực');
    if (user.email === newEmail) throw new BadRequestException('Email mới giống với email hiện tại');

    const existingUser = await this.userRepository.findOne({ where: { email: newEmail } });
    if (existingUser) throw new BadRequestException('Email mới đã tồn tại trên hệ thống, vui lòng kiểm tra lại dữ liệu');

    const existingEnterprise = await this.enterpriseRepository.findOne({ where: { email: newEmail } });
    if (existingEnterprise && existingEnterprise.username !== user.username && existingEnterprise.taxCode !== user.username) {
      throw new BadRequestException('Email mới đã tồn tại trên hệ thống, vui lòng kiểm tra lại dữ liệu');
    }

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

    const existingUser = await this.userRepository.findOne({ where: { email: otpRecord.targetValue } });
    if (existingUser && existingUser.id !== user.id) {
      throw new BadRequestException('Email mới đã tồn tại trên hệ thống, vui lòng kiểm tra lại dữ liệu');
    }

    const existingEnterprise = await this.enterpriseRepository.findOne({ where: { email: otpRecord.targetValue } });
    if (
      existingEnterprise &&
      existingEnterprise.username !== user.username &&
      existingEnterprise.taxCode !== user.username
    ) {
      throw new BadRequestException('Email mới đã tồn tại trên hệ thống, vui lòng kiểm tra lại dữ liệu');
    }

    user.email = otpRecord.targetValue;
    await this.userRepository.save(user);

    const enterprise = await this.enterpriseRepository.findOne({
      where: [{ username: user.username }, { taxCode: user.username }],
    });
    if (enterprise) {
      enterprise.email = otpRecord.targetValue;
      await this.enterpriseRepository.save(enterprise);
    }

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
    return { message: 'Cập nhật thông tin thành công', user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName } };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'role.permissions', 'title'],
    });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');
    return this.toAuthUser(user);
  }

  private toAuthUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl || null,
      titleName: user.title?.name || null,
      accountType:
        user.role?.code === 'ROLE_ENTERPRISE'
          ? AccountType.ENTERPRISE
          : user.accountType || AccountType.INTERNAL,
      role: user.role
        ? {
            id: user.role.id,
            code: user.role.code,
            name: user.role.name,
          }
        : null,
      title: user.title
        ? {
            id: user.title.id,
            name: user.title.name,
          }
        : null,
      permissions: getEffectivePermissions(user).map((permission) => ({
        id: permission.id,
        code: permission.code,
        name: permission.name,
      })) || [],
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

  async sendOtpEmail(email: string, type?: 'register' | 'forgot_password') {
    const user = await this.userRepository.findOne({ where: { email } });

    if (type === 'forgot_password' && !user) {
      throw new BadRequestException('Email chưa đăng ký trong hệ thống. Xin vui lòng thử lại sau');
    }
    if (type === 'register' && user) {
      throw new BadRequestException('Email này đã được đăng ký tài khoản');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[DEV] Generated OTP for ${email}: ${otp}`);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const context = user
      ? { fullName: user.fullName, username: user.username, isRegister: false }
      : { fullName: 'Quý đối tác', username: email, isRegister: true };
    
    try {
      await this.otpService.sendOtpViaEmail(email, otp, context);
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
    
    otpData.verified = true;
    otpStore[email] = otpData;
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

  async registerEnterprise(data: {
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
    const otpStore = (global as any).otpStore || {};
    const otpData = otpStore[data.email];

    if (!otpData) {
      throw new BadRequestException('Mã OTP không tồn tại hoặc đã hết hạn');
    }
    if (Date.now() > otpData.expiresAt.getTime()) {
      delete otpStore[data.email];
      (global as any).otpStore = otpStore;
      throw new BadRequestException('Mã OTP đã hết hạn, vui lòng gửi lại');
    }
    if (otpData.code !== data.otp) {
      throw new BadRequestException('Mã OTP không đúng');
    }
    this.assertLicenseDateNotInFuture(data.ngayCap);

    const existingByUsername = await this.userRepository.findOne({ where: { username: data.mst } });
    if (existingByUsername) {
      throw new BadRequestException('Mã số thuế này đã được đăng ký tài khoản');
    }

    const existingByEmail = await this.userRepository.findOne({ where: { email: data.email } });
    if (existingByEmail) {
      throw new BadRequestException('Email này đã được đăng ký tài khoản');
    }

    const existingEnterprise = await this.enterpriseRepository.findOne({
      where: [{ taxCode: data.mst }, { username: data.mst }],
    });
    if (existingEnterprise) {
      throw new BadRequestException('Mã số thuế này đã tồn tại trong thông tin doanh nghiệp');
    }

    const defaultPassword = '12345678';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const result = await this.userRepository.manager.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const roleRepository = manager.getRepository(Role);
      const enterpriseRepository = manager.getRepository(Enterprise);
      const enterpriseTypeRepository = manager.getRepository(EnterpriseType);
      const industryRepository = manager.getRepository(Industry);
      const provinceRepository = manager.getRepository(Province);
      const districtRepository = manager.getRepository(District);

      const enterpriseRole = await roleRepository.findOne({ where: { code: 'ROLE_ENTERPRISE' } });
      const enterpriseType = await this.findOrCreateEnterpriseType(enterpriseTypeRepository, data.loaiHinhKD);
      const industry = await this.findOrCreateIndustry(industryRepository, data.nganhNghe);
      const province = await this.findOrCreateProvince(provinceRepository, data.tinhTP || 'Thành phố Hồ Chí Minh');
      const ward = await this.findOrCreateDistrict(
        districtRepository,
        this.extractWardName(data.phuongXaTen),
        province,
      );
      const operationProvince = await this.findOrCreateProvince(
        provinceRepository,
        data.tinhTPHoatDong || data.tinhTP || 'Thành phố Hồ Chí Minh',
      );
      const operationWard = await this.findOrCreateDistrict(
        districtRepository,
        this.extractWardName(data.phuongXaHoatDongTen),
        operationProvince,
      );

      const user = userRepository.create({
        username: data.mst,
        passwordHash,
        fullName: data.tenDN || data.mst,
        email: data.email,
        isActive: true,
        accountType: AccountType.ENTERPRISE,
        role: enterpriseRole || undefined,
      });
      const savedUser = await userRepository.save(user);

      const enterprise = enterpriseRepository.create({
        name: data.tenDN || data.mst,
        taxCode: data.mst,
        enterpriseType: enterpriseType || undefined,
        industry: industry || undefined,
        licenseDate: data.ngayCap || undefined,
        province: province || undefined,
        ward: ward || undefined,
        address: data.diaChi || undefined,
        foreignName: data.tenNuocNgoai || undefined,
        email: data.email,
        phone: data.sdtCoQuan || undefined,
        operationProvince: operationProvince || undefined,
        operationWard: operationWard || undefined,
        operationAddress: data.diaDiemKD || undefined,
        leaderName: data.nguoiDungDau || undefined,
        leaderPhone: data.sdtNguoiDungDau || undefined,
        username: data.mst,
        password: defaultPassword,
        isActive: true,
      });
      const savedEnterprise = await enterpriseRepository.save(enterprise);

      return { user: savedUser, enterprise: savedEnterprise };
    });
    delete otpStore[data.email];
    (global as any).otpStore = otpStore;

    return {
      success: true,
      message: 'Tài khoản doanh nghiệp đã được tạo thành công',
      account: {
        username: data.mst,
        defaultPassword,
      },
      uploadToken: this.jwtService.sign(
        { enterpriseId: result.enterprise.id, purpose: 'enterprise-registration-upload' },
        { expiresIn: '10m' },
      ),
      enterprise: {
        id: result.enterprise.id,
        taxCode: result.enterprise.taxCode,
        name: result.enterprise.name,
      },
    };
  }

  private extractWardName(value?: string) {
    return value?.split(',')[0]?.trim() || '';
  }

  private assertLicenseDateNotInFuture(value?: string) {
    if (!value) return;

    const inputDate = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(inputDate.getTime()) || inputDate > today) {
      throw new BadRequestException('Ngày cấp GPKD không được lớn hơn ngày hiện tại');
    }
  }

  private makeCode(prefix: string, value: string) {
    const normalized = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toUpperCase();
    return `${prefix}_${normalized}`.slice(0, 50);
  }

  private async findOrCreateEnterpriseType(
    repository: Repository<EnterpriseType>,
    value?: string,
  ): Promise<EnterpriseType | null> {
    const name = value?.trim();
    if (!name) return null;

    const existing = await repository.findOne({
      where: [{ name }, { code: name }, { name: ILike(name) }],
    });
    if (existing) return existing;

    const enterpriseType = repository.create({
      code: this.makeCode('LH', name),
      name,
      isActive: true,
    });
    return repository.save(enterpriseType);
  }

  private async findOrCreateIndustry(repository: Repository<Industry>, value?: string): Promise<Industry | null> {
    const raw = value?.trim();
    if (!raw) return null;

    const [rawCode, ...rawNameParts] = raw.split('-');
    const code = rawCode.trim();
    const name = rawNameParts.join('-').trim() || raw;
    const existing = await repository.findOne({
      where: [{ code }, { name }, { name: ILike(name) }],
    });
    if (existing) return existing;

    const industry = repository.create({
      code: code || this.makeCode('NN', name),
      name,
      level: 4,
      isActive: true,
    });
    return repository.save(industry);
  }

  private async findOrCreateProvince(repository: Repository<Province>, value?: string): Promise<Province> {
    const name = value?.trim() || 'Thành phố Hồ Chí Minh';
    const existing = await repository.findOne({ where: { name } });
    if (existing) return existing;
    return repository.save(repository.create({ name }));
  }

  private async findOrCreateDistrict(
    repository: Repository<District>,
    value: string,
    province: Province | null,
  ): Promise<District | null> {
    const name = value?.trim();
    if (!name || !province) return null;

    const existing = await repository.findOne({
      where: { name, province: { id: province.id } },
      relations: ['province'],
    });
    if (existing) return existing;

    return repository.save(repository.create({ name, province }));
  }

  async getEnterpriseTypes() {
    return this.enterpriseTypeRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getIndustries() {
    return this.industryRepository.find({
      where: { isActive: true, level: 4 },
      order: { code: 'ASC' },
    });
  }
}
