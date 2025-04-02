// scripts/apply-triggers.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // 1. Trigger fonksiyonunu oluştur
    console.log('Creating function...');
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION update_user_permissions_from_roles()
      RETURNS TRIGGER AS $$
      BEGIN
          -- Kullanıcının permissions alanını sıfırla
          NEW.permissions = '{}';
          
          -- Kullanıcının her rolü için ilgili izinleri ekle
          IF array_length(NEW.roles, 1) > 0 THEN
              -- Rollerin permissions değerlerini topla
              NEW.permissions = (
                  SELECT array_agg(DISTINCT p)
                  FROM (
                      SELECT unnest(permissions) AS p
                      FROM role
                      WHERE id = ANY(NEW.roles::bigint[])
                  ) AS permissions_list
              );
              
              -- Null durumunu kontrol et
              IF NEW.permissions IS NULL THEN
                  NEW.permissions = '{}';
              END IF;
          END IF;
          
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    // 2. Mevcut trigger'ı varsa kaldır
    console.log('Dropping existing trigger if any...');
    await prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS update_user_permissions_trigger ON "user";
    `);
    
    // 3. Yeni trigger'ı oluştur
    console.log('Creating new trigger...');
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER update_user_permissions_trigger
      BEFORE INSERT OR UPDATE OF roles ON "user"
      FOR EACH ROW
      EXECUTE FUNCTION update_user_permissions_from_roles();
    `);
    
    console.log('Database triggers applied successfully');
  } catch (error) {
    console.error('Error executing SQL:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error applying triggers:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });