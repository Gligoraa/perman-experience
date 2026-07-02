import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const reservations = await prisma.reservation.createMany({
    data: [
      {
        clientName: "Marko Marić",
        clientEmail: "marko@example.com",
        clientPhone: "0911234567",
        service: "Šišanje",
        price: 2000,
        date: new Date(Date.now() + 86400000), // sutra
        status: "pending",
        notes: "Bez pranja kose",
      },
      {
        clientName: "Ivan Ivić",
        clientEmail: "ivan@example.com",
        clientPhone: "0987654321",
        service: "Brijanje",
        price: 1500,
        date: new Date(Date.now() + 172800000), // preksutra
        status: "confirmed",
        notes: "Klasično brijanje",
      },
      {
        clientName: "Petar Perić",
        clientEmail: "petar@example.com",
        clientPhone: "095555555",
        service: "Combo (Šišanje + Brada)",
        price: 3500,
        date: new Date(Date.now() - 3600000), // prije 1h
        status: "completed",
        notes: "Uvijek isti stil",
      },
    ],
  });
  console.log({ reservations });
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
