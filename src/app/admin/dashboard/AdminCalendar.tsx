"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { hr } from "date-fns/locale";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Clock3,
  Pencil,
  Save,
  UserRound,
  X,
} from "lucide-react";
import { businessData } from "@/config/business-config";
import DatePopover from "@/components/DatePopover";
import { formatDateKey, getAvailableTimeSlots, TIME_SLOTS } from "@/lib/availability";

type ReservationStatus = "pending" | "confirmed" | "completed" | "cancelled";

type ReservationItem = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  price: number;
  date: string;
  status: ReservationStatus;
  notes: string | null;
};

type DashboardStats = {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
};

type FormState = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  price: number;
  date: string;
  time: string;
  status: ReservationStatus;
  notes: string;
};

const serviceOptions = businessData.services.map((service) => ({
  label: service.name,
  price: Math.round(
    Number.parseFloat(service.price.replace(",", ".").replace(/[^\d.]/g, "")) * 100
  ),
}));

const weekdayLabels = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

const statusStyles: Record<ReservationStatus, string> = {
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  confirmed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  completed: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  cancelled: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

const statusLabels: Record<ReservationStatus, string> = {
  pending: "Na čekanju",
  confirmed: "Potvrđeno",
  completed: "Završeno",
  cancelled: "Otkazano",
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function getDefaultForm(date: Date): FormState {
  const defaultService = serviceOptions[0];

  return {
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    service: defaultService?.label ?? "",
    price: defaultService?.price ?? 0,
    date: format(date, "yyyy-MM-dd"),
    time: "09:00",
    status: "pending",
    notes: "",
  };
}

export default function AdminCalendar({
  initialReservations,
  stats,
}: {
  initialReservations: ReservationItem[];
  stats: DashboardStats;
}) {
  const [reservations, setReservations] = useState(initialReservations);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(() => getDefaultForm(new Date()));
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    return eachDayOfInterval({
      start: startOfWeek(monthStart, { weekStartsOn: 1 }),
      end: endOfWeek(monthEnd, { weekStartsOn: 1 }),
    });
  }, [currentMonth]);

  const reservationsByDay = useMemo(() => {
    return reservations.reduce<Record<string, ReservationItem[]>>((acc, reservation) => {
      const key = format(parseISO(reservation.date), "yyyy-MM-dd");
      acc[key] ??= [];
      acc[key].push(reservation);
      acc[key].sort((a, b) => a.date.localeCompare(b.date));
      return acc;
    }, {});
  }, [reservations]);

  const selectedDateKey = format(selectedDate, "yyyy-MM-dd");
  const selectedReservations = reservationsByDay[selectedDateKey] ?? [];

  const calendarSummary = useMemo(() => {
    return {
      monthReservations: reservations.filter((reservation) =>
        isSameMonth(parseISO(reservation.date), currentMonth)
      ).length,
      monthRevenue: reservations
        .filter(
          (reservation) =>
            isSameMonth(parseISO(reservation.date), currentMonth) &&
            reservation.status !== "cancelled"
        )
        .reduce((sum, reservation) => sum + reservation.price, 0),
    };
  }, [currentMonth, reservations]);

  const adminBookedTimes = useMemo(() => {
    return reservations
      .filter((reservation) => {
        if (reservation.status === "cancelled") {
          return false;
        }

        if (editingId && reservation.id === editingId) {
          return false;
        }

        return formatDateKey(reservation.date) === form.date;
      })
      .map((reservation) => format(parseISO(reservation.date), "HH:mm"));
  }, [editingId, form.date, reservations]);

  const adminAvailableTimes = useMemo(
    () =>
      getAvailableTimeSlots(adminBookedTimes, {
        excludeTime: editingId ? form.time : undefined,
      }),
    [adminBookedTimes, editingId, form.time]
  );

  useEffect(() => {
    if (!form.time) {
      return;
    }

    if (editingId) {
      return;
    }

    if (!adminAvailableTimes.includes(form.time)) {
      setForm((current) => ({ ...current, time: "" }));
    }
  }, [adminAvailableTimes, editingId, form.time]);

  const resetForm = (date = selectedDate) => {
    setEditingId(null);
    setForm(getDefaultForm(date));
    setError(null);
    setFeedback(null);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(startOfDay(date));
    if (!editingId) {
      setForm((current) => ({
        ...current,
        date: format(date, "yyyy-MM-dd"),
      }));
    }
  };

  const beginCreate = () => {
    resetForm(selectedDate);
  };

  const beginEdit = (reservation: ReservationItem) => {
    const reservationDate = parseISO(reservation.date);

    setEditingId(reservation.id);
    setSelectedDate(startOfDay(reservationDate));
    setForm({
      clientName: reservation.clientName,
      clientEmail: reservation.clientEmail,
      clientPhone: reservation.clientPhone,
      service: reservation.service,
      price: reservation.price,
      date: format(reservationDate, "yyyy-MM-dd"),
      time: format(reservationDate, "HH:mm"),
      status: reservation.status,
      notes: reservation.notes ?? "",
    });
    setError(null);
    setFeedback(null);
  };

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleServiceChange = (value: string) => {
    const matchedService = serviceOptions.find((service) => service.label === value);

    setForm((current) => ({
      ...current,
      service: value,
      price: matchedService?.price ?? current.price,
    }));
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setFeedback(null);

    try {
      const reservationDate = new Date(`${form.date}T${form.time}:00`);

      if (Number.isNaN(reservationDate.getTime())) {
        throw new Error("Datum ili vrijeme nisu ispravni.");
      }

      const payload = {
        clientName: form.clientName.trim(),
        clientEmail: form.clientEmail.trim(),
        clientPhone: form.clientPhone.trim(),
        service: form.service,
        price: form.price,
        date: reservationDate.toISOString(),
        status: form.status,
        notes: form.notes.trim(),
      };

      const response = await fetch(
        editingId ? `/api/reservations/${editingId}` : "/api/reservations",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error ?? "Nešto je pošlo po zlu.");
      }

      const normalizedReservation: ReservationItem = {
        id: result.id,
        clientName: result.clientName,
        clientEmail: result.clientEmail,
        clientPhone: result.clientPhone,
        service: result.service,
        price: result.price,
        date: result.date,
        status: result.status,
        notes: result.notes,
      };

      setReservations((current) => {
        if (editingId) {
          return current.map((reservation) =>
            reservation.id === editingId ? normalizedReservation : reservation
          );
        }

        return [...current, normalizedReservation].sort((a, b) => a.date.localeCompare(b.date));
      });

      setSelectedDate(startOfDay(parseISO(normalizedReservation.date)));
      setFeedback(editingId ? "Termin je ažuriran." : "Termin je dodan.");
      resetForm(startOfDay(parseISO(normalizedReservation.date)));
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Nešto je pošlo po zlu prilikom spremanja."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const updateReservationStatus = async (reservationId: string, status: ReservationStatus) => {
    setError(null);
    setFeedback(null);

    const response = await fetch(`/api/reservations/${reservationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setError(result?.error ?? "Status nije moguće promijeniti.");
      return;
    }

    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status: result.status } : reservation
      )
    );
    setFeedback("Status termina je ažuriran.");
  };

  const deleteReservation = async (reservationId: string) => {
    if (!confirm("Jesi li siguran da želiš obrisati ovaj termin?")) {
      return;
    }

    setError(null);
    setFeedback(null);

    const response = await fetch(`/api/reservations/${reservationId}`, {
      method: "DELETE",
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setError(result?.error ?? "Termin nije moguće obrisati.");
      return;
    }

    setReservations((current) => current.filter((reservation) => reservation.id !== reservationId));

    if (editingId === reservationId) {
      resetForm(selectedDate);
    }

    setFeedback("Termin je obrisan.");
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Danas uneseno</p>
          <p className="mt-3 text-4xl font-light text-white">{stats.total}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Aktivni termini</p>
          <p className="mt-3 text-4xl font-light text-amber-400">{stats.upcoming}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Ovaj mjesec</p>
          <p className="mt-3 text-4xl font-light text-white">{calendarSummary.monthReservations}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Prihod mjeseca</p>
          <p className="mt-3 text-3xl font-light text-emerald-400">
            {formatCurrency(calendarSummary.monthRevenue)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.45fr)_420px]">
        <section className="rounded-[32px] border border-white/10 bg-zinc-950 p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-white/5 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-amber-500">Admin kalendar</p>
              <h2 className="mt-2 text-3xl font-light text-white">
                {format(currentMonth, "LLLL yyyy.", { locale: hr })}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
                aria-label="Prethodni mjesec"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  setCurrentMonth(startOfMonth(today));
                  selectDate(today);
                }}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Danas
              </button>
              <button
                onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
                aria-label="Sljedeći mjesec"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-3 grid grid-cols-7 gap-3">
            {weekdayLabels.map((label) => (
              <div
                key={label}
                className="px-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-white/35"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {calendarDays.map((day) => {
              const dayKey = format(day, "yyyy-MM-dd");
              const dayReservations = reservationsByDay[dayKey] ?? [];
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonthDay = isSameMonth(day, currentMonth);

              return (
                <button
                  key={dayKey}
                  onClick={() => selectDate(day)}
                  className={`min-h-[118px] rounded-3xl border p-3 text-left transition ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/12 shadow-lg shadow-amber-500/10"
                      : "border-white/8 bg-black/30 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isCurrentMonthDay ? "text-white" : "text-white/25"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    {dayReservations.length > 0 && (
                      <span className="rounded-full bg-white/8 px-2 py-1 text-[10px] font-bold text-white/65">
                        {dayReservations.length}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    {dayReservations.slice(0, 3).map((reservation) => (
                      <div
                        key={reservation.id}
                        className={`rounded-2xl border px-2 py-1.5 text-[11px] ${statusStyles[reservation.status]}`}
                      >
                        <div className="font-semibold">{format(parseISO(reservation.date), "HH:mm")}</div>
                        <div className="truncate text-white/80">{reservation.clientName}</div>
                      </div>
                    ))}
                    {dayReservations.length > 3 && (
                      <div className="text-[11px] text-white/40">
                        +{dayReservations.length - 3} više termina
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-black/35 p-5">
            <div className="flex flex-col gap-4 border-b border-white/5 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Odabrani dan</p>
                <h3 className="mt-2 text-2xl font-light text-white">
                  {format(selectedDate, "EEEE, d. MMMM yyyy.", { locale: hr })}
                </h3>
              </div>
              <button
                onClick={beginCreate}
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
              >
                <CirclePlus className="h-4 w-4" />
                Dodaj termin
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {selectedReservations.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 px-5 py-10 text-center text-white/35">
                  Nema termina za ovaj dan. Dodaj prvi u panelu desno.
                </div>
              ) : (
                selectedReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="rounded-3xl border border-white/10 bg-zinc-950/80 p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                            {format(parseISO(reservation.date), "HH:mm")}
                          </span>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[reservation.status]}`}
                          >
                            {statusLabels[reservation.status]}
                          </span>
                        </div>

                        <div>
                          <p className="text-lg font-semibold text-white">{reservation.clientName}</p>
                          <p className="text-sm text-white/45">{reservation.clientEmail}</p>
                          <p className="text-sm text-white/45">{reservation.clientPhone}</p>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-white/65">
                          <span className="inline-flex items-center gap-2">
                            <Clock3 className="h-4 w-4" />
                            {reservation.service}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {formatCurrency(reservation.price)}
                          </span>
                        </div>

                        {reservation.notes && (
                          <p className="max-w-2xl rounded-2xl bg-white/5 px-3 py-2 text-sm text-white/55">
                            {reservation.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => beginEdit(reservation)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
                        >
                          <Pencil className="h-4 w-4" />
                          Uredi
                        </button>
                        {reservation.status !== "confirmed" && reservation.status !== "completed" && (
                          <button
                            onClick={() => updateReservationStatus(reservation.id, "confirmed")}
                            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 transition hover:bg-emerald-500/20"
                          >
                            Potvrdi
                          </button>
                        )}
                        {reservation.status !== "completed" && reservation.status !== "cancelled" && (
                          <button
                            onClick={() => updateReservationStatus(reservation.id, "completed")}
                            className="rounded-2xl border border-slate-500/20 bg-slate-500/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-500/20"
                          >
                            Završi
                          </button>
                        )}
                        {reservation.status !== "cancelled" && (
                          <button
                            onClick={() => updateReservationStatus(reservation.id, "cancelled")}
                            className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/20"
                          >
                            Otkaži
                          </button>
                        )}
                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:bg-rose-500/20 hover:text-rose-200"
                        >
                          Obriši
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <aside className="rounded-[32px] border border-white/10 bg-zinc-950 p-6">
          <div className="flex items-start justify-between border-b border-white/5 pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-amber-500">
                {editingId ? "Uređivanje termina" : "Novi termin"}
              </p>
              <h3 className="mt-2 text-2xl font-light text-white">
                {editingId ? "Ažuriraj rezervaciju" : "Dodaj rezervaciju"}
              </h3>
            </div>
            {editingId && (
              <button
                onClick={() => resetForm(selectedDate)}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
                aria-label="Odustani od uređivanja"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <form onSubmit={submitForm} className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.3em] text-white/40">Klijent</span>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                <input
                  value={form.clientName}
                  onChange={(event) => setField("clientName", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-white outline-none transition focus:border-amber-500/50"
                  placeholder="Ime i prezime"
                  required
                />
              </div>
            </label>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.3em] text-white/40">E-mail</span>
                <input
                  value={form.clientEmail}
                  onChange={(event) => setField("clientEmail", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-amber-500/50"
                  placeholder="mail@primjer.hr"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.3em] text-white/40">Telefon</span>
                <input
                  value={form.clientPhone}
                  onChange={(event) => setField("clientPhone", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-amber-500/50"
                  placeholder="+385..."
                  required
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.3em] text-white/40">Usluga</span>
              <select
                value={form.service}
                onChange={(event) => handleServiceChange(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-amber-500/50"
              >
                {serviceOptions.map((service) => (
                  <option key={service.label} value={service.label}>
                    {service.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.3em] text-white/40">Datum</span>
                <DatePopover
                  value={form.date}
                  onChange={(value) => {
                    setField("date", value);
                    setSelectedDate(startOfDay(new Date(`${value}T00:00:00`)));
                  }}
                  label="Datum termina"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.3em] text-white/40">Vrijeme</span>
                <input
                  type="time"
                  value={form.time}
                  onChange={(event) => setField("time", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-amber-500/50"
                  required
                />
              </label>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                  Slobodna vremena
                </span>
                <span className="text-xs text-white/30">
                  Slobodno {adminAvailableTimes.length} / {TIME_SLOTS.length}
                </span>
              </div>

              {adminAvailableTimes.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {adminAvailableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setField("time", time)}
                      className={`rounded-xl border px-2 py-2 text-sm transition ${
                        form.time === time
                          ? "border-amber-500 bg-amber-500 text-black"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/40">
                  Nema slobodnih termina za odabrani datum.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.3em] text-white/40">Status</span>
                <select
                  value={form.status}
                  onChange={(event) => setField("status", event.target.value as ReservationStatus)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-amber-500/50"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.3em] text-white/40">Cijena</span>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={form.price}
                  onChange={(event) => setField("price", Number(event.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-amber-500/50"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.3em] text-white/40">Napomena</span>
              <textarea
                value={form.notes}
                onChange={(event) => setField("notes", event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-amber-500/50"
                placeholder="Frizer, dodatne napomene, posebni zahtjevi..."
              />
            </label>

            {error && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}

            {feedback && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {feedback}
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-white/5 pt-5">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {isSaving
                  ? "Spremanje..."
                  : editingId
                    ? "Spremi promjene"
                    : "Dodaj termin"}
              </button>

              <button
                type="button"
                onClick={beginCreate}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Očisti formu
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
