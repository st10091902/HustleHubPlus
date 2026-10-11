const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
  {
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60
    },

    price: {
      type: Number,
      required: true,
      min: 0.01
    },

    deliveryDays: {
      type: Number,
      required: true,
      min: 1,
      max: 365
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Gig = mongoose.model(
  "Gig",
  gigSchema
);

module.exports = Gig;