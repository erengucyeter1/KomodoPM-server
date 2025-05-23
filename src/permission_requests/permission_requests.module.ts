import { Module } from '@nestjs/common';
import { PermissionRequestsService } from './permission_requests.service';
import { PermissionRequestsController } from './permission_requests.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PermissionRequestsController],
  providers: [PermissionRequestsService, PrismaService],
})
export class PermissionRequestsModule {}
  