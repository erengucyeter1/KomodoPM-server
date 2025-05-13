// server/prisma/scripts/raw-sql.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Komut satırı argümanlarından query parametresini al
const args = process.argv.slice(2);
const queryName = args[0];

async function main() {
  try {
    console.log(`Executing query: ${queryName}`);
    
    if (queryName === 'deleteAllInvoices') {
      // Önce InvoiceDetail tablosundaki ilişkili kayıtları sil (foreign key constraint nedeniyle)
      console.log('Deleting all records from InvoiceDetail table...');
      const deletedInvoiceDetails = await prisma.$executeRaw`DELETE FROM "FaturaDetaylari"`;
      console.log(`Deleted ${deletedInvoiceDetails} records from InvoiceDetail table.`);
      
      // Sonra Invoice tablosundaki tüm kayıtları sil
      console.log('Deleting all records from Invoice table...');
      const deletedInvoices = await prisma.$executeRaw`DELETE FROM "Faturalar"`;
      console.log(`Deleted ${deletedInvoices} records from Invoice table.`);
      
      console.log('All Invoice records and their details have been deleted successfully.');
    }else if (queryName === 'deleteAllProducts') {
      console.log('Deleting all records from Product table...');
      const deletedProducts = await prisma.$executeRaw`DELETE FROM "Products"`;
      console.log(`Deleted ${deletedProducts} records from Product table.`);
      
      console.log('All Product records have been deleted successfully.');
    }else if (queryName === 'deleteProjectExpenses') {
      console.log('Deleting all records from ProjectExpenses table...');
      const deletedProjectExpenses = await prisma.$executeRaw`DELETE FROM "project_expenses"`;
      console.log(`Deleted ${deletedProjectExpenses} records from ProjectExpenses table.`);
      
      console.log('All ProjectExpenses records have been deleted successfully.');
    }
    
    else {
      console.error(`Unknown query: ${queryName}`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Error executing SQL query:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });