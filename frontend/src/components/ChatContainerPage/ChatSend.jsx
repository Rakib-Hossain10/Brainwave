

import React, { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useChatStore } from "../../store/useChatStore"; 

export default function ChatSend() {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const { sendMessage, selectedCharacter } = useChatStore();

  const textareaRef = useRef(null);

  // auto-resize (1–6 lines)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(160, el.scrollHeight) + "px";
  }, [text]);

  
  const charId = selectedCharacter?._id ?? selectedCharacter?.id;
 const canSend = !!charId && text.trim().length > 0 && !sending;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSend) return;
    try {
      setSending(true);
      await sendMessage({ text: text.trim() }); // matches your store
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    // full-width footer background using your palette (n-11 over n-8 body)
    <div className="w-full bg-n-11/70 backdrop-blur-md px-3 sm:px-4 md:px-6 py-3 sm:py-4 pb-[env(safe-area-inset-bottom)] ">
      {/* keep the content width aligned with ChatMainContent */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-screen-md">
        <div className="flex items-end gap-2 sm:gap-3 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-2 sm:p-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={
              selectedCharacter
                ? `Message ${selectedCharacter.Name}…`
                : "Select a character to start…"
            }
            className="min-h-[40px] max-h-40 w-full resize-none bg-transparent text-n-1 placeholder:text-n-3 outline-none px-2 sm:px-3 py-2 leading-6"
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send"
            className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-2xl transition
              ${canSend
                ? "bg-white/20 hover:bg-white/30 active:bg-white/40"
                : "bg-white/10 opacity-50 cursor-not-allowed"}`}
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      </form>
    </div>
  );
}
