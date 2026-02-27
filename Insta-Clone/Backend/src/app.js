const path = require("path");
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
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

/* Serve Frontend index.html for any unknown routes */
app.get("(.*)", (req, res) => {
	res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
