import { ApiProperty } from '@nestjs/swagger';

export class CustomerSupplier {
  @ApiProperty({ example: 1, description: 'Müşteri/Tedarikçi ID' })
  id: number;

  @ApiProperty({ example: 'ABC Ticaret Ltd. Şti.', description: 'Müşteri/Tedarikçi unvanı' })
  title: string;

  @ApiProperty({ example: 'Kadıköy', description: 'Vergi dairesi' })
  taxOffice?: string;

  @ApiProperty({ example: '1234567890', description: 'Vergi numarası' })
  taxNumber?: string;

  @ApiProperty({ example: 'Atatürk Cad. No:123 İstanbul', description: 'Adres' })
  address?: string;

  @ApiProperty({ example: 'TR', description: 'Ülke kodu' })
  countryCode?: string;

  @ApiProperty({ example: '05551234567', description: 'Telefon numarası' })
  phone?: string;

  @ApiProperty({ example: 'info@example.com', description: 'E-posta adresi' })
  email?: string;

  @ApiProperty({ example: false, description: 'Tedarikçi mi?' })
  isSupplier: boolean;

  @ApiProperty({ example: '2023-01-01T12:00:00Z', description: 'Oluşturma tarihi' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-02T12:00:00Z', description: 'Güncelleme tarihi' })
  updatedAt: Date;
}
