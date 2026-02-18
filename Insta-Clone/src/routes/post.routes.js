const express = require("express");
const PostController = require("../controllers/post.controller");
const multer = require("multer");
const identifyUser = require("../middlewares/auth.middleware");
const upload = multer({ storage: multer.memoryStorage() });

const postRouter = express.Router();

postRouter.post(
	"/",
	upload.single("image"),
	identifyUser,
	PostController.createPostController,
);

postRouter.get("/", identifyUser, PostController.getPostController);

postRouter.get(
	"/details/:postId",
	identifyUser,
	PostController.getPostDetailsController,
);

module.exports = postRouter;
