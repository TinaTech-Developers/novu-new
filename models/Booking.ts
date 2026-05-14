import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    roomName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "unknown",
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    guests: {
      type: Number,
      default: 1,
      min: 1,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    nights: {
      type: Number,
      default: 1,
    },

    total: {
      type: Number,
      default: 0,
    },

    // ================= BOOKING STATUS =================
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    // ================= PAYMENT INFO =================
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "mobile_money"],
      default: null,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    balance: {
      type: Number,
      default: 0,
    },

    // ================= STAFF TRACKING =================
    confirmedBy: {
      type: String,
      default: null,
    },

    paymentProcessedBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
