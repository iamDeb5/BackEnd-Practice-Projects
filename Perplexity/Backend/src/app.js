import express from "express";
import cookieParser from "cookie-parser";
import authrouter from "./routes/auth.route.js";
import chatRouter from "./routes/chat.route.js";
import morgan from "morgan";
import cors from "cors";

const app = express();

/**
 *  Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

/**
 * Health Check
 */
app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

app.use("/api/auth", authrouter);
app.use("/api/chats", chatRouter);

export default app;
