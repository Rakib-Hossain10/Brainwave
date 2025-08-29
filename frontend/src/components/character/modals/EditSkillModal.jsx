// import React, { useEffect, useState } from "react";
// import Modal from "../../common/Modal";

// export default function EditSkillModal({ open, skill, onClose, onSubmit }) {
//   const [form, setForm] = useState({
//     id: "",
//     name: "",
//     description: "",
//     costType: "技能点",
//     costValue: "",
//     damageType: "单体",
//     damageValue: "",
//   });

//   useEffect(() => {
//     if (!open) return;
//     setForm({
//       id: skill?.id || "",
//       name: skill?.name || "",
//       description: skill?.description || "",
//       costType: skill?.cost?.type || "技能点",
//       costValue: skill?.cost?.value ?? "",
//       damageType: skill?.damage?.type || "单体",
//       damageValue: skill?.damage?.value ?? "",
//     });
//   }, [open, skill]);

//   const canSave = form.name.trim().length > 0 && form.description.trim().length > 0;

//   const handleSave = () => {
//     const payload = {
//       id: form.id || undefined,
//       name: form.name.trim(),
//       description: form.description.trim(),
//       cost:
//         form.costValue === "" ? undefined : { type: form.costType, value: Number(form.costValue) || 0 },
//       damage:
//         form.damageValue === "" ? undefined : { type: form.damageType, value: Number(form.damageValue) || 0 },
//     };
//     onSubmit?.(payload);
//     onClose?.();
//   };

//   return (
//     <Modal
//       open={open}
//       title="编辑技能"
//       onClose={onClose}
//       actions={
//         <>
//           <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className={`px-3 py-1.5 rounded-lg ${canSave ? "bg-white/80 text-black hover:bg-white" : "bg-white/20 text-white/50 cursor-not-allowed"}`}
//             disabled={!canSave}
//             onClick={handleSave}
//           >
//             Save
//           </button>
//         </>
//       }
//     >
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         <div className="sm:col-span-2">
//           <label className="text-xs text-white/70">Skill name</label>
//           <input
//             className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />
//         </div>
//         <div className="sm:col-span-2">
//           <label className="text-xs text-white/70">Description</label>
//           <textarea
//             className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none min-h-[96px]"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//           />
//         </div>

//         <div>
//           <label className="text-xs text-white/70">Cost Type</label>
//           <select
//             className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
//             value={form.costType}
//             onChange={(e) => setForm({ ...form, costType: e.target.value })}
//           >
//             <option>技能点</option>
//             <option>能量</option>
//             <option>怒气</option>
//           </select>
//         </div>
//         <div>
//           <label className="text-xs text-white/70">Cost Value</label>
//           <input
//             className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
//             placeholder="e.g. 5"
//             value={form.costValue}
//             onChange={(e) => setForm({ ...form, costValue: e.target.value })}
//           />
//         </div>

//         <div>
//           <label className="text-xs text-white/70">Damage Type</label>
//           <select
//             className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
//             value={form.damageType}
//             onChange={(e) => setForm({ ...form, damageType: e.target.value })}
//           >
//             <option>单体</option>
//             <option>群体</option>
//             <option>DOT</option>
//           </select>
//         </div>
//         <div>
//           <label className="text-xs text-white/70">Damage Value</label>
//           <input
//             className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
//             placeholder="e.g. 60"
//             value={form.damageValue}
//             onChange={(e) => setForm({ ...form, damageValue: e.target.value })}
//           />
//         </div>
//       </div>
//     </Modal>
//   );
// }







import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Modal from "../../common/Modal";

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

  // Close on true outside click / Esc (allow clicks inside the menu)
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      const t = e.target;
      if (triggerRef.current?.contains(t)) return; // clicking trigger toggles separately
      if (menuRef.current?.contains(t)) return;    // let item onClick run first
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

  // Smart positioning (open upward if below space is tight)
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
        top = Math.max(m, rect.top - 8); // translated by 100% height in CSS
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
                    onChange(opt.value); // fires before outside-close
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
// End Select 

export default function EditSkillModal({ open, skill, onClose, onSubmit }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    costType: "技能点",
    costValue: "",
    damageType: "单体",
    damageValue: "",
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      id: skill?.id || "",
      name: skill?.name || "",
      description: skill?.description || "",
      costType: skill?.cost?.type || "技能点",
      costValue: skill?.cost?.value ?? "",
      damageType: skill?.damage?.type || "单体",
      damageValue: skill?.damage?.value ?? "",
    });
  }, [open, skill]);

  const canSave =
    form.name.trim().length > 0 && form.description.trim().length > 0;

  const handleSave = () => {
    const payload = {
      id: form.id || undefined,
      name: form.name.trim(),
      description: form.description.trim(),
      cost:
        form.costValue === ""
          ? undefined
          : { type: form.costType, value: Number(form.costValue) || 0 },
      damage:
        form.damageValue === ""
          ? undefined
          : { type: form.damageType, value: Number(form.damageValue) || 0 },
    };
    onSubmit?.(payload);
    onClose?.();
  };

  // Options (same display strings as before)
  const costTypeOptions = [
    { value: "技能点", label: "技能点" },
    { value: "能量", label: "能量" },
    { value: "怒气", label: "怒气" },
  ];

  const damageTypeOptions = [
    { value: "单体", label: "单体" },
    { value: "群体", label: "群体" },
    { value: "DOT", label: "DOT" },
  ];

  return (
    <Modal
      open={open}
      title="编辑技能"
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
        <div className="sm:col-span-2">
          <label className="text-xs text-white/70">Skill name</label>
          <input
            className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs text-white/70">Description</label>
          <textarea
            className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none min-h-[96px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs text-white/70">Cost Type</label>
          <div className="mt-1">
            <Select
              value={form.costType}
              onChange={(v) => setForm({ ...form, costType: v })}
              options={costTypeOptions}
              label="Cost Type"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/70">Cost Value</label>
          <input
            className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
            placeholder="e.g. 5"
            value={form.costValue}
            onChange={(e) => setForm({ ...form, costValue: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs text-white/70">Damage Type</label>
          <div className="mt-1">
            <Select
              value={form.damageType}
              onChange={(v) => setForm({ ...form, damageType: v })}
              options={damageTypeOptions}
              label="Damage Type"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/70">Damage Value</label>
          <input
            className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
            placeholder="e.g. 60"
            value={form.damageValue}
            onChange={(e) => setForm({ ...form, damageValue: e.target.value })}
          />
        </div>
      </div>
    </Modal>
  );
}

