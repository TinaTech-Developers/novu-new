"use client";

import { motion } from "framer-motion";

export default function BookingBar() {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 w-[90%] md:w-[80%] bg-white shadow-xl rounded-2xl p-6 z-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="date"
          className="border p-2 text-gray-700 border-gray-400 rounded-lg"
        />
        <input
          type="date"
          className="border p-2 text-gray-700 border-gray-400 rounded-lg"
        />
        <input
          type="number"
          placeholder="Guests"
          className="border p-2 text-gray-700 border-gray-400 rounded-lg"
        />
        <button className="bg-[var(--primary)] text-white rounded-lg">
          Check Availability
        </button>
      </div>
    </motion.div>
  );
}
