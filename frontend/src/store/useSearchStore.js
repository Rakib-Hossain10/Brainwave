// src/store/useSearchStore.js
import { create } from "zustand";

export const useSearchStore = create((set, get) => ({
  query: "",
  results: [],
  isOpen: false,
  isLoading: false,
  error: null,

  setQuery: (q) => set({ query: q }),
  clear: () => set({ query: "", results: [], isOpen: false, isLoading: false, error: null }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  // এই ফাংশনটাই পরে আপনার backend এ কানেক্ট করবেন
  // শুধু নিচের "fake" অংশটা কমেন্ট আউট করে fetch/axios ব্যবহার করুন
  search: async (q) => {
    const trimmed = (q || "").trim();
    if (!trimmed) return set({ results: [], isOpen: false, isLoading: false });

    set({ isLoading: true, error: null });
    try {
      // --------- Replace this block with your real API ----------
      // Example:
      // const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      // const data = await res.json(); // expected: [{id, title, subtitle}, ...]
      // set({ results: data, isOpen: true });

      // Fake demo data (remove later):
      await new Promise(r => setTimeout(r, 500));
      const demo = Array.from({ length: 5 }).map((_, i) => ({
        id: `${trimmed}-${i}`,
        title: `Result for "${trimmed}" #${i + 1}`,
        subtitle: "Sample subtitle • replace with real field",
      }));
      set({ results: demo, isOpen: true });
      // ----------------------------------------------------------
    } catch (e) {
      set({ error: e?.message || "Search failed" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
