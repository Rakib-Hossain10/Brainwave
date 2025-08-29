

import React, { useEffect, useMemo, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import OverviewPanel from "./OverviewPanel";
import SkillsPanel from "./SkillsPanel";
import TagsPanel from "./TagsPanel";
import AddStatModal from "./modals/AddStatModal";
import AddTagModal from "./modals/AddTagModal";
import EditSkillModal from "./modals/EditSkillModal";
import { uid } from "../../utils/uid";
import { useNavigate, useParams } from "react-router-dom";

const TABS = [
  { key: "overview", label: "概览" },
  { key: "skills", label: "技能" },
  { key: "tags", label: "添加标签" },
];

export default function CharacterEditor() {
  const { characters, selectedCharacter, setSelectedCharacter, getCharacter } =
    useChatStore();

  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState("overview");
  const [openAddStat, setOpenAddStat] = useState(false);
  const [openAddTag, setOpenAddTag] = useState(false);
  const [openEditSkill, setOpenEditSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  // 1) Ensure characters are loaded
  useEffect(() => {
    if (!characters || characters.length === 0) getCharacter?.();
  }, [characters, getCharacter]);

  // 2) Restore selection on first mount/when data arrives:
  //    - Prefer routeId
  //    - Else use lastCharacterId from localStorage
  //    - Else fall back to first character and normalize URL
  useEffect(() => {
    if (!characters || characters.length === 0) return;

    const preferId =
      routeId ?? localStorage.getItem("lastCharacterId") ?? null;

    const found = preferId
      ? characters.find((ch) => String(ch._id ?? ch.id) === String(preferId))
      : null;

    if (found) {
      // If the store already has a different selection, update it.
      if (!selectedCharacter || (selectedCharacter._id ?? selectedCharacter.id) !== (found._id ?? found.id)) {
        setSelectedCharacter?.(found);
      }
      // Keep localStorage in sync
      const cid = String(found._id ?? found.id);
      if (cid) localStorage.setItem("lastCharacterId", cid);
      // If we arrived without a route id, normalize the URL once
      if (!routeId) navigate(`/characters/${cid}`, { replace: true });
    } else {
      // Fallback to the first character
      if (characters.length > 0) {
        const first = characters[0];
        setSelectedCharacter?.(first);
        const fid = String(first._id ?? first.id);
        if (fid) localStorage.setItem("lastCharacterId", fid);
        navigate(`/characters/${fid}`, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characters, routeId]);

  const c = useMemo(
    () => selectedCharacter || null,
    [selectedCharacter]
  );

  // Helpers for optimistic updates
  const replaceCharacterInStore = (updated) => {
    const id = updated.id ?? updated._id;
    setSelectedCharacter?.(updated);
    try {
      const api = useChatStore.getState?.();
      if (api?.characters && Array.isArray(api.characters)) {
        const next = api.characters.map((x) =>
          (x.id ?? x._id) === id ? updated : x
        );
        useChatStore.setState?.({
          characters: next,
          selectedCharacter: updated,
        });
      }
    } catch {}
  };

  const handleAddStat = (stat) => {
    if (!c) return;
    const next = { ...c, stats: [...(c.stats || []), stat] };
    replaceCharacterInStore(next);
  };

  const handleAddTag = (tag) => {
    if (!c) return;
    const tags = new Set([...(c.tags || [])]);
    tags.add(tag);
    const next = { ...c, tags: Array.from(tags) };
    replaceCharacterInStore(next);
  };

  const openSkillEditor = (sk) => {
    setEditingSkill(sk || null);
    setOpenEditSkill(true);
  };

  const handleSaveSkill = (payload) => {
    if (!c) return;
    const skills = [...(c.skills || [])];
    if (!payload.id) {
      skills.push({ ...payload, id: uid("sk") });
    } else {
      const i = skills.findIndex((s) => s.id === payload.id);
      if (i >= 0) skills[i] = { ...skills[i], ...payload };
      else skills.push(payload);
    }
    const next = { ...c, skills };
    replaceCharacterInStore(next);
  };

  // Keep URL in sync when user clicks a character in the sidebar
  const handlePickCharacter = (ch) => {
    setSelectedCharacter?.(ch);
    const cid = ch._id ?? ch.id;
    if (cid) {
      localStorage.setItem("lastCharacterId", String(cid));
      navigate(`/characters/${cid}`); // <-- crucial to prevent "jump to first" later
    }
  };

  // Start chat: persist id + go to Home (Home shows Chat if selectedCharacter exists)
  const handleStartChat = () => {
    if (c) {
      const cid = c._id ?? c.id ?? localStorage.getItem("lastCharacterId");
      if (cid) localStorage.setItem("lastCharacterId", String(cid));
      setSelectedCharacter?.(c);
    }
    sessionStorage.setItem("skipClearSelectionOnce", "1");
    navigate("/home");
  };

  if (!c) {
    return (
      <div className="container mx-auto px-4 py-6 text-white/80">
        Loading characters…
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-3 sm:px-4 py-4 grid grid-cols-12 gap-3 md:gap-5">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-3 xl:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2 sm:p-3">
            <ul className="space-y-1">
              {characters.map((ch) => {
                const key = ch.id ?? ch._id;
                const isActive = (c.id ?? c._id) === key;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => handlePickCharacter(ch)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition ${
                        isActive ? "bg-white/15" : "hover:bg-white/10"
                      }`}
                    >
                      <span className="text-sm sm:text-[15px]">{ch.Name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              className="mt-2 w-full rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
              onClick={() => setOpenAddStat(true)}
            >
              + 添加属性
            </button>
          </div>
        </aside>

        {/* Main */}
        <section className="col-span-12 md:col-span-8 lg:col-span-9 xl:col-span-10">
          {/* Tabs + actions (top-right) */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-xl text-sm border transition ${
                  tab === t.key
                    ? "bg-white/15 border-white/20"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              {tab === "skills" && (
                <button
                  className="rounded-xl bg-white/20 px-3 py-1.5 text-sm hover:bg-white/25"
                  onClick={() => openSkillEditor(null)}
                >
                  ＋ 新技能
                </button>
              )}
              {tab === "tags" && (
                <button
                  className="rounded-xl bg-white/20 px-3 py-1.5 text-sm hover:bg-white/25"
                  onClick={() => setOpenAddTag(true)}
                >
                  ＋ 新标签
                </button>
              )}

              {/* Start Chat */}
              <button
                onClick={handleStartChat}
                className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white px-4 py-2 text-sm sm:text-base font-semibold tracking-wide shadow-lg hover:scale-105 hover:shadow-xl hover:from-gray-700 hover:to-gray-900 transition-all duration-300 ease-in-out active:scale-95"
                title="Start Chat with this character"
              >
                Start Chat
              </button>
            </div>
          </div>

          {/* Panels */}
          {tab === "overview" && <OverviewPanel character={c} />}
          {tab === "skills" && (
            <SkillsPanel character={c} onEdit={openSkillEditor} />
          )}
          {tab === "tags" && (
            <TagsPanel character={c} onAdd={() => setOpenAddTag(true)} />
          )}
        </section>
      </div>

      {/* Modals */}
      <AddStatModal
        open={openAddStat}
        onClose={() => setOpenAddStat(false)}
        onSubmit={handleAddStat}
      />
      <AddTagModal
        open={openAddTag}
        onClose={() => setOpenAddTag(false)}
        onSubmit={handleAddTag}
      />
      <EditSkillModal
        open={openEditSkill}
        skill={editingSkill}
        onClose={() => setOpenEditSkill(false)}
        onSubmit={handleSaveSkill}
      />
    </>
  );
}
