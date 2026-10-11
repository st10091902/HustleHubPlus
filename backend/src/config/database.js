const mongoose = require("mongoose");

/**
 * Connect HustleHub+ to MongoDB.
 */
const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MongoDB connection string is not configured.");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Unable to connect to MongoDB.");

    throw error;
  }
};

module.exports = {
  connectDatabase
};