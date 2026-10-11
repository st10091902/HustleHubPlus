const Booking = require("../models/Booking");
const Gig = require("../models/Gig");

/**
 * Create a booking for an active Gig.
 *
 * The authenticated Client supplies only the Gig ID
 * and optional requirements.
 *
 * Freelancer and price are retrieved from MongoDB
 * and are never trusted from client-supplied input.
 */
const createBooking = async (
  req,
  res,
  next
) => {
  try {
    const {
      gigId,
      requirements
    } = req.validatedBody;

    /*
     * Confirm that the supplied Gig ID is valid.
     */
    const mongoose = require("mongoose");

    if (!mongoose.isValidObjectId(gigId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Gig identifier."
      });
    }

    /*
     * Only active marketplace Gigs may be booked.
     */
    const gig = await Gig.findOne({
      _id: gigId,
      isActive: true
    });

    if (!gig) {
      return res.status(404).json({
        success: false,
        message:
          "The requested Gig is not available."
      });
    }

    /*
     * IMPORTANT:
     * The authenticated Client becomes the booking Client.
     * Freelancer and amount come from the Gig itself.
     */
    const booking = await Booking.create({
      gig: gig.id,
      client: req.user.id,
      freelancer: gig.freelancer,
      gigTitle: gig.title,
      amount: gig.price,
      requirements,
      status: "CONFIRMED",
      paymentStatus: "SIMULATED_CONFIRMED"
    });

    const populatedBooking =
      await Booking.findById(
        booking.id
      )
        .populate(
          "gig",
          "title category deliveryDays"
        )
        .populate(
          "client",
          "name email"
        )
        .populate(
          "freelancer",
          "name"
        );

    return res.status(201).json({
      success: true,
      message:
        "Booking created successfully.",
      booking: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Return bookings belonging to the
 * authenticated Client.
 */
const getClientBookings = async (
  req,
  res,
  next
) => {
  try {
    const bookings = await Booking.find({
      client: req.user.id
    })
      .populate(
        "gig",
        "title category deliveryDays isActive"
      )
      .populate(
        "freelancer",
        "name"
      )
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Return bookings made for Gigs owned by
 * the authenticated Freelancer.
 */
const getFreelancerBookings = async (
  req,
  res,
  next
) => {
  try {
    const bookings = await Booking.find({
      freelancer: req.user.id
    })
      .populate(
        "gig",
        "title category deliveryDays"
      )
      .populate(
        "client",
        "name email"
      )
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Return an individual Booking only when
 * the authenticated user is a participant.
 */
const getBookingById = async (
  req,
  res,
  next
) => {
  try {
    const booking =
      await Booking.findById(
        req.params.id
      )
        .populate(
          "gig",
          "title category deliveryDays"
        )
        .populate(
          "client",
          "name email"
        )
        .populate(
          "freelancer",
          "name"
        );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    /*
     * Only the Client or Freelancer involved
     * in this Booking may retrieve it.
     */
    const clientId =
      booking.client._id.toString();

    const freelancerId =
      booking.freelancer._id.toString();

    if (
      req.user.id !== clientId &&
      req.user.id !== freelancerId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorised to access this booking."
      });
    }

    return res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getClientBookings,
  getFreelancerBookings,
  getBookingById
};