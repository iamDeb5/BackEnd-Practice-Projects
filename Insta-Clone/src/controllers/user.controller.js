const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

const followUserController = async (req, res) => {
	const followerUsername = req.user.username;
	const followeeUsername = req.params.username;

	if (followerUsername === followeeUsername) {
		return res.status(400).json({
			message: "You cannot follow yourself",
		});
	}

	const isFolloweeExist = await userModel.findOne({
		username: followeeUsername,
	});

	if (!isFolloweeExist) {
		return res.status(404).json({
			message: "User not found",
		});
	}

	const isAlreadyFollowing = await followModel.findOne({
		follower: followerUsername,
		followee: followeeUsername,
	});

	if (isAlreadyFollowing) {
		return res.status(200).json({
			message: "You are already following this user",
			follow: isAlreadyFollowing,
		});
	}

	const followRecord = await followModel.create({
		follower: followerUsername,
		followee: followeeUsername,
	});

	res.status(201).json({
		message: `You are now following ${followeeUsername}`,
		follow: followRecord,
	});
};

const unfollowUserController = async (req, res) => {
	const followerUsername = req.user.username;
	const followeeUsername = req.params.username;

	const isUserFollowing = await followModel.findOne({
		follower: followerUsername,
		followee: followeeUsername,
	});

	if (!isUserFollowing) {
		return res.status(404).json({
			message: "You are not following this user",
		});
	}

	await followModel.findByIdAndDelete(isUserFollowing._id);

	res.status(200).json({
		message: `You have unfollowed ${followeeUsername}`,
	});
};

module.exports = {
	followUserController,
	unfollowUserController,
};
