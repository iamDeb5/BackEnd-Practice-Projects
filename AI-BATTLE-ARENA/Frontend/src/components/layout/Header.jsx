import React from "react";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="flex-none px-12 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gray-800" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-sm font-medium tracking-wide text-gray-800">Arena Evaluation</h2>
          </div>
        </div>
      </div>
    </header>
  );
}
