import { eachDayOfInterval, isWithinInterval } from "date-fns";

// ================= PEAK SEASON =================
export const isPeakSeason = (date: Date) => {
  const year = date.getFullYear();

  // Dec 15 -> Jan 2
  const peakStart = new Date(year, 11, 15);

  const peakEnd = new Date(year + 1, 0, 2);

  return isWithinInterval(date, {
    start: peakStart,
    end: peakEnd,
  });
};

// ================= ZIM HOLIDAYS =================
const zimbabweHolidays = [
  "2026-01-01",
  "2026-04-18",
  "2026-05-25",
  "2026-12-25",
  "2026-12-26",
  // 2027
  "2027-01-01",
  "2027-04-10",
  "2027-05-25",
  "2027-12-25",
  "2027-12-26",
];

// ================= HOLIDAY CHECK =================
export const isZimbabweHoliday = (date: Date) => {
  const formatted = date.toISOString().split("T")[0];

  return zimbabweHolidays.includes(formatted);
};

// ================= NIGHT PRICE =================
export const getNightPrice = (room: any, date: Date, useBreakfast = false) => {
  const peak = isPeakSeason(date) || isZimbabweHoliday(date);

  if (useBreakfast && room.pricing?.bedAndBreakfastOffPeak) {
    return peak ?
        room.pricing.bedAndBreakfastPeak
      : room.pricing.bedAndBreakfastOffPeak;
  }

  return peak ? room.pricing.peak : room.pricing.offPeak;
};

// ================= TOTAL =================
export const calculateBookingTotal = (
  room: any,
  startDate: Date,
  endDate: Date,
  useBreakfast = false,
) => {
  const days = eachDayOfInterval({
    start: startDate,

    // EXCLUDE CHECKOUT DAY
    end: new Date(endDate.getTime() - 86400000),
  });

  let total = 0;

  for (const day of days) {
    total += getNightPrice(room, day, useBreakfast);
  }

  return total;
};
