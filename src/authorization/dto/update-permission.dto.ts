
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePermissionDto {

    @ApiProperty()
    @IsInt()
    id: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    permission_name: string;

    @ApiProperty()
    @IsString()
    permission_description: string;
}
