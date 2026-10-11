const { z } = require("zod");

const gigFields = {
  title: z
    .string()
    .trim()
    .min(3, "Title must contain at least 3 characters.")
    .max(100, "Title may not exceed 100 characters."),

  description: z
    .string()
    .trim()
    .min(
      10,
      "Description must contain at least 10 characters."
    )
    .max(
      2000,
      "Description may not exceed 2000 characters."
    ),

  category: z
    .string()
    .trim()
    .min(2, "Category is required.")
    .max(60, "Category may not exceed 60 characters."),

  price: z
    .number()
    .positive("Price must be greater than zero.")
    .max(
      1000000,
      "Price may not exceed 1,000,000."
    ),

  deliveryDays: z
    .number()
    .int("Delivery days must be a whole number.")
    .min(1, "Delivery time must be at least 1 day.")
    .max(
      365,
      "Delivery time may not exceed 365 days."
    ),

  isActive: z.boolean().optional()
};

const createGigSchema = z
  .object({
    title: gigFields.title,
    description: gigFields.description,
    category: gigFields.category,
    price: gigFields.price,
    deliveryDays: gigFields.deliveryDays,
    isActive: gigFields.isActive
  })
  .strict();

const updateGigSchema = z
  .object({
    title: gigFields.title.optional(),
    description: gigFields.description.optional(),
    category: gigFields.category.optional(),
    price: gigFields.price.optional(),
    deliveryDays: gigFields.deliveryDays.optional(),
    isActive: z.boolean().optional()
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided."
    }
  );

module.exports = {
  createGigSchema,
  updateGigSchema
};