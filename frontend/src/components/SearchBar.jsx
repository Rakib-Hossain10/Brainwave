
import { useEffect, useRef, useState } from "react";
import { Search, X, Loader2, Command } from "lucide-react";
import { useSearchStore } from "../store/useSearchStore";


// ফোকাস: ⌘/Ctrl+K বা /  -> ইনপুট ফোকাস হবে
// Enter -> submit (results open থাকে)
// Esc -> dropdown/clear/blur

const DEBOUNCE_MS = 300;

export default function SearchBar({ onSubmit }) {
  const inputRef = useRef(null);
  const {
    query, setQuery, search, results, isOpen, open, close, isLoading, clear, error,
  } = useSearchStore();

  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const isSlash = e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey;
      const isK = (e.key.toLowerCase() === "k") && (e.metaKey || e.ctrlKey);
      if (isK || isSlash) {
        e.preventDefault();
        inputRef.current?.focus();
        open();
      } else if (e.key === "Escape") {
        if (isOpen) {
          close();
        } else {
          inputRef.current?.blur();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, open, close]);

  // Debounced search
  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTimer) clearTimeout(debounceTimer);
    const t = setTimeout(() => {
      if (val.trim()) search(val);
      else clear();
    }, DEBOUNCE_MS);
    setDebounceTimer(t);
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!query.trim()) return;
    onSubmit?.(query);
    // dropdown can be open but i set it close 
    close();
    inputRef.current?.blur();
  };

  const handlePick = (item) => {
    setQuery(item.title);
    onSubmit?.(item.title, item);
    close();
    inputRef.current?.blur();
  };

  return (
    <div className="relative w-full md:w-96">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="
          group w-full rounded-xl px-3 py-2 
          bg-base-200/70 dark:bg-base-200/60
          backdrop-blur-xl border border-white/10
          shadow-[0_8px_30px_rgb(0,0,0,0.12)]
          ring-1 ring-transparent focus-within:ring-2 focus-within:ring-primary/70
          transition-all duration-200
        "
        onFocus={open}
      >
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 opacity-70" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search character…"
            className="input bg-transparent focus:outline-none border-0 flex-1 h-9 px-0 placeholder:opacity-60"
          />
          <div className="hidden md:flex items-center gap-1 text-xs opacity-70 select-none">
            <Command className="w-4 h-4" />
            <span>K</span>
          </div>

          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin opacity-80" />
          ) : query ? (
            <button
              type="button"
              onClick={() => clear()}
              className="btn btn-ghost btn-xs rounded-full"
              aria-label="Clear"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </form>

      {/* dropdown / command palette */}
      { (isOpen && (results.length > 0 || error || query)) && (
        <div
          className="
            absolute left-0 mt-2 w-full z-50
           rounded-xl overflow-hidden
          bg-[#0b0c10] border border-white/10 shadow-2xl  "
        >
          {error && (
            <div className="px-3 py-2 text-sm text-error/90 border-b border-white/10">
              {error}
            </div>
          )}

          {results.length > 0 ? (
            <ul className="max-h-72 overflow-auto">
              {results.map((item, idx) => (
                <li
                  key={item.id}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(-1)}
                  onClick={() => handlePick(item)}
                  className={`
                    px-3 py-2 cursor-pointer transition-colors
                    ${hoveredIdx === idx ? "bg-base-300/60" : "hover:bg-base-300/40"}
                  `}
                >
                  <div className="text-sm font-medium">{item.title}</div>
                  {item.subtitle && (
                    <div className="text-xs opacity-70">{item.subtitle}</div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-3 text-sm opacity-75">
              Press <span className="kbd kbd-xs">Enter</span> to search “{query}”
            </div>
          )}

          <div className="px-3 py-2 text-[11px] opacity-60 border-t border-white/10 flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1">
              <span className="kbd kbd-xs">⌘/Ctrl</span> + <span className="kbd kbd-xs">K</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="kbd kbd-xs">/</span> to focus
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="kbd kbd-xs">Esc</span> to close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
