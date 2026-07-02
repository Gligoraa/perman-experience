"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfToday,
  startOfWeek,
  subMonths,
} from "date-fns";
import { hr } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type DatePopoverProps = {
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  label?: string;
};

const WEEKDAY_LABELS = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

export default function DatePopover({
  value,
  onChange,
  minDate,
  label = "Odaberi datum",
}: DatePopoverProps) {
  const initialDate = value ? parseISO(value) : startOfToday();
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(startOfMonth(initialDate));

  const minSelectableDate = useMemo(
    () => (minDate ? parseISO(`${minDate}T00:00:00`) : null),
    [minDate]
  );

  const days = useMemo(() => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    return eachDayOfInterval({
      start: startOfWeek(monthStart, { weekStartsOn: 1 }),
      end: endOfWeek(monthEnd, { weekStartsOn: 1 }),
    });
  }, [month]);

  const selectedDate = value ? parseISO(`${value}T00:00:00`) : null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-left text-white transition hover:bg-white/5 focus:border-amber-500/50 focus:outline-none"
      >
        <span>
          <span className="mb-1 block text-xs uppercase tracking-[0.3em] text-white/35">
            {label}
          </span>
          <span className="text-sm font-medium">
            {selectedDate
              ? format(selectedDate, "EEEE, d. MMMM yyyy.", { locale: hr })
              : "Klikni za odabir datuma"}
          </span>
        </span>
        <CalendarDays className="h-5 w-5 text-amber-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+0.75rem)] z-50 w-[320px] rounded-[28px] border border-white/10 bg-zinc-950 p-4 shadow-2xl shadow-black/40">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonth((current) => subMonths(current, 1))}
              className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
              aria-label="Prethodni mjesec"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-semibold capitalize text-white">
              {format(month, "LLLL yyyy.", { locale: hr })}
            </div>
            <button
              type="button"
              onClick={() => setMonth((current) => addMonths(current, 1))}
              className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
              aria-label="Sljedeći mjesec"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-3 grid grid-cols-7 gap-2">
            {WEEKDAY_LABELS.map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-white/35"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const disabled = minSelectableDate ? isBefore(day, minSelectableDate) : false;
              const currentMonthDay = isSameMonth(day, month);
              const selected = selectedDate ? isSameDay(day, selectedDate) : false;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(format(day, "yyyy-MM-dd"));
                    setMonth(startOfMonth(day));
                    setIsOpen(false);
                  }}
                  className={`aspect-square rounded-2xl text-sm transition ${
                    selected
                      ? "bg-amber-500 font-semibold text-black"
                      : disabled
                        ? "cursor-not-allowed text-white/15"
                        : currentMonthDay
                          ? "bg-white/5 text-white hover:bg-white/10"
                          : "bg-transparent text-white/25 hover:bg-white/5"
                  }`}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
