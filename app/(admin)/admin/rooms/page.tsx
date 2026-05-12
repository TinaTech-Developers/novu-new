"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [selected, setSelected] = useState<any | null>(null);
  const [walkInModal, setWalkInModal] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const res = await fetch("/api/rooms");
      const data = await res.json();

      setRooms(data || []);
      setLoading(false);
    };

    load();
  }, []);

  // ================= FILTER =================
  const filtered = useMemo(() => {
    return rooms
      .filter((r) => (filter === "all" ? true : r.category === filter))
      .filter((r) => r.name?.toLowerCase().includes(search.toLowerCase()));
  }, [rooms, search, filter]);

  // ================= STATS =================
  const stats = {
    total: rooms.length,
    available: rooms.filter((r) => r.available).length,
    booked: rooms.filter((r) => !r.available).length,
  };

  // ================= WALK IN BOOKING =================
  const handleWalkInBooking = async () => {
    try {
      if (!selected) return;

      if (!guestName || !guestPhone) {
        alert("Please complete required fields");
        return;
      }

      setSubmitting(true);

      const today = new Date();

      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const payload = {
        roomId: selected._id,
        roomName: selected.name,
        category: selected.category,

        fullName: guestName,
        email: guestEmail,
        phone: guestPhone,

        checkIn: today,
        checkOut: tomorrow,

        nights: 1,
        total: selected.price,
        guests: 1,
        status: "confirmed",
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Booking failed");
        return;
      }

      alert("Walk-in booking successful");

      setWalkInModal(false);

      setGuestName("");
      setGuestPhone("");
      setGuestEmail("");

      // refresh rooms
      const refresh = await fetch("/api/rooms");
      const refreshData = await refresh.json();

      setRooms(refreshData || []);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Rooms Management</h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage rooms, availability & walk-in bookings
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <input
            placeholder="Search room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />

          <select
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none"
          >
            <option value="all">All Categories</option>
            <option value="executive">Executive</option>
            <option value="conference">Conference</option>
            <option value="two-beds">Two Beds</option>
            <option value="three-beds">Three Beds</option>
          </select>
        </div>
      </motion.div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Rooms",
            value: stats.total,
          },
          {
            label: "Available Rooms",
            value: stats.available,
          },
          {
            label: "Booked Rooms",
            value: stats.booked,
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            className="bg-white border rounded-2xl p-5 shadow-sm"
          >
            <p className="text-gray-500 text-sm">{item.label}</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {item.value}
            </h2>
          </motion.div>
        ))}
      </div>

      {/* ================= TABLE ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border rounded- overflow-hidden shadow-sm"
      >
        <div className="max-h-[550px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr className="text-left text-sm text-gray-600">
                <th className="p-4">Room</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ?
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    Loading rooms...
                  </td>
                </tr>
              : filtered.length === 0 ?
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No rooms found
                  </td>
                </tr>
              : filtered.map((room) => (
                  <tr
                    key={room._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={room.images?.[0] || "/placeholder.jpg"}
                          className="w-14 h-14 rounded-xl object-cover"
                        />

                        <div>
                          <h2 className="font-semibold text-gray-800">
                            {room.name}
                          </h2>

                          <p className="text-xs text-gray-500">
                            Room ID: {room._id?.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-gray-600 capitalize">
                      {room.category}
                    </td>

                    <td className="p-4 font-semibold text-gray-700">
                      ${room.price}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          room.available ?
                            "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                      >
                        {room.available ? "Available" : "Booked"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => setSelected(room)}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs hover:opacity-90"
                        >
                          View
                        </button>

                        <button
                          onClick={() => {
                            setSelected(room);
                            setWalkInModal(true);
                          }}
                          className="px-3 py-1.5 bg-[var(--primary)] text-white rounded-lg text-xs hover:opacity-90"
                        >
                          Walk In
                        </button>

                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs">
                          Edit
                        </button>

                        <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ================= VIEW MODAL ================= */}
      <AnimatePresence>
        {selected && !walkInModal && (
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
              className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
            >
              <img
                src={selected.images?.[0] || "/placeholder.jpg"}
                className="h-64 w-full object-cover"
              />

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selected.name}
                  </h2>

                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                    {selected.category}
                  </span>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {selected.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500">Price</p>
                    <h3 className="font-bold text-lg text-gray-800">
                      ${selected.price}
                    </h3>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500">Status</p>

                    <h3
                      className={`font-bold text-lg ${
                        selected.available ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {selected.available ? "Available" : "Booked"}
                    </h3>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 bg-gray-200 rounded-xl text-sm"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => {
                      setWalkInModal(true);
                    }}
                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl text-sm"
                  >
                    Book Walk-In
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= WALK IN MODAL ================= */}
      <AnimatePresence>
        {walkInModal && selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Walk-In Booking
              </h2>

              <p className="text-sm text-gray-500 mb-6">
                Create instant booking for{" "}
                <span className="font-semibold">{selected.name}</span>
              </p>

              <div className="space-y-4">
                <input
                  placeholder="Guest Name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />

                <input
                  placeholder="Phone Number"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />

                <input
                  placeholder="Email Address"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setWalkInModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  disabled={submitting}
                  onClick={handleWalkInBooking}
                  className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl"
                >
                  {submitting ? "Processing..." : "Confirm Booking"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
