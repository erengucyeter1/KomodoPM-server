import { PartialType } from '@nestjs/swagger';
import { CreateTreylerDto } from './create-trailers.dto';

export class UpdateTreylerDto extends PartialType(CreateTreylerDto) {}
