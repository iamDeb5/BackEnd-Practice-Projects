import express from "express";
import cookieParser from "cookie-parser";
import authrouter from "./routes/auth.route.js";

const app = express();

/**
 *  Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Health Check
 */
app.get("/", (req, res) => {
	res.json({
		message: "Server is running",
	});
});

app.use("/api/auth", authrouter);

export default app;
