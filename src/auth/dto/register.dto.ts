import { IsString, IsEmail, IsArray, IsInt } from 'class-validator';

export class RegisterDto {
    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsString()
    name: string;

    @IsString()
    surname: string;

    @IsEmail()
    email: string;
    
    @IsInt()
    authorization_rank: number;
}