const rateLimit = require(
  "express-rate-limit"
);

const apiRateLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit: 300,

    standardHeaders:
      "draft-8",

    legacyHeaders:
      false,

    message: {
      success: false,
      message:
        "Too many API requests. Please try again later."
    }
  });

module.exports =
  apiRateLimiter;