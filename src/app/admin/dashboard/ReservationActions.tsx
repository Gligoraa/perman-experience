"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Trash2 } from "lucide-react";

export default function ReservationActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    router.refresh();
  };

  const deleteReservation = async () => {
    if (!confirm("Jeste li sigurni da \u017eelite obrisati ovu rezervaciju?")) return;

    setLoading(true);
    await fetch(`/api/reservations/${id}`, {
      method: "DELETE",
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex justify-end gap-2">
      {status === "pending" && (
        <button
          onClick={() => updateStatus("confirmed")}
          disabled={loading}
          className="rounded-lg bg-green-500/10 p-2 text-green-500 transition-colors hover:bg-green-500 hover:text-black disabled:opacity-50"
          title="Potvrdi"
        >
          <Check className="h-4 w-4" />
        </button>
      )}
      {(status === "pending" || status === "confirmed") && (
        <button
          onClick={() => updateStatus("cancelled")}
          disabled={loading}
          className="rounded-lg bg-red-500/10 p-2 text-red-500 transition-colors hover:bg-red-500 hover:text-black disabled:opacity-50"
          title="Otka\u017ei"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {(status === "cancelled" || status === "completed") && (
        <button
          onClick={deleteReservation}
          disabled={loading}
          className="rounded-lg bg-zinc-800 p-2 text-zinc-400 transition-colors hover:bg-red-500 hover:text-black disabled:opacity-50"
          title="Obri\u0161i"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
