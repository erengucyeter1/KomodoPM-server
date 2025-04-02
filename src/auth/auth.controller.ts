import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';


@Controller('auth')
@ApiTags('auth')

export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOkResponse({ type: AuthEntity })

    login(@Body() { username, password }: LoginDto) {
        return this.authService.login(username, password);
    }


    @Post('register')
    @ApiOkResponse({ type: AuthEntity })
    register(@Body() { username, password, name, surname, email, authorization_rank }: RegisterDto) {
        return this.authService.register(username, password, name, surname, email, authorization_rank);
    }

}
