import { Router } from "express";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import {
  register,
  verifyEmail,
  login,
  getMe,
} from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const authrouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 * @body {username, email, password}
 */
authrouter.post("/register", registerValidator, register);

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 * @body {email, password}
 */
authrouter.post("/login", loginValidator, login);

/**
 * @route GET /api/auth/get-me
 * @description Get current user
 * @access Private
 */
authrouter.get("/get-me", authUser, getMe);

/**
 * @route GET /api/auth/verify-email
 * @description Verify email
 * @access Public
 * @query {token}
 */
authrouter.get("/verify-email", verifyEmail);

export default authrouter;
