import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvoiceDetailDto } from './dto/create-invoice-detail.dto';
import { UpdateInvoiceDetailDto } from './dto/update-invoice-detail.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import Decimal from "decimal.js";

@Injectable()
export class InvoiceDetailService {

  constructor(private readonly prisma: PrismaService) {}
  async create(createInvoiceDetailDto: CreateInvoiceDetailDto) {
    

    // is there an valid invoice with this id
    const invoice = this.prisma.invoice.findUnique({
      where: {
        invoiceNumber: createInvoiceDetailDto.invoiceNumber
      }
    });

    if (!invoice) {
            throw new BadRequestException('Bu numara ile fatura bulunamadı.');
      
    }




    const invoiceDetail = await this.prisma.invoiceDetail.create({
      data: {
        invoiceNumber: createInvoiceDetailDto.invoiceNumber,
        product_code: createInvoiceDetailDto.product_code,  
        quantity: createInvoiceDetailDto.quantity,
        quantityBalance: createInvoiceDetailDto.quantity,
        unitPrice: createInvoiceDetailDto.unitPrice,
        totalAmount: this.calculateTotalAmount(createInvoiceDetailDto),
        description: createInvoiceDetailDto.description,
        isVatExempt: createInvoiceDetailDto.isVatExempt,
        vatExemptionReason: createInvoiceDetailDto.vatExemptionReason,
        vatRate: createInvoiceDetailDto.vatRate,
        vatAmount: createInvoiceDetailDto.vatAmount,
      }
    });

  const product = await this.prisma.product.findUnique({
      where: { stock_code: createInvoiceDetailDto.product_code },
      select: { balance: true },
    });

    if (product) {
      const newBalance = product.balance.plus(createInvoiceDetailDto.quantity); // Prisma Decimal ise .plus kullanılır
      await this.prisma.product.update({
        where: { stock_code: createInvoiceDetailDto.product_code },
        data: { balance: newBalance },
      });
    }

    return invoiceDetail;
  }

  findAll() {
    return `This action returns all invoiceDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invoiceDetail`;
  }

  update(id: number, updateInvoiceDetailDto: UpdateInvoiceDetailDto) {
    return `This action updates a #${id} invoiceDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoiceDetail`;
  }

  private calculateTotalAmount(createInvoiceDetailDto: CreateInvoiceDetailDto): string {
  const unitPrice = new Decimal(createInvoiceDetailDto.unitPrice);
  const quantity = new Decimal(createInvoiceDetailDto.quantity);
  const totalAmount = unitPrice.mul(quantity);
  // İsterseniz iki ondalık basamağa yuvarlayabilirsiniz:
  return totalAmount.toFixed(5);

}
}
