const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const {
  findUserByEmail,
  addUser
} = require("../data/userStore");

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

    const existingUser = findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash,
      role,
      createdAt: new Date().toISOString()
    };

    addUser(user);

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

    const user = findUserByEmail(email);

    /*
     * Use the same generic message for an unknown email
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
 * Returns information from the authenticated user's token.
 */
const getCurrentUser = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Protected route accessed successfully.",
    user: {
      id: req.user.id,
      role: req.user.role
    }
  });
};

module.exports = {
  register,
  login,
  getCurrentUser
};