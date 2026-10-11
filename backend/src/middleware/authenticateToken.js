const User = require("../models/User");

const {
  verifyToken
} = require("../services/tokenService");

/**
 * Authenticate requests using a Bearer JWT.
 *
 * The JWT identifies the user, but the current user
 * and role are retrieved from MongoDB so that
 * authorisation decisions use current database data.
 */
const authenticateToken = async (
  req,
  res,
  next
) => {
  const authorizationHeader =
    req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required."
    });
  }

  const parts = authorizationHeader.split(" ");

  if (
    parts.length !== 2 ||
    parts[0] !== "Bearer" ||
    !parts[1]
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token format."
    });
  }

  const token = parts[1];

  try {
    /*
     * Verify signature, expiry, issuer and audience.
     */
    const decoded = verifyToken(token);

    /*
     * Ensure the user still exists and retrieve
     * their current role from MongoDB.
     */
    const user = await User.findById(decoded.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user no longer exists."
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token."
    });
  }
};

module.exports = authenticateToken;