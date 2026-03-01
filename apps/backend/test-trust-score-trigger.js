const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const user = await prisma.user.findUnique({
        where: { email: 'trust@score.com' }
    });

    if (!user) {
        console.log("Test user 'trust@score.com' not found.");
        return;
    }

    const bookings = await prisma.booking.findMany({
        where: { userId: user.id },
        select: { status: true }
    });

    const totalBookings = bookings.length;
    let completedBookings = 0;
    let cancelledBookings = 0;
    let noShowBookings = 0;

    for (const b of bookings) {
        if (b.status === 'COMPLETED') completedBookings++;
        if (b.status === 'CANCELLED') cancelledBookings++;
        if (b.status === 'NO_SHOW') noShowBookings++;
    }

    const completionWeight = 1.0;
    const cancellationWeight = 0.5;

    const weightedScore = (
        (completedBookings * completionWeight) +
        (cancelledBookings * cancellationWeight)
    ) / totalBookings;

    const trustScore = Math.max(0, Math.min(100, Math.round(weightedScore * 100)));

    await prisma.user.update({
        where: { id: user.id },
        data: {
            trustScore,
            totalBookings,
            completedBookings,
            cancelledBookings,
            noShowBookings,
        },
    });

    const check = await prisma.user.findUnique({ where: { id: user.id } });
    console.log(`Trust Score calculated constraints:\n - Total: ${check.totalBookings}\n - Completed: ${check.completedBookings}\n - Cancelled: ${check.cancelledBookings}\n - TrustScore: ${check.trustScore}%`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
