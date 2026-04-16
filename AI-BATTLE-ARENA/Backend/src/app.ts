import express from "express";
import runGraph from "./ai/graph.ai.js";
import { success } from "zod";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
		methods: ["GET", "POST"],
	}),
);

app.get("/", async (req, res) => {
	const result = await runGraph(
		"Write a function to get weather data for a given city.",
	);

	res.json(result);
});

app.post("/invoke", async (req, res) => {
	const { input } = req.body;

	const result = await runGraph(input);

	res.status(200).json({
		message: "Graph executed successfully",
		success: true,
		result,
	});
});

export default app;
