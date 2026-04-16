"use client";

import { motion } from "framer-motion";

export default function BookingBar() {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="
        absolute md:bottom-[-40px] bottom-[-100px]
        left-1/2 -translate-x-1/2
        w-[95%] sm:w-[90%] md:w-[80%]
        bg-white shadow-xl rounded-2xl
        p-4 sm:p-5 md:p-6
        z-20
      "
    >
      <div
        className="
        flex flex-col md:grid md:grid-cols-4
        gap-3 md:gap-4
      "
      >
        {/* CHECK-IN */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Check-in</label>
          <input
            type="date"
            className="border p-2 text-gray-700 border-gray-300 rounded-lg w-full"
          />
        </div>

        {/* CHECK-OUT */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Check-out</label>
          <input
            type="date"
            className="border p-2 text-gray-700 border-gray-300 rounded-lg w-full"
          />
        </div>

        {/* GUESTS */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Guests</label>
          <input
            type="number"
            placeholder="2"
            className="border p-2 text-gray-700 border-gray-300 rounded-lg w-full"
          />
        </div>

        {/* BUTTON */}
        <div className="flex items-end">
          <button
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
    </motion.div>
  );
}
