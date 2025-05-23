import { Module } from '@nestjs/common';
import { TrailersService } from './trailers.service';
import { TrailersContoller } from './trailers.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Bu satırı ekleyin

@Module({
  imports: [PrismaModule], // PrismaModule'u import edin
  controllers: [TrailersContoller],
  providers: [TrailersService],
  exports: [TrailersService]
})
export class TrailersModule {}