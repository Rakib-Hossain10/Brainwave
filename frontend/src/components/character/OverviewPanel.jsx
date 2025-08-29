//raw code

// import React from "react";
// import { getImgSrc } from "../../utils/getImgSrc";

// const Card = ({ children }) => (
//   <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 mb-3 sm:mb-4">
//     {children}
//   </div>
// );

// const Chip = ({ children }) => (
//   <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/10 text-[11px] sm:text-xs">
//     {children}
//   </span>
// );

// export default function OverviewPanel({ character }) {
//   if (!character) return null;

//   const img = getImgSrc(character.image);
//   const stats = character.stats || [];          // optional in your data

//   return (
//     <>
//       {/* Header: avatar + name + description */}
//       <Card>
//         <div className="flex items-start gap-3 sm:gap-4">
//           {img ? (
//             <img
//               src={img}
//               alt={character.Name}
//               className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover ring-1 ring-white/20"
//             />
//           ) : (
//             <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white/10" />
//           )}
//           <div className="min-w-0">
//             <div className="font-semibold text-white/90 text-sm sm:text-base">
//               {character.Name}
//             </div>
//             <p className="mt-1 text-[13px] sm:text-sm text-white/75 leading-relaxed">
//               {character.Description}
//             </p>
//           </div>
//         </div>
//       </Card>

//       {/* Stats */}
//       {stats.length === 0 ? (
//         <Card>
//           <div className="text-sm text-white/70">No stats yet.</div>
//         </Card>
//       ) : (
//         stats.map((s) => (
//           <Card key={s.key}>
//             <div className="flex items-center justify-between">
//               <div className="font-medium text-white/90">{s.label}</div>
//               {s.type && <Chip>{s.type}</Chip>}
//             </div>

//             {typeof s?.max === "number" ? (
//               <div className="mt-2">
//                 <div className="text-sm">{s.value}/{s.max}</div>
//                 <div className="h-2 rounded bg-white/10 mt-1 overflow-hidden">
//                   <div
//                     className="h-2 bg-white/40"
//                     style={{ width: `${Math.min(100, (s.value / s.max) * 100)}%` }}
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="mt-1 text-sm opacity-85 break-words">
//                 {String(s.value ?? "")}
//               </div>
//             )}

//             {s.desc && <div className="mt-1 text-xs text-white/70">{s.desc}</div>}
//           </Card>
//         ))
//       )}
//     </>
//   );
// }








import React from "react";
import { getImgSrc } from "../../utils/getImgSrc";

/**
 * Boss requirements covered:
 * - Support property types: string / int / float / progress
 * - Numbers (int/float) and progress always show: name + description + value
 * - Strings may show content only
 * - Strings starting with `#` render blue; `@` render yellow
 * - Backward compatible with existing shapes:
 *   - type: "number" | "percent" | "text" (mapped to number/progress/string)
 *   - fields: key, label, name, value, max?, desc?
 */

const Card = ({ children }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 mb-3 sm:mb-4">
    {children}
  </div>
);

const Chip = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full bg-white/10 text-[11px] sm:text-xs ${className}`}>
    {children}
  </span>
);

// normalize legacy/new type names to a canonical type
const normalizeType = (t) => {
  const s = String(t || "").toLowerCase();
  if (["percent", "progress"].includes(s)) return "progress";
  if (["text", "string"].includes(s)) return "string";
  if (["int", "integer", "float", "number"].includes(s)) return "number";
  // default: if no type but has max -> progress; else number if value numeric; else string
  return null;
};

// highlight #hash (blue) and @mention (yellow) inside a string
const HighlightedText = ({ text }) => {
  if (!text) return null;
  // keep spaces using split with capture
  const parts = String(text).split(/(\s+)/);
  return parts.map((p, i) => {
    if (p.startsWith("#")) return <span key={i} className="text-blue-400">{p}</span>;
    if (p.startsWith("@")) return <span key={i} className="text-yellow-400">{p}</span>;
    return <span key={i}>{p}</span>;
  });
};

// Single renderer for a property/stat row
const StatRow = ({ stat }) => {
  // Support raw strings in the array: "some text"
  if (typeof stat === "string") {
    return (
      <Card>
        <div className="text-sm text-white/85 leading-relaxed break-words">
          <HighlightedText text={stat} />
        </div>
      </Card>
    );
  }

  const type = normalizeType(stat.type);
  const name = stat.label ?? stat.name ?? stat.key ?? "Property";
  const desc = stat.desc ?? stat.description ?? "";
  const rawVal = stat.value;

  // detect numeric
  const numVal = typeof rawVal === "number" ? rawVal : (rawVal !== undefined && rawVal !== null && rawVal !== "" ? Number(rawVal) : null);
  const hasNumeric = typeof numVal === "number" && !Number.isNaN(numVal);

  // fallback inference when type missing
  const inferredType =
    type ||
    (typeof stat.max === "number" ? "progress" :
      hasNumeric ? "number" : "string");

  if (inferredType === "string") {
    // Show only content; prefer value -> desc -> name
    const content = rawVal ?? desc ?? name;
    return (
      <Card>
        <div className="flex items-center justify-between">
          <div className="font-medium text-white/90">{name}</div>
          <Chip className="opacity-70">string</Chip>
        </div>
        <div className="mt-1 text-sm text-white/80 leading-relaxed break-words">
          <HighlightedText text={content} />
        </div>
      </Card>
    );
  }

  if (inferredType === "progress") {
    const max = typeof stat.max === "number" ? stat.max : 100;
    const v = hasNumeric ? numVal : 0;
    const pct = Math.max(0, Math.min(100, (v / max) * 100));

    return (
      <Card>
        <div className="flex items-center justify-between">
          <div className="font-medium text-white/90">{name}</div>
          <Chip className="opacity-70">progress</Chip>
        </div>

        {desc && (
          <div className="mt-1 text-xs text-white/70 leading-relaxed break-words">
            <HighlightedText text={desc} />
          </div>
        )}

        <div className="mt-2">
          <div className="text-sm">{hasNumeric ? `${v}/${max}` : `0/${max}`}</div>
          <div className="h-2 rounded bg-white/10 mt-1 overflow-hidden">
            <div className="h-2 bg-white/40" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </Card>
    );
  }

  // number (int/float)
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="font-medium text-white/90">{name}</div>
        <Chip className="opacity-70">{Number.isInteger(numVal) ? "int" : "float"}</Chip>
      </div>

      {desc && (
        <div className="mt-1 text-xs text-white/70 leading-relaxed break-words">
          <HighlightedText text={desc} />
        </div>
      )}

      <div className="mt-2 text-sm">
        <span className="opacity-80">Value: </span>
        <span className="font-semibold">{hasNumeric ? numVal : String(rawVal ?? "")}</span>
      </div>
    </Card>
  );
};

export default function OverviewPanel({ character }) {
  if (!character) return null;

  const img = getImgSrc(character.image);
  const stats = Array.isArray(character.stats) ? character.stats : [];

  return (
    <>
      {/* Header: avatar + name + description */}
      <Card>
        <div className="flex items-start gap-3 sm:gap-4">
          {img ? (
            <img
              src={img}
              alt={character.Name}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover ring-1 ring-white/20"
            />
          ) : (
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white/10" />
          )}
          <div className="min-w-0">
            <div className="font-semibold text-white/90 text-sm sm:text-base">
              {character.Name}
            </div>
            <p className="mt-1 text-[13px] sm:text-sm text-white/75 leading-relaxed break-words">
              <HighlightedText text={character.Description} />
            </p>
          </div>
        </div>
      </Card>

      {/* Properties / Stats */}
      {stats.length === 0 ? (
        <Card>
          <div className="text-sm text-white/70">No properties yet.</div>
        </Card>
      ) : (
        stats.map((s, idx) => <StatRow key={s.key || s.label || s.name || idx} stat={s} />)
      )}
    </>
  );
}

