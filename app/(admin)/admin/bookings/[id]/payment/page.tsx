"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "../../../_components/layout";

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [staffName, setStaffName] = useState("");

  const [paymentType, setPaymentType] = useState("deposit");

  useEffect(() => {
    const fetchBooking = async () => {
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();
      setBooking(data);
      setLoading(false);
    };

    fetchBooking();
  }, [id]);

  // ================= CALCULATIONS =================
  const total = booking?.total || 0;

  const alreadyPaid = booking?.amountPaid || 0;

  const remainingBalance = Math.max(total - alreadyPaid, 0);

  const finalTotalPaid = alreadyPaid + amountPaid;

  const balance = Math.max(total - finalTotalPaid, 0);

  const paymentStatus = useMemo(() => {
    if (finalTotalPaid <= 0) return "unpaid";
    if (finalTotalPaid >= total) return "paid";
    return "partial";
  }, [finalTotalPaid, total]);
  // ================= SUBMIT =================
  const confirmPayment = async () => {
    if (!amountPaid || amountPaid <= 0) {
      alert("Enter a valid amount");
      return;
    }

    if (!staffName) {
      alert("Enter staff name");
      return;
    }
    if (finalTotalPaid > total) {
      alert("Amount exceeds remaining balance");
      return;
    }

    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amountPaid: Number(amountPaid),
        paymentMethod,
        paymentProcessedBy: staffName,
      }),
    });

    if (res.ok) {
      router.push("/admin/bookings");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto bg-white border rounded-xl p-6 space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Payment Processing
          </h1>
          <p className="text-sm text-gray-500">
            Room: <b>{booking.roomName}</b>
          </p>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-lg font-bold text-gray-900">${total}</p>
          </div>

          <div className="p-4 bg-green-100 rounded-lg">
            <p className="text-xs text-green-600">Amount Paid</p>
            <p className="text-lg font-bold text-green-700">${alreadyPaid}</p>
          </div>

          <div className="p-4 bg-red-100 rounded-lg">
            <p className="text-xs text-red-600">Balance</p>
            <p className="text-lg font-bold text-red-700">
              ${remainingBalance}
            </p>
          </div>
        </div>

        {/* INPUTS */}
        <div className="space-y-4">
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="w-full border p-3 rounded-lg border-gray-300 text-gray-800"
          >
            <option value="deposit">Deposit Payment</option>

            {booking?.amountPaid > 0 && booking?.amountPaid < total && (
              <option value="balance">Balance Payment</option>
            )}

            <option value="full">Full Payment</option>
          </select>
          <input
            type="number"
            placeholder="Enter amount paid"
            value={amountPaid}
            onChange={(e) => setAmountPaid(Number(e.target.value))}
            className="w-full border p-3 rounded-lg border-gray-300 text-gray-800"
          />

          <input
            type="text"
            placeholder="Staff name (who processed payment)"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            className="w-full border p-3 rounded-lg border-gray-300 text-gray-800"
          />

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border p-3 rounded-lg border-gray-300 text-gray-800"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="mobile_money">Mobile Money</option>
          </select>
        </div>

        {/* STATUS BADGE */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Status:</span>
          <span
            className={`px-3 py-1 text-xs rounded-full font-medium ${
              paymentStatus === "paid" ? "bg-green-600 text-white"
              : paymentStatus === "partial" ? "bg-yellow-500 text-white"
              : "bg-gray-400 text-white"
            }`}
          >
            {paymentStatus.toUpperCase()}
          </span>
        </div>
        {paymentStatus === "partial" && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-sm">
            Remaining balance: ${balance}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={confirmPayment}
          className="w-full bg-[var(--primary)] text-white py-3 rounded-lg hover:opacity-90"
        >
          {paymentStatus === "paid" ?
            "Complete Payment"
          : booking?.amountPaid > 0 ?
            "Pay Remaining Balance"
          : "Confirm Payment"}
        </button>
      </div>
    </AdminLayout>
  );
}
