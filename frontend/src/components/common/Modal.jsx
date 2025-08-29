import React from "react";

export default function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* sheet / dialog */}
      <div className="relative w-full sm:w-[520px] max-w-[92vw] rounded-t-2xl sm:rounded-2xl border border-white/15 bg-white/8 p-4 sm:p-5 shadow-[0_30px_120px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-white/90">{title}</h3>
          <button
            className="px-2 py-1 rounded-md text-white/70 hover:bg-white/10"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">{children}</div>

        <div className="mt-4 flex items-center justify-end gap-2">
          {actions}
        </div>
      </div>
    </div>
  );
}
