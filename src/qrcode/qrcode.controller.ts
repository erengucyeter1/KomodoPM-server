import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import { Response } from 'express';

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @Post()
  async create(@Body() createQrcodeDto: CreateQrcodeDto, @Res() res: Response) {
    try {
      const buffer = await this.qrcodeService.generateQrcode(createQrcodeDto.data);
      
      // Set proper headers for PNG image
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="qrcode-${createQrcodeDto.data}.png"`);
      res.setHeader('Content-Length', buffer.length);
      
      // Send the buffer as a PNG image
      return res.status(HttpStatus.OK).send(buffer);
    } catch (error) {
      console.error('QR Code generation error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'QR kod oluşturulurken bir hata oluştu.',
        error: error.message
      });
    }
  }
}
