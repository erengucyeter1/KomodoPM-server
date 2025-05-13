import { Controller, Get, Param, Res, ParseIntPipe, HttpStatus, StreamableFile } from '@nestjs/common';
import { ReportService } from './report.service';
import type { Response } from 'express'; // Express'ten Response tipini import et

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
/*
  @Get('project/:projectId')
  async getProjectReport(
    @Param('projectId') projectId: string,
    @Res({ passthrough: true }) res: Response, // passthrough: true ile NestJS'in varsayılan yanıt işleyicisini kullanabiliriz
  ): Promise<StreamableFile> { // StreamableFile döndürmek NestJS için daha idiomatiktir
    try {
      const pdfBuffer = await this.reportService.generateReportAsBuffer(projectId);

      // Yanıt başlıklarını ayarla
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="rapor-${projectId}.pdf"`); // Dosya adını tırnak içine almak özel karakter sorunlarını önleyebilir
      res.setHeader('Content-Length', pdfBuffer.length.toString()); // İçerik uzunluğunu belirt

      // Buffer'ı StreamableFile olarak döndür
      // Bu, NestJS'in stream'i düzgün bir şekilde yönetmesini sağlar.
      // Alternatif olarak doğrudan res.send(pdfBuffer) da kullanılabilir ama StreamableFile daha temizdir.
      return new StreamableFile(pdfBuffer);

    } catch (error) {
      console.error('Error in ReportController while generating report:', error);
      throw error; // NestJS'in global hata yakalayıcısına devret
    }
  } */
/*
  @Get('v2/project/:projectId')
  async getProjectReportV2(
    @Param('projectId') projectId: number,
    @Res({ passthrough: true }) res: Response,
  ) {

    this.reportService.findInvoiceDetailsByProjectId(projectId)

    return null;

  }*/

  @Get('project/:projectId/kdv-iade')
  async getProjectKdvReturnReport(
    @Param('projectId') projectIdString: string,
    @Res({ passthrough: true }) res: Response, // passthrough: true ekle
  ): Promise<StreamableFile> { // Dönüş tipini Promise<StreamableFile> yap
    try {
      const pdfBuffer = await this.reportService.generateReportAsBuffer(projectIdString);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="kdv_iade_raporu_proje_${projectIdString}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length.toString()); // Content-Length ekle

      return new StreamableFile(pdfBuffer); // StreamableFile olarak döndür

    } catch (error) {
      console.error('Rapor oluşturulurken kontrolcüde hata (kdv-iade):', error);
      // @Res({ passthrough: true }) kullanıldığında, NestJS'in global hata
      // yakalayıcısının devreye girmesi için hatayı yeniden fırlatmak daha iyidir.
      // Özel bir yanıt göndermek istiyorsanız, passthrough: true olmadan
      // res.status().send() kullanmanız gerekir.
      throw error;
      /*
      // Eski hata yönetimi (passthrough: true ile bu kısım genellikle kullanılmaz)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Rapor oluşturulurken bir sunucu hatası oluştu.',
      });
      // Bu durumda Promise<StreamableFile> yerine Promise<void> veya any dönebilirsiniz
      // ama StreamableFile ile tutarlı olması için hatayı fırlatmak daha iyi.
      */
    }
  }
}