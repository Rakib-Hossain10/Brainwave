






// import React, { useEffect, useRef } from "react";
// import ChatHeader from "../components/ChatContainerPage/ChatHeader";
// import ChatSend from "../components/ChatContainerPage/ChatSend";
// import MessageSkeleton from "../components/chat/MessageSkeleton";
// import { useChatStore } from "../store/useChatStore";
// import { useAuthStore } from "../store/useAuthStore";

// export default function ChatContainerPage() {
//   const {
//     messages,
//     getMessages,
//     isMessagesLoading,
//     selectedCharacter,
//   } = useChatStore();
//   const { authUser } = useAuthStore();

//   // auto-scroll ref
//   const endRef = useRef(null);

//   // Fetch messages when selected character changes (supports _id or id)
//   useEffect(() => {
//     const cid = selectedCharacter?._id ?? selectedCharacter?.id;
//     if (cid) getMessages(cid);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedCharacter?._id, selectedCharacter?.id]);

//   // Auto-scroll on new messages
//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "auto" });
//   }, [messages]);

//   return (
//     <div className="flex flex-col min-h-screen h-[100dvh] w-full bg-n-8 ">
//       {/* Fixed header (≈64px tall; adjust if your header differs) */}
//       <header className="fixed top-0 z-10 bg-n-8 w-full">
//         <ChatHeader />
//       </header>

//       {/* Middle band: ends BEFORE the fixed ChatSend */}
//       <main className="flex-1 w-full overflow-hidden pt-16 pb-[calc(65px+env(safe-area-inset-bottom))] mt-9">  {/*pb-[65px] is setting the height with middile maincontent */}
//         <div className="mx-auto h-full w-full max-w-screen-md px-3 sm:px-5 md:px-8 py-4 sm:py-6">
//           {/* Scrollable message column */}
//           <div
//             className="
//               h-full w-full overflow-y-auto overscroll-contain
//               space-y-4
//               px-1
//             "
//           >
//             {isMessagesLoading ? (
//               <>
//                <MessageSkeleton align="right" />
//                 <MessageSkeleton align="left" />
//                <MessageSkeleton align="right" />
//                 <MessageSkeleton align="left" />
//                <MessageSkeleton align="right" />
//                 <MessageSkeleton align="left" />
//                <MessageSkeleton align="right" />
                

                
//               </>
//             ) : (
//               <>
//                 {messages.map((m) => {
//                   // Before auth is wired, use a stable fallback id so UI behaves
//                   const myId = authUser?._id ?? "user-123";
//                   const isMe = m.senderId === myId;

//                   return (
//                     <div
//                       key={m._id ?? `${m.senderId}-${m.createdAt ?? Math.random()}`}
//                       className={`flex ${isMe ? "justify-end" : "justify-start"}`}
//                     >
//                       <div
//                         className={[
//                           "group relative max-w-[92%] sm:max-w-[88%] md:max-w-[68%]",
//                           "rounded-2xl border px-3.5 py-2.5 sm:px-[18px] sm:py-3",
//                           "whitespace-pre-wrap break-words", // never overflow
//                           "shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all",
//                           isMe
//                             ? "bg-gradient-to-br from-white/25 via-white/15 to-white/10 border-white/20 text-gray-50 hover:shadow-[0_18px_60px_rgba(99,102,241,0.35)]"
//                             : "bg-gradient-to-br from-black/55 via-black/45 to-black/35 border-white/15 text-gray-100 hover:shadow-[0_18px_60px_rgba(56,189,248,0.25)]",
//                         ].join(" ")}
//                       >
//                         {/* Hover accent ring */}
//                         <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-inset group-hover:ring-white/15 transition" />

//                         {/* AI avatar + name (never show user avatar) */}
//                         {!isMe && (
//                           <div className="mb-2 flex items-center gap-2">
//                             <img
//                               src={
//                                 typeof selectedCharacter?.image === "string"
//                                   ? selectedCharacter.image
//                                   : "/avatar.png"
//                               }
//                               alt="AI"
//                               className="h-7 w-7 rounded-full border border-white/20 object-cover"
//                             />
//                             <span className="text-xs sm:text-sm text-white/80">
//                               {selectedCharacter?.Name ?? "AI"}
//                             </span>
//                           </div>
//                         )}

//                         {/* Text only — audio removed as requested */}
//                         {m.text && (
//                           <p className="text-[15px] leading-relaxed tracking-[0.01em]">
//                             {m.text}
//                           </p>
//                         )}

//                         {/* subtle bottom highlight */}
//                         <div className="pointer-events-none absolute -bottom-px left-5 right-5 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div ref={endRef} />
//               </>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Fixed footer (chat input) */}
//       <footer className="fixed bottom-0 z-10 bg-transparent w-full">
//         <ChatSend />
//       </footer>
//     </div>
//   );
// }



















import React, { useEffect, useRef } from "react";
import ChatHeader from "../components/ChatContainerPage/ChatHeader";
import ChatSend from "../components/ChatContainerPage/ChatSend";
import MessageSkeleton from "../components/chat/MessageSkeleton";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import Live2DDisplay from "../components/live2d/Live2DModel";

export default function ChatContainerPage() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedCharacter,
  } = useChatStore();
  const { authUser } = useAuthStore();

  // auto-scroll ref
  const endRef = useRef(null);

  // Fetch messages when selected character changes (supports _id or id)
  useEffect(() => {
    const cid = selectedCharacter?._id ?? selectedCharacter?.id;
    if (cid) getMessages(cid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCharacter?._id, selectedCharacter?.id]);

  // Auto-scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen h-[100dvh] w-full bg-n-8 ">
      {/* Fixed header (≈64px tall; adjust if your header differs) */}
      <header className="fixed top-0 z-10 bg-n-8 w-full">
        <ChatHeader />
      </header>

      {/* Middle band: ends BEFORE the fixed ChatSend */}
      <main className="flex-1 w-full overflow-hidden pt-16 pb-[calc(65px+env(safe-area-inset-bottom))] mt-9">  {/*pb-[65px] is setting the height with middile maincontent */}
        <div className="mx-auto h-full w-full max-w-screen-md px-3 sm:px-5 md:px-8 py-4 sm:py-6">
          {/* Scrollable message column */}
          <div
            className="
              h-full w-full overflow-y-auto overscroll-contain
              space-y-4
              px-1
            "
          >
            {isMessagesLoading ? (
              <>
               <MessageSkeleton align="right" />
                <MessageSkeleton align="left" />
               <MessageSkeleton align="right" />
                <MessageSkeleton align="left" />
               <MessageSkeleton align="right" />
                <MessageSkeleton align="left" />
               <MessageSkeleton align="right" />
                

                
              </>
            ) : (
              <>
                {messages.map((m) => {
                  // Before auth is wired, use a stable fallback id so UI behaves
                  const myId = authUser?._id ?? "user-123";
                  const isMe = m.senderId === myId;

                  return (
                    <div
                      key={m._id ?? `${m.senderId}-${m.createdAt ?? Math.random()}`}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={[
                          "group relative max-w-[92%] sm:max-w-[88%] md:max-w-[68%]",
                          "rounded-2xl border px-3.5 py-2.5 sm:px-[18px] sm:py-3",
                          "whitespace-pre-wrap break-words", // never overflow
                          "shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all",
                          isMe
                            ? "bg-gradient-to-br from-white/25 via-white/15 to-white/10 border-white/20 text-gray-50 hover:shadow-[0_18px_60px_rgba(99,102,241,0.35)]"
                            : "bg-gradient-to-br from-black/55 via-black/45 to-black/35 border-white/15 text-gray-100 hover:shadow-[0_18px_60px_rgba(56,189,248,0.25)]",
                        ].join(" ")}
                      >
                        {/* Hover accent ring */}
                        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-inset group-hover:ring-white/15 transition" />

                        {/* AI avatar + name (never show user avatar) */}
                        {!isMe && (
                          <div className="mb-2 flex items-center gap-2">
                            <img
                              src={
                                typeof selectedCharacter?.image === "string"
                                  ? selectedCharacter.image
                                  : "/avatar.png"
                              }
                              alt="AI"
                              className="h-7 w-7 rounded-full border border-white/20 object-cover"
                            />
                            <span className="text-xs sm:text-sm text-white/80">
                              {selectedCharacter?.Name ?? "AI"}
                            </span>
                          </div>
                        )}

                        {/* Text only — audio removed as requested */}
                        {m.text && (
                          <p className="text-[15px] leading-relaxed tracking-[0.01em]">
                            {m.text}
                          </p>
                        )}

                        {/* subtle bottom highlight */}
                        <div className="pointer-events-none absolute -bottom-px left-5 right-5 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Fixed footer (chat input) */}
      <footer className="fixed bottom-0 z-10 bg-transparent w-full">
        <ChatSend />
      </footer>

            <Live2DDisplay topOffset={100} width={230} height={350} opacity={1} />

    </div>
  );
};








