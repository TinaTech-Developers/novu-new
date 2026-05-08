import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

// ================= GET =================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    await connectDB();

    const booking = await Booking.findById(id);

    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    return Response.json(booking);
  } catch (error: any) {
    console.error("❌ GET booking by ID error:", error);

    return Response.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

// ================= PATCH =================
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    await connectDB();

    const body = await req.json();

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true },
    );

    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    return Response.json(booking);
  } catch (error: any) {
    console.error("❌ PATCH booking status error:", error);

    return Response.json(
      { error: "Failed to update booking status" },
      { status: 500 },
    );
  }
}

// ================= DELETE =================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    await connectDB();

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    return Response.json({ message: "Booking deleted" });
  } catch (error: any) {
    console.error("❌ DELETE booking error:", error);

    return Response.json(
      { error: "Failed to delete booking" },
      { status: 500 },
    );
  }
}
