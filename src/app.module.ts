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
import { TrailersModule } from './trailers/trailers.module';
import { ProjectsModule } from './projects/projects.module';
import { StockModule } from './stock/stock.module';
import { QrcodeModule } from './qrcode/qrcode.module';
import { BillModule } from './bill/bill.module';
import { InvoiceModule } from './invoice/invoice.module';
import { InvoiceDetailModule } from './invoice-detail/invoice-detail.module';
import { CustomerSupplierModule } from './customer-supplier/customer-supplier.module';
import { ProjectExpenseModule } from './project-expense/project-expense.module';
import { ReportModule } from './report/report.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PermissionRequestsModule } from './permission_requests/permission_requests.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [AuthModule, UserModule, UserModule, AuthorizationModule, ChatModule, TrailersModule, ProjectsModule, StockModule, QrcodeModule, BillModule, InvoiceModule, InvoiceDetailModule, CustomerSupplierModule, ProjectExpenseModule, ReportModule, PermissionRequestsModule, MessagesModule ], // AuthModule already exports JwtModule
  controllers: [AppController],
  providers: [AppService, PrismaService, UsersService, AuthorizationService, {provide: APP_GUARD, useClass: JwtAuthGuard}],
})
export class AppModule { }



