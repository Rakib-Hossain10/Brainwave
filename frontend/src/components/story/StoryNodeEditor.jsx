// import React, { useEffect, useState } from "react";

// // bottom-sheet on mobile, modal on desktop
// export default function StoryNodeEditor({ open, node, onClose, onSave }) {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [accent, setAccent] = useState("rose");

//   useEffect(() => {
//     if (!open || !node) return;
//     setTitle(node.data?.title || "");
//     setContent(node.data?.content || "");
//     setAccent(node.data?.accent || "rose");
//   }, [open, node]);

//   if (!open || !node) return null;

//   const handleSave = () => onSave?.({ id: node.id, title, content, accent });

//   return (
//     <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative w-full sm:w-[640px] max-w-[95vw] rounded-t-2xl sm:rounded-2xl border border-white/15 bg-[#121318]/95 p-4 sm:p-5">
//         <div className="flex items-center justify-between">
//           <h3 className="text-base sm:text-lg font-semibold">编辑节点</h3>
//           <button className="px-2 py-1 rounded-md hover:bg-white/10" onClick={onClose}>✕</button>
//         </div>

//         <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
//           <div className="sm:col-span-2">
//             <label className="text-xs text-white/70">标题</label>
//             <input
//               className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="例如：1. 开局1"
//             />
//           </div>
//           <div className="sm:col-span-2">
//             <label className="text-xs text-white/70">内容</label>
//             <textarea
//               className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none min-h-[160px]"
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="在此输入剧情文本…"
//             />
//           </div>

//         </div>

//         <div className="mt-4 flex items-center justify-end gap-2">
//           <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15" onClick={onClose}>
//             取消
//           </button>
//           <button
//             className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-white/90"
//             onClick={handleSave}
//           >
//             保存
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }






import React, { useEffect, useState } from "react";

// bottom-sheet on mobile, modal on desktop
export default function StoryNodeEditor({ open, node, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [accent, setAccent] = useState("rose");

  useEffect(() => {
    if (!open || !node) return;
    setTitle(node.data?.title || "");
    setContent(node.data?.content || "");
    setAccent(node.data?.accent || "rose");
  }, [open, node]);

  if (!open || !node) return null;

  // ✅ Save then close (works for sync or async onSave)
  const handleSave = async () => {
    try {
      const maybePromise = onSave?.({ id: node.id, title, content, accent });
      if (maybePromise && typeof maybePromise.then === "function") {
        await maybePromise;
      }
      onClose?.();
    } catch (e) {
      // If you want to keep the modal open on error, do nothing here.
      // Optionally show a toast elsewhere.
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-[640px] max-w-[95vw] rounded-t-2xl sm:rounded-2xl border border-white/15 bg-[#121318]/95 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold">编辑节点</h3>
          <button className="px-2 py-1 rounded-md hover:bg-white/10" onClick={onClose}>✕</button>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs text-white/70">标题</label>
            <input
              className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：1. 开局1"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-white/70">内容</label>
            <textarea
              className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none min-h-[160px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="在此输入剧情文本…"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15" onClick={onClose}>
            取消
          </button>
          <button
            className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-white/90"
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
