const mongoose = require("mongoose");

/**
 * Validate a MongoDB ObjectId route parameter.
 */
const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const value = req.params[paramName];

    if (!mongoose.isValidObjectId(value)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource identifier."
      });
    }

    next();
  };
};

module.exports = validateObjectId;