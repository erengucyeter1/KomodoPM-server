import { Controller, Get, Param, Res, HttpStatus, StreamableFile } from '@nestjs/common';
import { ReportService } from './report.service';
import type { Response } from 'express'; // Express'ten Response tipini import et

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

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
      // Hata durumunda, istemciye uygun bir hata yanıtı göndermek önemlidir.
      // @Res({ passthrough: true }) kullandığımız için, burada doğrudan res ile yanıtı değiştiremeyiz.
      // Bu durumda, NestJS'in standart hata filtreleme mekanizmasının devreye girmesi için hatayı yeniden fırlatabiliriz
      // veya özel bir HttpException fırlatabiliriz.
      // Şimdilik, basitlik adına hatayı yeniden fırlatalım, bu genellikle 500 Internal Server Error ile sonuçlanır.
      // Daha kontrollü bir hata için:
      // throw new HttpException('Rapor oluşturulurken sunucuda bir hata oluştu.', HttpStatus.INTERNAL_SERVER_ERROR);
      
      // Eğer @Res() res: Response kullanıp passthrough: false (varsayılan) yapsaydık:
      // res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      //   statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      //   message: 'Rapor oluşturulurken bir hata oluştu.',
      //   error: error.message,
      // });
      // return; // void döndürmek için
      throw error; // NestJS'in global hata yakalayıcısına devret
    }
  }
}