import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const permissions = [
  { id: 1, name: 'admin', description: 'Tüm admin paneline erişim sağlar' },
  { id: 2, name: 'see:users', description: 'kullanıcıları görür' },
  { id: 3, name: 'see:permissions', description: 'izinleri görür' },
  { id: 4, name: 'see:role', description: 'rolleri görür' },
  { id: 5, name: 'see:projects', description: 'projeleri görür' },
  { id: 6, name: 'see:trailers', description: 'Römorkları görür' },
  { id: 7, name: 'see:stock', description: 'stokları görür' },
  { id: 8, name: 'see:chat', description: 'mesajlaşma arayüzünü görür' },
  { id: 9, name: 'see:user_details', description: 'kullanıcı detaylarını görür' },
  { id: 10, name: 'see:project_expenses', description: 'proje giderlerini görür' },
  { id: 11, name: 'see:invoices', description: 'faturaları görür' },
  { id: 12, name: 'create:projectExpenseReport', description: 'Bir projenin k.d.v iade talebi raporunu oluşturabilir.' },
  { id: 13, name: 'create:project', description: 'Yeni proje oluşturabilir.' },
  { id: 14, name: 'create:trailer', description: 'yeni römork modeli ekler' },
  { id: 15, name: 'send:message', description: 'kullanıcı mesaj gönderebilir.' },
  { id: 16, name: 'create:invoice', description: 'yeni fatura ekler' },
  { id: 17, name: 'see:partners', description: 'müşterileri ve tedarikçileri görebilir' },
  { id: 18, name: 'create:partner', description: 'yeni bir müşteri veya tedarikçi ekleyebilir.' },
  { id: 19, name: 'see:partner', description: 'seçili bir müşteriye veya tedarikçiye ait detaylı bilgileri görebilir.' },
  { id: 20, name: 'update:partner', description: 'seçili bir müşterinin veya tedarikçinin bilgilerini güncelleyebilir.' },
  { id: 21, name: 'delete:partner', description: 'seçili bir müşterinin veya tedarikçinin kaydını silebilir.' },
  { id: 22, name: 'see:projectDetail', description: 'seçili bir projenin detaylı bilgilerini  görür.' },
  { id: 23, name: 'update:projectStatus', description: 'Projenin durumunu değiştirebilir. Tamamlandı, planlandı, devam ediyor gibi.' },
  { id: 24, name: 'create:projectExpense', description: 'projeye yeni gider ekleyebilir.' },
  { id: 25, name: 'update:trailer', description: 'bir römorkun özelliklerini günceller' },
  { id: 26, name: 'delete:trailer', description: 'bir römorkun kaydını siler' },
  { id: 27, name: 'create:user', description: 'yeni bir kullanıcı ekler' },
  { id: 28, name: 'update:user', description: 'kullanıcının bilgilerini günceller' },
  { id: 29, name: 'update:projectExpense', description: 'proje giderlerinin değerini güncelleyebilir.' }
];

async function main() {
  
    await prisma.permission.createMany({
        data: permissions,
        skipDuplicates: true // varsa atla
      });
  

  console.log('✅ Permissions seeded successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
