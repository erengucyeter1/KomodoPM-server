import { PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    status: string;
}
