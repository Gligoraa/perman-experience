import { format, parseISO } from "date-fns";

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export function formatDateKey(value: Date | string) {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "yyyy-MM-dd");
}

export function getAvailableTimeSlots(
  bookedTimes: string[],
  options?: { excludeTime?: string }
) {
  const blocked = new Set(
    bookedTimes.filter((time) => time && time !== options?.excludeTime)
  );

  return TIME_SLOTS.filter((slot) => !blocked.has(slot));
}
