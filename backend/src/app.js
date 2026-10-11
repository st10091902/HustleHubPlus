const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const accessRoutes = require(
  "./routes/accessRoutes"
);

const gigRoutes = require(
  "./routes/gigRoutes"
);

const bookingRoutes = require(
  "./routes/bookingRoutes"
);

const transactionRoutes = require(
  "./routes/transactionRoutes"
);

const {
  authRateLimiter
} = require("./middleware/authRateLimiter");

const {
  corsOptions
} = require("./config/securityConfig");

const {
  notFoundHandler,
  globalErrorHandler
} = require("./middleware/errorHandler");

const app = express();

/*
 * Reduce unnecessary technology disclosure.
 */
app.disable("x-powered-by");

/*
 * Security-related HTTP headers.
 */
app.use(helmet());

/*
 * Restrict browser cross-origin access.
 */
app.use(cors(corsOptions));

/*
 * Parse JSON bodies and restrict request size.
 */
app.use(
  express.json({
    limit: "10kb",
    strict: true
  })
);

app.use(
  express.urlencoded({
    extended: false,
    limit: "10kb"
  })
);

/*
 * Health endpoint.
 */
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "HustleHub+ API is running"
  });
});

/*
 * Authentication API.
 */
app.use(
  "/api/auth",
  authRateLimiter,
  authRoutes
);

/*
 * RBAC verification routes.
 */
app.use(
  "/api/access",
  accessRoutes
);

/*
 * Gig marketplace and management API.
 */
app.use(
  "/api/gigs",
  gigRoutes
);

/*
 * Booking API.
 */
app.use(
  "/api/bookings",
  bookingRoutes
);

/*
 * Financial Transaction API.
 */
app.use(
  "/api/transactions",
  transactionRoutes
);

/*
 * Controlled 404 response.
 */
app.use(notFoundHandler);

/*
 * Final global error handler.
 */
app.use(globalErrorHandler);

module.exports = app;