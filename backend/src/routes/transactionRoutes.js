const express = require("express");

const {
  getClientTransactions,
  getFreelancerTransactions,
  getFreelancerIncome,
  getTransactionById
} = require(
  "../controllers/transactionController"
);

const authenticateToken = require(
  "../middleware/authenticateToken"
);

const authorizeRoles = require(
  "../middleware/authorizeRoles"
);

const validateObjectId = require(
  "../middleware/validateObjectId"
);

const {
  ROLES
} = require("../config/roles");

const router = express.Router();

/*
 * CLIENT:
 * View own financial transactions.
 */
router.get(
  "/client",
  authenticateToken,
  authorizeRoles(
    ROLES.CLIENT
  ),
  getClientTransactions
);

/*
 * FREELANCER:
 * View transactions generated from
 * their own Gigs.
 */
router.get(
  "/freelancer",
  authenticateToken,
  authorizeRoles(
    ROLES.FREELANCER
  ),
  getFreelancerTransactions
);

/*
 * FREELANCER:
 * Income summary.
 *
 * Keep /income before /:id.
 */
router.get(
  "/income",
  authenticateToken,
  authorizeRoles(
    ROLES.FREELANCER
  ),
  getFreelancerIncome
);

/*
 * CLIENT or FREELANCER:
 * View a transaction they participated in.
 */
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(
    ROLES.CLIENT,
    ROLES.FREELANCER
  ),
  validateObjectId("id"),
  getTransactionById
);

module.exports = router;