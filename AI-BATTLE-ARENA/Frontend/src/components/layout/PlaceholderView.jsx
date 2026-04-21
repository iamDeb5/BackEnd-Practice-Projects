import React from "react";

export default function PlaceholderView({ title, icon: Icon, description }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 h-full p-8 pt-32">
      <div className="w-16 h-16 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm">
        {Icon ? <Icon className="w-8 h-8 text-gray-400" strokeWidth={1.5} /> : null}
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-light text-gray-800 tracking-tight">{title}</h2>
        <p className="text-gray-400 text-sm max-w-sm font-light mx-auto">
          {description}
        </p>
      </div>
    </div>
  );
}
