const { z } = require("zod");

const createBookingSchema = z
  .object({
    gigId: z
      .string()
      .trim()
      .min(1, "Gig ID is required."),

    requirements: z
      .string()
      .trim()
      .max(
        1000,
        "Requirements may not exceed 1000 characters."
      )
      .optional()
      .default("")
  })
  .strict();

module.exports = {
  createBookingSchema
};