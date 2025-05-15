import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entities/auth.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, private usersService: UsersService) { }


    async login(username: string, password: string): Promise<AuthEntity> {

        const user = await this.prisma.user.findUnique({ where: { username: username }, include: { roles: { include: { permissions: true } } } });

        if (!user) {
            throw new NotFoundException('Username or password is incorrect');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Username or password is incorrect');
        }



        const permissionNames = user.roles.flatMap(role => role.permissions.map(permission => permission.name));





        return {
            accessToken: this.jwtService.sign({ user: new UserEntity(user, permissionNames) }),
        }
    }


    async register(username: string, password: string, name: string, surname: string, email: string, authorization_rank: number): Promise<{ message: string, statusCode: number }> {

        const existingUser = await this.prisma.user.findUnique({ where: { username } });

        if (existingUser) {
            throw new UnauthorizedException('Username is already taken');
        }


        const createUserDto: CreateUserDto
            =
        {
            username,
            password: password,
            name,
            surname,
            email,
            authorization_rank
        };

        try {
            await this.usersService.create(createUserDto);
            return {
                message: 'User successfully registered',
                statusCode: 201,
            };
        }
        catch (error) {
            throw new UnauthorizedException('User registration failed');
        }
    }






}
