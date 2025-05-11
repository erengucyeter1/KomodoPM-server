import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateInvoiceDetailDto {
    @IsString()
    @IsNotEmpty()
    invoiceNumber: string;

    @IsString()
    @IsNotEmpty()
    product_code: string;

    @IsNotEmpty()
    @Transform(({ value }) => value !== undefined ? value.toString() : value)
    @IsDecimal()
    quantity: string;

    @IsNotEmpty()
    @Transform(({ value }) => value !== undefined ? value.toString() : value)
    @IsDecimal()
    unitPrice: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    @IsNotEmpty()
    isVatExempt: boolean;

    @IsOptional()
    @IsString()
    vatExemptionReason: string;

    @IsOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    vatRate: number;

    @IsOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    vatAmount: number;
}