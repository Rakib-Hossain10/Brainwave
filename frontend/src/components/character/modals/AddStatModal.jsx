



// import React, { useMemo, useState } from "react";
// import Modal from "../../common/Modal";

// /**
//  * Produces a stat object compatible with  OverviewPanel renderer:
//  *   type: "string" | "int" | "float" | "progress"
//  *   fields: key, label, value, max? (for progress), desc?
//  *
//  * Behavior:
//  * - string: value is plain text
//  * - int:    value is integer number
//  * - float:  value is floating number
//  * - progress: value/max numbers (max optional -> defaults to 100 at save)
//  */

// export default function AddStatModal({ open, onClose, onSubmit }) {
//   const [form, setForm] = useState({
//     key: "",
//     label: "",
//     type: "string",   // string | int | float | progress
//     value: "",
//     max: "",
//     desc: "",
//   });

//   // Helpers to render correct inputs & validations per type
//   const isString = form.type === "string";
//   const isInt = form.type === "int";
//   const isFloat = form.type === "float";
//   const isProgress = form.type === "progress";

//   const numericValue = useMemo(() => {
//     if (isInt) return Number.isNaN(parseInt(form.value, 10)) ? null : parseInt(form.value, 10);
//     if (isFloat || isProgress) return Number.isNaN(parseFloat(form.value)) ? null : parseFloat(form.value);
//     return null;
//   }, [form.value, isInt, isFloat, isProgress]);

//   const numericMax = useMemo(() => {
//     if (!isProgress) return null;
//     if (form.max === "") return 100; // default
//     const m = parseFloat(form.max);
//     return Number.isNaN(m) ? 100 : m;
//   }, [form.max, isProgress]);

//   const canSave = useMemo(() => {
//     if (!form.key.trim() || !form.label.trim()) return false;
//     if (isString) return String(form.value).trim().length > 0;
//     if (isInt || isFloat || isProgress) return numericValue !== null;
//     return false;
//   }, [form, isString, isInt, isFloat, isProgress, numericValue]);

//   const handleSave = () => {
//     // Build payload according to the selected type
//     const base = {
//       key: form.key.trim(),
//       label: form.label.trim(),
//       type: form.type, // "string" | "int" | "float" | "progress"
//       desc: form.desc.trim() || undefined,
//     };

//     let payload = base;

//     if (isString) {
//       payload = { ...base, value: String(form.value) };
//     } else if (isInt) {
//       payload = { ...base, value: numericValue ?? 0 };
//     } else if (isFloat) {
//       payload = { ...base, value: numericValue ?? 0 };
//     } else if (isProgress) {
//       payload = {
//         ...base,
//         value: numericValue ?? 0,
//         max: numericMax ?? 100,
//       };
//     }

//     onSubmit?.(payload);
//     onClose?.();
//   };

//   return (
//     <Modal
//       open={open}
//       title="添加属性"
//       onClose={onClose}
//       actions={
//         <>
//           <button
//             className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className={`px-3 py-1.5 rounded-lg ${
//               canSave
//                 ? "bg-white/80 text-black hover:bg-white"
//                 : "bg-white/20 text-white/50 cursor-not-allowed"
//             }`}
//             disabled={!canSave}
//             onClick={handleSave}
//           >
//             Save
//           </button>
//         </>
//       }
//     >
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         {/* Key */}
//         <div>
//           <label className="text-xs text-white/70">Key</label>
//           <input
//             className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
//             placeholder="e.g. strength / patience / trust"
//             value={form.key}
//             onChange={(e) => setForm({ ...form, key: e.target.value })}
//           />
//         </div>

//         {/* Label (display name) */}
//         <div>
//           <label className="text-xs text-white/70">Label</label>
//           <input
//             className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
//             placeholder="e.g. 力量 / 耐心 / 信任"
//             value={form.label}
//             onChange={(e) => setForm({ ...form, label: e.target.value })}
//           />
//         </div>

//         {/* Type */}
//         <div className="">
//           <label className="text-xs text-white/70">Type</label>
//           <select
//             className="mt-1 w-full rounded-lg bg-white/9.5 px-3 py-2 text-sm outline-none"
//             value={form.type}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 type: e.target.value,
//                 // clear numeric fields when switching
//                 value: "",
//                 max: "",
//               })
//             }
//           >
          
//               <option className="w-full" value="string">string</option>
//               <option value="int">int</option>
//               <option value="float">float</option>
//               <option value="progress">progress</option>
            
//           </select>
//         </div>

//         {/* Value */}
//         <div>
//           <label className="text-xs text-white/70">Value</label>
//           {isString ? (
//             <input
//               className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
//               placeholder="e.g. #Warrior @Stealth or any text"
//               value={form.value}
//               onChange={(e) => setForm({ ...form, value: e.target.value })}
//             />
//           ) : (
//             <input
//               type="number"
//               step={isInt ? "1" : "any"}
//               className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
//               placeholder={isProgress ? "e.g. 60" : isInt ? "e.g. 10" : "e.g. 12.5"}
//               value={form.value}
//               onChange={(e) => setForm({ ...form, value: e.target.value })}
//             />
//           )}
//         </div>

//         {/* Max (only for progress) */}
//         {isProgress && (
//           <div>
//             <label className="text-xs text-white/70">Max (optional; default 100)</label>
//             <input
//               type="number"
//               step="any"
//               className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
//               placeholder="e.g. 100"
//               value={form.max}
//               onChange={(e) => setForm({ ...form, max: e.target.value })}
//             />
//           </div>
//         )}

//         {/* Description */}
//         <div className="sm:col-span-2">
//           <label className="text-xs text-white/70">Description (optional)</label>
//           <input
//             className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
//             placeholder="brief note…"
//             value={form.desc}
//             onChange={(e) => setForm({ ...form, desc: e.target.value })}
//           />
//           {/* small helper note about # / @ highlighting */}
//           {isString && (
//             <div className="mt-1 text-[11px] text-white/60">
//               Tip: strings starting with <span className="text-blue-400">#</span> show in blue; with{" "}
//               <span className="text-yellow-400">@</span> show in yellow.
//             </div>
//           )}
//         </div>
//       </div>
//     </Modal>
//   );
// }




import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Modal from "../../common/Modal";

//Dependency-free Select
/* Portal menu + smart positioning; fixes mobile overflow & selection */
function Select({ value, onChange, options, label = "Select", className = "" }) {
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({
    top: 0,
    left: 0,
    width: 0,
    direction: "down",
    maxH: 240,
  });

  const close = () => setOpen(false);

  // Close on true outside click / Esc (keep clicks inside the menu)
  useEffect(() => {
    if (!open) return;

    const onDocClick = (e) => {
      const t = e.target;
      if (triggerRef.current?.contains(t)) return; // click on trigger itself
      if (menuRef.current?.contains(t)) return;    // click inside menu => allow option onClick first
      close();
    };
    const onKey = (e) => e.key === "Escape" && close();

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Compute menu position (opens up if not enough room below)
  useEffect(() => {
    if (!open) return;
    const compute = () => {
      const m = 10; // viewport margin
      const rect = triggerRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const preferredTop = rect.bottom + 8;
      const spaceBelow = vh - preferredTop - m;
      const spaceAbove = rect.top - m;

      let direction = "down";
      let top = preferredTop;
      let maxH = Math.min(280, spaceBelow);

      if (spaceBelow < 160 && spaceAbove > spaceBelow) {
        direction = "up";
        top = Math.max(m, rect.top - 8); // we'll translate by 100% height in CSS
        maxH = Math.min(280, spaceAbove);
      }

      const left = Math.min(Math.max(m, rect.left), Math.max(m, vw - rect.width - m));
      setMenuPos({ top, left, width: rect.width, direction, maxH });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(document.body);
    window.addEventListener("scroll", compute, true);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", compute, true);
      window.removeEventListener("resize", compute);
    };
  }, [open]);

  const menu = open
    ? ReactDOM.createPortal(
        <div
          className="fixed z-[1000]"
          style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
          ref={menuRef}
        >
          <div
            className="rounded-xl shadow-2xl ring-1 ring-white/15 bg-neutral-900 text-white overflow-auto"
            style={{
              maxHeight: menuPos.maxH,
              transform:
                menuPos.direction === "up" ? "translateY(-100%) translateY(-8px)" : "none",
            }}
            role="listbox"
          >
            {options.map((opt) => {
              const selected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value); // will run before outside-close
                    close();
                  }}
                  className={`w-full text-left px-3 py-2 text-sm md:text-[13px] 
                    ${selected ? "bg-white/15" : "hover:bg-white/10"} 
                    focus:outline-none`}
                  role="option"
                  aria-selected={selected}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        className={`w-full rounded-lg bg-white/10 px-3 py-2 pr-9 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20 relative ${className}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={label}
      >
        <span className="truncate block">
          {options.find((o) => o.value === value)?.label ?? label}
        </span>
        {/* Arrow */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.085l3.71-3.855a.75.75 0 111.08 1.04l-4.24 4.41a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
        </svg>
      </button>
      {menu}
    </>
  );
}
//End Select 

export default function AddStatModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    key: "",
    label: "",
    type: "string", // string | int | float | progress
    value: "",
    max: "",
    desc: "",
  });

  const isString = form.type === "string";
  const isInt = form.type === "int";
  const isFloat = form.type === "float";
  const isProgress = form.type === "progress";

  const numericValue = useMemo(() => {
    if (isInt) return Number.isNaN(parseInt(form.value, 10)) ? null : parseInt(form.value, 10);
    if (isFloat || isProgress) return Number.isNaN(parseFloat(form.value)) ? null : parseFloat(form.value);
    return null;
  }, [form.value, isInt, isFloat, isProgress]);

  const numericMax = useMemo(() => {
    if (!isProgress) return null;
    if (form.max === "") return 100;
    const m = parseFloat(form.max);
    return Number.isNaN(m) ? 100 : m;
  }, [form.max, isProgress]);

  const canSave = useMemo(() => {
    if (!form.key.trim() || !form.label.trim()) return false;
    if (isString) return String(form.value).trim().length > 0;
    if (isInt || isFloat || isProgress) return numericValue !== null;
    return false;
  }, [form, isString, isInt, isFloat, isProgress, numericValue]);

  const handleSave = () => {
    const base = {
      key: form.key.trim(),
      label: form.label.trim(),
      type: form.type,
      desc: form.desc.trim() || undefined,
    };

    let payload = base;

    if (isString) {
      payload = { ...base, value: String(form.value) };
    } else if (isInt) {
      payload = { ...base, value: numericValue ?? 0 };
    } else if (isFloat) {
      payload = { ...base, value: numericValue ?? 0 };
    } else if (isProgress) {
      payload = {
        ...base,
        value: numericValue ?? 0,
        max: numericMax ?? 100,
      };
    }

    onSubmit?.(payload);
    onClose?.();
  };

  const typeOptions = [
    { value: "string", label: "string" },
    { value: "int", label: "int" },
    { value: "float", label: "float" },
    { value: "progress", label: "progress" },
  ];

  return (
    <Modal
      open={open}
      title="添加属性"
      onClose={onClose}
      actions={
        <>
          <button
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg ${
              canSave
                ? "bg-white/80 text-black hover:bg-white"
                : "bg-white/20 text-white/50 cursor-not-allowed"
            }`}
            disabled={!canSave}
            onClick={handleSave}
          >
            Save
          </button>
        </>
      }
    >
      {/* allow dropdown to overflow properly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-visible">
        {/* Key */}
        <div>
          <label className="text-xs text-white/70">Key</label>
          <input
            className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
            placeholder="e.g. strength / patience / trust"
            value={form.key}
            onChange={(e) => setForm({ ...form, key: e.target.value })}
          />
        </div>

        {/* Label */}
        <div>
          <label className="text-xs text-white/70">Label</label>
          <input
            className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
            placeholder="e.g. 力量 / 耐心 / 信任"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
        </div>

        {/* Type */}
        <div>
          <label className="text-xs text-white/70">Type</label>
          <div className="mt-1">
            <Select
              value={form.type}
              onChange={(v) =>
                setForm({
                  ...form,
                  type: v,
                  value: "",
                  max: "",
                })
              }
              options={typeOptions}
              label="Type"
            />
          </div>
        </div>

        {/* Value */}
        <div>
          <label className="text-xs text-white/70">Value</label>
          {isString ? (
            <input
              className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
              placeholder="e.g. #Warrior @Stealth or any text"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
          ) : (
            <input
              type="number"
              step={isInt ? "1" : "any"}
              className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
              placeholder={isProgress ? "e.g. 60" : isInt ? "e.g. 10" : "e.g. 12.5"}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
          )}
        </div>

        {/* Max (only for progress) */}
        {isProgress && (
          <div>
            <label className="text-xs text-white/70">Max (optional; default 100)</label>
            <input
              type="number"
              step="any"
              className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
              placeholder="e.g. 100"
              value={form.max}
              onChange={(e) => setForm({ ...form, max: e.target.value })}
            />
          </div>
        )}

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="text-xs text-white/70">Description (optional)</label>
          <input
            className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
            placeholder="brief note…"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
          />
          {isString && (
            <div className="mt-1 text-[11px] text-white/60">
              Tip: strings starting with <span className="text-blue-400">#</span> show in blue; with{" "}
              <span className="text-yellow-400">@</span> show in yellow.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
