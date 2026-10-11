const bcrypt = require("bcryptjs");

const User = require("../models/User");

const {
  generateToken
} = require("../services/tokenService");

/**
 * Register a new HustleHub+ user.
 */
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.validatedBody;

    /*
     * Check whether the email address is already registered.
     */
    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    /*
     * Hash the password before database storage.
     */
    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    /*
     * Store the new user in MongoDB.
     */
    const user = await User.create({
      name,
      email,
      passwordHash,
      role
    });

    /*
     * Never return either the password
     * or password hash to the client.
     */
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    /*
     * Protect against duplicate email race conditions.
     */
    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    next(error);
  }
};

/**
 * Authenticate an existing HustleHub+ user.
 */
const login = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.validatedBody;

    /*
     * passwordHash has select:false in the User schema,
     * so it must be explicitly requested for login.
     */
    const user = await User.findOne({
      email
    }).select("+passwordHash");

    /*
     * Use the same response for an unknown email
     * and an incorrect password.
     */
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    /*
     * Generate a signed JWT after successful authentication.
     */
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      tokenType: "Bearer",
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Return the current authenticated user.
 */
const getCurrentUser = async (req, res, next) => {
  try {
    /*
     * Confirm that the user represented by the JWT
     * still exists in MongoDB.
     */
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user no longer exists."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Protected route accessed successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};