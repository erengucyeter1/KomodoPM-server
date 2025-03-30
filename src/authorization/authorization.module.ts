import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AuthorizationController],
  providers: [AuthorizationService, PrismaService],
})
export class AuthorizationModule { }
