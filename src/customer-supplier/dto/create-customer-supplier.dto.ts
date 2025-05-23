import { IsString, IsOptional, IsEmail, IsBoolean, MaxLength, IsISO31661Alpha2 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerSupplierDto {
  @ApiProperty({ 
    description: 'Müşteri/Tedarikçi unvanı',
    example: 'ABC Ticaret Ltd. Şti.' 
  })
  @IsString({ message: 'Unvan bir metin olmalıdır' })
  @MaxLength(255, { message: 'Unvan en fazla 255 karakter olabilir' })
  title: string;

  @ApiProperty({ 
    description: 'Vergi dairesi',
    example: 'Kadıköy',
    required: false 
  })
  @IsOptional()
  @IsString({ message: 'Vergi dairesi bir metin olmalıdır' })
  @MaxLength(255, { message: 'Vergi dairesi en fazla 255 karakter olabilir' })
  taxOffice?: string;

  @ApiProperty({ 
    description: 'Vergi/TC kimlik numarası',
    example: '1234567890',
    required: false 
  })
  @IsOptional()
  @IsString({ message: 'Vergi numarası bir metin olmalıdır' })
  @MaxLength(20, { message: 'Vergi numarası en fazla 20 karakter olabilir' })
  taxNumber?: string;

  @ApiProperty({ 
    description: 'Adres bilgisi',
    example: 'Atatürk Cad. No:123 Kadıköy/İstanbul',
    required: false 
  })
  @IsOptional()
  @IsString({ message: 'Adres bir metin olmalıdır' })
  address?: string;

  @ApiProperty({ 
    description: 'Ülke kodu (ISO 3166-1 alpha-2)',
    example: 'TR',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Ülke kodu bir metin olmalıdır' })
  @IsISO31661Alpha2({ message: 'Geçerli bir ISO 3166-1 alpha-2 ülke kodu giriniz (örn. TR)' })
  @MaxLength(2, { message: 'Ülke kodu en fazla 2 karakter olabilir' })
  countryCode?: string;

  @ApiProperty({ 
    description: 'Telefon numarası',
    example: '05551234567',
    required: false 
  })
  @IsOptional()
  @IsString({ message: 'Telefon numarası bir metin olmalıdır' })
  @MaxLength(20, { message: 'Telefon numarası en fazla 20 karakter olabilir' })
  phone?: string;

  @ApiProperty({ 
    description: 'E-posta adresi',
    example: 'info@example.com',
    required: false 
  })
  @IsOptional()
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  @MaxLength(255, { message: 'E-posta adresi en fazla 255 karakter olabilir' })
  email?: string;

  @ApiProperty({ 
    description: 'Tedarikçi mi?',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean({ message: 'Tedarikçi değeri boolean olmalıdır' })
  isSupplier?: boolean = false;
}