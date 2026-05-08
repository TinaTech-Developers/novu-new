"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BookingBar() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  // your rooms list

  // 🔥 AVAILABILITY FUNCTION (FROM YOU — FIXED + CONNECTED)
  const checkAvailability = async () => {
    const [bookingsRes] = await Promise.all([fetch("/api/bookings")]);

    const bookings = await bookingsRes.json();

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const available = rooms.filter((room) => {
      const isBooked = bookings.some((b: any) => {
        return (
          b.roomName === room.name &&
          new Date(b.checkIn) <= end &&
          new Date(b.checkOut) >= start
        );
      });

      return !isBooked;
    });

    setAvailableRooms(available);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await fetch("/api/rooms");
      const data = await res.json();

      setRooms(data || []);
    };

    fetchRooms();
  }, []);
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="
        absolute md:bottom-[-40px] bottom-[-40px]
        left-1/2 -translate-x-1/2
        w-[95%] sm:w-[90%] md:w-[80%]
        bg-white shadow-xl rounded-2xl
        p-4 sm:p-5 md:p-6
        z-20
      "
    >
      <div className="flex flex-col md:grid md:grid-cols-4 gap-3 md:gap-4">
        {/* CHECK-IN */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border p-2 text-gray-700 border-gray-300 rounded-lg w-full"
          />
        </div>

        {/* CHECK-OUT */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border p-2 text-gray-700 border-gray-300 rounded-lg w-full"
          />
        </div>

        {/* GUESTS */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Guests</label>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="border p-2 text-gray-700 border-gray-300 rounded-lg w-full"
          />
        </div>

        {/* BUTTON */}
        <div className="flex items-end">
          <button
            onClick={checkAvailability}
            className="
              bg-[var(--primary)] text-white
              rounded-lg w-full py-2
              hover:opacity-90 transition
            "
          >
            Check Availability
          </button>
        </div>
      </div>

      {/* 🔥 RESULTS */}
      {availableRooms.length > 0 && (
        <div className="mt-4 bg-gray-50 p-4 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-700">
            Available Apartments:
          </h3>

          {availableRooms.map((room) => (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              key={room._id}
              className="px-3 py-1 bg-[var(--primary)] text-white text-xs rounded-sm mt-2 inline-block mx-2"
            >
              {room.name}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
