import { tavily as Tavily } from "@tavily/core";

const tavily = Tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

export const searchInternet = async (query) => {
  const response = await tavily.search(query, {
    max_results: 5,
    searchDepth: "advanced",
  });
  return JSON.stringify(response);
};
