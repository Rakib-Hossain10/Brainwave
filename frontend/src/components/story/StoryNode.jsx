import React from "react";
import { Handle, Position } from "reactflow";

// small color map
const accents = {
  violet: "ring-violet-400/60",
  rose: "ring-rose-400/60",
  amber: "ring-amber-400/60",
  cyan: "ring-cyan-400/60",
};

export default function StoryNode({ id, data, selected }) {
  const ring = accents[data.accent] || "ring-white/40";

  return (
    <div
      className={[
        "w-[270px] max-w-[78vw] rounded-2xl border border-white/15 bg-white/6 backdrop-blur",
        "shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-1",
        ring,
        selected ? "outline outline-1 outline-white/60" : "",
      ].join(" ")}
      onClick={(e) => {
        // if user is in "connect mode" from another node, clicking this one picks target
        if (data.inConnectMode && !data.connecting) data.onPickTarget?.();
        e.stopPropagation();
      }}
    >
      {/* title bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <div className="text-sm font-semibold truncate">{data.title || "未命名"}</div>
        <div className="flex items-center gap-2">
          <button
            className={`text-xs rounded-md px-2 py-0.5 ${data.connecting ? "bg-emerald-400/80 text-black" : "bg-white/10 hover:bg-white/15"}`}
            onClick={(e) => { e.stopPropagation(); data.onStartConnect?.(); }}
            title="连线"
          >
            ↪
          </button>
          <button
            className="text-xs rounded-md px-2 py-0.5 bg-white/10 hover:bg-white/15"
            onClick={(e) => { e.stopPropagation(); data.onEdit?.(); }}
            title="编辑"
          >
            ✎
          </button>
        </div>
      </div>

      {/* content preview */}
      <div className="px-3 py-3">
        <p className="text-[12px] leading-5 max-h-40 overflow-hidden text-white/80">
          {data.content || "点击 ✎ 编辑 填写节点内容…"}
        </p>
      </div>

      {/* connectors */}
      <Handle type="target" position={Position.Top} className="!bg-white !opacity-60" />
      <Handle type="source" position={Position.Bottom} className="!bg-white !opacity-60" />
    </div>
  );
}
