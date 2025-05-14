import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import puppeteer from 'puppeteer';
import { format } from 'date-fns';
import { is, ca, tr } from 'date-fns/locale'; // Türkçe locale'i bu şekilde import edin
import * as fs from 'fs';
import * as path from 'path';


export interface KdvDeductionLogEntry {
  projectId: number;

  invoiceId: number;
  invoiceNumber: string; // Alış Faturasının Sıra No'su
  invoiceDate: Date; // Alış Faturasının Tarihi
  invoiceCurrency: string | null;
  invoicePartnerTaxNumber: string; // Satıcının Vergi Kimlik Numarası/TC Kimlik Numarası
  invoiceTotalAmountWithoutVat: Decimal; // Alış Faturasının KDV Hariç Tutarı (Faturanın Toplamı)
  invoiceTotalVatAmount: Decimal; // Alış Faturasının KDV'si (Faturanın Toplamı)

  invoiceDetailId: number;
  originalInvoiceDetailQuantity: Decimal;
  invoiceDetailUnitPrice: Decimal;
  invoiceDetailVatRate: Decimal | null;

  productCode: string;
  productName: string; // Alınan Mal ve/veya Hizmetin Cinsi
  productMeasurementUnit: string;
  productUnitWeight: Decimal; // Yüklenilen Malın ağırlığı (hesaplanacak)

  quantityDeducted: Decimal; // Alınan Mal ve/veya Hizmetin Miktarı (kullanılan)
  deductedValueKdvExclusive: Decimal; // Kullanılan miktarın KDV hariç değeri
  deductedVatAmount: Decimal; // Bünyeye Giren Mal ve/veya Hizmetin KDV'si (kullanılan miktarın KDV'si)
 // newBalanceOnInvoiceDetail: Decimal;

  deductionTimestamp: Date;

  ggbTescilNo?: string | null; // GGB Tescil No'su (Alış İthalat İse)
  iadeHakkiDoguranIslemTuru?: string | null; // Belgeye İlişkin İade Hakkı Doğuran İşlem Türü
  yuklenimTuruId?: number | null; // Yüklenim Türü (ID, açıklaması ayrıca çekilecek)
  indirimKDVDönemi?: string | null; // Belgenin İndirime Konu Edildiği KDV Dönemi
  yuklenimKDVDönemi?: string | null; // Belgenin Yüklenildiği KDV Dönemi

  saticiAdiUnvani?: string | null;
}

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  public async getKdvDeductionLogForProject(projectId: number, isPreview: boolean = true): Promise<KdvDeductionLogEntry[]> {
    const deductionLog: KdvDeductionLogEntry[] = [];
    

    const aggregatedExpenses = await this.prisma.project_expenses.groupBy({
      by: ['product_code'],
      where: { project_id: projectId },
      _sum: { quantity: true },
    });

    if (!aggregatedExpenses || aggregatedExpenses.length === 0) {
      return [];
    }

    await this.prisma.$transaction(async (tx) => {
      for (const expenseGroup of aggregatedExpenses) {
        const productCode = expenseGroup.product_code;
        let quantityNeededForProduct = new Decimal(expenseGroup._sum.quantity || 0);

        if (quantityNeededForProduct.lessThanOrEqualTo(0)) {
          continue;
        }

        const productInfo = await tx.product.findUnique({
          where: { stock_code: productCode },
        });

        if (!productInfo) {
          console.warn(`Ürün kodu ${productCode} olan ürün bulunamadı. Bu ürün için düşüm işlemi atlanıyor.`);
          continue;
        }
        

        const availableInvoiceDetails = await tx.invoiceDetail.findMany({
          where: {
            product_code: productCode,
            quantityBalance: { gt: 0 },
          },
          include: {
            invoice: {
              include: {
                customerSupplier: true,
              },
            },
          },
          orderBy: [
            { invoice: { invoiceDate: 'asc' } },
            { createdAt: 'asc' },
          ],
        });
        

        for (const detail of availableInvoiceDetails) {
          if (quantityNeededForProduct.lessThanOrEqualTo(0)) {
            break;
          }

          const currentDetailBalance = new Decimal(detail.quantityBalance);
          const quantityToDeductThisDetail = Decimal.min(quantityNeededForProduct, currentDetailBalance);

          if (quantityToDeductThisDetail.greaterThan(0)) {

            if(!isPreview){
            const newDetailBalance = currentDetailBalance.minus(quantityToDeductThisDetail);
            await tx.invoiceDetail.update({
              where: { id: detail.id },
              data: { quantityBalance: newDetailBalance },
            });
            };

            const vatRateFromDetail = detail.vatRate ? new Decimal(detail.vatRate) : new Decimal(0);
            const deductedValue = quantityToDeductThisDetail.mul(detail.unitPrice);
            const vatAmountCalculated = deductedValue.mul(vatRateFromDetail).div(100);

            const invoiceTotalAmountWithoutVat = new Decimal(detail.invoice.totalAmountWithoutVat || 0);
            const invoiceTotalVatAmount = new Decimal(detail.invoice.totalVatAmount || 0);

            

            deductionLog.push({
              projectId,
              invoiceId: detail.invoice.id,
              invoiceNumber: detail.invoice.invoiceNumber,
              invoiceDate: detail.invoice.invoiceDate,
              invoiceCurrency: detail.invoice.currency,
              invoicePartnerTaxNumber: detail.invoice.partnerTaxNumber,
              invoiceTotalAmountWithoutVat: invoiceTotalAmountWithoutVat,
              invoiceTotalVatAmount: invoiceTotalVatAmount,
              invoiceDetailId: detail.id,
              originalInvoiceDetailQuantity: new Decimal(detail.quantity),
              invoiceDetailUnitPrice: new Decimal(detail.unitPrice),
              invoiceDetailVatRate: detail.vatRate,
              productCode: productInfo.stock_code,
              productName: productInfo.description,
              productMeasurementUnit: productInfo.measurement_unit,
              productUnitWeight: new Decimal(productInfo.unit_weight),
              quantityDeducted: quantityToDeductThisDetail,
              deductedValueKdvExclusive: deductedValue,
              deductedVatAmount: vatAmountCalculated,
             // newBalanceOnInvoiceDetail: newDetailBalance,
              deductionTimestamp: new Date(),
              ggbTescilNo: detail.invoice.customsDeclarationNumber,
              iadeHakkiDoguranIslemTuru: detail.invoice.return_eligible_transaction_type,
              yuklenimTuruId: detail.invoice.expense_allocation_id,
              indirimKDVDönemi: detail.invoice.deduction_kdv_period,
              yuklenimKDVDönemi: detail.invoice.upload_kdv_period,

              saticiAdiUnvani: detail.invoice.customerSupplier.title,
              
            });

            quantityNeededForProduct = quantityNeededForProduct.minus(quantityToDeductThisDetail);
          }
        }

        if (quantityNeededForProduct.greaterThan(0)) {
          console.warn(`Ürün ${productCode} için KDV bakiyesi yetersiz. Kalan ihtiyaç: ${quantityNeededForProduct.toString()}`);
        }
      }
    },
    {
        maxWait: 15000, 
        timeout: 30000, 
    });

    return deductionLog;
  }

  async generateReportAsBuffer(projectIdString: string, creatorId:string): Promise<Buffer> {
    const projectId = parseInt(projectIdString, 10);
    if (isNaN(projectId)) {
      throw new BadRequestException('Geçersiz Proje ID formatı.');
    }

    const projectStatusInfo = await this.prisma.treyler_project.findUnique({
      where: { id: projectId },
      select: {
        status: true,
      },
    });

    const isProjectComplated = (projectStatusInfo?.status === "completed");



    const isPDFAlreadyExists = await this.prisma.expenseReport.findFirst({
      where: {
        project_id: projectId,
      },
    });


    if(isPDFAlreadyExists){
      // read file
      const filePath = path.join(__dirname,  '..','..', '..', 'storage', 'expenseReports', isPDFAlreadyExists.file_path);
      if(fs.existsSync(filePath)){
        const pdfBuffer = fs.readFileSync(filePath);
        return pdfBuffer;
      }
      else{
        throw new NotFoundException('Rapor bulunamadı.');
      }
    }





    

    const kdvDeductionLogs = await this.getKdvDeductionLogForProject(projectId,!isProjectComplated);  // ikinci parametre false ise raporlanan değerler veri tabanından düşülür.

    if (kdvDeductionLogs.length === 0) {
      const htmlContent = `<html><body><h1>KDV İade Raporu (Proje: ${projectId})</h1><p>Bu proje için KDV iadesine tabi gider bulunamadı veya ilgili fatura detaylarında yeterli bakiye yoktu.</p></body></html>`;
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
      const pdfBuffer = await page.pdf({ format: 'A4' });
      await browser.close();

      const result = Buffer.from(pdfBuffer);

      

      return result;
    }

    const reportData = await Promise.all(kdvDeductionLogs.map(async (log, index) => {
      let yuklenimTuruDescription = '';
      if (log.yuklenimTuruId) {
        const yuklenimType = await this.prisma.expense_allocation_type.findUnique({
          where: { id: log.yuklenimTuruId },
        });
        yuklenimTuruDescription = yuklenimType?.description || '';
      }

      const alisFaturasininKdvHaricTutariStr = `${log.invoiceTotalAmountWithoutVat.toFixed(2)} ${log.invoiceCurrency || ''}`;
      const alisFaturasininKdvStr = `${log.invoiceTotalVatAmount.toFixed(2)} ${log.invoiceCurrency || ''}`;
      const bunyeyeGirenKDVStr = `${log.deductedVatAmount.toFixed(2)} ${log.invoiceCurrency || ''}`;
      const malHizmetMiktariStr = `${log.quantityDeducted.toString()} ${log.productMeasurementUnit}`;
      const yuklenilenMalAgirligiStr = log.productUnitWeight.mul(log.quantityDeducted).gt(0)
        ? `${log.productUnitWeight.mul(log.quantityDeducted).toFixed(2)} kg`
        : '';

      return {
        siraNo: index + 1,
        alisFaturaTarihi: format(log.invoiceDate, 'dd.MM.yyyy'),
        alisFaturaSiraNo: log.invoiceNumber,
        saticiAdiUnvani: log.saticiAdiUnvani,
        saticiVergiNoTCNo: log.invoicePartnerTaxNumber,
        malHizmetCinsi: log.productName,
        malHizmetMiktari: malHizmetMiktariStr,
        kdvHaricTutar: alisFaturasininKdvHaricTutariStr,
        kdvTutari: alisFaturasininKdvStr,
        bunyeyeGirenKDV: bunyeyeGirenKDVStr,
        ggbTescilNo: log.ggbTescilNo || '',
        iadeHakkiDoguranIslemTuru: log.iadeHakkiDoguranIslemTuru || '',
        yuklenimTuru: yuklenimTuruDescription,
        indirimKDVDönemi: log.indirimKDVDönemi || '',
        yuklenimKDVDönemi: log.yuklenimKDVDönemi || '',
        yuklenilenMalAgirligi: yuklenilenMalAgirligiStr,
      };
    }));

    const htmlContent = this.generateDynamicHtmlForReport(reportData, projectId);

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfUint8Array = await page.pdf({
        format: 'A3',
        printBackground: true,
        landscape: true,
        margin: { top: '20px', right: '15px', bottom: '20px', left: '15px' },
      });

      
      if(isProjectComplated){

        //save to file

        const filePath = this.savePDF(pdfUint8Array,projectId);


        //save to db
        await this.prisma.expenseReport.create({
          data: {
            creator_id: parseInt(creatorId, 10),
            project_id: projectId,
            file_path: filePath,
          },
        });
      }

      return pdfUint8Array;
    } catch (error) {
      console.error('Rapor PDF oluşturulurken hata (servis):', error);
      throw new Error(`Rapor PDF oluşturulamadı: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private generateDynamicHtmlForReport(data: any[], projectId: number): string {
    const tableRows = data.map(row => `
      <tr>
        <td class="text-center">${row.siraNo}</td>
        <td>${row.alisFaturaTarihi}</td>
        <td>${row.alisFaturaSiraNo}</td>
        <td>${row.saticiAdiUnvani}</td>
        <td>${row.saticiVergiNoTCNo}</td>
        <td>${row.malHizmetCinsi}</td>
        <td class="text-center">${row.malHizmetMiktari}</td>
        <td class="text-right">${row.kdvHaricTutar}</td>
        <td class="text-right">${row.kdvTutari}</td>
        <td class="text-right">${row.bunyeyeGirenKDV}</td>
        <td class="text-center">${row.ggbTescilNo}</td>
        <td>${row.iadeHakkiDoguranIslemTuru}</td>
        <td>${row.yuklenimTuru}</td>
        <td class="text-center">${row.indirimKDVDönemi}</td>
        <td class="text-center">${row.yuklenimKDVDönemi}</td>
        <td class="text-center">${row.yuklenilenMalAgirligi}</td>
      </tr>
    `).join('');

    const firmaAdi = "ÖRNEK FİRMA A.Ş.";
    const vergiDairesi = "ÖRNEK VERGİ DAİRESİ";
    const vergiNumarasi = "1234567890";
    const raporDonemi = format(new Date(), "MMMM yyyy", { locale: tr });

    return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
          <meta charset="UTF-8">
          <title>KDV İade Raporu - Yüklenilen KDV Listesi (Proje: ${projectId})</title>
          <style>
              body { font-family: 'DejaVu Sans', Arial, sans-serif; margin: 15px; font-size: 7px; }
              h1 { text-align: center; margin-bottom: 10px; font-size: 12px; }
              h2 { text-align: center; margin-bottom: 15px; font-size: 10px; font-weight: normal; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed; }
              th, td { border: 1px solid #ccc; padding: 3px; text-align: left; word-wrap: break-word; overflow-wrap: break-word; }
              th { background-color: #f0f0f0; font-size: 6.5px; font-weight: bold; }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .company-info { margin-bottom: 15px; font-size: 8px; }
              .footer { margin-top: 25px; font-size: 7px; text-align: center; }
          </style>
      </head>
      <body>
          <div class="company-info">
              <strong>Firma Adı:</strong> ${firmaAdi}<br>
              <strong>Vergi Dairesi:</strong> ${vergiDairesi}<br>
              <strong>Vergi Numarası:</strong> ${vergiNumarasi}<br>
              <strong>Rapor Dönemi:</strong> ${raporDonemi} (Proje Bazlı)
          </div>

          <h1>KDV İADE TALEBİNE İLİŞKİN YÜKLENİLEN KDV LİSTESİ</h1>

          <table>
            <thead>
              <tr>
                <th style="width: 3%;">Sıra No</th>
                <th style="width: 6%;">Alış Faturasının Tarihi</th>
                <th style="width: 7%;">Alış Faturasının Sıra No'su</th>
                <th style="width: 10%;">Satıcının Adı-Soyadı/Ünvanı</th>
                <th style="width: 7%;">Satıcının Vergi Kimlik Numarası/TC Kimlik Numarası</th>
                <th style="width: 11%;">Alınan Mal ve/veya Hizmetin Cinsi</th>
                <th style="width: 6%;">Alınan Mal ve/veya Hizmetin Miktarı</th>
                <th style="width: 7%;" class="text-right">Alış Faturasının KDV Hariç Tutarı</th>
                <th style="width: 7%;" class="text-right">Alış Faturasının KDV'si</th>
                <th style="width: 7%;" class="text-right">Bünyeye Giren Mal ve/veya Hizmetin KDV'si</th>
                <th style="width: 6%;">GGB Tescil No'su (Alış İthalat İse)</th>
                <th style="width: 7%;">Belgeye İlişkin İade Hakkı Doğuran İşlem Türü</th>
                <th style="width: 5%;">Yüklenim Türü</th>
                <th style="width: 5%;">Belgenin İndirime Konu Edildiği KDV Dönemi</th>
                <th style="width: 5%;">Belgenin Yüklenildiği KDV Dönemi</th>
                <th style="width: 5%;">Yüklenilen Malın ağırlığı</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows.length > 0 ? tableRows : '<tr><td colspan="16" class="text-center">Bu proje için KDV iadesine uygun veri bulunamadı.</td></tr>'}
            </tbody>
          </table>

          <div class="footer">
              Bu liste, KDV iade talebimiz kapsamında yüklenilen KDV tutarlarını göstermektedir. <br>
              [FİRMA YETKİLİSİ ADI SOYADI] - [ÜNVANI] - [${format(new Date(), 'dd.MM.yyyy')}]
          </div>
      </body>
      </html>
    `;
  }

  private savePDF(buffer: Buffer, projectId: number): string {
    const dirPath = path.join(__dirname,'..','..', '..', 'storage', 'expenseReports');
    const fileName = `kdv-raporu-${projectId}.pdf`;
    const fullPath = path.join(dirPath, fileName);
  
    // Klasör yoksa oluştur
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  
    // PDF dosyasını kaydet
    try{
      fs.writeFileSync(fullPath, buffer);

    }catch (error){
      console.error(error.message);
    }
  
    // Veritabanına kaydetmek için göreli path döndür
    return path.relative(path.join(__dirname, '..'), fullPath).replace(/\\/g, '/');
  }
}