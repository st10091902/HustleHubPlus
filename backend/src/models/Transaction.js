const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionReference: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
      index: true
    },

    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true
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

    currency: {
      type: String,
      enum: ["ZAR"],
      default: "ZAR"
    },

    type: {
      type: String,
      enum: ["BOOKING_PAYMENT"],
      default: "BOOKING_PAYMENT"
    },

    status: {
      type: String,
      enum: [
        "COMPLETED",
        "REFUNDED"
      ],
      default: "COMPLETED"
    },

    paymentMethod: {
      type: String,
      enum: ["SIMULATED"],
      default: "SIMULATED"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);

module.exports = Transaction;