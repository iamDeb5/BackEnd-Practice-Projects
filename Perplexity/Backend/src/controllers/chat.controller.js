import { response } from "express";
import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  const { message, chat: chatId } = req.body;

  let chat = null;

  if (!chatId) {
    // New chat: generate a title and create a chat document
    const title = await generateChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  } else {
    // Follow-up: fetch the existing chat so we always have a valid chat object
    chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
  }

  await messageModel.create({
    chat: chat._id,
    role: "user",
    content: message,
  });

  const messages = await messageModel.find({ chat: chat._id });

  const result = await generateResponse(messages);

  const aiMessage = await messageModel.create({
    chat: chat._id,
    role: "ai",
    content: result,
  });

  res.status(201).json({
    chat,
    aiMessage,
  });
};

export const getChats = async (req, res) => {
  const user = req.user;
  const chats = await chatModel.find({ user: user.id });
  res.status(200).json({
    message: "Chats retrieved successfully",
    chats,
  });
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  const messages = await messageModel.find({ chat: chatId });

  res.status(200).json({
    message: "Messages retrieved successfully",
    messages,
  });
};

export const deleteChat = async (req, res) => {
  const { chatId } = req.params;
  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  await messageModel.deleteMany({
    chat: chatId,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  res.status(200).json({
    message: "Chat deleted successfully",
  });
};
