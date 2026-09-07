const { z } = require("zod");

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters.")
      .max(80, "Name may not exceed 80 characters."),

    email: z
      .string()
      .trim()
      .email("A valid email address is required.")
      .max(254, "Email address is too long.")
      .transform((email) => email.toLowerCase()),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters.")
      .max(72, "Password may not exceed 72 characters.")
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter."
      )
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter."
      )
      .regex(
        /[0-9]/,
        "Password must contain at least one number."
      )
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character."
      ),

    role: z.enum(["CLIENT", "FREELANCER"], {
      message: "Role must be either CLIENT or FREELANCER."
    })
  })
  .strict();

const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("A valid email address is required.")
      .max(254, "Email address is too long.")
      .transform((email) => email.toLowerCase()),

    password: z
      .string()
      .min(1, "Password is required.")
      .max(72, "Password may not exceed 72 characters.")
  })
  .strict();

module.exports = {
  registerSchema,
  loginSchema
};