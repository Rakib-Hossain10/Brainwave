import React from "react";
import StoryEditor from "../components/story/StoryEditor";
import { useParams, Link } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { ChevronLeft } from "lucide-react";

export default function StoryEditorPage() {
  const { selectedCharacter } = useChatStore();
  const { id } = useParams();
  const currentId = selectedCharacter?.id ?? selectedCharacter?._id;

  return (
    <div className="min-h-screen h-[100dvh] bg-[#0b0c10] text-white">
      {/* Header like screenshot (title left, ✓ right) */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-xl border-b border-white/10">

        <Link
        to={`/characters/${currentId}`}
        className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
      >
         <ChevronLeft className="h-5 w-5 text-white/90" />
      </Link>

        <h1 className="text-sm font-semibold tracking-wide">剧情分支编辑器</h1>
        <button
          title="Save"
          
          onClick={() => document.dispatchEvent(new CustomEvent("story:save"))}
        >
          ✓ Save
        </button>



      </header>



      <StoryEditor />
    </div>
  );
}
