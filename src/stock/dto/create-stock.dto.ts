import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { measurement_units } from '@prisma/client';

export class CreateStockDto {


    @IsNotEmpty()
    @IsString()
    stockCode: string;

    @IsNotEmpty()
    @IsEnum(measurement_units, { message: 'Input must be a valid measurement unit' })
    mesurementUnit: measurement_units;

    @IsString()
    description: string;    





}
