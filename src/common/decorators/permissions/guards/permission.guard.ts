import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { parseJwt } from 'src/common/utils/jwtHelper';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required permissions from decorator
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const strategy = this.reflector.get<string>(
      'strategy',
      context.getHandler(),
    );

    console.log('Required Permissions:', requiredPermissions);
    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new ForbiddenException('JWT token not found');
    }

    const payload = parseJwt(token);



    
    // Kullanıcı zaten JwtAuthGuard tarafından request'e eklenmiş olmalı
    const user = payload.user;

    console.log('User:', user); 

    
    if (!user) {
      throw new ForbiddenException('User not found in request. Make sure JwtAuthGuard is applied before PermissionGuard.');
    }
    
    // Kullanıcının izinlerini al
    const userPermissions = user.permissions || [];

    
    // Admin kontrolü
    if (userPermissions.includes('admin')) {
      return true;
    }

    // İzin kontrolü

    let hasPermissions: boolean = false;

    switch (strategy) {
      case 'all':
        hasPermissions = requiredPermissions.every(permission =>
          userPermissions.includes(permission),
        );
        break;
      case 'any':
        hasPermissions = requiredPermissions.some(permission =>
          userPermissions.includes(permission),
        );
        break;
      default:
        throw new ForbiddenException('Invalid strategy');
        
    }
    

    if (!hasPermissions) {
      console.log('User Permissions:', userPermissions);
      console.log('Required Permissions:', requiredPermissions);
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }

 

  
}