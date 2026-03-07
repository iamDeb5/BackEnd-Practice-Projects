const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

/**
 * Routes
 */
const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.routes");

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);

// Serve static frontend files from the "public" directory
app.use(express.static(path.join(__dirname, "../public")));

// Catch-all route to serve React's index.html for any unhandled routes (for React Router)
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
