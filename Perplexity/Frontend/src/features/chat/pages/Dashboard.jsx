import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import MessageContent from "../components/MessageContent";

// Bot icon SVG
const BotIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0"
  >
    <path
      d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="13" r="1" fill="currentColor" />
    <circle cx="15" cy="13" r="1" fill="currentColor" />
  </svg>
);

// User icon SVG
const UserIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0"
  >
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Send icon SVG
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef(null);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const error = useSelector((state) => state.chat.error);

  const currentMessages = chats[currentChatId]?.messages ?? [];

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.loadChats();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isLoading]);

  const handleSubmitMessage = (event) => {
    event.preventDefault();
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage || isLoading) return;

    chat.handleSendMessage({
      message: trimmedMessage,
      chatId: currentChatId || undefined,
    });
    setChatInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitMessage(e);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#07090f] text-white">
      <section className="mx-auto flex h-screen w-full">
        {/* ── Sidebar ── */}
        <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-white/8 bg-[#080b12] p-4 md:flex">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-2 px-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#31b8c6]/20">
              <BotIcon />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              Perplexity
            </span>
          </div>

          {/* New Chat */}
          <button
            onClick={() => chat.handleNewChat()}
            type="button"
            className="mb-4 flex w-full items-center gap-2 rounded-xl border border-dashed border-white/20 bg-transparent px-3 py-2.5 text-sm font-medium text-white/50 transition hover:border-white/40 hover:text-white/80"
          >
            <span className="text-base leading-none">+</span>
            New Chat
          </button>

          {/* Chat History */}
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-white/30">
            Recent
          </p>
          <div className="flex-1 space-y-0.5 overflow-y-auto">
            {Object.values(chats).length === 0 && (
              <p className="px-1 text-xs text-white/25">No chats yet</p>
            )}
            {Object.values(chats).map((chatItem) => (
              <button
                onClick={() => chat.handleSelectChat(chatItem.id)}
                key={chatItem.id}
                type="button"
                className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm transition ${
                  currentChatId === chatItem.id
                    ? "bg-white/10 font-medium text-white"
                    : "text-white/55 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                {chatItem.title}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main Chat Area ── */}
        <section className="relative flex min-w-0 flex-1 flex-col">
          {/* Messages */}
          <div className="messages flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <div className="mx-auto max-w-3xl space-y-6">
              {/* Empty state */}
              {!currentChatId && !error && currentMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#31b8c6]/10 text-[#31b8c6]">
                    <BotIcon />
                  </div>
                  <h2 className="mb-2 text-2xl font-semibold text-white">
                    Ask me anything
                  </h2>
                  <p className="text-sm text-white/35">
                    I can search the internet for the latest information.
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Messages list */}
              {currentMessages.map((message, index) => (
                <div
                  key={message._id ?? index}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      message.role === "user"
                        ? "bg-white/10 text-white/70"
                        : "bg-[#31b8c6]/15 text-[#31b8c6]"
                    }`}
                  >
                    {message.role === "user" ? <UserIcon /> : <BotIcon />}
                  </div>

                  {/* Bubble */}
                  {message.role === "user" ? (
                    // User bubble — simple pill
                    <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-white/10 px-4 py-3 text-sm leading-relaxed text-white backdrop-blur-sm md:text-base">
                      <MessageContent content={message.content} role="user" />
                    </div>
                  ) : (
                    // AI bubble — open, full-width prose
                    <div className="min-w-0 flex-1 text-sm md:text-base">
                      <MessageContent content={message.content} role="ai" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#31b8c6]/15 text-[#31b8c6]">
                    <BotIcon />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/8 bg-[#0c1220] px-4 py-3.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#31b8c6]/60 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#31b8c6]/60 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#31b8c6]/60 [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ── Input Bar ── */}
          <div className="border-t border-white/8 bg-[#07090f] px-4 py-4 md:px-8">
            <form
              onSubmit={handleSubmitMessage}
              className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-white/12 bg-[#0c1220] px-4 py-3 transition focus-within:border-white/25"
            >
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                disabled={isLoading}
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/30 disabled:opacity-50 md:text-base"
                style={{ maxHeight: "160px", overflowY: "auto" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
                }}
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isLoading}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#31b8c6] text-[#07090f] transition hover:bg-[#45c7d4] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <SendIcon />
              </button>
            </form>
            <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-white/20">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
