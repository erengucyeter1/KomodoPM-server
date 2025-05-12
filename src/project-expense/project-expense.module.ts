import { Module } from '@nestjs/common';
import { ProjectExpenseService } from './project-expense.service';
import { ProjectExpenseController } from './project-expense.controller';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  controllers: [ProjectExpenseController],
  providers: [ProjectExpenseService,PrismaService],
})
export class ProjectExpenseModule {}
