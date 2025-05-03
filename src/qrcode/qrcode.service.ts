import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { createCanvas, loadImage, Canvas } from 'canvas';
import { logoBase64 } from './logo';

@Injectable()
export class QrcodeService {
  
  async generateQrcode(code: string, mesurement:string): Promise<Buffer> {
    // Create a canvas with higher resolution for better print quality
    // Add extra height for the license plate text at the bottom
    const qrSize = 800; // QR code size
    const padding = 40; // Padding around QR code
    const plateHeight = 120; // Height of the license plate area
    const canvasWidth = qrSize + (padding * 2);
    const canvasHeight = qrSize + (padding * 2) + plateHeight;
    
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    
    // Fill background with white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Generate QR code as data URL

    const qrText = code+";"+mesurement;

    const qrDataURL = await QRCode.toDataURL(qrText, {
      errorCorrectionLevel: 'H', // High error correction for better readability
      margin: 0, // We're adding our own padding
      width: qrSize,
      color: {
        dark: '#000000',  // Black dots
        light: '#FFFFFF'  // White background
      }
    });
    
    // Load the QR code image onto canvas
    const qrImage = await loadImage(qrDataURL);
    ctx.drawImage(qrImage, padding, padding, qrSize, qrSize);
    // Draw license plate at the bottom
    const plateY = qrSize + (padding * 2);
    const plateWidth = canvasWidth - (padding * 2);
    
    // Draw license plate background (rounded rectangle)
    ctx.fillStyle = '#E7E7E7'; // Light gray background
    this.roundRect(ctx, padding - 3, plateY - 20, plateWidth, plateHeight, 10, true);
    
    // Add black border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    // Add some space from the bottom
    const bottomMargin = 20;
    const adjustedPlateY = plateY - bottomMargin;
    
    // Draw the border with adjusted position
    this.roundRect(ctx, padding -3, adjustedPlateY, plateWidth, plateHeight, 10, false, true);
    
    // Add text to the license plate
    ctx.fillStyle = '#000000'; // Black text
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Calculate center position for the text more precisely
    // Use the full width of the plate for better centering
    const textX = padding + (plateWidth / 2);
    const textY = adjustedPlateY + (plateHeight / 2);
    
    // Draw the text
    const infoText = code + " - " + mesurement;
    
    // Check if text might be too long for the plate
    const textMetrics = ctx.measureText(infoText);
    if (textMetrics.width > (plateWidth - 40)) {
      // If text is too long, reduce the font size
      const fontSize = Math.min(60, Math.floor((plateWidth - 40) / textMetrics.width * 60));
      ctx.font = `bold ${fontSize}px Arial`;
    }
    
    ctx.fillText(infoText, textX, textY);


    // add logo to center of qr code
  // add logo to center of qr code
  try {
    // Calculate logo size (25% of QR code size is safe)
    const logoSize = qrSize * 0.25;
    const logoX = padding + (qrSize - logoSize) / 2;
    const logoY = padding + (qrSize - logoSize) / 2;
    
    // Get logo as base64 string and load it
    // Make sure the base64 string includes the data URL prefix
    const logoImageSrc = `data:image/png;base64,${logoBase64}`;
    const logoImage = await loadImage(logoImageSrc);
    
    // Draw white background for the logo (square)
    ctx.fillStyle = '#FFFFFF';
    
    // Add padding around the logo
    const logoBackgroundPadding = 10;
    ctx.fillRect(
      logoX - logoBackgroundPadding, 
      logoY - logoBackgroundPadding, 
      logoSize + (logoBackgroundPadding * 2), 
      logoSize + (logoBackgroundPadding * 2)
    );
    
    // Draw border around the logo background (square)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.strokeRect(
      logoX - logoBackgroundPadding, 
      logoY - logoBackgroundPadding, 
      logoSize + (logoBackgroundPadding * 2), 
      logoSize + (logoBackgroundPadding * 2)
    );
    
    // Draw the logo itself
    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
  } catch (error) {
    console.error('Error adding logo to QR code:', error);
    // Continue without logo if there's an error
  }




      
      // Convert canvas to buffer
      return canvas.toBuffer('image/png', {
        compressionLevel: 6,
        filters: Canvas.PNG_FILTER_NONE,
        resolution: 300 // 300 DPI for print quality
      });
    }
  
  // Helper function to draw rounded rectangles
  private roundRect(
    ctx: any,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fill: boolean = false,
    stroke: boolean = false
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }
}