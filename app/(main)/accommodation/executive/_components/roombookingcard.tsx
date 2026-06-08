"use client";

import { useEffect, useState } from "react";
import { differenceInCalendarDays, startOfDay } from "date-fns";
import HotelCalendar from "./hotelcalendar";
import {
  calculateBookingTotal,
  isPeakSeason,
  isZimbabweHoliday,
} from "@/lib/pricing";

export default function RoomBookingCard({ room }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);

  const [extraBeds, setExtraBeds] = useState(0);

  const [includeLunch, setIncludeLunch] = useState(false);
  const [includeDinner, setIncludeDinner] = useState(false);

  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [includeBreakfast, setIncludeBreakfast] = useState(false);

  // ================= FETCH BOOKINGS =================
  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);

      const res = await fetch("/api/bookings", {
        cache: "no-store",
      });

      const data = await res.json();

      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ================= FILTER BOOKINGS FOR THIS ROOM =================
  const roomBookings = bookings.filter(
    (b) =>
      b.roomId?.toString() === room._id?.toString() && b.status === "confirmed",
  );

  // ================= OVERLAP CHECK =================
  const isOverlapping = (start: Date, end: Date, existingBookings: any[]) => {
    return existingBookings.some((b) => {
      const existingStart = new Date(b.checkIn);
      const existingEnd = new Date(b.checkOut);

      // Proper hotel overlap logic
      return start < existingEnd && end > existingStart;
    });
  };

  // ================= BLOCKED STATUS =================
  const blocked = !!(
    startDate &&
    endDate &&
    isOverlapping(startDate, endDate, roomBookings)
  );

  const maxExtraBeds =
    room.category === "two-beds" || room.category === "three-beds" ? 2 : 0;

  const maxGuests = room.capacity + extraBeds;

  // ================= NIGHTS =================
  const nights =
    startDate && endDate ?
      Math.max(1, differenceInCalendarDays(endDate, startDate))
    : 0;

  // ================= TOTAL =================
  // ================= TOTAL =================
  const total =
    startDate && endDate ?
      calculateBookingTotal(
        room,
        startDate,
        endDate,
        includeBreakfast,
        includeLunch,
        includeDinner,
        extraBeds,
      )
    : 0;

  // ================= HANDLE BOOKING =================
  const handleBooking = async () => {
    try {
      if (!startDate || !endDate) {
        alert("Please select dates");
        return;
      }

      if (!name || !email || !phone) {
        alert("Please complete all required fields");
        return;
      }
      if (guests < 1) {
        alert("Guests must be at least 1");
        return;
      }

      if (!room._id) {
        alert("Invalid room selected");
        return;
      }
      if (guests > maxGuests) {
        alert(`Maximum guests allowed is ${maxGuests}`);
        return;
      }

      // FINAL LIVE CHECK BEFORE BOOKING
      const latestRes = await fetch("/api/bookings", {
        cache: "no-store",
      });

      const latestBookings = await latestRes.json();

      const latestRoomBookings = latestBookings.filter(
        (b: any) =>
          b.roomId?.toString() === room._id?.toString() &&
          b.status !== "cancelled",
      );

      const alreadyBooked = isOverlapping(
        startDate,
        endDate,
        latestRoomBookings,
      );

      if (alreadyBooked) {
        alert("Selected dates are already booked");
        return;
      }

      setSubmitting(true);

      const bookingData = {
        roomId: room._id,
        roomName: room.name,
        category: room.category,

        fullName: name,
        email,
        phone,

        guests,
        extraBeds,

        breakfastIncluded: includeBreakfast,
        lunchIncluded: includeLunch,
        dinnerIncluded: includeDinner,

        checkIn: startDate,
        checkOut: endDate,

        nights,
        total,
      };
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Booking failed");
        return;
      }

      // REFRESH BOOKINGS IMMEDIATELY
      await fetchBookings();

      alert("Booking submitted successfully!");

      // RESET FORM
      setName("");
      setEmail("");
      setPhone("");
      setGuests(1);

      setStartDate(null);
      setEndDate(null);

      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= UI =================
  return (
    <>
      {/* BOOK BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[var(--primary)] text-white px-6 py-2 rounded-sm hover:opacity-90 transition mt-10 md:mt-0"
      >
        Book Now
      </button>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-4xl rounded p-6 relative text-gray-700 z-50 max-h-[90vh] overflow-hidden">
            {/* CLOSE */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-4 text-gray-600 text-xl hover:text-black"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">
              Book {room.name}
            </h2>

            <div className="grid md:grid-cols-2 gap-6 h-full">
              {/* CALENDAR */}
              <div>
                <HotelCalendar
                  key={roomBookings.length}
                  bookedDates={roomBookings.map((b) => ({
                    start: b.checkIn,
                    end: b.checkOut,
                  }))}
                  onChange={({ start, end }) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                />
                {loadingBookings && (
                  <p className="text-sm text-gray-500 mt-2">
                    Loading bookings...
                  </p>
                )}
              </div>

              {/* FORM */}
              <div className="flex flex-col gap-2 overflow-y-auto pr-2 md:max-h-[75vh]">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="border border-gray-300 p-2 text-sm rounded"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  className="border border-gray-300 p-2 text-sm rounded"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className="border border-gray-300 p-2 text-sm rounded"
                />
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">
                    Number of Guests
                  </label>

                  <input
                    type="number"
                    min={1}
                    max={maxGuests}
                    value={guests}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      if (value <= maxGuests) {
                        setGuests(value);
                      }
                    }}
                    className="border border-gray-300 p-2 text-sm rounded w-full"
                    placeholder="Guests"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {room.category === "executive" && "Maximum 2 guests"}

                    {room.category === "two-beds" &&
                      `Maximum ${6 + extraBeds} guests`}

                    {room.category === "three-beds" &&
                      `Maximum ${8 + extraBeds} guests`}
                  </p>
                </div>
                {(room.category === "two-beds" ||
                  room.category === "three-beds") && (
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Extra Beds
                    </label>

                    <select
                      value={extraBeds}
                      onChange={(e) => setExtraBeds(Number(e.target.value))}
                      className="border border-gray-300 p-2 text-sm rounded w-full"
                    >
                      <option value={0}>No Extra Bed</option>
                      <option value={1}>1 Extra Bed</option>
                      <option value={2}>2 Extra Beds</option>
                    </select>

                    <p className="text-xs text-gray-500 mt-1">
                      Maximum guests: {maxGuests}
                    </p>
                  </div>
                )}{" "}
                <div className="border rounded p-2">
                  <div className="flex justify-between items-center">
                    <span>Lunch</span>

                    <input
                      type="checkbox"
                      checked={includeLunch}
                      onChange={() => setIncludeLunch(!includeLunch)}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="border rounded p-2">
                  <div className="flex justify-between items-center">
                    <span>Dinner</span>

                    <input
                      type="checkbox"
                      checked={includeDinner}
                      onChange={() => setIncludeDinner(!includeDinner)}
                    />
                  </div>
                </div>
                {/* BREAKFAST OPTION */}
                {room.category === "executive" && (
                  <div className="border border-orange-200 bg-orange-50 rounded-xl  p-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                          Bed & Breakfast
                        </h3>

                        <p className="text-xs text-gray-600 mt-1">
                          Include breakfast with your executive room booking.
                        </p>

                        <div className="mt- space-y- text-xs text-gray-700">
                          <p>
                            Off Peak:
                            <span className="font-semibold ml-1">
                              ${room.pricing?.bedAndBreakfastOffPeak || 0}
                            </span>
                          </p>

                          <p>
                            Peak:
                            <span className="font-semibold ml-1">
                              ${room.pricing?.bedAndBreakfastPeak || 0}
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIncludeBreakfast(!includeBreakfast)}
                        className={`w-16 h-7 rounded-full relative transition ${
                          includeBreakfast ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full transition ${
                            includeBreakfast ? "left-10" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          includeBreakfast ?
                            "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {includeBreakfast ? "Breakfast Included" : "Room Only"}
                      </span>
                    </div>
                  </div>
                )}
                {/* DATE SUMMARY */}
                {startDate && endDate && (
                  <div className="bg-gray-100 p-2 rounded-sm space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold text-xs">Check In:</span>{" "}
                      {startDate.toDateString()}
                    </p>

                    <p className="text-sm">
                      <span className="font-semibold text-xs">Check Out:</span>{" "}
                      {endDate.toDateString()}
                    </p>

                    <p className="text-sm">
                      <span className="font-semibold text-xs">Nights:</span>{" "}
                      {nights}
                    </p>

                    <p className="font-bold text-sm">
                      Total: ${total.toFixed(2)}
                    </p>
                    {room.category === "executive" && (
                      <div className="flex justify-between text-sm border-t pt-2 mt-2">
                        <span className="text-gray-600">Breakfast</span>

                        <span
                          className={`font-semibold ${
                            includeBreakfast ? "text-green-600" : (
                              "text-gray-700"
                            )
                          }`}
                        >
                          {includeBreakfast ? "Included" : "Not Included"}
                        </span>
                      </div>
                    )}
                    <div className="space-y-1">
                      {Array.from({ length: nights }, (_, i) => {
                        const day = new Date(startDate);

                        day.setDate(day.getDate() + i);

                        const peak =
                          isPeakSeason(day) || isZimbabweHoliday(day);

                        return (
                          <div key={i} className="flex justify-between text-xs">
                            <span>{day.toDateString()}</span>

                            <span>{peak ? "Peak" : "Off Peak"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* BLOCK MESSAGE */}
                {blocked && (
                  <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">
                    Selected dates are unavailable.
                  </div>
                )}
                {/* BUTTON */}
                <button
                  disabled={blocked || submitting}
                  onClick={handleBooking}
                  className={`py-3 rounded-lg text-white font-medium transition ${
                    blocked || submitting ?
                      "bg-gray-400 cursor-not-allowed"
                    : "bg-[var(--primary)] hover:opacity-90"
                  }`}
                >
                  {submitting ?
                    "Processing..."
                  : blocked ?
                    "Not Available"
                  : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
