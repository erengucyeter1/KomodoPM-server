import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Tablolarda veri var mı kontrol et
  const userCount = await prisma.user.count()
  const permissionCount = await prisma.permissions.count()
  const roleCount = await prisma.role.count()

  // İzinleri ekle (eğer yoksa)
  if (permissionCount === 0) {
    console.log('Permissions tablosuna veriler ekleniyor...')
    
    const adminPermission = await prisma.permissions.create({
      data: {
        name: 'admin',
        description: 'Tüm admin paneline erişim sağlar'
      }
    })
    
    console.log('Admin permission oluşturuldu:', adminPermission)
  }

  // Rolleri ekle (eğer yoksa)
  if (roleCount === 0) {
    console.log('Role tablosuna veriler ekleniyor...')
    
    // Önce izinleri al
    const adminPermission = await prisma.permissions.findFirst({
      where: { name: 'admin' }
    })

    if (adminPermission) {
      const adminRole = await prisma.role.create({
        data: {
          name: 'admin',
          description: 'Sistem yöneticisi',
          // İzinleri bir dizi olarak ekle
          permissions: [adminPermission.id]
        }
      })
      
      console.log('Admin role oluşturuldu:', adminRole)
    }
  }

  // Admin kullanıcısı ekle (eğer yoksa)
  if (userCount === 0) {
    console.log('User tablosuna admin kullanıcısı ekleniyor...')
    
    // Admin rolünü bul
    const adminRole = await prisma.role.findFirst({
      where: { name: 'admin' }
    })

    if (adminRole) {
      // Şifreyi hash'le
      const hashedPassword = await bcrypt.hash('admin', 10)
      
      const adminUser = await prisma.user.create({
        data: {
          username: 'admin',
          name: 'Admin',         
          surname: 'User',       
          email: 'admin@example.com',
          password: hashedPassword,
          // Eksik olan authorization_rank alanını ekle - en yüksek yetki için 100 değeri verelim
          authorization_rank: 9,
          // Roller bir dizi olarak ekleniyor
          roles: [Number(adminRole.id)],
          permissions: adminRole.permissions // İzinleri de ekle,
        }
      })
      
      console.log('Admin kullanıcısı oluşturuldu:', adminUser)
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
