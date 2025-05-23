import { Module } from '@nestjs/common';
import { InvoiceDetailService } from './invoice-detail.service';
import { InvoiceDetailController } from './invoice-detail.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { StockService } from '../stock/stock.service';


@Module({
  controllers: [InvoiceDetailController],
  providers: [InvoiceDetailService, PrismaService ,StockService],
})
export class InvoiceDetailModule {}
