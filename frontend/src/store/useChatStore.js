import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import {charactersData} from "../constants/data";

const USE_MOCK = true; // flip to false when backend is ready
import { mockMessages } from "../mock/mockMessages";

export const useChatStore = create((set, get) => ({
  messages: [],
  characters: [],
  selectedCharacter: null,
  isCharactersLoading: false,
  isMessagesLoading: false,

  getCharacter: async () => {
    set({ isCharactersLoading: true });
    try {
      // Simulating fetching characters data
      const res = charactersData; // Replace with axiosInstance.get("/characters") when API is ready
      set({ characters: res });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isCharactersLoading: false });
    }
  },

  // getMessages: async (userId) => {
  //   set({ isMessagesLoading: true });
  //   try {
  //     const res = await axiosInstance.get(`/messages/${userId}`);
  //     set({ messages: res.data });
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   } finally {
  //     set({ isMessagesLoading: false });
  //   }
  // },

   
    getMessages: async (characterId) => {
    const { selectedCharacter } = get();
    set({ isMessagesLoading: true });

    try {
      if (USE_MOCK) {
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 700));
        const authUserId = "user-123"; // or pull from your auth store
        const aiId = selectedCharacter?.id || characterId || "ai-999";
        const data = mockMessages(authUserId, aiId);
        set({ messages: data });
      } else {
        // my real API call
        // const res = await axiosInstance.get(`/messages/${characterId}`);
        // set({ messages: res.data });
      }
    } catch (e) {
      console.error(e);
    } finally {
      set({ isMessagesLoading: false });
    }
  },


  //1st one

  //   sendMessage: async (messageData) => {
  //   const { selectedCharacter, messages } = get();
  //   try {
  //     const res = await axiosInstance.post(
  //       `/messages/send/${selectedCharacter._id}`,
  //       messageData
  //     );
  //     set({ messages: [...messages, res.data] });   // Append the new message with the all existing messages
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  // },




  sendMessage: async (messageData) => {
  const { selectedCharacter, messages } = get();

  // guard: must have a character
  if (!selectedCharacter?.id) return;

  // who is the current user id? (try auth store; fall back to a stable mock id)
  let me = "user-123";
  try {
    const { authUser } = useAuthStore.getState?.() || {};
    if (authUser?._id) me = authUser._id;
  } catch (_) {}

  // construct a local message (same shape your UI expects)
  const localMsg = {
    _id: "local-" + Date.now(),
    senderId: me,
    receiverId: selectedCharacter.id,
    text: (messageData?.text || "").trim(),
    audio: null,
    createdAt: new Date().toISOString(),
  };

  if (USE_MOCK) {
    // mock mode: just push locally
    set({ messages: [...messages, localMsg] });
    return;
  }

  // live mode: optimistic update, then reconcile with server response
  set({ messages: [...messages, localMsg] });
  try {
    const res = await axiosInstance.post(
      `/messages/send/${selectedCharacter._id}`,
      messageData
    );

    // replace the optimistic message with the real one (match by _id prefix)
    const real = res.data;
    set({
      messages: get().messages.map((m) =>
        m._id === localMsg._id ? real : m
      ),
    });
  } catch (error) {
    // revert optimistic append on failure
    set({ messages: get().messages.filter((m) => m._id !== localMsg._id) });
    toast.error(error?.response?.data?.message || "Failed to send message");
  }
},






  setSelectedCharacter: (selectedCharacter) => set({ selectedCharacter }),
}));
