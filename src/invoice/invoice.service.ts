import { Injectable,BadRequestException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    // First check if an invoice with this number already exists
    const existingInvoice = await this.prisma.invoice.findFirst({
      where: {
        invoiceNumber: createInvoiceDto.invoiceNumber,
      },
    });
    
    // If an existing invoice is found, throw an exception
    if (existingInvoice) {
      throw new BadRequestException('Bu fatura numarası zaten mevcut.');
    }
    
    // Only create a new invoice if no existing invoice is found
    return this.prisma.invoice.create({
      data: {
        invoiceNumber: createInvoiceDto.invoiceNumber,
        partnerTaxNumber: createInvoiceDto.partnerTaxNumber,
        invoiceType: createInvoiceDto.invoiceType,
        transactionType: createInvoiceDto.transactionType,
        invoiceDate: createInvoiceDto.invoiceDate,
        isInternational: createInvoiceDto.isInternational,
        currency: createInvoiceDto.currency,
        deduction_kdv_period: createInvoiceDto.deduction_kdv_period,
        upload_kdv_period: createInvoiceDto.upload_kdv_period,
        expense_allocation_id: createInvoiceDto.expense_allocation_id,
        customsDeclarationNumber: createInvoiceDto.customsDeclarationNumber,
        importCountryCode: createInvoiceDto.importCountryCode,
        exportCountryCode: createInvoiceDto.exportCountryCode,
      },
    });
  }

  findAll() {
    return `This action returns all invoice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
