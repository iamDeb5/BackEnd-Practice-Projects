import React from "react";
import ReactMarkdown from "react-markdown";
import { Activity } from "lucide-react";

export default function SolutionCard({ title, markdownContent }) {
  return (
    <div className="group rounded-2xl bg-[#fafafa] p-8 border border-gray-100/50 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-3 h-3" /> {title}
        </h4>
      </div>
      <div className="prose prose-sm max-w-none text-gray-600 prose-pre:bg-white prose-pre:border prose-pre:border-gray-100 prose-pre:text-gray-700">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
    </div>
  );
}
