"use client";

import { useEffect, useMemo, useState } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ================= FILTER + SEARCH =================
  const filtered = useMemo(() => {
    return bookings
      .filter((b) => (filter === "all" ? true : b.status === filter))
      .filter((b) => {
        const q = search.toLowerCase();
        return (
          b.roomName?.toLowerCase().includes(q) ||
          b.fullName?.toLowerCase().includes(q) ||
          b.email?.toLowerCase().includes(q)
        );
      });
  }, [bookings, filter, search]);

  // ================= STATUS UPDATE =================
  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status } : b)),
    );
  };

  // ================= DELETE =================
  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking permanently?")) return;

    await fetch(`/api/bookings/${id}`, {
      method: "DELETE",
    });

    setBookings((prev) => prev.filter((b) => b._id !== id));
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    revenue: bookings.reduce((a, b) => a + (b.total || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>

        <div className="flex gap-2 flex-wrap">
          <input
            placeholder="Search bookings..."
            className="border p-2 rounded-lg text-sm text-gray-600 border-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-2 rounded-lg text-sm text-gray-600 border-gray-300"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: stats.total },
          { label: "Pending", value: stats.pending },
          { label: "Confirmed", value: stats.confirmed },
          { label: "Revenue", value: `$${stats.revenue}` },
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 border rounded-xl">
            <p className="text-gray-500 text-sm">{s.label}</p>
            <h2 className="text-xl font-bold text-gray-800">{s.value}</h2>
          </div>
        ))}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Room</th>
                <th className="p-3 text-left">Guest</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((b) => (
                <tr key={b._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-700">
                    {b.roomName}
                  </td>
                  <td className="p-3 text-gray-600">{b.fullName}</td>
                  <td className="p-3 text-gray-600">{b.email}</td>

                  <td className="p-3">
                    <span className="px-2 py-1 text-xs rounded bg-gray-500">
                      {b.status}
                    </span>
                  </td>

                  <td className="p-3 flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelected(b)}
                      className="text-xs px-2 py-1 bg-gray-700 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => updateStatus(b._id, "confirmed")}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() => updateStatus(b._id, "cancelled")}
                      className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded"
                    >
                      Cancel
                    </button>

                    <a
                      href={`mailto:${b.email}?subject=Booking Update`}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                    >
                      Email
                    </a>

                    <button
                      onClick={() => deleteBooking(b._id)}
                      className="text-xs px-2 py-1 bg-black text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-3">Booking Details</h2>

            <p>
              <b>Room:</b> {selected.roomName}
            </p>
            <p>
              <b>Name:</b> {selected.fullName}
            </p>
            <p>
              <b>Email:</b> {selected.email}
            </p>
            <p>
              <b>Phone:</b> {selected.phone}
            </p>
            <p>
              <b>Status:</b> {selected.status}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
