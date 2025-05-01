import { Module } from '@nestjs/common';
import { TreylersService } from './treylers.service';
import { TreylersController } from './treylers.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Bu satırı ekleyin

@Module({
  imports: [PrismaModule], // PrismaModule'u import edin
  controllers: [TreylersController],
  providers: [TreylersService],
  exports: [TreylersService]
})
export class TreylersModule {}