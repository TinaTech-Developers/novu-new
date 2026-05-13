"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../_components/layout";

export default function GuestsPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const res = await fetch("/api/bookings");
      const data = await res.json();

      // Extract unique guests from bookings
      const uniqueGuestsMap = new Map();

      (data || []).forEach((b: any) => {
        if (!uniqueGuestsMap.has(b.email)) {
          uniqueGuestsMap.set(b.email, {
            name: b.fullName,
            email: b.email,
            phone: b.phone,
            bookings: 1,
            totalSpent: b.total || 0,
            lastVisit: b.checkIn,
          });
        } else {
          const g = uniqueGuestsMap.get(b.email);
          g.bookings += 1;
          g.totalSpent += b.total || 0;

          if (new Date(b.checkIn) > new Date(g.lastVisit)) {
            g.lastVisit = b.checkIn;
          }
        }
      });

      setGuests(Array.from(uniqueGuestsMap.values()));
      setLoading(false);
    };

    load();
  }, []);

  // ================= FILTER =================
  const filtered = useMemo(() => {
    return guests.filter(
      (g) =>
        g.name?.toLowerCase().includes(search.toLowerCase()) ||
        g.email?.toLowerCase().includes(search.toLowerCase()) ||
        g.phone?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [guests, search]);

  // ================= STATS =================
  const stats = {
    totalGuests: guests.length,
    totalBookings: guests.reduce((a, b) => a + b.bookings, 0),
    revenue: guests.reduce((a, b) => a + b.totalSpent, 0),
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ================= HEADER ================= */}
        <div className="bg-white border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Guests</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all hotel guests & booking history
            </p>
          </div>

          <input
            placeholder="Search guests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Guests", value: stats.totalGuests },
            { label: "Total Bookings", value: stats.totalBookings },
            { label: "Total Revenue", value: `$${stats.revenue}` },
          ].map((s, i) => (
            <div key={i} className="bg-white border rounded-2xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm">{s.label}</p>
              <h2 className="text-2xl font-bold text-gray-800 mt-2">
                {s.value}
              </h2>
            </div>
          ))}
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white border shadow-sm overflow-hidden">
          <div className="max-h-[550px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr className="text-left text-gray-600">
                  <th className="p-4">Guest</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Bookings</th>
                  <th className="p-4">Spent</th>
                  <th className="p-4">Last Visit</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ?
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      Loading guests...
                    </td>
                  </tr>
                : filtered.length === 0 ?
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      No guests found
                    </td>
                  </tr>
                : filtered.map((g, i) => (
                    <tr
                      key={i}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-semibold text-gray-800">
                        {g.name}
                      </td>

                      <td className="p-4 text-gray-600">
                        <div>{g.email}</div>
                        <div className="text-xs text-gray-400">{g.phone}</div>
                      </td>

                      <td className="p-4">{g.bookings}</td>

                      <td className="p-4 font-semibold text-gray-700">
                        ${g.totalSpent}
                      </td>

                      <td className="p-4 text-gray-500">
                        {new Date(g.lastVisit).toDateString()}
                      </td>

                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => setSelected(g)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs"
                        >
                          View
                        </button>

                        <a
                          href={`mailto:${g.email}`}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs"
                        >
                          Email
                        </a>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= MODAL ================= */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9 }}
                className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
              >
                <h2 className="text-xl font-bold mb-4">Guest Profile</h2>

                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <b>Name:</b> {selected.name}
                  </p>
                  <p>
                    <b>Email:</b> {selected.email}
                  </p>
                  <p>
                    <b>Phone:</b> {selected.phone}
                  </p>
                  <p>
                    <b>Bookings:</b> {selected.bookings}
                  </p>
                  <p>
                    <b>Total Spent:</b> ${selected.totalSpent}
                  </p>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
