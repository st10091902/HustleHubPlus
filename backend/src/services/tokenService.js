const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT for an authenticated user.
 */
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is not configured.");
  }

  return jwt.sign(
    {
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      issuer: "hustlehubplus-api",
      audience: "hustlehubplus-users"
    }
  );
};

/**
 * Verifies and decodes a JWT.
 */
const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is not configured.");
  }

  return jwt.verify(
    token,
    process.env.JWT_SECRET,
    {
      issuer: "hustlehubplus-api",
      audience: "hustlehubplus-users"
    }
  );
};

module.exports = {
  generateToken,
  verifyToken
};