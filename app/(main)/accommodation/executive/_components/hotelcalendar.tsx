"use client";

import { useMemo, useState } from "react";
import {
  format,
  addDays,
  startOfDay,
  isSameDay,
  isAfter,
  eachDayOfInterval,
} from "date-fns";

type Props = {
  bookedDates?: { start: string; end: string }[];
  onChange: (range: { start: Date | null; end: Date | null }) => void;
};

export default function HotelCalendar({ bookedDates = [], onChange }: Props) {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  // SHOW 60 DAYS
  const days = useMemo(
    () => Array.from({ length: 30 }, (_, i) => addDays(new Date(), i)),
    [],
  );

  // ================= NORMALISE =================
  const norm = (d: Date) => startOfDay(d).getTime();

  // ================= BOOKED CHECK =================
  const isBooked = (day: Date) => {
    const current = startOfDay(day).getTime();

    return bookedDates.some((b) => {
      const start = startOfDay(new Date(b.start)).getTime();

      const end = startOfDay(new Date(b.end)).getTime();

      // hotel logic:
      // check-in day booked
      // checkout day free
      return current >= start && current < end;
    });
  };
  // ================= RANGE HAS BOOKED DAYS =================
  const rangeContainsBookedDates = (startDate: Date, endDate: Date) => {
    const range = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return range.some((day) => isBooked(day));
  };

  // ================= SELECTED RANGE =================
  const isInSelectedRange = (day: Date) => {
    if (!start || !end) return false;

    return day >= start && day <= end;
  };

  // ================= CLICK HANDLER =================
  const handleClick = (day: Date) => {
    const selectedDay = startOfDay(day);

    // BLOCK BOOKED DAYS
    if (isBooked(selectedDay)) return;

    // START NEW SELECTION
    if (!start || (start && end)) {
      setStart(selectedDay);
      setEnd(null);

      onChange({
        start: selectedDay,
        end: null,
      });

      return;
    }

    // USER CLICKED BEFORE START
    const newStart = isAfter(start, selectedDay) ? selectedDay : start;

    const newEnd = isAfter(start, selectedDay) ? start : selectedDay;

    // BLOCK RANGE IF IT CONTAINS BOOKED DAYS
    if (rangeContainsBookedDates(newStart, newEnd)) {
      return;
    }

    setStart(newStart);
    setEnd(newEnd);

    onChange({
      start: newStart,
      end: newEnd,
    });
  };

  return (
    <div className="bg-white border rounded-2xl p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Select Dates</h3>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gray-300" />
            <span>Booked</span>
          </div>

          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[var(--primary)]" />
            <span>Selected</span>
          </div>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const disabled = isBooked(day);

          const selected =
            (start && isSameDay(day, start)) || (end && isSameDay(day, end));

          const inRange = isInSelectedRange(day);

          return (
            <button
              key={day.toISOString()}
              disabled={disabled}
              onClick={() => handleClick(day)}
              className={`
    relative p-2 rounded-lg text-xs transition

    ${selected ? "bg-[var(--primary)] text-white" : ""}

    ${!selected && !disabled ? "hover:bg-gray-100 cursor-pointer" : ""}

    ${disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""}
  `}
            >
              <div className="text-[10px]">{format(day, "EEE")}</div>

              <div className="font-semibold">{format(day, "d")}</div>

              {/* BOOKED INDICATOR */}
              {disabled && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
