"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();
      setBooking(data);
    };

    if (id) fetchBooking();
  }, [id]);

  if (!booking) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border rounded-xl mt-6">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>

      <div className="space-y-2 text-gray-700">
        <p>
          <b>Room:</b> {booking.roomName}
        </p>
        <p>
          <b>Name:</b> {booking.fullName}
        </p>
        <p>
          <b>Email:</b> {booking.email}
        </p>
        <p>
          <b>Phone:</b> {booking.phone}
        </p>
        <p>
          <b>Status:</b> {booking.status}
        </p>
        <p>
          <b>Check In:</b> {new Date(booking.checkIn).toDateString()}
        </p>
        <p>
          <b>Check Out:</b> {new Date(booking.checkOut).toDateString()}
        </p>
        <p>
          <b>Total:</b> ${booking.total}
        </p>
      </div>
    </div>
  );
}
