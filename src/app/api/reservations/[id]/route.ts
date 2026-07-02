/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const normalizedRole =
    typeof role === "string" ? role.trim().toLowerCase() : role;

  if (!session || normalizedRole !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { status } = data;
    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];

    if (typeof status !== "string" || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Neispravan status rezervacije" },
        { status: 400 }
      );
    }

    const updateData: {
      status: string;
      clientName?: string;
      clientEmail?: string;
      clientPhone?: string;
      service?: string;
      price?: number;
      date?: Date;
      notes?: string | null;
    } = {
      status,
    };

    if (
      "clientName" in data ||
      "clientEmail" in data ||
      "clientPhone" in data ||
      "service" in data ||
      "price" in data ||
      "date" in data ||
      "notes" in data
    ) {
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
          { error: "Nedostaju obavezni podaci za ažuriranje termina" },
          { status: 400 }
        );
      }

      updateData.clientName = String(data.clientName).trim();
      updateData.clientEmail = String(data.clientEmail).trim();
      updateData.clientPhone = String(data.clientPhone).trim();
      updateData.service = String(data.service).trim();
      updateData.price = data.price;
      updateData.date = reservationDate;
      updateData.notes = data.notes ? String(data.notes).trim() : null;
    }

    const updated = await prisma.reservation.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Greška pri ažuriranju rezervacije" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const normalizedRole =
    typeof role === "string" ? role.trim().toLowerCase() : role;

  if (!session || normalizedRole !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.reservation.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Greška pri brisanju rezervacije" },
      { status: 500 }
    );
  }
}
