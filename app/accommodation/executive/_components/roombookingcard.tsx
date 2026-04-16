"use client";

import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import HotelCalendar from "./hotelcalendar";

export default function RoomBookingCard({ room }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const nights =
    startDate && endDate ?
      Math.max(1, differenceInCalendarDays(endDate, startDate))
    : 0;

  const total = nights * room.price;

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert("Please select dates");
      return;
    }

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        room: room.name,
        checkIn: startDate,
        checkOut: endDate,
        nights,
        total,
      }),
    });

    if (res.ok) {
      alert("Booking sent successfully!");
      setIsOpen(false);
    } else {
      alert("Failed to send booking");
    }
  };

  return (
    <>
      {/* ================= BUTTON ================= */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg"
      >
        Book Now
      </button>

      {/* ================= MODAL ================= */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-4xl rounded- p-6 relative text-gray-700">
            {/* CLOSE */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-4 text-gray-600 text-xl hover:text-black"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-[var(--primary)] mb-4 text-gray-900">
              Book {room.name}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* CALENDAR */}
              <HotelCalendar
                bookedDates={[{ start: "2026-04-20", end: "2026-04-22" }]}
                onChange={({ start, end }) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
              />

              {/* FORM */}
              <div className="flex flex-col gap-4">
                <input
                  placeholder="Full Name"
                  className="border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  placeholder="Email"
                  className="border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  placeholder="Phone"
                  className="border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  onChange={(e) => setPhone(e.target.value)}
                />

                {/* SUMMARY */}
                {nights > 0 && (
                  <div className="bg-gray-100 p-3 rounded-lg text-gray-700">
                    <p>Nights: {nights}</p>
                    <p className="font-bold text-gray-900">Total: ${total}</p>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  className="bg-[var(--primary)] text-white py-2 rounded-lg mt-2 hover:opacity-90"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
