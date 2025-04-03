import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

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

    const payload = this.parseJwt(token);



    
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
    const hasAllPermissions = requiredPermissions.every(permission =>
      userPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      console.log('User Permissions:', userPermissions);
      console.log('Required Permissions:', requiredPermissions);
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }

 

  private parseJwt(token) {
      try {
        // JWT'nin payload kısmını al
        const base64Url = token.split('.')[1];
        
        // Base64 URL karakter düzeltmeleri
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // Base64'ü çözümle (UTF-8 desteği ile)
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('JWT parsing error:', error);
        return null;
      }
    }
}