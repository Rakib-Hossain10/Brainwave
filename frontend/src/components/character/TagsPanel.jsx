//raw code

// import React from "react";

// const Card = ({ children }) => (
//   <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 mb-3 sm:mb-4">
//     {children}
//   </div>
// );

// const Tag = ({ children }) => (
//   <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/10 text-[11px] sm:text-xs">
//     {children}
//   </span>
// );

// export default function TagsPanel({ character, onAdd }) {
//   const tags = character?.tags || [];

//   return (
//     <Card>
//       <div className="flex flex-wrap items-center gap-2">
//         {tags.length === 0 && (
//           <span className="text-sm text-white/70">No tags yet.</span>
//         )}
//         {tags.map((t, i) => (
//           <Tag key={i}>{t}</Tag>
//         ))}
//         <button
//           type="button"
//           onClick={onAdd}
//           className="px-2 py-0.5 rounded-full bg-white/10 text-[11px] sm:text-xs hover:bg-white/15"
//         >
//           + 添加标签
//         </button>
//       </div>
//     </Card>
//   );
// }






import React from "react";

// Color chips by prefix: # -> blue, @ -> yellow, else neutral
const tagStyle = (t = "") => {
  if (t.startsWith("#")) return "bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/30";
  if (t.startsWith("@")) return "bg-yellow-500/15 text-yellow-300 ring-1 ring-yellow-400/30";
  return "bg-white/10 text-white/90 ring-1 ring-white/10";
};

const Card = ({ children }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 mb-3 sm:mb-4">
    {children}
  </div>
);

export default function TagsPanel({ character, onAddTag }) {
  const tags = character?.tags || [];

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        {tags.length === 0 && (
          <span className="text-sm text-white/70">No tags yet.</span>
        )}
        {tags.map((t, i) => (
          <span key={i} className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] sm:text-xs ${tagStyle(t)}`}>
            {t}
          </span>
        ))}
        <button
          type="button"
          onClick={onAddTag}
          className="px-2 py-0.5 rounded-full bg-white/10 text-[11px] sm:text-xs hover:bg-white/15"
        >
          + 添加标签
        </button>
      </div>
    </Card>
  );
}

