const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const booking = await prisma.booking.findFirst({
    where: { customerName: "Cron Test User" }
  });
  
  if (!booking) {
    console.log("Booking not found");
    return;
  }
  
  // Set to CONFIRMED and 20 mins in past
  const pastDate = new Date(Date.now() - 20 * 60000);
  
  await prisma.booking.update({
    where: { id: booking.id },
    data: { 
      status: 'CONFIRMED',
      startTime: pastDate
    }
  });
  
  console.log(`Updated booking ${booking.id} to CONFIRMED and startTime to ${pastDate}`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
