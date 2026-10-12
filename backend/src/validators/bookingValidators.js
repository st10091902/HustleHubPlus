const { z } = require("zod");

const sanitizePlainText = require(
  "../utils/sanitizePlainText"
);

const requirementsSchema =
  z.preprocess(
    (value) =>
      sanitizePlainText(value),

    z
      .string()
      .trim()
      .max(
        1000,
        "Requirements may not exceed 1000 characters."
      )
  );

const createBookingSchema = z
  .object({
    gigId: z
      .string()
      .trim()
      .min(
        1,
        "Gig ID is required."
      ),

    requirements:
      requirementsSchema
        .optional()
        .default("")
  })
  .strict();

module.exports = {
  createBookingSchema
};