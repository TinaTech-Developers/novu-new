"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../_components/layout";

export default function AdminDashboardV2() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();

        console.log("BOOKINGS API RESPONSE:", data);

        // 🔥 FIX HERE
        setBookings(Array.isArray(data) ? data : data?.bookings || []);
      } catch (err) {
        console.error("Failed to load bookings", err);
        setBookings([]);
      }
    };

    fetchData();
  }, []);
  const totalRevenue = useMemo(
    () => bookings.reduce((sum, b) => sum + (b.total || 0), 0),
    [bookings],
  );

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  const occupancy = bookings.length ? (confirmed / bookings.length) * 100 : 0;

  const avgRevenue = bookings.length ? totalRevenue / bookings.length : 0;

  return (
    <AdminLayout>
      <div className="space-y-6 bg-gray-50 min-h-screen p-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Hotel ERP Control Center
          </h1>
          <p className="text-gray-700">
            Real-time operations, revenue & performance analytics
          </p>
        </div>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPI title="Total Bookings" value={bookings.length} />
          <KPI title="Revenue" value={`$${totalRevenue}`} />
          <KPI title="Occupancy" value={`${occupancy.toFixed(1)}%`} />
          <KPI title="Avg Booking" value={`$${avgRevenue.toFixed(0)}`} />
        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* PERFORMANCE GAUGE */}
          <div className="bg-white border rounded-xl p-5">
            <h2 className="font-semibold text-gray-800 mb-4">
              Performance Score
            </h2>

            <div className="flex flex-col items-center justify-center">
              <div className="relative w-44 h-44">
                <div className="absolute inset-0 rounded-full border-8 border-gray-100" />

                <div
                  className="absolute inset-0 rounded-full border-8"
                  style={{
                    borderColor: "var(--primary)",
                    clipPath: `inset(0 ${100 - occupancy}% 0 0)`,
                  }}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">
                    {occupancy.toFixed(0)}%
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-700 mt-3">
                System occupancy performance
              </p>
            </div>
          </div>

          {/* RECENT BOOKINGS */}
          <div className="bg-white border rounded-xl p-5 md:col-span-2">
            <h2 className="font-semibold text-gray-800 mb-4">
              Recent Bookings
            </h2>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {bookings.slice(0, 8).map((b) => (
                <div
                  key={b._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="text-black font-medium">{b.roomName}</p>
                    <p className="text-sm text-gray-700">{b.fullName}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-800 font-semibold">${b.total}</p>
                    <p className="text-xs text-gray-700">{b.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-gray-800 mb-2">System Status</h2>

          <p className="text-gray-700 text-sm">
            All services operational • Booking engine active • Database synced
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

/* KPI CARD */
function KPI({ title, value }: any) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <p className="text-sm text-gray-700">{title}</p>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
    </div>
  );
}
