import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";
import Booking from "@/models/Booking";

export async function GET() {
  try {
    await connectDB();

    const rooms = await Room.find();
    const bookings = await Booking.find();

    const now = new Date();

    // ================= CHECK IF ROOM IS BOOKED =================
    const isRoomBooked = (roomId: string) => {
      return bookings.some((b) => {
        if (b.roomId.toString() !== roomId.toString()) return false;

        return (
          new Date(b.checkIn) <= now &&
          new Date(b.checkOut) >= now &&
          b.status !== "cancelled"
        );
      });
    };

    // ================= ATTACH DYNAMIC STATUS =================
    const enrichedRooms = rooms.map((room) => {
      const booked = isRoomBooked(room._id);

      return {
        ...room.toObject(),
        available: !booked,
        isBooked: booked,
      };
    });

    return Response.json(enrichedRooms);
  } catch (error: any) {
    console.error("❌ GET rooms error:", error);

    return Response.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("📥 Incoming booking:", body);

    // ================= VALIDATION =================
    if (!body.roomId) {
      return Response.json({ error: "roomId is required" }, { status: 400 });
    }

    if (!body.fullName || !body.email || !body.checkIn || !body.checkOut) {
      return Response.json(
        { error: "Missing required booking fields" },
        { status: 400 },
      );
    }

    // ================= NORMALIZE DATA =================
    const booking = await Booking.create({
      roomId: body.roomId,
      roomName: body.roomName,
      category: body.category || "unknown",

      fullName: body.fullName,
      email: body.email,
      phone: body.phone,

      checkIn: new Date(body.checkIn),
      checkOut: new Date(body.checkOut),

      nights: body.nights || 1,
      total: body.total || 0,
      guests: body.guests || 1,
    });

    return Response.json(booking);
  } catch (error: any) {
    console.error("❌ Booking API FULL ERROR:", error);

    return Response.json(
      {
        error: error.message,
      },
      { status: 500 },
    );
  }
}
