import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { NextRequest } from "next/server";

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
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  await connectDB();

  const body = await req.json();

  const booking = await Booking.findById(id);
  if (!booking) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const amountPaid = Number(body.amountPaid || 0);
  const balance = booking.total - amountPaid;
  let paymentStatus = "unpaid";

  if (amountPaid <= 0) paymentStatus = "unpaid";
  else if (amountPaid < booking.total) paymentStatus = "partial";
  else paymentStatus = "paid";

  // AUTO-CONFIRM RULE
  const status =
    paymentStatus === "partial" || paymentStatus === "paid" ?
      "confirmed"
    : "pending";

  // AUTO-CONFIRM RULE
  // if (paymentStatus === "partial" || paymentStatus === "paid") {
  //   status = "confirmed";
  // }

  const updated = await Booking.findByIdAndUpdate(
    id,
    {
      status,
      paymentStatus,
      amountPaid,
      balance,
      paymentMethod: body.paymentMethod,
      paymentProcessedBy: body.paymentProcessedBy,
    },
    { new: true },
  );
  return Response.json(updated);
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
