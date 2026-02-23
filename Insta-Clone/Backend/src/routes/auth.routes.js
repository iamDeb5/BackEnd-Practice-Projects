const express = require("express");
const authController = require("../controllers/auth.controller");
const identifyUser = require("../middlewares/auth.middleware");

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

/**
 * @route GET /api/auth/get-me
 * @description  Get the currently logged in user's Information
 * @access Private
 */
authRouter.get("/get-me", identifyUser, authController.getMeController);

module.exports = authRouter;
