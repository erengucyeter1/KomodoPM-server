import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatGateway } from './sockets/index';
import { RedisService } from '../redis/redis.service';
@Module({
  imports: [
    PrismaModule,
    // JWT Modülünü doğrudan process.env kullanarak kaydet
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      },
    }),
  ],
  providers: [ChatGateway, RedisService],
  exports: [ChatGateway],
})
export class ChatModule {}