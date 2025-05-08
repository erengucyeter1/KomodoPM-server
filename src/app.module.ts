import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { UserModule } from './users/users.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { AuthorizationService } from './authorization/authorization.service';
import {ChatModule} from './chat/chat.module';
import { TreylersModule } from './treylers/treylers.module';
import { ProjectsModule } from './projects/projects.module';
import { StockModule } from './stock/stock.module';
import { QrcodeModule } from './qrcode/qrcode.module';
import { BillModule } from './bill/bill.module';
import { InvoiceModule } from './invoice/invoice.module';
import { InvoiceDetailModule } from './invoice-detail/invoice-detail.module';
import { CustomerSupplierModule } from './customer-supplier/customer-supplier.module';

@Module({
  imports: [AuthModule, UserModule, UserModule, AuthorizationModule, ChatModule, TreylersModule, ProjectsModule, StockModule, QrcodeModule, BillModule, InvoiceModule, InvoiceDetailModule, CustomerSupplierModule ], // AuthModule already exports JwtModule
  controllers: [AppController],
  providers: [AppService, PrismaService, UsersService, AuthorizationService],
})
export class AppModule { }



