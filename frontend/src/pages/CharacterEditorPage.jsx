

import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import CharacterEditor from "../components/character/CharacterEditor";
import { useChatStore } from "../store/useChatStore";
import { ChevronLeft } from "lucide-react";

export default function CharacterEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    characters,
    selectedCharacter,
    setSelectedCharacter,
    getCharacter,
  } = useChatStore();

  // Load characters if needed
  useEffect(() => {
    if (!characters?.length) getCharacter?.();
  }, [characters, getCharacter]);

  // Select character by :id when available
  useEffect(() => {
    if (!id || !characters?.length) return;
    const found = characters.find(
      (c) => String(c.id ?? c._id) === String(id)
    );
    if (
      found &&
      (selectedCharacter?.id ?? selectedCharacter?._id) !== (found.id ?? found._id)
    ) {
      setSelectedCharacter?.(found);
    }
  }, [id, characters, selectedCharacter, setSelectedCharacter]);

  // ✅ Clear selection on unmount, unless Start Chat triggered navigation
  useEffect(() => {
    return () => {
      const skip = sessionStorage.getItem("skipClearSelectionOnce") === "1";
      if (skip) {
        sessionStorage.removeItem("skipClearSelectionOnce");
        return;
      }
      setSelectedCharacter?.(null);
    };
  }, [setSelectedCharacter]);

  const currentId = id ?? (selectedCharacter?.id ?? selectedCharacter?._id);

  const handleBack = () => {
    // Your requirement earlier was to go Home explicitly
    navigate("/home");
  };

  return (
    <div className="min-h-screen h-[100dvh] text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-6">
          <button
            onClick={handleBack}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/20 transition"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5 text-white/90" />
          </button>
          <h1 className="text-sm font-semibold tracking-wide">角色编辑器</h1>
        </div>

        {currentId ? (
          <Link
            to={`/story-editor/${currentId}`}
            className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
            title="Open Story Editor for this character"
          >
            Story Editor →
          </Link>
        ) : null}
      </header>

      <CharacterEditor />
    </div>
  );
}


