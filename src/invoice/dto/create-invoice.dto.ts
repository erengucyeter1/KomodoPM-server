import { IsString, IsOptional, IsDate, IsEnum, IsNotEmpty, IsBoolean, Length, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { InvoiceType, TransactionType } from '@prisma/client';
import { Optional } from '@nestjs/common';

export class CreateInvoiceDto {
    @IsString()
    @IsNotEmpty()
    invoiceNumber: string;

    @IsString()
    @IsNotEmpty()
    partnerTaxNumber: string;

    @IsOptional()
    @IsEnum(InvoiceType)
    @Transform(({ value }) => {
        if (typeof value === 'string' && Object.values(InvoiceType).includes(value as any)) {
            return value as InvoiceType;
        }
        return value;
    })
    invoiceType: InvoiceType;


    @IsOptional()
    @IsEnum(TransactionType)
    @Transform(({ value }) => {
        if (typeof value === 'string' && Object.values(TransactionType).includes(value as any)) {
            return value as TransactionType;
        }
        return value;
    })
    transactionType: TransactionType;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    invoiceDate: Date;

    @IsNotEmpty()
    @IsBoolean()
    @Type(() => Boolean)
    isInternational: boolean;

    @IsNotEmpty()
    @IsString()
    @Length(3,3)
    currency: string;

    @IsOptional()
    @IsString()
    deduction_kdv_period: string;

    @IsOptional()
    @IsString()
    upload_kdv_period: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    expense_allocation_id: number;


    @IsOptional()
    @IsString()
    customsDeclarationNumber: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value === undefined ? null : value)
    importCountryCode: string | null;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value === undefined ? null : value)
    exportCountryCode: string;
    
    

}