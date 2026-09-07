const {
  verifyToken
} = require("../services/tokenService");

const authenticateToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

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
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.sub,
      role: decoded.role
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