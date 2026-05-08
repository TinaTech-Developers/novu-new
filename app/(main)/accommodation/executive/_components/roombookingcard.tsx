"use client";

import { useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import HotelCalendar from "./hotelcalendar";

export default function RoomBookingCard({ room }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [bookings, setBookings] = useState<any[]>([]);

  // ================= FETCH REAL BOOKINGS =================
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        setBookings(data || []);
      } catch (err) {
        console.error("Failed to load bookings", err);
      }
    };

    fetchBookings();
  }, []);

  // ================= OVERLAP CHECK =================
  const isOverlapping = (start: Date, end: Date, list: any[]) => {
    return list.some((b) => {
      return new Date(b.checkIn) <= end && new Date(b.checkOut) >= start;
    });
  };

  // ================= FILTER BOOKINGS FOR THIS ROOM =================
  const roomBookings = bookings.filter((b) => b.roomId === room._id);

  const blocked = !!(
    startDate &&
    endDate &&
    isOverlapping(startDate, endDate, roomBookings)
  );

  // ================= NIGHTS & TOTAL =================
  const nights =
    startDate && endDate ?
      Math.max(1, differenceInCalendarDays(endDate, startDate))
    : 0;

  const total = nights * room.price;

  // ================= BOOKING HANDLER =================
  const handleBooking = async () => {
    if (blocked) {
      alert("Room not available for selected dates");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select dates");
      return;
    }

    if (!room._id) {
      alert("Invalid room selected. Please reload page.");
      return;
    }

    const bookingData = {
      roomId: room._id,
      roomName: room.name,
      category: room.category || "unknown",

      fullName: name,
      email,
      phone,

      checkIn: startDate.toISOString(),
      checkOut: endDate.toISOString(),

      nights,
      total,
      guests: 1,
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
      console.error("Booking error:", data);
      alert(data?.error || "Failed to create booking");
      return;
    }

    alert("Booking submitted successfully!");

    setIsOpen(false);
    setName("");
    setEmail("");
    setPhone("");
    setStartDate(null);
    setEndDate(null);
  };

  // ================= UI =================
  return (
    <>
      {/* BOOK BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[var(--primary)] text-white px-6 py-2 rounded-sm hover:opacity-90 transition"
      >
        Book Now
      </button>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-4xl rounded p-6 relative text-gray-700 z-50">
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
                bookedDates={roomBookings.map((b) => ({
                  start: b.checkIn,
                  end: b.checkOut,
                }))}
                onChange={({ start, end }) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
              />

              {/* FORM */}
              <div className="flex flex-col gap-4">
                <input
                  placeholder="Full Name"
                  className="border border-gray-300 p-2 rounded"
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  placeholder="Email"
                  className="border border-gray-300 p-2 rounded"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  placeholder="Phone"
                  className="border border-gray-300 p-2 rounded"
                  onChange={(e) => setPhone(e.target.value)}
                />

                {/* SUMMARY */}
                {nights > 0 && (
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p>Nights: {nights}</p>
                    <p className="font-bold">Total: ${total}</p>
                  </div>
                )}

                {/* BUTTON */}
                <button
                  onClick={handleBooking}
                  className={`py-2 rounded-lg mt-2 text-white transition ${
                    blocked ?
                      "bg-gray-400 cursor-not-allowed"
                    : "bg-[var(--primary)]"
                  }`}
                >
                  {blocked ? "Not Available" : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
