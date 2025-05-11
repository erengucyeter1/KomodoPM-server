import { Module } from '@nestjs/common';
import { InvoiceDetailService } from './invoice-detail.service';
import { InvoiceDetailController } from './invoice-detail.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [InvoiceDetailController],
  providers: [InvoiceDetailService, PrismaService ],
})
export class InvoiceDetailModule {}
