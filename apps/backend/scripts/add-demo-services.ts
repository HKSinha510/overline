import { PrismaClient } from '@prisma/client';

async function addServicesToDemo() {
  const prisma = new PrismaClient();
  
  try {
    // Find all shops without services
    const shopsWithoutServices = await prisma.shop.findMany({
      where: {
        services: {
          none: {}
        }
      }
    });
    
    console.log(`Found ${shopsWithoutServices.length} shops without services`);
    
    const salonServices = [
      { name: 'Haircut - Men', description: 'Professional haircut with styling', durationMinutes: 30, price: 400, sortOrder: 1 },
      { name: 'Haircut - Women', description: 'Stylish cut with wash and blow dry', durationMinutes: 45, price: 800, sortOrder: 2 },
      { name: 'Hair Color', description: 'Premium hair coloring services', durationMinutes: 90, price: 2500, sortOrder: 3 },
      { name: 'Beard Trim', description: 'Professional beard trimming and styling', durationMinutes: 15, price: 200, sortOrder: 4 },
      { name: 'Hair Spa', description: 'Deep conditioning hair treatment', durationMinutes: 60, price: 1500, sortOrder: 5 },
      { name: 'Facial', description: 'Refreshing facial treatment', durationMinutes: 45, price: 800, sortOrder: 6 },
    ];
    
    for (const shop of shopsWithoutServices) {
      console.log(`Adding services to: ${shop.name}`);
      for (const service of salonServices) {
        await prisma.service.create({
          data: { shopId: shop.id, ...service }
        });
      }
    }
    
    console.log('Done! Added services to all shops.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addServicesToDemo();
