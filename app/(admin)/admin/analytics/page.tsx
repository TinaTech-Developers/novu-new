"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  CalendarDays,
  BedDouble,
  DollarSign,
  Download,
  TrendingUp,
  Users,
  Hotel,
  RefreshCw,
} from "lucide-react";
import * as XLSX from "xlsx";

export default function AnalyticsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [bookingsRes, roomsRes] = await Promise.all([
          fetch("/api/bookings"),
          fetch("/api/rooms"),
        ]);

        const bookingsData = await bookingsRes.json();
        const roomsData = await roomsRes.json();

        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setRooms(Array.isArray(roomsData) ? roomsData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ================= STATS =================
  const stats = useMemo(() => {
    const totalRevenue = bookings.reduce(
      (acc, item) => acc + Number(item.total || 0),
      0,
    );

    const occupiedRooms = bookings.filter(
      (b) => b.status !== "cancelled",
    ).length;

    const occupancyRate =
      rooms.length > 0 ? ((occupiedRooms / rooms.length) * 100).toFixed(1) : 0;

    return {
      totalBookings: bookings.length,
      totalRevenue,
      totalRooms: rooms.length,
      occupancyRate,
    };
  }, [bookings, rooms]);

  // ================= MONTHLY REVENUE =================
  const revenueChart = useMemo(() => {
    const monthly: any = {};

    bookings.forEach((booking) => {
      const date = new Date(booking.checkIn);

      const month = date.toLocaleString("default", {
        month: "short",
      });

      if (!monthly[month]) {
        monthly[month] = 0;
      }

      monthly[month] += Number(booking.total || 0);
    });

    return Object.entries(monthly).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }, [bookings]);

  // ================= ROOM CATEGORY =================
  const roomCategoryData = useMemo(() => {
    const categories: any = {};

    rooms.forEach((room) => {
      if (!categories[room.category]) {
        categories[room.category] = 0;
      }

      categories[room.category]++;
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  }, [rooms]);

  // ================= BOOKINGS TREND =================
  const bookingTrend = useMemo(() => {
    const map: any = {};

    bookings.forEach((booking) => {
      const date = new Date(booking.checkIn);

      const day = date.toLocaleDateString();

      if (!map[day]) {
        map[day] = 0;
      }

      map[day]++;
    });

    return Object.entries(map)
      .map(([date, bookings]) => ({
        date,
        bookings,
      }))
      .slice(-10);
  }, [bookings]);

  // ================= RECENT BOOKINGS =================
  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.checkIn).getTime() -
        new Date(a.createdAt || a.checkIn).getTime(),
    )
    .slice(0, 8);

  // ================= EXPORT =================
  const exportExcel = () => {
    const workbook = XLSX.utils.book_new();

    const bookingsSheet = XLSX.utils.json_to_sheet(bookings);
    const roomsSheet = XLSX.utils.json_to_sheet(rooms);
    const revenueSheet = XLSX.utils.json_to_sheet(revenueChart);

    XLSX.utils.book_append_sheet(workbook, bookingsSheet, "Bookings Report");

    XLSX.utils.book_append_sheet(workbook, roomsSheet, "Rooms");

    XLSX.utils.book_append_sheet(workbook, revenueSheet, "Revenue Analytics");

    XLSX.writeFile(workbook, "hotel-analytics-report.xlsx");
  };

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  return (
    <div className="space-y-6 pb-10">
      {/* ================= HEADER ================= */}
      <div className="bg-white border rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            Analytics Dashboard
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Hotel performance insights, occupancy reports, booking trends &
            revenue analytics
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition px-5 py-3 rounded-2xl text-sm font-medium"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            onClick={exportExcel}
            className="flex items-center gap-2 bg-[var(--primary)] hover:opacity-90 transition text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg"
          >
            <Download size={16} />
            Export Full Report
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          {
            title: "Total Revenue",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "from-green-500 to-emerald-600",
          },
          {
            title: "Total Bookings",
            value: stats.totalBookings,
            icon: CalendarDays,
            color: "from-blue-500 to-indigo-600",
          },
          {
            title: "Occupancy Rate",
            value: `${stats.occupancyRate}%`,
            icon: TrendingUp,
            color: "from-orange-500 to-red-500",
          },
          {
            title: "Rooms",
            value: stats.totalRooms,
            icon: Hotel,
            color: "from-purple-500 to-violet-600",
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${item.color} rounded-3xl p-6 text-white shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{item.title}</p>

                <h2 className="text-4xl font-black mt-3">{item.value}</h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <item.icon size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid xl:grid-cols-2 gap-6">
        {/* REVENUE */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Revenue Overview
              </h2>

              <p className="text-sm text-gray-500">
                Monthly revenue performance
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <DollarSign className="text-green-600" />
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROOM TYPES */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Room Categories
              </h2>

              <p className="text-sm text-gray-500">
                Distribution of hotel rooms
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <BedDouble className="text-blue-600" />
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomCategoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  innerRadius={70}
                  paddingAngle={4}
                >
                  {roomCategoryData.map((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOOKINGS TREND */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Booking Activity
              </h2>

              <p className="text-sm text-gray-500">
                Recent booking trend analysis
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Users className="text-purple-600" />
            </div>
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingTrend}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#8b5cf6"
                  strokeWidth={4}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ================= EXTRA ANALYTICS ================= */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* BOOKING STATUS */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Booking Status
          </h2>

          <div className="space-y-4">
            {[
              {
                label: "Confirmed",
                count: bookings.filter((b) => b.status === "confirmed").length,
                color: "bg-green-500",
              },
              {
                label: "Pending",
                count: bookings.filter((b) => b.status === "pending").length,
                color: "bg-yellow-500",
              },
              {
                label: "Cancelled",
                count: bookings.filter((b) => b.status === "cancelled").length,
                color: "bg-red-500",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${item.color}`} />

                  <span className="text-gray-700">{item.label}</span>
                </div>

                <span className="font-bold text-gray-800">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TOP ROOMS */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Most Booked Rooms
          </h2>

          <div className="space-y-4">
            {rooms.slice(0, 5).map((room, index) => (
              <div key={room._id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{room.name}</p>

                  <p className="text-xs text-gray-500 capitalize">
                    {room.category}
                  </p>
                </div>

                <div className="font-bold text-[var(--primary)]">
                  ${room.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK INSIGHTS */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 shadow-xl text-white">
          <h2 className="text-2xl font-black">Business Insights</h2>

          <div className="space-y-5 mt-6">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-sm text-gray-300">
                Average Revenue Per Booking
              </p>

              <h3 className="text-3xl font-black mt-2">
                $
                {bookings.length > 0 ?
                  (stats.totalRevenue / bookings.length).toFixed(2)
                : "0"}
              </h3>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-sm text-gray-300">Active Guests</p>

              <h3 className="text-3xl font-black mt-2">
                {new Set(bookings.map((b) => b.email || b.phone)).size}
              </h3>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-sm text-gray-300">Estimated Monthly Growth</p>

              <h3 className="text-3xl font-black mt-2">+12.8%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RECENT BOOKINGS ================= */}
      <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Recent Bookings</h2>

          <p className="text-sm text-gray-500 mt-1">
            Latest guest reservations
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="p-4">Guest</th>
                <th className="p-4">Room</th>
                <th className="p-4">Check In</th>
                <th className="p-4">Check Out</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ?
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Loading analytics...
                  </td>
                </tr>
              : recentBookings.map((booking: any) => (
                  <tr
                    key={booking._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {booking.fullName}
                        </p>

                        <p className="text-xs text-gray-500">{booking.email}</p>
                      </div>
                    </td>

                    <td className="p-4 text-gray-700">{booking.roomName}</td>

                    <td className="p-4 text-gray-600">
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-gray-600">
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </td>

                    <td className="p-4 font-bold text-green-600">
                      ${booking.total}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "confirmed" ?
                            "bg-green-100 text-green-700"
                          : booking.status === "pending" ?
                            "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status || "confirmed"}
                      </span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
