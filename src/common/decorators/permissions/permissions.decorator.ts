// src/authorization/permissions.decorator.ts
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionGuard } from './guards/permission.guard';

/**
 * @param permissions İstenen izinler dizisi
 * @param strategy izinlerin tümü mü gerekli en az biri olsa yeterli mi
 */
export function Permissions(permissions: string[], strategy: 'all' | 'any' = 'all') {
    return applyDecorators(
      SetMetadata('permissions', permissions),
      SetMetadata('strategy', strategy),
      UseGuards(PermissionGuard)
    );
  }