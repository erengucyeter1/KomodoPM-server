import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService,PrismaService],
})
export class ProjectsModule {}
