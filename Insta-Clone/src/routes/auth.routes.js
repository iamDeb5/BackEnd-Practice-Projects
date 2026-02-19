const express = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a User
 * @access Public
 */
authRouter.post("/register", authController.registerController);

/**
 * @route POST /api/auth/login
 * @description Login a User
 * @access Public
 */
authRouter.post("/login", authController.loginController);

module.exports = authRouter;
