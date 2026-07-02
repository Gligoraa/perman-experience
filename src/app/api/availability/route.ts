import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const stylist = searchParams.get("stylist");

  if (!date) {
    return NextResponse.json(
      { error: "Datum je obavezan." },
      { status: 400 }
    );
  }

  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59.999`);

  if (Number.isNaN(dayStart.getTime())) {
    return NextResponse.json(
      { error: "Datum nije ispravan." },
      { status: 400 }
    );
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          not: "cancelled",
        },
        ...(stylist
          ? {
              notes: {
                contains: `Frizer: ${stylist}`,
              },
            }
          : {}),
      },
      orderBy: { date: "asc" },
      select: {
        date: true,
      },
    });

    return NextResponse.json({
      bookedTimes: reservations.map((reservation) =>
        reservation.date.toISOString().slice(11, 16)
      ),
    });
  } catch {
    return NextResponse.json(
      { error: "Dostupnost termina nije moguće dohvatiti." },
      { status: 500 }
    );
  }
}
