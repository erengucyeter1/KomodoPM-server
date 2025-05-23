import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const userCount = await prisma.user.count()
  const permissionCount = await prisma.permission.count()
  const roleCount = await prisma.role.count()

  let adminPermission
  let adminRole
  let  adminUser
  // Permission ekle
  if (permissionCount === 0) {
    console.log('Permissions tablosuna veriler ekleniyor...')

    adminPermission = await prisma.permission.create({
      data: {
        name: 'admin',
        description: 'Tüm admin paneline erişim sağlar',
      },
    })

    console.log('Admin permission oluşturuldu:', adminPermission)
  } else {
    adminPermission = await prisma.permission.findUnique({
      where: { name: 'admin' },
    })
  }

  // Role ekle
  if (roleCount === 0) {
    console.log('Roles tablosuna veriler ekleniyor...')

    if (adminPermission) {
      adminRole = await prisma.role.create({
        data: {
          name: 'admin',
          description: 'Sistem yöneticisi',
          permissions: {
            connect: [{ id: adminPermission.id }],
          },
        },
      })

      console.log('Admin rolü oluşturuldu:', adminRole)
    }
  } else {
    adminRole = await prisma.role.findUnique({
      where: { name: 'admin' },
      include: { permissions: true },
    })
  }

  // Admin kullanıcıyı ekle
  if (userCount === 0) {
    console.log('User tablosuna admin kullanıcısı ekleniyor...')

    if (adminRole) {
      const hashedPassword = await bcrypt.hash('admin', 10)

      try{
        adminUser = await prisma.user.create({
          data: {
            username: 'admin',
            name: 'Admin',
            surname: 'User',
            email: 'admin@example.com',
            password: hashedPassword,
            authorization_rank: 9,
            roles: {
              connect: [{ id: adminRole.id }],
            },
          },
          include: {
            roles: true,
          },
        })

        console.log('Admin kullanıcısı oluşturuldu:', adminUser)


      }catch (error){
        console.log(error)
      }
     

    }
  } else {
    console.log('User tablosunda kullanıcı bulundu, eklenmedi.')
  }

  console.log('Seed işlemi tamamlandı.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Seed işlemi sırasında hata:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
