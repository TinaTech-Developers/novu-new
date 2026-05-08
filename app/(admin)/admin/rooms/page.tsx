"use client";

import { useEffect, useMemo, useState } from "react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

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

  // ================= FILTER + SEARCH =================
  const filtered = useMemo(() => {
    return rooms
      .filter((r) => (filter === "all" ? true : r.category === filter))
      .filter((r) => r.name?.toLowerCase().includes(search.toLowerCase()));
  }, [rooms, search, filter]);

  const stats = {
    total: rooms.length,
    available: rooms.filter((r) => r.available).length,
    booked: rooms.filter((r) => !r.available).length,
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Rooms Management</h1>

        <div className="flex gap-2 flex-wrap">
          <input
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg text-sm"
          />

          <select
            className="border p-2 rounded-lg text-sm"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="executive">Executive</option>
            <option value="conference">Conference</option>
            <option value="two-beds">Two Beds</option>
            <option value="three-beds">Three Beds</option>
          </select>

          <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm">
            + Add Room
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-gray-500 text-sm">Total Rooms</p>
          <h2 className="text-xl font-bold text-gray-800">{stats.total}</h2>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-gray-500 text-sm">Available</p>
          <h2 className="text-xl font-bold text-green-600">
            {stats.available}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-gray-500 text-sm">Booked</p>
          <h2 className="text-xl font-bold text-red-600">{stats.booked}</h2>
        </div>
      </div>

      {/* ================= GRID ================= */}
      {loading ?
        <p className="text-gray-500">Loading rooms...</p>
      : filtered.length === 0 ?
        <p className="text-gray-500">No rooms found</p>
      : <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((room) => (
            <div
              key={room._id}
              className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <img
                src={room.images?.[0] || "/placeholder.jpg"}
                className="h-40 w-full object-cover"
              />

              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">{room.name}</h2>

                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {room.category}
                  </span>
                </div>

                <p className="text-gray-500 text-sm">${room.price} / night</p>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    room.available ?
                      "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}
                >
                  {room.available ? "Available" : "Booked"}
                </span>

                <div className="flex justify-between pt-3">
                  <button
                    onClick={() => setSelected(room)}
                    className="text-blue-600 text-sm"
                  >
                    View
                  </button>

                  <button className="text-gray-700 text-sm">Edit</button>

                  <button className="text-red-600 text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      }

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-3">{selected.name}</h2>

            <img
              src={selected.images?.[0]}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />

            <p className="text-gray-600">{selected.description}</p>

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
