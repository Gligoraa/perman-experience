const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users found:", users.map(u => ({ email: u.email, role: u.role })));
    const reservations = await prisma.reservation.count();
    console.log("Reservations count:", reservations);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
