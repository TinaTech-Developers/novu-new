import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["two-beds", "three-beds", "executive", "conference"],
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    pricing: {
      offPeak: {
        type: Number,
        required: true,
        default: 0,
      },

      peak: {
        type: Number,
        required: true,
        default: 0,
      },

      bedAndBreakfastOffPeak: {
        type: Number,
        default: null,
      },

      bedAndBreakfastPeak: {
        type: Number,
        default: null,
      },
    },

    capacity: {
      type: Number,
      default: 1,
    },

    facilities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    available: {
      type: Boolean,
      default: true,
    },

    bookedDates: [
      {
        start: {
          type: Date,
          required: true,
        },
        end: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);
