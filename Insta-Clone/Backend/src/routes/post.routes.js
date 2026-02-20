const express = require("express");
const PostController = require("../controllers/post.controller");
const multer = require("multer");
const identifyUser = require("../middlewares/auth.middleware");
const upload = multer({ storage: multer.memoryStorage() });

const postRouter = express.Router();

/**
 * @route POST /api/posts/
 * @description Create a Post
 * @access Private
 */
postRouter.post(
	"/",
	upload.single("image"),
	identifyUser,
	PostController.createPostController,
);

/**
 * @route GET /api/posts/
 * @description Get All Posts
 * @access Private
 */
postRouter.get("/", identifyUser, PostController.getPostController);

/**
 * @route GET /api/posts/details/:postId
 * @description Get Post Details
 * @access Private
 */
postRouter.get(
	"/details/:postId",
	identifyUser,
	PostController.getPostDetailsController,
);

/**
 * @route POST /api/posts/like/:postId
 * @description Like a Post
 * @access Private
 */

postRouter.post(
	"/like/:postId",
	identifyUser,
	PostController.likePostController,
);

module.exports = postRouter;
