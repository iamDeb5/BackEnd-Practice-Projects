import React from "react";

function BoxIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" />
      <path d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z" fill="currentColor" />
    </svg>
  );
}

export default function EmptyState() {
  return (
    <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm">
        <BoxIcon />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-light text-gray-800 tracking-tight">Initiate an Evaluation</h2>
        <p className="text-gray-400 text-sm max-w-sm font-light mx-auto">
          Input a problem or prompt. Two models will generate responses asynchronously and present them for algorithmic judging.
        </p>
      </div>
    </div>
  );
}
