import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './users.controller';

@Module({
    providers: [UsersService],
    imports: [PrismaModule],
    exports: [UsersService],
    controllers: [UserController],
})
export class UserModule {

}
