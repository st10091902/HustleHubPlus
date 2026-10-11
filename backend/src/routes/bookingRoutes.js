const express = require("express");

const {
  createBooking,
  getClientBookings,
  getFreelancerBookings,
  getBookingById
} = require(
  "../controllers/bookingController"
);

const {
  createBookingSchema
} = require(
  "../validators/bookingValidators"
);

const authenticateToken = require(
  "../middleware/authenticateToken"
);

const authorizeRoles = require(
  "../middleware/authorizeRoles"
);

const validateRequest = require(
  "../middleware/validateRequest"
);

const validateObjectId = require(
  "../middleware/validateObjectId"
);

const bookingRateLimiter = require(
  "../middleware/bookingRateLimiter"
);

const {
  ROLES
} = require("../config/roles");

const router = express.Router();

/*
 * CLIENT:
 * Create a booking.
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles(ROLES.CLIENT),
  bookingRateLimiter,
  validateRequest(createBookingSchema),
  createBooking
);

/*
 * CLIENT:
 * View own bookings.
 */
router.get(
  "/client",
  authenticateToken,
  authorizeRoles(ROLES.CLIENT),
  getClientBookings
);

/*
 * FREELANCER:
 * View bookings made for their Gigs.
 */
router.get(
  "/freelancer",
  authenticateToken,
  authorizeRoles(ROLES.FREELANCER),
  getFreelancerBookings
);

/*
 * CLIENT or FREELANCER:
 * View one Booking when they participate in it.
 *
 * This must come after /client and /freelancer.
 */
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(
    ROLES.CLIENT,
    ROLES.FREELANCER
  ),
  validateObjectId("id"),
  getBookingById
);

module.exports = router;