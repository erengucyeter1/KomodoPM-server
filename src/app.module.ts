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

@Module({
  imports: [AuthModule, UserModule, UserModule, AuthorizationModule, ChatModule, TreylersModule, ProjectsModule ], // AuthModule already exports JwtModule
  controllers: [AppController],
  providers: [AppService, PrismaService, UsersService, AuthorizationService],
})
export class AppModule { }



