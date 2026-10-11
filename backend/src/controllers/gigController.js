const Gig = require("../models/Gig");

/**
 * Return all active gigs available in the marketplace.
 */
const getAvailableGigs = async (
  req,
  res,
  next
) => {
  try {
    const gigs = await Gig.find({
      isActive: true
    })
      .populate("freelancer", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: gigs.length,
      gigs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Return one active marketplace gig.
 */
const getGigById = async (
  req,
  res,
  next
) => {
  try {
    const gig = await Gig.findOne({
      _id: req.params.id,
      isActive: true
    }).populate(
      "freelancer",
      "name"
    );

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found."
      });
    }

    return res.status(200).json({
      success: true,
      gig
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Return all gigs belonging to the
 * currently authenticated Freelancer.
 */
const getMyGigs = async (
  req,
  res,
  next
) => {
  try {
    const gigs = await Gig.find({
      freelancer: req.user.id
    }).sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: gigs.length,
      gigs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new gig owned by the
 * authenticated Freelancer.
 */
const createGig = async (
  req,
  res,
  next
) => {
  try {
    const {
      title,
      description,
      category,
      price,
      deliveryDays,
      isActive
    } = req.validatedBody;

    const gig = await Gig.create({
      freelancer: req.user.id,
      title,
      description,
      category,
      price,
      deliveryDays,
      ...(typeof isActive === "boolean"
        ? { isActive }
        : {})
    });

    return res.status(201).json({
      success: true,
      message: "Gig created successfully.",
      gig
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a gig owned by the
 * authenticated Freelancer.
 */
const updateGig = async (
  req,
  res,
  next
) => {
  try {
    const gig = await Gig.findById(
      req.params.id
    );

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found."
      });
    }

    /*
     * Ownership enforcement.
     */
    if (
      gig.freelancer.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorised to modify this gig."
      });
    }

    const allowedUpdates =
      req.validatedBody;

    Object.assign(
      gig,
      allowedUpdates
    );

    await gig.save();

    return res.status(200).json({
      success: true,
      message: "Gig updated successfully.",
      gig
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a gig owned by the
 * authenticated Freelancer.
 */
const deleteGig = async (
  req,
  res,
  next
) => {
  try {
    const gig = await Gig.findById(
      req.params.id
    );

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found."
      });
    }

    /*
     * Ownership enforcement.
     */
    if (
      gig.freelancer.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorised to delete this gig."
      });
    }

    await gig.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Gig deleted successfully."
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableGigs,
  getGigById,
  getMyGigs,
  createGig,
  updateGig,
  deleteGig
};