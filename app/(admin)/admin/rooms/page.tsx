"use client";
import {
  calculateBookingTotal,
  isPeakSeason,
  isZimbabweHoliday,
} from "@/lib/pricing";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HotelCalendar from "@/app/(main)/accommodation/executive/_components/hotelcalendar";
import { differenceInCalendarDays } from "date-fns";
import AdminLayout from "../_components/layout";

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

  const [startDate, setStartDate] = useState<Date | null>(null);

  const [endDate, setEndDate] = useState<Date | null>(null);

  const [bookings, setBookings] = useState<any[]>([]);

  // ================= EDIT ROOM DATA =================const [editModal, setEditModal] = useState(false);

  const [editModal, setEditModal] = useState(false);

  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAvailable, setEditAvailable] = useState(true);
  const [editImage, setEditImage] = useState("");

  // ================= HANDLEUPDATE =================
  const handleUpdateRoom = async () => {
    try {
      if (!selected) return;

      setSubmitting(true);

      const payload = {
        name: editName,
        price: Number(editPrice),
        category: editCategory,
        description: editDescription,
        available: editAvailable,
        images: [editImage],
      };

      const res = await fetch(`/api/rooms/${selected._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update room");
        return;
      }

      alert("Room updated successfully");

      setRooms((prev) =>
        prev.map((r) =>
          r._id === selected._id ?
            {
              ...r,
              ...payload,
            }
          : r,
        ),
      );

      setEditModal(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

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

  // ===============FETCH BOOKINGS =================
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          fetch("/api/rooms"),
          fetch("/api/bookings"),
        ]);

        const roomsData = await roomsRes.json();
        const bookingsData = await bookingsRes.json();

        setRooms(roomsData || []);
        setBookings(bookingsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
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

  // ==============additional states for booking management=================
  const selectedRoomBookings = bookings.filter(
    (b) =>
      b.roomId?.toString() === selected?._id?.toString() &&
      b.status !== "cancelled",
  );

  // ================= NIGHTS =================
  const nights =
    startDate && endDate ?
      Math.max(1, differenceInCalendarDays(endDate, startDate))
    : 0;

  // ================= TOTAL =================
  const total =
    selected && startDate && endDate ?
      calculateBookingTotal(selected, startDate, endDate)
    : 0;

  // ===========overlap check for walk-in booking=================

  const isOverlapping = (start: Date, end: Date, existingBookings: any[]) => {
    return existingBookings.some((b) => {
      const existingStart = new Date(b.checkIn);
      const existingEnd = new Date(b.checkOut);

      return start < existingEnd && end > existingStart;
    });
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
    <AdminLayout>
      <div className="space-y-6">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Rooms Management
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Manage rooms, availability & walk-in bookings
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <input
              placeholder="Search room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded- text-gray-800 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />

            <select
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 text-gray-800 rounded- px-4 py-2 text-sm outline-none"
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

                          <button
                            onClick={() => {
                              setSelected(room);

                              setEditName(room.name || "");
                              setEditPrice(room.price || "");
                              setEditCategory(room.category || "");
                              setEditDescription(room.description || "");
                              setEditAvailable(room.available);
                              setEditImage(room.images?.[0] || "");

                              setEditModal(true);
                            }}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200"
                          >
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
              className="fixed inset-0 bg-black/60 flex items-center  justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9 }}
                className="bg-white  overflow-hidden max-w-lg w-full h-[90vh]  shadow-2xl"
              >
                <img
                  src={selected.images?.[0] || "/placeholder.jpg"}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                      {selected.name}
                    </h2>

                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                      {selected.category}
                    </span>
                  </div>

                  <p className="text-gray-600  text-sm leading-relaxe">
                    {selected.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-2 rounded-xl">
                      <p className="text-xs text-gray-500">Price</p>
                      <h3 className="font-bold text-lg text-gray-800">
                        ${selected.price}
                      </h3>
                    </div>

                    <div className="bg-gray-50 p-2 rounded-xl">
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

                  <div className="flex justify-end gap-3 p-2 mb-5">
                    <button
                      onClick={() => setSelected(null)}
                      className="px-4 py-2 bg-red-600 text-sm"
                    >
                      Close
                    </button>

                    <button
                      onClick={() => {
                        setWalkInModal(true);
                      }}
                      className="px-4 py-2 bg-[var(--primary)] text-white text-sm"
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="bg-white w-full max-w-5xl overflow-hidden shadow-2xl"
              >
                <div className="grid lg:grid-cols-2">
                  {/* ================= LEFT SIDE ================= */}
                  <div className="relative h-full bg-black">
                    <img
                      src={selected.images?.[0] || "/placeholder.jpg"}
                      className="w-full h-full object-cover opacity-80"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />

                    <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                      <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold">{selected.name}</h2>

                        <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs uppercase tracking-wider">
                          {selected.category}
                        </span>
                      </div>

                      <p className="text-sm text-gray-200 mt-3 leading-relaxed">
                        {selected.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                          <p className="text-xs text-gray-300 uppercase tracking-wide">
                            Price Per Night
                          </p>

                          <h3 className="text-2xl font-bold mt-1">
                            ${selected.price}
                          </h3>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                          <p className="text-xs text-gray-300 uppercase tracking-wide">
                            Status
                          </p>

                          <h3
                            className={`text-2xl font-bold mt-1 ${
                              selected.available ? "text-green-400" : (
                                "text-red-400"
                              )
                            }`}
                          >
                            {selected.available ? "Available" : "Booked"}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ================= RIGHT SIDE ================= */}
                  <div className="p-8 lg:p-10 overflow-y-auto max-h-[90vh]">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          Walk-In Booking
                        </h2>

                        <p className="text-gray-500 mt-2 text-sm">
                          Create a direct booking for hotel reception guests.
                        </p>
                      </div>

                      <button
                        onClick={() => setWalkInModal(false)}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center text-gray-600 text-xl"
                      >
                        ×
                      </button>
                    </div>

                    {/* ================= BOOKING COMPONENT ================= */}
                    <div className="space-y-5">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                          Guest Full Name
                        </label>

                        <input
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Enter guest full name"
                          className="w-full border border-gray-300 px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                          Phone Number
                        </label>

                        <input
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="Enter phone number"
                          className="w-full border border-gray-300 px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                          Email Address
                        </label>

                        <input
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="Enter email address"
                          type="email"
                          className="w-full border border-gray-300 px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
                        />
                      </div>

                      {/* ================= CALENDAR ================= */}
                      <div className="border   p-4 mt-4 z-50">
                        <HotelCalendar
                          bookedDates={selectedRoomBookings.map((b) => ({
                            start: b.checkIn,
                            end: b.checkOut,
                          }))}
                          onChange={({ start, end }) => {
                            setStartDate(start);
                            setEndDate(end);
                          }}
                        />
                      </div>

                      {/* ================= SUMMARY ================= */}
                      {startDate && endDate && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 border rounded-3xl p-5"
                        >
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-500 text-sm">
                              Check In
                            </span>

                            <span className="font-semibold text-gray-800 text-sm">
                              {startDate.toDateString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-500 text-sm">
                              Check Out
                            </span>

                            <span className="font-semibold text-gray-800 text-sm">
                              {endDate.toDateString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-500 text-sm">
                              Nights
                            </span>

                            <span className="text-2xl font-bold text-[var(--primary)]">
                              ${total.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-4">
                            <span className="font-semibold text-gray-700">
                              Total Amount
                            </span>

                            <span className="text-2xl font-bold text-[var(--primary)]">
                              ${total.toFixed(2)}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* ================= ACTIONS ================= */}
                      <div className="flex justify-end gap-4 pt-4">
                        <button
                          onClick={() => setWalkInModal(false)}
                          className="px-6 py-2 bg-red-600 hover:bg-red-700 transition text-white font-medium"
                        >
                          Cancel
                        </button>

                        <button
                          disabled={submitting}
                          onClick={handleWalkInBooking}
                          className="px-6 py-2 bg-[var(--primary)] hover:opacity-90 transition text-white font-semibold shadow-lg"
                        >
                          {submitting ?
                            "Processing..."
                          : "Confirm Walk-In Booking"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ================= EDIT ROOM MODAL ================= */}
          <AnimatePresence>
            {editModal && selected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9 }}
                  className="bg-white w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                >
                  {/* HEADER */}
                  <div className="relative h-52">
                    <img
                      src={editImage || "/placeholder.jpg"}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/50" />

                    <div className="absolute bottom-6 left-6 text-white">
                      <h2 className="text-3xl font-bold">Edit Room</h2>

                      <p className="text-sm text-gray-200 mt-1">
                        Update room details & availability
                      </p>
                    </div>

                    <button
                      onClick={() => setEditModal(false)}
                      className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white w-10 h-10 rounded-full"
                    >
                      ×
                    </button>
                  </div>

                  {/* BODY */}
                  <div className="p-8 grid md:grid-cols-2 gap-5 overflow-y-auto flex-1">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Room Name
                      </label>

                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full border border-gray-300 text-gray-700  px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Price Per Night
                      </label>

                      <input
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        type="number"
                        className="w-full border border-gray-300 text-gray-700  px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Category
                      </label>

                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full border border-gray-300 text-gray-700  px-4 py-2 outline-none"
                      >
                        <option value="executive">Executive</option>
                        <option value="conference">Conference</option>
                        <option value="two-beds">Two Beds</option>
                        <option value="three-beds">Three Beds</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Image URL
                      </label>

                      <input
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                        className="w-full border border-gray-300 text-gray-700  px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Description
                      </label>

                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 text-gray-700  px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>

                    {/* AVAILABILITY */}
                    <div className="md:col-span-2 flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Room Availability
                        </h3>

                        <p className="text-sm text-gray-500">
                          Toggle whether this room is available for booking
                        </p>
                      </div>

                      <button
                        onClick={() => setEditAvailable(!editAvailable)}
                        className={`w-20 h-10 rounded-full transition relative ${
                          editAvailable ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-8 h-8 bg-white rounded-full transition ${
                            editAvailable ? "left-11" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-end gap-4 px-8 pb-8">
                    <button
                      onClick={() => setEditModal(false)}
                      className="px-6 py-2 rounded- bg-red-600 hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>

                    <button
                      disabled={submitting}
                      onClick={handleUpdateRoom}
                      className="px-6 py-2  bg-[var(--primary)] text-white font-semibold shadow-lg hover:opacity-90 transition"
                    >
                      {submitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
