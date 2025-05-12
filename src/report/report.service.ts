import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs'; // Dosya sistemi için import'u etkinleştirin
import * as path from 'path'; // Path modülünü ekleyin

@Injectable()
export class ReportService {
  async generateReportAsBuffer(projectId: string): Promise<Buffer> { // Proje ID'si şimdilik kullanılmıyor ama metod imzasında kalsın
    console.log('Generating KDV Iade Raporu for projectId:', projectId);

    // Mock Data - KDV İade Raporu için
    const mockKDVData = [
      {
        siraNo: 1,
        alisFaturaTarihi: '01.04.2025',
        alisFaturaSiraNo: 'ABC000000001',
        saticiAdiUnvani: 'YILMAZ TEDARİK HİZMETLERİ A.Ş.',
        saticiVergiNoTCNo: '9876543210',
        malHizmetCinsi: 'Elektronik Devre Kartı XYZ-123',
        malHizmetMiktari: '100 Adet',
        kdvHaricTutar: '25.000,00 TL',
        kdvTutari: '5.000,00 TL',
        bunyeyeGirenKDV: '5.000,00 TL',
        ggbTescilNo: '', // Yurtiçi alım için boş
        iadeHakkiDoguranIslemTuru: 'Mal İhracatı',
        yuklenimTuru: 'Doğrudan Yüklenim',
        indirimKDVDönemi: 'Nisan 2025',
        yuklenimKDVDönemi: 'Nisan 2025',
        yuklenilenMalAgirligi: '5 kg',
      },
      {
        siraNo: 2,
        alisFaturaTarihi: '05.04.2025',
        alisFaturaSiraNo: 'DEF000000002',
        saticiAdiUnvani: 'GLOBAL LOJİSTİK LTD. ŞTİ.',
        saticiVergiNoTCNo: '1234509876',
        malHizmetCinsi: 'Uluslararası Nakliye Hizmeti (İhracat Malı İçin)',
        malHizmetMiktari: '1 Konteyner',
        kdvHaricTutar: '12.000,00 TL',
        kdvTutari: '2.400,00 TL',
        bunyeyeGirenKDV: '2.400,00 TL',
        ggbTescilNo: '',
        iadeHakkiDoguranIslemTuru: 'İhracatla İlgili Taşıma Hizmeti',
        yuklenimTuru: 'Genel Gider',
        indirimKDVDönemi: 'Nisan 2025',
        yuklenimKDVDönemi: 'Nisan 2025',
        yuklenilenMalAgirligi: '-', // Hizmet için ağırlık yok
      },
      {
        siraNo: 3,
        alisFaturaTarihi: '10.04.2025',
        alisFaturaSiraNo: 'GHI000000003',
        saticiAdiUnvani: 'TECH COMPONENTS GMBH', // Yabancı satıcı
        saticiVergiNoTCNo: 'DE999888777', // Yabancı satıcının vergi no'su
        malHizmetCinsi: 'Özel Sensör Modülü ABC-SENSOR',
        malHizmetMiktari: '50 Adet',
        kdvHaricTutar: '15.000,00 EUR', // Farklı para birimi olabilir
        kdvTutari: '0,00 EUR', // İthalatta KDV gümrükte ödenir, faturada olmayabilir
        bunyeyeGirenKDV: '4.500,00 TL', // Gümrükte ödenen KDV (TL karşılığı)
        ggbTescilNo: 'TR001234567890', // Gümrük Giriş Beyannamesi No
        iadeHakkiDoguranIslemTuru: 'Mal İhracatı',
        yuklenimTuru: 'Doğrudan Yüklenim (İthalat)',
        indirimKDVDönemi: 'Nisan 2025',
        yuklenimKDVDönemi: 'Nisan 2025',
        yuklenilenMalAgirligi: '2.5 kg',
      },
      {
        siraNo: 4,
        alisFaturaTarihi: '12.04.2025',
        alisFaturaSiraNo: 'JKL000000004',
        saticiAdiUnvani: 'DEMİR ÇELİK SANAYİ TİCARET A.Ş.',
        saticiVergiNoTCNo: '5554443332',
        malHizmetCinsi: 'Paslanmaz Çelik Levha (Üretim İçin)',
        malHizmetMiktari: '500 kg',
        kdvHaricTutar: '30.000,00 TL',
        kdvTutari: '6.000,00 TL',
        bunyeyeGirenKDV: '6.000,00 TL',
        ggbTescilNo: '',
        iadeHakkiDoguranIslemTuru: 'Mal İhracatı',
        yuklenimTuru: 'Doğrudan Yüklenim',
        indirimKDVDönemi: 'Nisan 2025',
        yuklenimKDVDönemi: 'Nisan 2025',
        yuklenilenMalAgirligi: '500 kg',
      },
      {
        siraNo: 5,
        alisFaturaTarihi: '15.04.2025',
        alisFaturaSiraNo: 'MNO000000005',
        saticiAdiUnvani: 'BİLGE YAZILIM VE DANIŞMANLIK HİZMETLERİ',
        saticiVergiNoTCNo: '1112223334',
        malHizmetCinsi: 'İhracat Süreçleri Danışmanlık Hizmeti',
        malHizmetMiktari: '10 Saat',
        kdvHaricTutar: '8.000,00 TL',
        kdvTutari: '1.600,00 TL',
        bunyeyeGirenKDV: '1.600,00 TL',
        ggbTescilNo: '',
        iadeHakkiDoguranIslemTuru: 'İhracatla İlgili Danışmanlık Hizmeti',
        yuklenimTuru: 'Genel Gider',
        indirimKDVDönemi: 'Nisan 2025',
        yuklenimKDVDönemi: 'Nisan 2025',
        yuklenilenMalAgirligi: '-',
      },
    ];

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
          <meta charset="UTF-8">
          <title>KDV İade Raporu - Yüklenilen KDV Listesi</title>
          <style>
              body { font-family: 'Arial', sans-serif; margin: 15px; font-size: 8px; }
              h1 { text-align: center; margin-bottom: 15px; font-size: 14px; }
              h2 { text-align: center; margin-bottom: 20px; font-size: 12px; font-weight: normal; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #666; padding: 4px; text-align: left; word-wrap: break-word; }
              th { background-color: #e0e0e0; font-weight: bold; text-align: center; vertical-align: middle;}
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .company-info { margin-bottom: 20px; font-size: 10px; }
              .footer { margin-top: 30px; text-align: center; font-size: 9px; border-top: 1px solid #ccc; padding-top: 10px;}
          </style>
      </head>
      <body>
          <div class="company-info">
              <strong>Firma Ünvanı:</strong> [FİRMA ÜNVANINIZ BURAYA GELECEK]<br>
              <strong>Vergi Dairesi:</strong> [VERGİ DAİRENİZ BURAYA GELECEK]<br>
              <strong>Vergi Numarası:</strong> [VERGİ NUMARANIZ BURAYA GELECEK]<br>
              <strong>Rapor Dönemi:</strong> Nisan 2025 (Örnek)
          </div>

          <h1>KDV İADE TALEBİNE İLİŞKİN YÜKLENİLEN KDV LİSTESİ</h1>
          <h2>(İhraç Edilen Malların Üretiminde Kullanılan Hammadde ve Hizmet Alımları)</h2>

          <table>
            <thead>
              <tr>
                <th>Sıra No</th>
                <th>Alış Faturasının Tarihi</th>
                <th>Alış Faturasının Sıra No'su</th>
                <th>Satıcının Adı-Soyadı veya Ünvanı</th>
                <th>Satıcının Vergi Kimlik Numarası/TC Kimlik Numarası</th>
                <th>Alınan Mal ve/veya Hizmetin Cinsi</th>
                <th>Alınan Mal ve/veya Hizmetin Miktarı</th>
                <th class="text-right">Alış Faturasının KDV Hariç Tutarı</th>
                <th class="text-right">Alış Faturasının KDV'si</th>
                <th class="text-right">Bünyeye Giren Mal ve/veya Hizmetin KDV'si</th>
                <th>GGB Tescil No'su (Alış İthalat İse)</th>
                <th>Belgeye İlişkin İade Hakkı Doğuran İşlem Türü</th>
                <th>Yüklenim Türü</th>
                <th>Belgenin İndirime Konu Edildiği KDV Dönemi</th>
                <th>Belgenin Yüklenildiği KDV Dönemi</th>
                <th>Yüklenilen Malın Ağırlığı</th>
              </tr>
            </thead>
            <tbody>
              ${mockKDVData
                .map(
                  (row) => `
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
                  <td class="text-center">${row.ggbTescilNo || '-'}</td>
                  <td>${row.iadeHakkiDoguranIslemTuru}</td>
                  <td>${row.yuklenimTuru}</td>
                  <td class="text-center">${row.indirimKDVDönemi}</td>
                  <td class="text-center">${row.yuklenimKDVDönemi}</td>
                  <td class="text-center">${row.yuklenilenMalAgirligi || '-'}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>

          <div class="footer">
              Bu liste, KDV iade talebimiz kapsamında yüklenilen KDV tutarlarını göstermektedir. <br>
              [FİRMA YETKİLİSİ ADI SOYADI] - [ÜNVANI] - [TARİH]
          </div>
      </body>
      </html>
    `;

    let browser;
    try {
      console.log('Launching Puppeteer for KDV Iade Raporu...');
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      console.log('Puppeteer launched for KDV Iade Raporu.');

      const page = await browser.newPage();
      console.log('New page created for KDV Iade Raporu.');

      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      console.log('KDV Iade Raporu content set on page.');

      const pdfBuffer = await page.pdf({
        format: 'A3', // Çok fazla sütun olduğu için A3 veya daha büyük bir özel format gerekebilir
        printBackground: true,
        landscape: true, // Yatay mod daha iyi olabilir
        margin: {
          top: '20px',
          right: '15px',
          bottom: '20px',
          left: '15px',
        },
        // scale: 0.8, // Gerekirse içeriği küçültmek için ölçek ayarı
      });
      console.log('KDV Iade Raporu PDF buffer generated. Length:', pdfBuffer.length);

      if (!pdfBuffer || pdfBuffer.length < 100) {
        throw new Error('Generated KDV Iade Raporu PDF buffer is too small or empty.');
      }

      // PDF'i sunucuda bir dosyaya kaydet (debug için)
      const outputDirectory = path.join(__dirname, '..', '..', 'generated_reports');
      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
      }


      return pdfBuffer;
    } catch (error) {
      console.error('Error during KDV Iade Raporu PDF generation in service:', error);
      throw new Error(`KDV İade Raporu oluşturulamadı: ${error.message}`);
    } finally {
      if (browser) {
        console.log('Closing browser for KDV Iade Raporu...');
        await browser.close();
        console.log('Browser closed for KDV Iade Raporu.');
      }
    }
  }
}