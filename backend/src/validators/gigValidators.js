const { z } = require("zod");

const sanitizePlainText = require(
  "../utils/sanitizePlainText"
);

const sanitizedText = (
  minimum,
  maximum,
  fieldName
) =>
  z.preprocess(
    (value) =>
      sanitizePlainText(value),

    z
      .string()
      .trim()
      .min(
        minimum,
        `${fieldName} must contain at least ${minimum} characters.`
      )
      .max(
        maximum,
        `${fieldName} may not exceed ${maximum} characters.`
      )
  );

const gigFields = {
  title: sanitizedText(
    3,
    100,
    "Title"
  ),

  description: sanitizedText(
    10,
    2000,
    "Description"
  ),

  category: sanitizedText(
    2,
    60,
    "Category"
  ),

  price: z
    .number()
    .positive(
      "Price must be greater than zero."
    )
    .max(
      1000000,
      "Price may not exceed 1,000,000."
    ),

  deliveryDays: z
    .number()
    .int(
      "Delivery days must be a whole number."
    )
    .min(
      1,
      "Delivery time must be at least 1 day."
    )
    .max(
      365,
      "Delivery time may not exceed 365 days."
    ),

  isActive: z
    .boolean()
    .optional()
};

const createGigSchema = z
  .object({
    title: gigFields.title,
    description:
      gigFields.description,
    category:
      gigFields.category,
    price:
      gigFields.price,
    deliveryDays:
      gigFields.deliveryDays,
    isActive:
      gigFields.isActive
  })
  .strict();

const updateGigSchema = z
  .object({
    title:
      gigFields.title.optional(),

    description:
      gigFields.description.optional(),

    category:
      gigFields.category.optional(),

    price:
      gigFields.price.optional(),

    deliveryDays:
      gigFields.deliveryDays.optional(),

    isActive:
      z.boolean().optional()
  })
  .strict()
  .refine(
    (data) =>
      Object.keys(data).length > 0,
    {
      message:
        "At least one field must be provided."
    }
  );

module.exports = {
  createGigSchema,
  updateGigSchema
};