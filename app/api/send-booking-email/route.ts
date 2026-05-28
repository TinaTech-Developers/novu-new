import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const booking = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const balance = booking.total - (booking.amountPaid || 0);

    await transporter.sendMail({
      from: `"Hotel Management" <${process.env.EMAIL_USER}>`,

      to: booking.email,

      subject: `Booking Confirmation - ${booking.roomName}`,

      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Booking Confirmation</h2>

          <p>Dear ${booking.fullName},</p>

          <p>
            We are pleased to confirm your booking with us.
          </p>

          <hr />

          <h3>Booking Details</h3>

          <p><strong>Room:</strong> ${booking.roomName}</p>

          <p><strong>Category:</strong> ${booking.category}</p>

          <p>
            <strong>Check In:</strong>
            ${new Date(booking.checkIn).toDateString()}
          </p>

          <p>
            <strong>Check Out:</strong>
            ${new Date(booking.checkOut).toDateString()}
          </p>

          <p><strong>Guests:</strong> ${booking.guests}</p>

          ${
            booking.breakfastIncluded ?
              `
                <p>
                  <strong>Breakfast:</strong>
                  Included
                </p>
              `
            : ""
          }

          <hr />

          <h3>Payment Summary</h3>

          <p><strong>Total:</strong> $${booking.total}</p>

          <p>
            <strong>Amount Paid:</strong>
            $${booking.amountPaid || 0}
          </p>

          <p>
            <strong>Balance:</strong>
            $${balance.toFixed(2)}
          </p>

          <p>
            <strong>Status:</strong>
            ${booking.paymentStatus || "pending"}
          </p>

          <br />

          <p>
            Check-in starts at 2:00 PM and
            check-out is at 10:00 AM.
          </p>

          <p>
            We look forward to hosting you.
          </p>

          <br />

          <p>
            Kind regards,<br />
            Hotel Management Team
          </p>
        </div>
      `,
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to send email",
      },
      {
        status: 500,
      },
    );
  }
}
