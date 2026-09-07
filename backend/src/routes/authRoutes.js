const express = require("express");

const {
  register,
  login,
  getCurrentUser
} = require("../controllers/authController");

const {
  registerSchema,
  loginSchema
} = require("../validators/authValidators");

const validateRequest = require("../middleware/validateRequest");
const authenticateToken = require("../middleware/authenticateToken");

const {
  loginRateLimiter
} = require("../middleware/authRateLimiter");

const router = express.Router();

/*
 * Public registration endpoint
 */
router.post(
  "/register",
  validateRequest(registerSchema),
  register
);

/*
 * Public login endpoint with
 * brute-force protection.
 */
router.post(
  "/login",
  loginRateLimiter,
  validateRequest(loginSchema),
  login
);

/*
 * Protected endpoint
 */
router.get(
  "/me",
  authenticateToken,
  getCurrentUser
);

module.exports = router;