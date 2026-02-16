const express = require("express");
const PostController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const postRouter = express.Router();

postRouter.post(
	"/",
	upload.single("image"),
	PostController.createPostController,
);

postRouter.get("/", PostController.getPostController);

postRouter.get("/details/:postId", PostController.getPostDetailsController);

module.exports = postRouter;
