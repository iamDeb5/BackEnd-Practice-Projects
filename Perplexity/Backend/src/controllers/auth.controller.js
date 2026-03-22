import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 * @body {username, email, password}
 */
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User already exist",
      success: false,
      err: "User already exist",
    });
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  const emailVerificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity",
    html: `<p>Hi ${username},</p><p>Thank you for registering. We're exicited to have you on board!</p>
	<p>Please verify your email address by clicking on the link below:</p>
	<a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a> 
	<p>If you did not create this account, please ignore this email.</p>
	<p>Best regards,<br>The Perplexity Team</p>`,
  });

  res.status(201).json({
    message: "User created successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 * @body {email, password}
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid password",
      success: false,
      err: "Invalid password",
    });
  }

  if (!user.verified) {
    return res.status(401).json({
      message: "Please verify your email first",
      success: false,
      err: "User not verified",
    });
  }

  const token = jwt.sign(
    { username: user.username, email: user.email, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

/**
 * @route GET /api/auth/get-me
 * @description Get current user
 * @access Private
 */
export const getMe = async (req, res) => {
  const userId = req.user.id;
  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  res.status(200).json({
    message: "User fetched successfully",
    success: true,
    user,
  });
};

/**
 * @route GET /api/auth/verify-email
 * @description Verify email
 * @access Public
 * @query {token}
 */
export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      message: "Token is required",
      success: false,
      err: "Token is required",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({
        message: "Invalid Token",
        success: false,
        err: "User not found",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        message: "User already verified",
        success: false,
        err: "User already verified",
      });
    }

    user.verified = true;
    await user.save();

    const html = `<h1>Email verified successfully</h1>
	<p>Your email has been verified successfully. You can now login to your account</p>`;

    res.send(html);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid Token",
      success: false,
      err: "Invalid Token",
    });
  }
};
