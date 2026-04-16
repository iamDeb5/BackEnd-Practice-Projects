import React, { useState, useRef, useEffect } from "react";
import Header from "../components/layout/Header";
import EmptyState from "../components/chat/EmptyState";
import MessageItem from "../components/chat/MessageItem";
import ChatInput from "../components/chat/ChatInput";
import { generateMockResponse } from "../services/mockApi";
import axios from "axios";

export default function App() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (userMessage) => {
    // Add loading message
    const newMessageId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: newMessageId,
        problem: userMessage,
        status: "loading",
      },
    ]);

    const response = await axios.post("http://localhost:3000/invoke", {
      input: userMessage,
    });

    const data = response.data;
    console.log(data);

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === newMessageId ? { ...msg, ...data, status: "done" } : msg,
      ),
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white selection:bg-gray-100">
      <Header />

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto hidden-scrollbar pb-32">
        <div className="max-w-6xl mx-auto px-12 flex flex-col gap-16 py-8">
          {messages.length === 0 && <EmptyState />}

          {messages.map((msg) => (
            <MessageItem key={msg.id} msg={msg} />
          ))}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
}
