import { Module } from '@nestjs/common';
import { CustomerSupplierService } from './customer-supplier.service';
import { CustomerSupplierController } from './customer-supplier.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerSupplierController],
  providers: [CustomerSupplierService],
  exports: [CustomerSupplierService],
})
export class CustomerSupplierModule {}