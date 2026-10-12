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

const apiRateLimiter = require(
  "./middleware/apiRateLimiter"
);

const rejectUnsafeMongoKeys = require(
  "./middleware/rejectUnsafeMongoKeys"
);

const requireJsonContentType = require(
  "./middleware/requireJsonContentType"
);

const noStore = require(
  "./middleware/noStore"
);

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
 *
 * Because this service is a JSON API rather than
 * an HTML frontend, it does not need to load scripts,
 * styles, frames, forms or external browser resources.
 */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'none'"
        ],

        baseUri: [
          "'none'"
        ],

        frameAncestors: [
          "'none'"
        ],

        formAction: [
          "'none'"
        ],

        objectSrc: [
          "'none'"
        ]
      }
    },

    referrerPolicy: {
      policy:
        "no-referrer"
    },

    crossOriginResourcePolicy: {
      policy:
        "same-site"
    }
  })
);

/*
 * Restrict browser cross-origin access.
 */
app.use(
  cors(corsOptions)
);

/*
 * Enforce JSON for API write operations.
 *
 * This must run before the JSON parser so unsupported
 * content types are rejected explicitly.
 */
app.use(
  "/api",
  requireJsonContentType
);

/*
 * Parse JSON bodies and restrict their size.
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
 * Reject dangerous MongoDB/operator-style keys.
 */
app.use(
  "/api",
  rejectUnsafeMongoKeys
);

/*
 * General API abuse protection.
 */
app.use(
  "/api",
  apiRateLimiter
);

/*
 * Health endpoint.
 */
app.get(
  "/api/health",
  (req, res) => {
    return res.status(200).json({
      success: true,
      message:
        "HustleHub+ API is running"
    });
  }
);

/*
 * Authentication API.
 *
 * Responses may contain authentication information
 * and therefore must not be cached.
 */
app.use(
  "/api/auth",
  noStore,
  authRateLimiter,
  authRoutes
);

/*
 * RBAC verification API.
 */
app.use(
  "/api/access",
  noStore,
  accessRoutes
);

/*
 * Gig marketplace API.
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
  noStore,
  bookingRoutes
);

/*
 * Financial Transaction API.
 */
app.use(
  "/api/transactions",
  noStore,
  transactionRoutes
);

/*
 * Controlled 404.
 */
app.use(
  notFoundHandler
);

/*
 * Global controlled error handling.
 */
app.use(
  globalErrorHandler
);

module.exports = app;