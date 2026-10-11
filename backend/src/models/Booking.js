const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
      index: true
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    gigTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01
    },

    requirements: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED"
      ],
      default: "CONFIRMED"
    },

    paymentStatus: {
      type: String,
      enum: [
        "SIMULATED_CONFIRMED",
        "REFUNDED"
      ],
      default: "SIMULATED_CONFIRMED"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Booking = mongoose.model(
  "Booking",
  bookingSchema
);

module.exports = Booking;