const mongoose = require("mongoose");

const Transaction = require(
  "../models/Transaction"
);

/**
 * Return transactions belonging to
 * the authenticated Client.
 */
const getClientTransactions = async (
  req,
  res,
  next
) => {
  try {
    const transactions =
      await Transaction.find({
        client: req.user.id
      })
        .populate(
          "gig",
          "title category"
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
      count: transactions.length,
      transactions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Return financial transactions belonging
 * to the authenticated Freelancer.
 */
const getFreelancerTransactions = async (
  req,
  res,
  next
) => {
  try {
    const transactions =
      await Transaction.find({
        freelancer:
          req.user.id
      })
        .populate(
          "gig",
          "title category"
        )
        .populate(
          "client",
          "name"
        )
        .sort({
          createdAt: -1
        });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate Freelancer income from completed
 * booking-payment transactions.
 */
const getFreelancerIncome = async (
  req,
  res,
  next
) => {
  try {
    const freelancerId =
      new mongoose.Types.ObjectId(
        req.user.id
      );

    const result =
      await Transaction.aggregate([
        {
          $match: {
            freelancer:
              freelancerId,

            type:
              "BOOKING_PAYMENT",

            status:
              "COMPLETED"
          }
        },

        {
          $group: {
            _id: null,

            totalIncome: {
              $sum: "$amount"
            },

            transactionCount: {
              $sum: 1
            }
          }
        }
      ]);

    const summary =
      result.length > 0
        ? result[0]
        : {
            totalIncome: 0,
            transactionCount: 0
          };

    return res.status(200).json({
      success: true,

      income: {
        currency: "ZAR",

        totalIncome:
          summary.totalIncome,

        completedTransactions:
          summary.transactionCount
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Return one Transaction only if the
 * authenticated user participated in it.
 */
const getTransactionById = async (
  req,
  res,
  next
) => {
  try {
    const transaction =
      await Transaction.findById(
        req.params.id
      )
        .populate(
          "gig",
          "title category"
        )
        .populate(
          "client",
          "name email"
        )
        .populate(
          "freelancer",
          "name"
        );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message:
          "Transaction not found."
      });
    }

    const clientId =
      transaction.client
        ._id.toString();

    const freelancerId =
      transaction.freelancer
        ._id.toString();

    if (
      req.user.id !== clientId &&
      req.user.id !== freelancerId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorised to access this transaction."
      });
    }

    return res.status(200).json({
      success: true,
      transaction
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClientTransactions,
  getFreelancerTransactions,
  getFreelancerIncome,
  getTransactionById
};