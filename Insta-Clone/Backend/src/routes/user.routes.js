const express = require("express");
const userController = require("../controllers/user.controller");
const identifyUser = require("../middlewares/auth.middleware");

const userRouter = express.Router();

/**
 * @route POST /api/users/follow/:username
 * @description Follow a User
 * @access Private
 */
userRouter.post(
	"/follow/:username",
	identifyUser,
	userController.followUserController,
);

/**
 * @route POST /api/users/unfollow/:username
 * @description Unfollow a User
 * @access Private
 */

userRouter.post(
	"/unfollow/:username",
	identifyUser,
	userController.unfollowUserController,
);

/**
 * @route POST /api/users/accept/:username
 * @description Accept a Follow Request
 * @access Private
 */
userRouter.post(
	"/accept/:username",
	identifyUser,
	userController.acceptFollowRequestController,
);

/**
 * @route POST /api/users/reject/:username
 * @description Reject a Follow Request
 * @access Private
 */
userRouter.post(
	"/reject/:username",
	identifyUser,
	userController.rejectFollowRequestController,
);

module.exports = userRouter;
