const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: "http://localhost:5173",
	}),
);

app.use(express.static("./public"));

/* Require Routes*/
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userRouter = require("./routes/user.routes");

/* Using Routes */
app.use("https://insta-clone-1dta.onrender.com/api/auth", authRouter);
app.use("https://insta-clone-1dta.onrender.com/api/posts", postRouter);
app.use("https://insta-clone-1dta.onrender.com/api/users", userRouter);

module.exports = app;
