// Minimal, realistic messages
export const mockMessages = (authUserId, aiId) => ([
  {
    _id: "m1",
    senderId: authUserId,        // user
    receiverId: aiId,
    text: "Hey! Can you help me pick a restaurant for tonight?",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "m2",
    senderId: aiId,              // AI
    receiverId: authUserId,
    text: "Absolutely. Any preference for cuisine or budget?",
    audio: "/mock/audio/reply-1.mp3", // put any local/public URL here
    createdAt: new Date().toISOString(),
  },
  {
    _id: "m3",
    senderId: authUserId,
    receiverId: aiId,
    text: "Mid-range, maybe Italian. Somewhere near CBD.",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "m4",
    senderId: aiId,
    receiverId: authUserId,
    text:
      "Got it. I found a few cozy Italian spots within 2 km of the CBD. " +
      "Do you want romantic ambience or more lively?",
    audio: "/mock/audio/reply-2.mp3",
    createdAt: new Date().toISOString(),
  },
]);
