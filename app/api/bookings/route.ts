import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { transporter } from "@/lib/mailer";

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

    if (!body.roomId) {
      return Response.json({ error: "roomId is required" }, { status: 400 });
    }

    const checkIn = new Date(body.checkIn);
    const checkOut = new Date(body.checkOut);

    // Prevent overlapping pending/confirmed bookings
    const overlappingBooking = await Booking.findOne({
      roomId: body.roomId,
      status: { $in: ["pending", "confirmed"] },

      $and: [
        {
          checkIn: { $lt: checkOut },
        },
        {
          checkOut: { $gt: checkIn },
        },
      ],
    });

    if (overlappingBooking) {
      return Response.json(
        {
          error: "Room already booked for selected dates",
        },
        { status: 400 },
      );
    }

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

      breakfastIncluded: body.breakfastIncluded || false,

      status: "pending",
    });

    // ===========================
    // SEND CUSTOMER EMAIL
    // ===========================

    try {
      await transporter.sendMail({
        from: `"Novu Resort" <${process.env.EMAIL_USER}>`,
        to: booking.email,
        subject: "Booking Request Received - Novu Resort",

        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.7">

            <p>Dear ${booking.fullName},</p>

            <p>
              Thank you for choosing to stay with us.
              We are pleased to confirm that we have received your booking request.
            </p>

            <p>
              A deposit is required to secure your reservation.
            </p>

            <h3>Your Booking</h3>

            <table cellpadding="6">
              <tr>
                <td><strong>Room</strong></td>
                <td>${booking.roomName}</td>
              </tr>

              <tr>
                <td><strong>Check In</strong></td>
                <td>${new Date(booking.checkIn).toDateString()}</td>
              </tr>

              <tr>
                <td><strong>Check Out</strong></td>
                <td>${new Date(booking.checkOut).toDateString()}</td>
              </tr>

              <tr>
                <td><strong>Nights</strong></td>
                <td>${booking.nights}</td>
              </tr>

              <tr>
                <td><strong>Guests</strong></td>
                <td>${booking.guests}</td>
              </tr>

              <tr>
                <td><strong>Total</strong></td>
                <td>$${booking.total}</td>
              </tr>
            </table>

            <hr />

            <h3>Payment Options</h3>

            <h4>1. Cash Drop-Off</h4>

            <p>
              Number 9 Crossland Road<br>
              New Alexandra Park<br>
              Harare
            </p>

            <h4>2. EcoCash</h4>

            <p>
              EcoCash Number: +263772241125<br>
              Name: Vutsa Nyarumbu
            </p>

            <h4>3. Bank Transfer</h4>

            <p>
              Account Name: Rutwill Private Limited<br>
              Bank Name: FBC Bank<br>
              Account Number: 6832974352200<br>
              Branch: Southerton Harare<br>
              Reference: Please use your booking name.
            </p>

            <p>
              After making payment, please send proof of payment by replying
              to this email or via WhatsApp:
            </p>

            <ul>
              <li>+263712214219</li>
              <li>+263783288279</li>
              <li>0772146009</li>
            </ul>

            <h3>Important Information</h3>

            <ul>
              <li>
                A deposit of 50% of the total booking value is required to secure your reservation.
              </li>

              <li>
                Reservations are only confirmed once the deposit has been received and verified.
              </li>

              <li>
                The remaining balance must be paid before or upon check-in.
              </li>

              <li>
                Upon arrival, a refundable security deposit of $50 shall be paid and refunded on checkout provided there are no damages or missing items.
              </li>
            </ul>

            <p>
              We look forward to hosting you and hope you enjoy your stay.
            </p>

            <p>
              Kind regards,<br>
              <strong>Novu Resort</strong><br>
              +263783288279<br>
              novuresort@gmail.com
            </p>

          </div>
        `,
      });

      // ===========================
      // SEND ADMIN EMAIL
      // ===========================

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: "novuresort@gmail.com",
        subject: `New Booking - ${booking.roomName}`,

        html: `
          <h2>New Booking Request</h2>

          <p><strong>Name:</strong> ${booking.fullName}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Phone:</strong> ${booking.phone}</p>
          <p><strong>Room:</strong> ${booking.roomName}</p>
          <p><strong>Guests:</strong> ${booking.guests}</p>
          <p><strong>Total:</strong> $${booking.total}</p>
          <p><strong>Status:</strong> ${booking.status}</p>
        `,
      });
    } catch (mailError) {
      console.error("EMAIL ERROR:", mailError);
    }

    return Response.json({
      success: true,
      booking,
    });
  } catch (error: any) {
    console.error("BOOKING ERROR:", error);

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
