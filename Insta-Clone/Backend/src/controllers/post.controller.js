const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const likeModel = require("../models/like.model");


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

const likePostController = async (req, res) => {
	const username = req.user.username;
	const postId = req.params.postId;

	const post = await postModel.findById(postId);

	if (!post) {
		return res.status(404).json({
			message: "Post not found",
		});
	}

	const like = await likeModel.create({
		post: postId,
		user: username,
	});

	res.status(200).json({
		message: "Post Liked Successfully",
		like,
	});
};

const unlikePostController = async (req, res) => {
	const username = req.user.username;
	const postId = req.params.postId;

	const post = await postModel.findById(postId);

	if (!post) {
		return res.status(404).json({
			message: "Post not found",
		});
	}

	const isLiked = await likeModel.findOne({
		post: postId,
		user: username,
	});

	if (!isLiked) {
		return res.status(400).json({
			message: "Post not liked",
		});
	}

	await likeModel.findOneAndDelete({
		_id: isLiked._id,
	})

	return res.status(200).json({
		message: "Post Unliked Successfully",
	});
};


const getFeedController = async (req, res) => {
	const user = req.user;
	const rawPosts = await postModel.find().populate("user").lean();

	const posts = await Promise.all(rawPosts.map(async (post) => {
		const isLiked = await likeModel.findOne({
			post: post._id,
			user: user.username,
		})
		post.isLiked = Boolean(isLiked);

		return post;
	}))

	return res.status(200).json({
		message: "Posts Fetched Succesfully",
		posts,
	});
}

module.exports = {
	createPostController,
	getPostController,
	getPostDetailsController,
	likePostController,
	getFeedController,
	unlikePostController,
};
