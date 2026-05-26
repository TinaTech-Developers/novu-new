"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AdminLayout from "../../_components/layout";

export default function PaymentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [saving, setSaving] = useState(false);

  // ================= FETCH BOOKING =================
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        const data = await res.json();

        setBooking(data);

        setAmountPaid(data.amountPaid || 0);
        setPaymentMethod(data.paymentMethod || "cash");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id]);

  // ================= UPDATE PAYMENT =================
  const handleUpdatePayment = async () => {
    try {
      setSaving(true);

      const paid = Number(amountPaid || 0);

      let paymentStatus = "unpaid";

      if (paid > 0 && paid < booking.total) {
        paymentStatus = "partial";
      }

      if (paid >= booking.total) {
        paymentStatus = "paid";
      }

      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountPaid: paid,
          paymentMethod,
          paymentStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update payment");
        return;
      }

      setBooking(data);

      alert("Payment updated successfully");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ================= STATUS STYLES =================
  const getPaymentStyle = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";

      case "partial":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500 text-lg">
          Loading payment...
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Payment not found
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* ================= HEADER ================= */}
          <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Payment Details
              </h1>

              <p className="text-gray-500 mt-1">
                Manage booking payment information
              </p>
            </div>

            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-white border hover:bg-gray-100 transition text-gray-700"
            >
              ← Back
            </button>
          </div>

          {/* ================= MAIN CARD ================= */}
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white border shadow-sm overflow-hidden"
          >
            {/* ================= TOP ================= */}
            <div className="bg-gradient-to-r from-[var(--primary)] to-black p-8 text-white">
              <div className="flex flex-col md:flex-row justify-between gap-5 md:items-center">
                <div>
                  <h2 className="text-3xl font-bold">{booking.roomName}</h2>

                  <p className="text-white/70 mt-2">
                    Booking ID: {booking._id}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full border text-sm font-medium w-fit ${getPaymentStyle(
                    booking.paymentStatus,
                  )}`}
                >
                  {booking.paymentStatus}
                </span>
              </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ================= GUEST INFO ================= */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-50 border p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-5">
                  Guest Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Guest Name</p>

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

              {/* ================= BOOKING INFO ================= */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-50 border p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-5">
                  Booking Information
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

              {/* ================= PAYMENT SUMMARY ================= */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 bg-gray-100 border p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-5">
                  Payment Summary
                </h3>

                <div className="grid md:grid-cols-4 gap-5">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>

                    <h2 className="text-2xl font-bold text-black">
                      ${booking.total}
                    </h2>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>

                    <h2 className="text-2xl font-bold text-green-600">
                      ${booking.amountPaid || 0}
                    </h2>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Outstanding Balance</p>

                    <h2 className="text-2xl font-bold text-red-600">
                      ${(booking.total - (booking.amountPaid || 0)).toFixed(2)}
                    </h2>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>

                    <h2 className="text-lg font-semibold text-gray-800 capitalize">
                      {booking.paymentMethod || "Not set"}
                    </h2>
                  </div>
                </div>
              </motion.div>

              {/* ================= UPDATE PAYMENT ================= */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 bg-black text-white p-6"
              >
                <h3 className="text-xl font-semibold mb-6">Update Payment</h3>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-white/70 block mb-2">
                      Amount Paid
                    </label>

                    <input
                      type="number"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-white/70 block mb-2">
                      Payment Method
                    </label>

                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 px-4 py-3 outline-none text-white"
                    >
                      <option className="text-black" value="cash">
                        Cash
                      </option>

                      <option className="text-black" value="ecocash">
                        EcoCash
                      </option>

                      <option className="text-black" value="bank-transfer">
                        Bank Transfer
                      </option>

                      <option className="text-black" value="swipe">
                        Swipe
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    disabled={saving}
                    onClick={handleUpdatePayment}
                    className="px-6 py-3 bg-[var(--primary)] hover:opacity-90 transition font-semibold"
                  >
                    {saving ? "Updating..." : "Update Payment"}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
