import { eachDayOfInterval, isWithinInterval } from "date-fns";

// ================= PEAK SEASON =================
export const isPeakSeason = (date: Date) => {
  const year = date.getFullYear();

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
  "2026-08-11",
  "2026-08-12",

  // 2027
  "2027-01-01",
  "2027-04-10",
  "2027-05-25",
  "2027-12-25",
  "2027-12-26",
  "2027-08-11",
  "2027-08-12",
];

// ================= HOLIDAY CHECK =================
export const isZimbabweHoliday = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formatted = `${year}-${month}-${day}`;

  return zimbabweHolidays.includes(formatted);
};

// ================= NIGHT PRICE =================
export const getNightPrice = (room: any, date: Date, useBreakfast = false) => {
  const peak = isPeakSeason(date) || isZimbabweHoliday(date);

  if (
    useBreakfast &&
    room.pricing?.bedAndBreakfastOffPeak &&
    room.pricing?.bedAndBreakfastPeak
  ) {
    return peak ?
        room.pricing.bedAndBreakfastPeak
      : room.pricing.bedAndBreakfastOffPeak;
  }

  return peak ? room.pricing.peak : room.pricing.offPeak;
};

// ================= MEAL PRICE =================
export const getMealPrice = (room: any, date: Date) => {
  const peak = isPeakSeason(date) || isZimbabweHoliday(date);

  const roomOnly = peak ? room.pricing?.peak || 0 : room.pricing?.offPeak || 0;

  const bedAndBreakfast =
    peak ?
      room.pricing?.bedAndBreakfastPeak
    : room.pricing?.bedAndBreakfastOffPeak;

  // If B&B pricing exists use the difference
  if (typeof bedAndBreakfast === "number" && typeof roomOnly === "number") {
    return Math.max(0, bedAndBreakfast - roomOnly);
  }

  // Fallback meal price
  return 20;
};

// ================= TOTAL =================
export const calculateBookingTotal = (
  room: any,
  startDate: Date,
  endDate: Date,
  useBreakfast = false,
  useLunch = false,
  useDinner = false,
  extraBeds = 0,
) => {
  const days = eachDayOfInterval({
    start: startDate,
    end: new Date(endDate.getTime() - 86400000),
  });

  let total = 0;

  for (const day of days) {
    let dayTotal = getNightPrice(room, day, useBreakfast);

    const mealPrice = getMealPrice(room, day);

    if (useLunch) {
      dayTotal += mealPrice;
    }

    if (useDinner) {
      dayTotal += mealPrice;
    }

    // $15 per extra bed per night
    dayTotal += extraBeds * 15;

    total += dayTotal;
  }

  console.log({
    room: room.name,
    useBreakfast,
    useLunch,
    useDinner,
    extraBeds,
    total,
  });

  return total;
};
