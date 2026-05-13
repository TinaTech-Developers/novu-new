import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    hotelName: String,
    currency: { type: String, default: "USD" },
    taxRate: { type: Number, default: 0 },
    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "11:00" },
  },
  { timestamps: true },
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
