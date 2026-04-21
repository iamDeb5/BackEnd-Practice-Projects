import React, { useState, useRef, useEffect } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import EmptyState from "../components/chat/EmptyState";
import MessageItem from "../components/chat/MessageItem";
import ChatInput from "../components/chat/ChatInput";
import PlaceholderView from "../components/layout/PlaceholderView";
import axios from "axios";
import { History, BookOpen, BarChart2, Settings, LifeBuoy } from "lucide-react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [currentTab, setCurrentTab] = useState("New Curation");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (userMessage) => {
    const newMessageId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: newMessageId,
        problem: userMessage,
        status: "loading",
      },
    ]);

    try {
      const response = await axios.post("http://localhost:3000/invoke", {
        input: userMessage,
      });

      const data = response.data;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessageId
            ? { ...msg, ...data.result, status: "done" }
            : msg,
        ),
      );
    } catch (error) {
      console.error("Evaluation failed", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessageId ? { ...msg, status: "error" } : msg,
        ),
      );
    }
  };

  const handleTabChange = (tabName) => {
    setCurrentTab(tabName);
    if (tabName === "New Curation" && messages.length > 0) {
      // Optional: Ask for confirmation, or just leave the messages
      // We will let them stay, "New Curation" acts as the home dashboard.
      // If we wanted to clear it on click: setMessages([]);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case "History":
        return (
          <PlaceholderView
            title="Evaluation History"
            icon={History}
            description="Past comparisons will be archived and accessible here."
          />
        );
      case "Library":
        return (
          <PlaceholderView
            title="Prompt Library"
            icon={BookOpen}
            description="Save your frequently used evaluation prompts here."
          />
        );
      case "Insights":
        return (
          <PlaceholderView
            title="Model Insights"
            icon={BarChart2}
            description="View detailed analytics on model performance and win-rates over time."
          />
        );
      case "Settings":
        return (
          <PlaceholderView
            title="System Settings"
            icon={Settings}
            description="Configure API keys, default models, and UI preferences."
          />
        );
      case "Support":
        return (
          <PlaceholderView
            title="Help & Support"
            icon={LifeBuoy}
            description="Access documentation or contact the administrative team."
          />
        );
      case "New Curation":
      default:
        return (
          <>
            <div className="flex-1 overflow-y-auto hidden-scrollbar pb-32">
              <div className="max-w-5xl mx-auto px-8 md:px-12 flex flex-col gap-16 py-8">
                {messages.length === 0 && <EmptyState />}
                {messages.map((msg) => (
                  <MessageItem key={msg.id} msg={msg} />
                ))}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            </div>
            <ChatInput onSend={handleSend} />
          </>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white selection:bg-gray-100">
      <Sidebar currentTab={currentTab} onTabChange={handleTabChange} />

      {/* App Window Wrapper */}
      <div className="flex-1 flex flex-col relative bg-white border-l border-gray-100 shadow-xl z-10 md:rounded-l-[2.5rem]">
        <Header />

        {renderContent()}
      </div>
    </div>
  );
}
