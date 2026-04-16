import React, { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="absolute bottom-0 w-full bg-gradient-to-t from-white via-white to-transparent pt-12 pb-8 px-12 z-20">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute inset-0 bg-gray-100 rounded-3xl blur-xl opacity-50 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-end gap-2 bg-white border border-gray-200 rounded-3xl p-2 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-shadow group-focus-within:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] group-focus-within:border-gray-300">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "60px";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask a question or define a task..."
              className="w-full max-h-[200px] min-h-[60px] bg-transparent resize-none py-4 px-6 text-base text-gray-800 placeholder-gray-400 focus:outline-none scrollbar-hide"
              style={{ height: "60px" }}
            />
            <div className="px-2 pb-2 shrink-0">
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-gray-900 transition-all active:scale-95"
              >
                <Send className="w-5 h-5 ml-0.5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4 tracking-wide font-medium">
          AI judgments are evaluative and should be reviewed for accuracy.
        </p>
      </div>
    </div>
  );
}
