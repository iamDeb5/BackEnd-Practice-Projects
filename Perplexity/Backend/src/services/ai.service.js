import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export const generateResponse = async (messages) => {
  const response = await geminiModel.invoke(
    messages.map((msg) => {
      if (msg.role == "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role == "ai") {
        return new AIMessage(msg.content);
      }
    }),
  );
  return response.text;
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
