import React from "react";
import { Scale } from "lucide-react";

export default function JudgementSection({ judge }) {
  if (!judge) return null;

  return (
    <div className="mt-8 relative">
      {/* Decorative line */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gray-200 to-transparent rounded-full" />
      
      <div className="pl-6 py-2">
        <div className="flex items-center gap-3 mb-6">
          <Scale className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
          <h3 className="text-base font-medium text-gray-900 tracking-tight">Judgement</h3>
        </div>

        <div className="grid grid-cols-2 gap-12">
          {/* Judgement 1 */}
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <span className="text-4xl font-light tracking-tighter text-gray-900">
                {judge.solution_1_score}
              </span>
              <span className="text-sm font-medium text-gray-400 pb-1 uppercase tracking-widest">
                Score
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {judge.solution_1_reasoning}
            </p>
          </div>

          {/* Judgement 2 */}
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <span className="text-4xl font-light tracking-tighter text-gray-900">
                {judge.solution_2_score}
              </span>
              <span className="text-sm font-medium text-gray-400 pb-1 uppercase tracking-widest">
                Score
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {judge.solution_2_reasoning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
