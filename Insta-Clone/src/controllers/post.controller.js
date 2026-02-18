const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");

const imagekit = new ImageKit({
	privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const createPostController = async (req, res) => {
	const file = await imagekit.files.upload({
		file: await toFile(Buffer.from(req.file.buffer), "file"),
		fileName: "Test",
		folder: "Cohort-2-InstaClone-Posts",
	});

	const post = await postModel.create({
		caption: req.body.caption,
		imgUrl: file.url,
		user: req.user.id,
	});

	res.status(201).json({
		message: "Post Created Successfully",
		post,
	});
};

const getPostController = async (req, res) => {
	const userId = req.user.id;

	const posts = await postModel.find({
		user: userId,
	});

	res.status(200).json({
		message: "Posts Fetched Succesfully",
		posts,
	});
};

const getPostDetailsController = async (req, res) => {
	const userId = req.user.id;
	const postId = req.params.postId;

	const post = await postModel.findById(postId);

	if (!post) {
		return res.status(404).json({
			message: "Post not found",
		});
	}

	const isValidUser = post.user.toString() == userId;

	if (!isValidUser) {
		return res.status(403).json({
			message: "Forbidden Content",
		});
	}

	return res.status(200).json({
		message: "Post Fetched Succesfully",
		post,
	});
};

module.exports = {
	createPostController,
	getPostController,
	getPostDetailsController,
};
