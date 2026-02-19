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

	const followRequestStatus = await followModel.findOne({
		follower: followerUsername,
		followee: followeeUsername,
		status: "requested",
	});
	if (followRequestStatus) {
		return res.status(200).json({
			message: "You have already sent a follow request to this user",
			follow: followRequestStatus,
		});
	}

	const isAlreadyFollowing = await followModel.findOne({
		follower: followerUsername,
		followee: followeeUsername,
		status: "accepted",
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
		status: "requested",
	});

	res.status(201).json({
		message: `You have sent a follow request to ${followeeUsername}`,
		follow: followRecord,
	});
};

const unfollowUserController = async (req, res) => {
	const followerUsername = req.user.username;
	const followeeUsername = req.params.username;

	const isUserFollowing = await followModel.findOne({
		follower: followerUsername,
		followee: followeeUsername,
		status: "accepted",
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

const acceptFollowRequestController = async (req, res) => {
	const followeeUsername = req.user.username;
	const followerUsername = req.params.username;

	const followRequest = await followModel.findOne({
		follower: followerUsername,
		followee: followeeUsername,
		status: "requested",
	});

	if (!followRequest) {
		return res.status(404).json({
			message: "Follow request not found",
		});
	}
	followRequest.status = "accepted";
	await followRequest.save();

	res.status(200).json({
		message: `You have accepted the follow request from ${followerUsername}`,
		follow: followRequest,
	});
};

const rejectFollowRequestController = async (req, res) => {
	const followeeUsername = req.user.username;
	const followerUsername = req.params.username;

	const followRequest = await followModel.findOne({
		follower: followerUsername,
		followee: followeeUsername,
		status: "requested",
	});

	if (!followRequest) {
		return res.status(404).json({
			message: "Follow request not found",
		});
	}

	await followModel.findByIdAndDelete(followRequest._id);

	res.status(200).json({
		message: `You have rejected the follow request from ${followerUsername}`,
	});
};

module.exports = {
	followUserController,
	unfollowUserController,
	acceptFollowRequestController,
	rejectFollowRequestController,
};
