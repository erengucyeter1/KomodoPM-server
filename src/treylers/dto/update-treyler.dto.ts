import { PartialType } from '@nestjs/swagger';
import { CreateTreylerDto } from './create-treyler.dto';

export class UpdateTreylerDto extends PartialType(CreateTreylerDto) {}
