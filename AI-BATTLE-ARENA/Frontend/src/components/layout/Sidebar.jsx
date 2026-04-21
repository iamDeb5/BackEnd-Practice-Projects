import React from "react";
import { PlusCircle, History, BookOpen, BarChart2, Settings, LifeBuoy } from "lucide-react";

const navItems = [
  { icon: PlusCircle, label: "New Curation", active: true },
  { icon: History, label: "History" },
  { icon: BookOpen, label: "Library" },
  { icon: BarChart2, label: "Insights" },
];

const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: LifeBuoy, label: "Support" },
];

export default function Sidebar({ currentTab, onTabChange }) {
  return (
    <div className="w-64 bg-[#fdfdfd] h-full flex flex-col py-8 px-6 border-r border-gray-100 hidden md:flex shrink-0">
      <div className="mb-12 px-2">
        <h1 className="text-xl font-medium tracking-tight text-gray-900">The Curator</h1>
        <p className="text-xs text-gray-400 font-medium mt-1 tracking-widest uppercase">Precision Interface</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onTabChange(item.label)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentTab === item.label 
                ? "bg-gray-900 text-white shadow-sm" 
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <item.icon className={`w-4 h-4 ${currentTab === item.label ? "text-gray-300" : "text-gray-400"}`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="pt-8 border-t border-gray-100 space-y-2">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onTabChange(item.label)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentTab === item.label 
                ? "bg-gray-900 text-white shadow-sm" 
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <item.icon className={`w-4 h-4 ${currentTab === item.label ? "text-gray-300" : "text-gray-400"}`} />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
