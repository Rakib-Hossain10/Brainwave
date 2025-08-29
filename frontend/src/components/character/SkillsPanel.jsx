import React from "react";

const Card = ({ children }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 mb-3 sm:mb-4">
    {children}
  </div>
);

const Chip = ({ children }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/10 text-[11px] sm:text-xs">
    {children}
  </span>
);

export default function SkillsPanel({ character, onEdit }) {
  const skills = character?.skills || [];

  if (skills.length === 0) {
    return (
      <Card>
        <div className="text-sm text-white/70">No skills yet.</div>
      </Card>
    );
  }

  return (
    <>
      {skills.map((sk) => (
        <Card key={sk.id}>
          <div className="flex items-center justify-between">
            <div className="font-semibold text-white/90">{sk.name}</div>
            <button
              type="button"
              onClick={() => onEdit?.(sk)}
              className="text-xs underline opacity-80 hover:opacity-100"
            >
              ✎ Edit
            </button>
          </div>

          <p className="mt-1 text-[13px] sm:text-sm text-white/80 leading-relaxed">
            {sk.description}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {sk.cost && <Chip>消耗: {sk.cost.type} {sk.cost.value}</Chip>}
            {sk.damage && <Chip>伤害: {sk.damage.type} {sk.damage.value}</Chip>}
            {(sk.adds || []).map((a, i) => (
              <Chip key={i}>添加: {a.type}{a.value ? ` ${a.value}` : ""}</Chip>
            ))}
          </div>
        </Card>
      ))}
    </>
  );
}
