import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { UserModule } from './users/users.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { AuthorizationService } from './authorization/authorization.service';
import {ChatGateway} from './chat/sockets/index';


@Module({
  imports: [AuthModule, UserModule, UserModule, AuthorizationModule], // AuthModule already exports JwtModule
  controllers: [AppController],
  providers: [AppService, PrismaService, UsersService, AuthorizationService,ChatGateway],
})
export class AppModule { }



