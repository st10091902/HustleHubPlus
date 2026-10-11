const express = require("express");

const authenticateToken = require(
  "../middleware/authenticateToken"
);

const authorizeRoles = require(
  "../middleware/authorizeRoles"
);

const {
  ROLES
} = require("../config/roles");

const router = express.Router();

/**
 * Any authenticated user.
 */
router.get(
  "/authenticated",
  authenticateToken,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message:
        "Authenticated access granted.",
      user: req.user
    });
  }
);

/**
 * CLIENT only.
 */
router.get(
  "/client",
  authenticateToken,
  authorizeRoles(ROLES.CLIENT),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Client access granted."
    });
  }
);

/**
 * FREELANCER only.
 */
router.get(
  "/freelancer",
  authenticateToken,
  authorizeRoles(ROLES.FREELANCER),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Freelancer access granted."
    });
  }
);

/**
 * ADMIN only.
 */
router.get(
  "/admin",
  authenticateToken,
  authorizeRoles(ROLES.ADMIN),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Administrator access granted."
    });
  }
);

module.exports = router;