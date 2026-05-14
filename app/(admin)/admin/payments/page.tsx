"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../_components/layout";
import { useRouter } from "next/navigation";

export default function PaymentsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  // ================= FETCH BOOKINGS =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };

    fetchData();
  }, []);

  // ================= FILTER =================
  const filtered = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => b.paymentStatus === filter);
  }, [bookings, filter]);

  // ================= STATS =================
  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.amountPaid || 0),
    0,
  );

  const totalBalance = bookings.reduce(
    (sum, b) => sum + ((b.total || 0) - (b.amountPaid || 0)),
    0,
  );

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between gap-3 md:items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Payments Overview
          </h1>

          <select
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg text-sm text-gray-700"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <h2 className="text-xl font-bold text-gray-900">
              ${totalRevenue.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white border p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <h2 className="text-xl font-bold text-gray-900">
              {bookings.length}
            </h2>
          </div>

          <div className="bg-white border p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Outstanding Balance</p>
            <h2 className="text-xl font-bold text-red-600">
              ${totalBalance.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Guest</th>
                  <th className="p-3 text-left">Room</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Paid</th>
                  <th className="p-3 text-left">Balance</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((b) => (
                  <tr
                    key={b._id}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => router.push(`/admin/payments/${b._id}`)}
                  >
                    <td className="p-3 text-gray-800 font-medium">
                      {b.fullName}
                    </td>

                    <td className="p-3 text-gray-700">{b.roomName}</td>

                    <td className="p-3 text-gray-900 font-medium">
                      ${b.total}
                    </td>

                    <td className="p-3 text-green-700 font-medium">
                      ${b.amountPaid || 0}
                    </td>

                    <td className="p-3 text-red-600 font-medium">
                      ${(b.total - (b.amountPaid || 0)).toFixed(2)}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded font-medium ${
                          b.paymentStatus === "paid" ?
                            "bg-green-100 text-green-700"
                          : b.paymentStatus === "partial" ?
                            "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/payments/${b._id}`);
                        }}
                        className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded-md hover:bg-gray-800 transition"
                      >
                        Manage Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
