
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQrcodeDto {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    mesurement: string;

}

