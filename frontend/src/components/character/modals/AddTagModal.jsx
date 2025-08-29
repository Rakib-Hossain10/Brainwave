import React, { useState } from "react";
import Modal from "../../common/Modal";

export default function AddTagModal({ open, onClose, onSubmit }) {
  const [tag, setTag] = useState("");

  const canSave = tag.trim().length > 0;

  const handleSave = () => {
    onSubmit?.(tag.trim());
    onClose?.();
  };

  return (
    <Modal
      open={open}
      title="添加标签"
      onClose={onClose}
      actions={
        <>
          <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg ${canSave ? "bg-white/80 text-black hover:bg-white" : "bg-white/20 text-white/50 cursor-not-allowed"}`}
            disabled={!canSave}
            onClick={handleSave}
          >
            Save
          </button>
        </>
      }
    >
      <div>
        <label className="text-xs text-white/70">New Tag</label>
        <input
          className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
          placeholder="主角 / 科幻 / 温柔…"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
      </div>
    </Modal>
  );
}
