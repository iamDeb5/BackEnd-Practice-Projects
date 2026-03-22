import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

export const testAi = async () => {
  const result = await model.invoke("What is the full name of AB de Villiers?");
  console.log(result.text);
};
