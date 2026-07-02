import { prisma } from "@/lib/prisma";
import { Reservation } from "@prisma/client";
import LogoutButton from "./LogoutButton";
import AdminCalendar from "./AdminCalendar";

export default async function AdminDashboardPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { date: "desc" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = {
    total: reservations.filter((r: Reservation) => new Date(r.createdAt) >= today).length,
    upcoming: reservations.filter(
      (r: Reservation) => r.status === "pending" || r.status === "confirmed"
    ).length,
    completed: reservations.filter(
      (r: Reservation) => r.status === "completed" && new Date(r.date) >= today
    ).length,
    cancelled: reservations.filter((r: Reservation) => r.status === "cancelled").length,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-light text-white">Administracija rezervacija</h1>
          <p className="text-white/40">
            Pregledaj kalendar, dodaj termine i uređuj postojeće rezervacije bez skakanja po tablici.
          </p>
        </div>
        <LogoutButton />
      </div>

      <AdminCalendar
        stats={stats}
        initialReservations={reservations.map((reservation) => ({
          id: reservation.id,
          clientName: reservation.clientName,
          clientEmail: reservation.clientEmail,
          clientPhone: reservation.clientPhone,
          service: reservation.service,
          price: reservation.price,
          date: reservation.date.toISOString(),
          status: reservation.status as "pending" | "confirmed" | "completed" | "cancelled",
          notes: reservation.notes,
        }))}
      />
    </div>
  );
}
