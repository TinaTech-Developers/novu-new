import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";
import Booking from "@/models/Booking";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query = category ? { category } : {};

    const rooms = await Room.find(query).sort({ createdAt: -1 });

    return Response.json(rooms);
  } catch (error) {
    return Response.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("📥 Incoming booking:", body);

    // 🚨 STEP 1: CHECK FOR CONFLICT (ADD HERE)
    const isConflict = await Booking.findOne({
      roomId: body.roomId,
      $or: [
        {
          checkIn: { $lte: body.checkOut },
          checkOut: { $gte: body.checkIn },
        },
      ],
    });

    if (isConflict) {
      return Response.json(
        { error: "Room already booked for these dates" },
        { status: 400 },
      );
    }

    // ✅ STEP 2: CREATE BOOKING ONLY IF SAFE
    const booking = await Booking.create(body);

    return Response.json(booking);
  } catch (error: any) {
    console.error("❌ Booking API FULL ERROR:", error);

    return Response.json(
      {
        error: error.message,
        details: error,
      },
      { status: 500 },
    );
  }
}
