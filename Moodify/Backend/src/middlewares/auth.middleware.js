const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const redis = require("../config/cache");

const authUser = async (req, res, next) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({
			message: "Token not provided",
		});
	}

	const isTokenBlackListed = await redis.get(token);

	if (isTokenBlackListed) {
		return res.status(401).json({
			message: "Invalid Token",
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({
			message: "Invalid Token",
		});
	}
};

module.exports = { authUser };
