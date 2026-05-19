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
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }

  // ================= EXISTING PAYMENT =================
  const existingPaid = Number(booking.amountPaid || 0);

  // ================= NEW PAYMENT =================
  const newPayment = Number(body.amountPaid || 0);

  if (newPayment <= 0) {
    return Response.json({ error: "Invalid payment amount" }, { status: 400 });
  }

  // ================= TOTAL PAID =================
  const totalPaid = existingPaid + newPayment;

  // ================= PREVENT OVERPAYMENT =================
  if (totalPaid > booking.total) {
    return Response.json(
      { error: "Payment exceeds remaining balance" },
      { status: 400 },
    );
  }

  // ================= BALANCE =================
  const balance = Math.max(booking.total - totalPaid, 0);

  // ================= PAYMENT STATUS =================
  let paymentStatus = "unpaid";

  if (totalPaid <= 0) {
    paymentStatus = "unpaid";
  } else if (totalPaid < booking.total) {
    paymentStatus = "partial";
  } else {
    paymentStatus = "paid";
  }

  // ================= BOOKING STATUS =================
  const status =
    paymentStatus === "partial" || paymentStatus === "paid" ?
      "confirmed"
    : "pending";

  // ================= UPDATE =================
  const updated = await Booking.findByIdAndUpdate(
    id,
    {
      status,
      paymentStatus,

      amountPaid: totalPaid,
      balance,

      paymentMethod: body.paymentMethod,
      paymentProcessedBy: body.paymentProcessedBy,

      paidAt: new Date(),
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
