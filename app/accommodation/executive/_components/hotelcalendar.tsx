"use client";

import { useMemo, useState } from "react";
import { format, addDays, isSameDay, isWithinInterval } from "date-fns";

type Props = {
  bookedDates?: { start: string; end: string }[];
  onChange: (range: { start: Date | null; end: Date | null }) => void;
};

export default function HotelCalendar({ bookedDates = [], onChange }: Props) {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  const today = new Date();

  const days = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => addDays(today, i)); // ✅ changed 60 → 30
  }, []);

  const isBooked = (date: Date) => {
    return bookedDates.some((b) => {
      const start = new Date(b.start);
      const end = new Date(b.end);
      return isWithinInterval(date, { start, end });
    });
  };

  const handleClick = (date: Date) => {
    if (!start || (start && end)) {
      setStart(date);
      setEnd(null);
      onChange({ start: date, end: null });
    } else {
      if (date < start) {
        setEnd(start);
        setStart(date);
        onChange({ start: date, end: start });
      } else {
        setEnd(date);
        onChange({ start, end: date });
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border p-4">
      <h3 className="font-semibold mb-3 text-gray-700">Select Your Stay</h3>

      <div className="grid grid-cols-7 gap-2 text-xs text-center">
        {days.map((day) => {
          const disabled = isBooked(day);

          const selected =
            (start && isSameDay(day, start)) || (end && isSameDay(day, end));

          const inRange = start && end && isWithinInterval(day, { start, end });

          return (
            <button
              key={day.toISOString()}
              disabled={disabled}
              onClick={() => handleClick(day)}
              className={`
                p-2 rounded-lg transition text-xs
                ${disabled ? "bg-gray-200 text-gray-700 cursor-not-allowed" : ""}
                ${selected ? "bg-[var(--primary)] text-white" : ""}
                ${inRange ? "bg-blue-100" : ""}
                ${!selected && !disabled ? "hover:bg-gray-100" : ""}
              `}
            >
              <div className="text-[10px]">{format(day, "EEE")}</div>
              <div className="font-semibold">{format(day, "d")}</div>
            </button>
          );
        })}
      </div>

      {start && (
        <p className="mt-3 text-sm text-gray-600">
          Check-in: {format(start, "PPP")}
          {end && <> → Check-out: {format(end, "PPP")}</>}
        </p>
      )}
    </div>
  );
}
