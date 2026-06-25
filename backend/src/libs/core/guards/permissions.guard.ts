import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../modules/users/entities/user.entity';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';
import { getEffectivePermissions } from '../utils/effective-permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string | undefined;

    if (!authHeader) throw new ForbiddenException('Missing authorization header');

    const token = authHeader.split(' ')[1];
    if (!token) throw new ForbiddenException('Invalid token');

    try {
      const payload = this.jwtService.verify(token) as { sub: string };

      const user = await this.userRepo.findOne({
        where: { id: payload.sub },
        relations: ['role', 'role.permissions', 'title'],
      });

      if (!user) throw new ForbiddenException('Access denied');

      if (!requiredPermission) {
        request.user = user;
        return true;
      }

      if (!user.role?.permissions) {
        throw new ForbiddenException('Access denied');
      }

      const hasPermission = getEffectivePermissions(user).some(
        (p) => p.code === requiredPermission,
      );

      if (!hasPermission) {
        throw new ForbiddenException(`Missing permission: ${requiredPermission}`);
      }

      request.user = user;
      return true;
    } catch (err) {
      if (err instanceof ForbiddenException) throw err;
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}
