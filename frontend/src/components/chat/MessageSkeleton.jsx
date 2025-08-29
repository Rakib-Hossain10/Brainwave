import React from "react";

const MessageSkeleton = ({ align = "left" }) => (
  <div className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}>
    <div className="max-w-[85%] md:max-w-[70%] rounded-2xl bg-white/10 animate-pulse">
      <div className="p-3 sm:p-4">
        <div className="h-3 w-24 bg-white/20 rounded mb-2" />
        <div className="h-3 w-40 bg-white/20 rounded mb-2" />
        <div className="h-3 w-28 bg-white/20 rounded" />
      </div>
    </div>
  </div>
);

export default MessageSkeleton;
