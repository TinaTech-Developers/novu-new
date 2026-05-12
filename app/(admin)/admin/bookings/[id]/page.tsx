"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBooking();
  }, [id]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500 text-lg">
          Loading booking...
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Booking not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Booking Details
            </h1>

            <p className="text-gray-500 mt-1">
              View complete booking information
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-xl bg-white border hover:bg-gray-400 text-gray-700 transition"
          >
            ← Back
          </button>
        </div>

        {/* MAIN CARD */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white shadow-sm border overflow-hidden"
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-[var(--primary)] to-black p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold">{booking.roomName}</h2>

                <p className="text-white/80 mt-2">Booking ID: {booking._id}</p>
              </div>

              <span
                className={`px-4 py-2 rounded-full border text-sm font-medium w-fit ${getStatusStyle(
                  booking.status,
                )}`}
              >
                {booking.status}
              </span>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GUEST INFO */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 p-6 border"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-5">
                Guest Information
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-800">
                    {booking.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-800">{booking.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-800">{booking.phone}</p>
                </div>
              </div>
            </motion.div>

            {/* STAY INFO */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 p-6 border"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-5">
                Stay Information
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Check In</p>
                  <p className="font-medium text-gray-800">
                    {new Date(booking.checkIn).toDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Check Out</p>
                  <p className="font-medium text-gray-800">
                    {new Date(booking.checkOut).toDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-medium text-gray-800">
                    {booking.guests || 1}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* PAYMENT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 bg-black text-white p-3"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <p className="text-white/70 text-sm">Total Booking Amount</p>

                  <h2 className=" font-bold mt-1">${booking.total}</h2>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <button className="px-2 bg-white text-black hover:opacity-90 transition">
                    Print Invoice
                  </button>

                  <button className="px-2 border border-white/30 hover:bg-white/10 transition">
                    Send Email
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
