import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatMistralAI } from "@langchain/mistralai";
import { z } from "zod";
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(
  async ({ query }) => {
    // LangChain passes the zod-parsed object { query }, not a raw string
    return await searchInternet(query);
  },
  {
    name: "search_internet",
    description:
      "Search the internet for up-to-date information. Use this for any question about current events, recent news, or real-time data.",
    schema: z.object({
      query: z.string().describe("The search query to look up on the internet"),
    }),
  },
);

const agent = createReactAgent({
  llm: geminiModel,
  tools: [searchInternetTool],
});

export const generateResponse = async (messages) => {
  const response = await agent.invoke({
    messages: messages.map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role === "ai") {
        return new AIMessage(msg.content);
      }
    }),
  });
  // The last message in the output is the final AI reply
  const lastMessage = response.messages[response.messages.length - 1];
  return lastMessage.content;
};

export const generateChatTitle = async (message) => {
  const response = await mistralModel.invoke([
    new SystemMessage(`You are a helpfull assistant that generate concise and descriptive title for chat conversation.
      
      User will provide you the first message of the chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear , relevant and engaging, giving user a quick understanding of the chat's topic. 
      
      `),

    new HumanMessage(`Generate a title for this chat conversation: ${message}`),
  ]);

  return response.text;
};
