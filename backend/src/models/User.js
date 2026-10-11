const mongoose = require("mongoose");

const {
  ROLES
} = require("../config/roles");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254
    },

    passwordHash: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const User = mongoose.model(
  "User",
  userSchema
);

module.exports = User;