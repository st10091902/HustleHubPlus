const mongoose = require("mongoose");
const crypto = require("crypto");

const Booking = require("../models/Booking");
const Gig = require("../models/Gig");
const Transaction = require(
  "../models/Transaction"
);

/**
 * Create a Booking and corresponding Transaction.
 *
 * Both records are created inside one MongoDB
 * transaction so they either both succeed or both fail.
 */
const createBooking = async (
  req,
  res,
  next
) => {
  const session =
    await mongoose.startSession();

  try {
    const {
      gigId,
      requirements
    } = req.validatedBody;

    if (
      !mongoose.isValidObjectId(gigId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Gig identifier."
      });
    }

    let booking;
    let financialTransaction;

    await session.withTransaction(
      async () => {
        /*
         * Load the active Gig inside the
         * MongoDB transaction.
         */
        const gig = await Gig.findOne({
          _id: gigId,
          isActive: true
        }).session(session);

        if (!gig) {
          const error = new Error(
            "GIG_NOT_AVAILABLE"
          );

          throw error;
        }

        /*
         * Booking values are derived from
         * trusted server/database data.
         */
        const bookingDocuments =
          await Booking.create(
            [
              {
                gig: gig.id,
                client: req.user.id,
                freelancer:
                  gig.freelancer,
                gigTitle: gig.title,
                amount: gig.price,
                requirements,
                status: "CONFIRMED",
                paymentStatus:
                  "SIMULATED_CONFIRMED"
              }
            ],
            {
              session
            }
          );

        booking =
          bookingDocuments[0];

        /*
         * Automatically create the
         * financial record.
         */
        const transactionDocuments =
          await Transaction.create(
            [
              {
                transactionReference:
                  crypto.randomUUID(),

                booking: booking.id,

                gig: gig.id,

                client: req.user.id,

                freelancer:
                  gig.freelancer,

                gigTitle: gig.title,

                amount: gig.price,

                currency: "ZAR",

                type:
                  "BOOKING_PAYMENT",

                status:
                  "COMPLETED",

                paymentMethod:
                  "SIMULATED"
              }
            ],
            {
              session
            }
          );

        financialTransaction =
          transactionDocuments[0];
      }
    );

    /*
     * Populate the response only after the
     * database transaction has committed.
     */
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
        "Booking and transaction created successfully.",

      booking:
        populatedBooking,

      transaction: {
        id:
          financialTransaction.id,

        transactionReference:
          financialTransaction
            .transactionReference,

        amount:
          financialTransaction.amount,

        currency:
          financialTransaction.currency,

        status:
          financialTransaction.status,

        paymentMethod:
          financialTransaction
            .paymentMethod
      }
    });
  } catch (error) {
    if (
      error.message ===
      "GIG_NOT_AVAILABLE"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "The requested Gig is not available."
      });
    }

    next(error);
  } finally {
    await session.endSession();
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
    const bookings =
      await Booking.find({
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
 * Return bookings received by the
 * authenticated Freelancer.
 */
const getFreelancerBookings = async (
  req,
  res,
  next
) => {
  try {
    const bookings =
      await Booking.find({
        freelancer:
          req.user.id
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
 * the authenticated user participates in it.
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
        message:
          "Booking not found."
      });
    }

    const clientId =
      booking.client._id.toString();

    const freelancerId =
      booking.freelancer
        ._id.toString();

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