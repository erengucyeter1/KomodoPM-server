import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import {Permissions} from '../common/decorators/permissions/permissions.decorator';
import { Public } from 'src/common/decorators/auth/public.decorator';



@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @Public()
    @ApiOkResponse({ type: AuthEntity })

    login(@Body() { username, password }: LoginDto) {
        return this.authService.login(username, password);
    }


    @Post('register')
    @Permissions(['create:user'])
    @ApiBearerAuth()
    @ApiOkResponse({ type: AuthEntity })
    register(@Body() { username, password, name, surname, email, authorization_rank }: RegisterDto) {
        return this.authService.register(username, password, name, surname, email, authorization_rank);
    }

}
