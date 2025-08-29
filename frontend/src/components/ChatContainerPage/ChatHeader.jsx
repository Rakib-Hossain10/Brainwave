

import React from "react";
import { MessageSquare, ChevronLeft } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const { selectedCharacter, setSelectedCharacter } = useChatStore();
  const navigate = useNavigate();

  const getImgSrc = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (img?.src && typeof img.src === "string") return img.src;
    const first = Object.values(img).find((v) => typeof v === "string");
    return first || "";
  };

  const aiName = selectedCharacter?.Name || "AI";
  const aiImg = getImgSrc(selectedCharacter?.image) || "/avatar.png";

  const handleBack = () => {
    setSelectedCharacter(null);
    navigate("/home");
  };

  return (
    <header className="w-full bg-n-11/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 py-2 md:py-3">
        {/* ===== Desktop (md+) ===== */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left side: Back + Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/20 transition"
            >
              <ChevronLeft className="h-5 w-5 text-white/90" />
            </button>

            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <MessageSquare className="h-5 w-5 text-white/90" />
              </span>
              <span className="text-lg font-semibold text-white/90 leading-none">
                Software Name
              </span>
            </div>
          </div>

          {/* AI identity */}
          <div className="flex items-center gap-3">
            <img
              src={aiImg}
              alt={aiName}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-white/20"
            />
            <span className="text-sm font-medium text-white/90">{aiName}</span>
          </div>
        </div>

        {/* ===== Mobile (< md) ===== */}
        <div className="flex flex-col items-center justify-center md:hidden text-center space-y-2">
          {/* Top row: back button on left + brand centered */}
          <div className="relative w-full flex items-center justify-center">
            {/* Back button pinned left */}
            <button
              onClick={handleBack}
              className="absolute left-0 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/20 transition mt-12"
            >
              <ChevronLeft className="h-5 w-5 text-white/90 flex" />
            </button> 

            {/* Software Name centered */}
            <div className="flex items-center gap-2.5 justify-center">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <MessageSquare className="h-5 w-5 text-white/90" />
              </span>
              <span className="text-base font-semibold text-white/90 leading-none">
                Software Name
              </span>
            </div>
          </div>

          {/* AI avatar + name below */}
          <div className="flex items-center gap-2 justify-center">
            <img
              src={aiImg}
              alt={aiName}
              className="h-10 w-10 rounded-full object-cover ring-1 ring-white/20"
            />
            <span className="text-sm text-white/80">{aiName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;



