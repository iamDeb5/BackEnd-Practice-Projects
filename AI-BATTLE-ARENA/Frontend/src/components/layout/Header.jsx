import React from "react";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="flex-none px-12 py-8 bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide uppercase text-gray-900">Arena</h1>
            <p className="text-xs text-gray-400 font-medium">Model Evaluation Lab</p>
          </div>
        </div>
      </div>
    </header>
  );
}
