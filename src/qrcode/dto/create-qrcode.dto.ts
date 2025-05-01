
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQrcodeDto {
    @IsNotEmpty()
    @IsString()
    data: string;

}

