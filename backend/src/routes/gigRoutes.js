const express = require("express");

const {
  getAvailableGigs,
  getGigById,
  getMyGigs,
  createGig,
  updateGig,
  deleteGig
} = require(
  "../controllers/gigController"
);

const {
  createGigSchema,
  updateGigSchema
} = require(
  "../validators/gigValidators"
);

const authenticateToken = require(
  "../middleware/authenticateToken"
);

const authorizeRoles = require(
  "../middleware/authorizeRoles"
);

const validateRequest = require(
  "../middleware/validateRequest"
);

const validateObjectId = require(
  "../middleware/validateObjectId"
);

const {
  ROLES
} = require("../config/roles");

const router = express.Router();

/*
 * Marketplace routes.
 *
 * Active gigs may be browsed by users
 * without management permissions.
 */
router.get(
  "/",
  getAvailableGigs
);

/*
 * Freelancer management routes.
 *
 * IMPORTANT:
 * /mine must appear before /:id.
 */
router.get(
  "/mine",
  authenticateToken,
  authorizeRoles(ROLES.FREELANCER),
  getMyGigs
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles(ROLES.FREELANCER),
  validateRequest(createGigSchema),
  createGig
);

/*
 * Individual marketplace Gig.
 */
router.get(
  "/:id",
  validateObjectId("id"),
  getGigById
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(ROLES.FREELANCER),
  validateObjectId("id"),
  validateRequest(updateGigSchema),
  updateGig
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(ROLES.FREELANCER),
  validateObjectId("id"),
  deleteGig
);

module.exports = router;