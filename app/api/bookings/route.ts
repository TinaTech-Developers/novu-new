import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET() {
  try {
    await connectDB();

    const bookings = await Booking.find().sort({ createdAt: -1 });

    return Response.json(bookings);
  } catch (error: any) {
    console.error("GET BOOKINGS ERROR:", error);

    return Response.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // ================= VALIDATION =================
    if (!body.roomId) {
      return Response.json({ error: "roomId is required" }, { status: 400 });
    }

    const checkIn = new Date(body.checkIn);

    const checkOut = new Date(body.checkOut);

    // ================= IMPORTANT =================
    // ONLY BLOCK CONFIRMED BOOKINGS
    const overlappingBooking = await Booking.findOne({
      roomId: body.roomId,

      status: "pending",

      $and: [
        {
          checkIn: { $lt: checkOut },
        },
        {
          checkOut: { $gt: checkIn },
        },
      ],
    });

    // ================= BLOCK DOUBLE BOOKING =================
    if (overlappingBooking) {
      return Response.json(
        {
          error: "Room already booked for selected dates",
        },
        { status: 400 },
      );
    }

    // ================= CREATE AS PENDING =================
    const booking = await Booking.create({
      roomId: body.roomId,

      roomName: body.roomName,

      category: body.category || "unknown",

      fullName: body.fullName,

      email: body.email,

      phone: body.phone,

      checkIn,

      checkOut,

      nights: body.nights || 1,

      total: body.total || 0,

      guests: body.guests || 1,

      // IMPORTANT
      status: body.status || "pending",
    });

    return Response.json(booking);
  } catch (error: any) {
    console.error("BOOKING ERROR:", error);

    return Response.json({ error: error.message }, { status: 500 });
  }
}
