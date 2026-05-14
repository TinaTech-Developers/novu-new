"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [method, setMethod] = useState("cash");
  const [type, setType] = useState("full"); // full | deposit

  useEffect(() => {
    const fetchBooking = async () => {
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();
      setBooking(data);
      setLoading(false);
    };

    fetchBooking();
  }, [id]);

  const calculateAmount = () => {
    if (!booking) return 0;

    if (type === "deposit") return booking.total * 0.3;
    return booking.total;
  };

  const confirmPayment = async () => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "confirmed",
        paymentStatus: type === "deposit" ? "deposit_paid" : "paid",
        paymentMethod: method,
        amountPaid: calculateAmount(),
      }),
    });

    if (res.ok) {
      router.push("/admin/bookings");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border">
      <h1 className="text-2xl font-bold mb-4">Payment Confirmation</h1>

      <p className="mb-2">
        <b>Room:</b> {booking.roomName}
      </p>
      <p className="mb-2">
        <b>Total:</b> ${booking.total}
      </p>

      <div className="mt-4 space-y-3">
        <select
          className="w-full border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="full">Full Payment</option>
          <option value="deposit">30% Deposit</option>
        </select>

        <select
          className="w-full border p-2 rounded"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="mobile_money">Mobile Money</option>
        </select>

        <div className="p-3 bg-gray-100 rounded">
          <p>
            Amount to pay: <b>${calculateAmount()}</b>
          </p>
        </div>

        <button
          onClick={confirmPayment}
          className="w-full bg-green-600 text-white py-3 rounded"
        >
          Confirm Payment & Approve Booking
        </button>
      </div>
    </div>
  );
}
