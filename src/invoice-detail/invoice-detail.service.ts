import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDetailDto } from './dto/create-invoice-detail.dto';
import { StockService } from '../stock/stock.service';
// UpdateInvoiceDetailDto şu an bu metodda kullanılmıyor, gerekirse import edilebilir.
// import { UpdateInvoiceDetailDto } from './dto/update-invoice-detail.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import Decimal from "decimal.js";
import { measurement_units } from '@prisma/client';
import { CreateStockDto } from '../stock/dto/create-stock.dto';

@Injectable()
export class InvoiceDetailService {

  constructor(private readonly prisma: PrismaService, private readonly stockService: StockService) {}

  async create(createInvoiceDetailDto: CreateInvoiceDetailDto) {
    const quantity = new Decimal(createInvoiceDetailDto.quantity);
    const unitPrice = new Decimal(createInvoiceDetailDto.unitPrice);
    const isService = createInvoiceDetailDto.isService;

    if (isService) {
      const createStockDto: CreateStockDto = {
        stockCode: createInvoiceDetailDto.product_code,
        mesurementUnit: measurement_units.ADET,
        description: createInvoiceDetailDto.description,
        isService: true,
      };
      const product = await this.stockService.create(createStockDto);

      if(!product){
        throw new InternalServerErrorException("Ürün oluşturulamadı");
      }
    }

    // KDV Hariç Satır Toplamını Hesapla
    const lineTotalAmountWithoutVat = unitPrice.mul(quantity);

    // KDV Tutarını Hesapla
    let lineVatAmount = new Decimal(0);
    if (createInvoiceDetailDto.vatRate && !createInvoiceDetailDto.isVatExempt) {
      const vatRate = new Decimal(createInvoiceDetailDto.vatRate);
      lineVatAmount = lineTotalAmountWithoutVat.mul(vatRate).div(100);
    }
    // Not: Eğer DTO'da `vatAmount` alanı varsa ve KDV'den muaf değilse,
    // ve bu DTO'dan gelen `vatAmount`'ı kullanmak isterseniz, buraya ek bir koşul eklenebilir.
    // Mevcut mantık, KDV'yi `vatRate` üzerinden hesaplamayı tercih ediyor.

    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Faturanın varlığını kontrol et
        const invoice = await tx.invoice.findUnique({
          where: {
            invoiceNumber: createInvoiceDetailDto.invoiceNumber
          }
        });

        if (!invoice) {
          throw new NotFoundException(`Fatura bulunamadı: ${createInvoiceDetailDto.invoiceNumber}`);
        }

        // 2. Fatura detayını oluştur
        const invoiceDetail = await tx.invoiceDetail.create({
          data: {
            invoiceNumber: createInvoiceDetailDto.invoiceNumber,
            product_code: createInvoiceDetailDto.product_code,
            quantity: quantity,
            quantityBalance: quantity, // Başlangıçta bakiye, miktarın tamamıdır
            unitPrice: unitPrice,
            totalAmount: lineTotalAmountWithoutVat, // KDV Hariç Satır Toplamı
            description: createInvoiceDetailDto.description,
            isVatExempt: createInvoiceDetailDto.isVatExempt,
            vatExemptionReason: createInvoiceDetailDto.vatExemptionReason,
            vatRate: createInvoiceDetailDto.vatRate ? new Decimal(createInvoiceDetailDto.vatRate) : null,
            vatAmount: lineVatAmount, // Hesaplanan KDV Tutarı
          }
        });

        // Fatura detayı oluşturma işlemi sonrasında bir kontrol (genellikle Prisma hata fırlatır)
        if (!invoiceDetail) {
          throw new InternalServerErrorException('Fatura detay kaydı oluşturulamadı.');
        }

        // 3. Faturanın genel toplamlarını güncelle
        await tx.invoice.update({
          where: {
            invoiceNumber: createInvoiceDetailDto.invoiceNumber
          },
          data: {
            totalVatAmount: {
              increment: lineVatAmount // Hesaplanan KDV tutarını ekle
            },
            totalAmountWithoutVat: {
              increment: lineTotalAmountWithoutVat // Hesaplanan KDV hariç satır toplamını ekle
            }
          }
        });

        // 4. Ürün stok bakiyesini güncelle (eğer ürün varsa)
        const product = await tx.product.findUnique({
          where: { stock_code: createInvoiceDetailDto.product_code },
          select: { balance: true }, // Sadece bakiye alanını çek
        });

        if (product && product.balance !== null && product.balance !== undefined) {
          const currentBalance = new Decimal(product.balance);
          const newBalance = currentBalance.plus(quantity); // Alış faturası olduğu için stok artar
          await tx.product.update({
            where: { stock_code: createInvoiceDetailDto.product_code },
            data: { balance: newBalance },
          });
        } else {
          // Ürün bulunamazsa veya bakiye null ise logla.
          // İşlemin devam etmesi veya burada bir hata fırlatılması iş mantığınıza bağlıdır.
          console.warn(`Ürün kodu ${createInvoiceDetailDto.product_code} için stok güncellenemedi: Ürün bulunamadı veya bakiye bilgisi eksik.`);
        }

        return invoiceDetail;
      },
      {
        maxWait: 10000, // Opsiyonel: İşlem için maksimum bekleme süresi
        timeout: 20000, // Opsiyonel: İşlem için maksimum çalışma süresi
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error; // Bilinen istemci taraflı hataları doğrudan fırlat
      }
      // Beklenmedik diğer hatalar için loglama ve genel bir sunucu hatası fırlatma
      console.error('Fatura detayı oluşturulurken beklenmedik bir hata oluştu:', error);
      throw new InternalServerErrorException('Fatura detayı oluşturulurken sunucu taraflı bir hata oluştu.');
    }
  }

  // Diğer metodlar (findAll, findOne, update, remove) buraya eklenebilir.
}