import React from "react";
import { User, Loader2 } from "lucide-react";
import SolutionCard from "./SolutionCard";
import JudgementSection from "./JudgementSection";

export default function MessageItem({ msg }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* User Message */}
      <div className="flex gap-6 mb-12">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-gray-500" />
        </div>
        <div className="pt-1">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">
            Prompt
          </h3>
          <div className="text-lg text-gray-800 leading-relaxed font-light">
            {msg.problem}
          </div>
        </div>
      </div>

      {/* Status or Responses */}
      {msg.status === "loading" ? (
        <div className="flex items-center gap-4 pl-14 text-gray-400 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-light">
            Synthesizing solutions and awaiting judgement...
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-8 ml-14">
          {/* Solutions Side-by-Side */}
          <div className="grid grid-cols-2 gap-8">
            <SolutionCard title="Model Alpha" markdownContent={msg.solution_1} />
            <SolutionCard title="Model Omega" markdownContent={msg.solution_2} />
          </div>

          {/* Judge Recommendation */}
          <JudgementSection judge={msg.judge} />
        </div>
      )}
    </div>
  );
}
