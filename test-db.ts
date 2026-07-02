import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.reservation.count();
  console.log('Reservation count:', count);
  const user = await prisma.user.findFirst();
  console.log('First user:', user?.email);
}
main();
