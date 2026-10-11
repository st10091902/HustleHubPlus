const rateLimit = require("express-rate-limit");

const bookingRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 20,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many booking requests. Please try again later."
  }
});

module.exports = bookingRateLimiter;