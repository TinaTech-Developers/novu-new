"use client";

import { useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import HotelCalendar from "./hotelcalendar";

export default function RoomBookingCard({ room }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ================= FETCH BOOKINGS =================
  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);

      const res = await fetch("/api/bookings", {
        cache: "no-store",
      });

      const data = await res.json();

      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ================= FILTER BOOKINGS FOR THIS ROOM =================
  const roomBookings = bookings.filter(
    (b) =>
      b.roomId?.toString() === room._id?.toString() && b.status === "confirmed",
  );

  // ================= OVERLAP CHECK =================
  const isOverlapping = (start: Date, end: Date, existingBookings: any[]) => {
    return existingBookings.some((b) => {
      const existingStart = new Date(b.checkIn);
      const existingEnd = new Date(b.checkOut);

      return start < existingEnd && end > existingStart;
    });
  };

  // ================= BLOCKED STATUS =================
  const blocked = !!(
    startDate &&
    endDate &&
    isOverlapping(startDate, endDate, roomBookings)
  );

  // ================= NIGHTS =================
  const nights =
    startDate && endDate ?
      Math.max(1, differenceInCalendarDays(endDate, startDate))
    : 0;

  // ================= TOTAL =================
  const total = nights * room.price;

  // ================= HANDLE BOOKING =================
  const handleBooking = async () => {
    try {
      if (!startDate || !endDate) {
        alert("Please select dates");
        return;
      }

      if (!name || !email || !phone) {
        alert("Please complete all required fields");
        return;
      }

      if (!room._id) {
        alert("Invalid room selected");
        return;
      }

      // FINAL LIVE CHECK BEFORE BOOKING
      const latestRes = await fetch("/api/bookings", {
        cache: "no-store",
      });

      const latestBookings = await latestRes.json();

      const latestRoomBookings = latestBookings.filter(
        (b: any) =>
          b.roomId?.toString() === room._id?.toString() &&
          b.status !== "cancelled",
      );

      const alreadyBooked = isOverlapping(
        startDate,
        endDate,
        latestRoomBookings,
      );

      if (alreadyBooked) {
        alert("Selected dates are already booked");
        return;
      }

      setSubmitting(true);

      const bookingData = {
        roomId: room._id,
        roomName: room.name,
        category: room.category || "unknown",

        fullName: name,
        email,
        phone,

        checkIn: startDate,
        checkOut: endDate,

        nights,
        total,
        guests: 1,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Booking failed");
        return;
      }

      // REFRESH BOOKINGS IMMEDIATELY
      await fetchBookings();

      alert("Booking submitted successfully!");

      // RESET FORM
      setName("");
      setEmail("");
      setPhone("");

      setStartDate(null);
      setEndDate(null);

      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= UI =================
  return (
    <>
      {/* BOOK BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          bg-[var(--primary)] text-white
          px-5 sm:px-6
          py-2.5
          text-sm sm:text-base
          rounded-md
          hover:opacity-90
          transition
          mt-6 md:mt-0
          w-full sm:w-auto
        "
      >
        Book Now
      </button>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 p-3 sm:p-5 overflow-y-auto">
          <div
            className="
              bg-white
              w-full
              max-w-6xl
              mx-auto
              rounded-2xl
              relative
              text-gray-700
              mt-4 sm:mt-8
              mb-4
            "
          >
            {/* CLOSE */}
            <button
              onClick={() => setIsOpen(false)}
              className="
                absolute
                top-3 right-4
                text-gray-600
                text-2xl
                hover:text-black
                z-20
              "
            >
              ×
            </button>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* TITLE */}
              <h2
                className="
                  text-xl sm:text-2xl lg:text-3xl
                  font-bold
                  text-[var(--primary)]
                  mb-5 sm:mb-6
                  pr-10
                "
              >
                Book {room.name}
              </h2>

              {/* CONTENT */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-8">
                {/* CALENDAR */}
                <div className="min-w-0">
                  <HotelCalendar
                    key={roomBookings.length}
                    bookedDates={roomBookings.map((b) => ({
                      start: b.checkIn,
                      end: b.checkOut,
                    }))}
                    onChange={({ start, end }) => {
                      setStartDate(start);
                      setEndDate(end);
                    }}
                  />

                  {loadingBookings && (
                    <p className="text-sm text-gray-500 mt-3">
                      Loading bookings...
                    </p>
                  )}
                </div>

                {/* FORM */}
                <div className="flex flex-col gap-4">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="
                      border border-gray-300
                      p-3
                      rounded-lg
                      text-sm sm:text-base
                      outline-none
                      focus:border-[var(--primary)]
                    "
                  />

                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    className="
                      border border-gray-300
                      p-3
                      rounded-lg
                      text-sm sm:text-base
                      outline-none
                      focus:border-[var(--primary)]
                    "
                  />

                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    className="
                      border border-gray-300
                      p-3
                      rounded-lg
                      text-sm sm:text-base
                      outline-none
                      focus:border-[var(--primary)]
                    "
                  />

                  {/* DATE SUMMARY */}
                  {startDate && endDate && (
                    <div className="bg-gray-100 p-4 rounded-xl space-y-2">
                      <p className="text-sm sm:text-base break-words">
                        <span className="font-semibold text-xs sm:text-sm">
                          Check In:
                        </span>{" "}
                        {startDate.toDateString()}
                      </p>

                      <p className="text-sm sm:text-base break-words">
                        <span className="font-semibold text-xs sm:text-sm">
                          Check Out:
                        </span>{" "}
                        {endDate.toDateString()}
                      </p>

                      <p className="text-sm sm:text-base">
                        <span className="font-semibold text-xs sm:text-sm">
                          Nights:
                        </span>{" "}
                        {nights}
                      </p>

                      <p className="font-bold text-base sm:text-lg">
                        Total: ${total.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* BLOCK MESSAGE */}
                  {blocked && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-xl text-sm">
                      Selected dates are unavailable.
                    </div>
                  )}

                  {/* BUTTON */}
                  <button
                    disabled={blocked || submitting}
                    onClick={handleBooking}
                    className={`
                      py-3 sm:py-4
                      rounded-xl
                      text-white
                      font-medium
                      text-sm sm:text-base
                      transition
                      mt-2

                      ${
                        blocked || submitting ?
                          "bg-gray-400 cursor-not-allowed"
                        : "bg-[var(--primary)] hover:opacity-90"
                      }
                    `}
                  >
                    {submitting ?
                      "Processing..."
                    : blocked ?
                      "Not Available"
                    : "Confirm Booking"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
