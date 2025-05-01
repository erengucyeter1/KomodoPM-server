import { IsString, IsOptional,  IsBase64 } from 'class-validator';

export class CreateTreylerDto {

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsBase64()
    imageData?: string; 

    @IsOptional()
    @IsString()
    contentType?: string;
}
