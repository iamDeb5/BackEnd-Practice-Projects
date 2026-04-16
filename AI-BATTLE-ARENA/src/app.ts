import express from "express";
import runGraph from "./ai/graph.ai.js";

const app = express();

app.get("/", async (req, res) => {
	const result = await runGraph(
		"Write a function to get weather data for a given city.",
	);

	res.json(result);
});

export default app;
