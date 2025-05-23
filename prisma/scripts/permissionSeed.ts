import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const permissions = [
 // Kullanıcı (User) Yetkileri
{ name: 'see:users', description: 'kullanıcıları görür' },
{ name: 'see:user_details', description: 'kullanıcı detaylarını görür' },
{ name: 'create:user', description: 'yeni bir kullanıcı ekler' },
{ name: 'update:user', description: 'kullanıcının bilgilerini günceller' },

// Yetkiler (Permissions)
{ name: 'see:permissions', description: 'izinleri görür' },
{ name: 'create:permission', description: 'yeni bir izin ekler' },
{ name: 'update:permission', description: 'izinleri güncelleyebilir.' },
{ name: 'delete:permission', description: 'izinleri siler.' },

// Roller (Roles)
{ name: 'see:roles', description: 'rolleri görür' },
{ name: 'create:role', description: 'yeni bir rol ekler' },
{ name: 'update:role', description: 'rol bilgilerini güncelleyebilir.' },
{ name: 'delete:role', description: 'rol bilgilerini siler.' },

// Proje (Project) Yetkileri
{ name: 'see:projects', description: 'projeleri görür' },
{ name: 'see:projectDetail', description: 'seçili bir projenin detaylı bilgilerini  görür.' },
{ name: 'create:project', description: 'Yeni proje oluşturabilir.' },
{ name: 'update:projectStatus', description: 'Projenin durumunu değiştirebilir. Tamamlandı, planlandı, devam ediyor gibi.' },

// Proje Giderleri (Project Expenses)
{ name: 'see:project_expenses', description: 'proje giderlerini görür' },
{ name: 'create:projectExpense', description: 'projeye yeni gider ekleyebilir.' },
{ name: 'update:projectExpense', description: 'proje giderlerinin değerini güncelleyebilir.' },
{ name: 'create:projectExpenseReport', description: 'Bir projenin k.d.v iade talebi raporunu oluşturabilir.' },

// Römorklar (Trailers)
{ name: 'see:trailers', description: 'Römorkları görür' },
{ name: 'see:trailer', description: 'seçili bir römorkun detaylarını görür' },
{ name: 'create:trailer', description: 'yeni römork modeli ekler' },
{ name: 'update:trailer', description: 'bir römorkun özelliklerini günceller' },
{ name: 'delete:trailer', description: 'bir römorkun kaydını siler' },

// Stok (Stock)
{ name: 'see:stock', description: 'stokları görür' },
{ name: 'create:stock', description: 'stok eklemek için yeterlilikleri var.' },
{ name: 'update:stock', description: 'stok bilgilerini güncelleyebilir.' },
{ name: 'delete:stock', description: 'stok bilgilerini siler.' },

// Fatura (Invoice)
{ name: 'see:invoices', description: 'faturaları görür' },
{ name: 'create:invoice', description: 'yeni fatura ekler' },

// Mesajlaşma (Chat / Messaging)
{ name: 'see:chat', description: 'mesajlaşma arayüzünü görür' },
{ name: 'send:message', description: 'kullanıcı mesaj gönderebilir.' },

// İş Ortakları (Partner / Müşteri & Tedarikçi)
{ name: 'see:partners', description: 'müşterileri ve tedarikçileri görebilir' },
{ name: 'create:partner', description: 'yeni bir müşteri veya tedarikçi ekleyebilir.' },
{ name: 'see:partner', description: 'seçili bir müşteriye veya tedarikçiye ait detaylı bilgileri görebilir.' },
{ name: 'update:partner', description: 'seçili bir müşterinin veya tedarikçinin bilgilerini güncelleyebilir.' },
{ name: 'delete:partner', description: 'seçili bir müşterinin veya tedarikçinin kaydını silebilir.' },

  
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
