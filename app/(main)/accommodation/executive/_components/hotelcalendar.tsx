"use client";

import { useState } from "react";

import {
  format,
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

  // ================= NORMALISE =================
  const norm = (d: Date) => startOfDay(d).getTime();

  // ================= BOOKED CHECK =================
  const isBooked = (day: Date) => {
    const current = norm(day);

    return bookedDates.some((b) => {
      const start = norm(new Date(b.start));

      const end = norm(new Date(b.end));

      // HOTEL LOGIC:
      // CHECK-IN DAY = BOOKED
      // CHECK-OUT DAY = FREE
      return current >= start && current < end;
    });
  };

  // ================= RANGE VALIDATION =================
  const rangeContainsBookedDates = (startDate: Date, endDate: Date) => {
    const range = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return range.some((day) => isBooked(day));
  };

  // ================= RANGE UI =================
  const isInSelectedRange = (day: Date) => {
    if (!start || !end) return false;

    return day >= start && day <= end;
  };

  // ================= CLICK =================
  const handleClick = (day: Date) => {
    const selectedDay = startOfDay(day);

    // BLOCK BOOKED DAYS
    if (isBooked(selectedDay)) return;

    // START NEW RANGE
    if (!start || (start && end)) {
      setStart(selectedDay);

      setEnd(null);

      onChange({
        start: selectedDay,
        end: null,
      });

      return;
    }

    // HANDLE BACKWARD SELECTION
    const newStart = isAfter(start, selectedDay) ? selectedDay : start;

    const newEnd = isAfter(start, selectedDay) ? start : selectedDay;

    // BLOCK RANGES WITH BOOKED DATES
    if (rangeContainsBookedDates(newStart, newEnd)) {
      alert("Selected range contains booked dates");

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
      {/* ================= HEADER ================= */}
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

      {/* ================= MONTHS ================= */}
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-2">
          {Array.from({ length: 12 }, (_, monthIndex) => {
            const monthStart = startOfDay(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth() + monthIndex,
                1,
              ),
            );

            const totalDays = new Date(
              monthStart.getFullYear(),
              monthStart.getMonth() + 1,
              0,
            ).getDate();

            const monthDays = Array.from(
              { length: totalDays },
              (_, i) =>
                new Date(
                  monthStart.getFullYear(),
                  monthStart.getMonth(),
                  i + 1,
                ),
            );

            return (
              <div
                key={monthIndex}
                className="bg-gray-50 border rounded-2xl p-4 min-w-[300px] max-w-[300px]"
              >
                {/* MONTH TITLE */}
                <div className="mb-4">
                  <h2 className="font-semibold text-gray-800">
                    {format(monthStart, "MMMM yyyy")}
                  </h2>
                </div>

                {/* WEEKDAYS */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div
                        key={d}
                        className="text-[10px] text-center text-gray-400"
                      >
                        {d}
                      </div>
                    ),
                  )}
                </div>

                {/* DAYS */}
                <div className="grid grid-cols-7 gap-2">
                  {monthDays.map((day) => {
                    const disabled = isBooked(day);

                    const selected =
                      (start && isSameDay(day, start)) ||
                      (end && isSameDay(day, end));

                    const inRange = isInSelectedRange(day);

                    return (
                      <button
                        key={day.toISOString()}
                        disabled={disabled}
                        onClick={() => handleClick(day)}
                        className={`
                          relative p-2 rounded-lg text-xs transition

                          ${selected ? "bg-[var(--primary)] text-white" : ""}

                          ${
                            inRange && !selected ?
                              "bg-blue-100 text-blue-700"
                            : ""
                          }

                          ${
                            !selected && !disabled ?
                              "hover:bg-gray-100 cursor-pointer"
                            : ""
                          }

                          ${
                            disabled ?
                              "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : ""
                          }
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
          })}
        </div>
      </div>
    </div>
  );
}
