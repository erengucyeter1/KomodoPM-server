import { IsString, IsEmail, IsArray, IsInt } from 'class-validator';

export class CreateUserDto {
    @IsString()
    username: string;

    @IsString()
    hash_password: string;

    @IsString()
    name: string;

    @IsString()
    surname: string;

    @IsEmail()
    email: string;

    @IsArray()
    @IsInt({ each: true })
    authorization_ids: number[];

    @IsInt()
    authorization_rank: number;
}