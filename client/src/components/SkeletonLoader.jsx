import React from "react";

export const SkeletonLoader = ({ type = "text", lines = 3 }) => {
  const items = Array.from({ length: lines });
  
  if (type === "card") {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-zinc-800 rounded-lg p-6 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-1/3"></div>
        <div className="h-8 bg-gray-300 dark:bg-zinc-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 animate-pulse">
      {items.map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
      ))}
    </div>
  );
};
