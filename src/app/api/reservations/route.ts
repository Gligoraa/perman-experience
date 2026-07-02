/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const normalizedRole =
    typeof role === "string" ? role.trim().toLowerCase() : role;

  if (!session || normalizedRole !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const filter = status ? { status } : {};

  try {
    const reservations = await prisma.reservation.findMany({
      where: filter,
      orderBy: { date: "desc" },
    });
    return NextResponse.json(reservations);
  } catch {
    return NextResponse.json(
      { error: "Gre\u0161ka pri dohva\u0107anju rezervacija" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const reservationDate = new Date(data.date);

    if (
      !data.clientName ||
      !data.clientEmail ||
      !data.clientPhone ||
      !data.service ||
      !Number.isInteger(data.price) ||
      Number.isNaN(reservationDate.getTime())
    ) {
      return NextResponse.json(
        { error: "Nedostaju obavezni podaci za rezervaciju." },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        clientName: String(data.clientName).trim(),
        clientEmail: String(data.clientEmail).trim(),
        clientPhone: String(data.clientPhone).trim(),
        service: String(data.service).trim(),
        price: data.price,
        date: reservationDate,
        notes: data.notes ? String(data.notes).trim() : null,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gre\u0161ka pri kreiranju rezervacije" },
      { status: 500 }
    );
  }
}
