

import React, { useEffect, useMemo, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useNavigate } from "react-router-dom";


/* ---------- helpers ---------- */
const getImgSrc = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (image.src && typeof image.src === "string") return image.src;
  const vals = Object.values(image);
  if (vals.length && typeof vals[0] === "string") return vals[0];
  return "";
};

/* ---------- modal to show full description ---------- */
/* ---------- centered modal to show full description ---------- */
const DescriptionDialog = ({ open, item, onClose }) => {
  if (!open || !item) return null;

  const stop = (e) => e.stopPropagation();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div
        className="relative w-full max-w-md sm:max-w-lg rounded-2xl border border-white/10 bg-[#0b0c10]/95 p-4 sm:p-5"
        onClick={stop}
      >
        <div className="flex items-start gap-3">
          {item.image ? (
            <img
              src={getImgSrc(item.image)}
              alt={item.Name}
              className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/20"
            />
          ) : (
            <div className="h-12 w-12 rounded-xl bg-white/10" />
          )}
          <div className="min-w-0">
            <div className="font-semibold text-white/90">{item.Name}</div>
            <p className="mt-1 text-sm text-white/80 leading-relaxed break-words">
              {item.Description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


/* ---------- card ---------- */
const Card = React.memo(({ item, onSelect, onConfigure, onShowMore }) => {
  const { Name, Description } = item;
  const imgSrc = useMemo(() => getImgSrc(item.image), [item]);

  const MAX = 60;
  const isLong = (Description || "").length > MAX;
  const shown = (Description || "").slice(0, MAX);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(item);
    }
  };

  return (
    <div className="mb-3 sm:mb-5 inline-block w-full align-top" style={{ breakInside: "avoid" }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(item)}
        onKeyDown={handleKeyDown}
        className="group w-full text-left rounded-2xl overflow-hidden border border-base-300 bg-base-100 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        {/* square image keeps cards compact */}
        <div className="relative aspect-square w-full overflow-hidden bg-base-200">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={Name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-sm opacity-60">
              No image
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-semibold line-clamp-1">{Name}</h3>

          {/* clamp to keep height fixed; open modal for more */}
          <p className="mt-1 text-sm text-base-content/80 line-clamp-2">
            {isLong ? `${shown}…` : shown}
          </p>

          {isLong && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShowMore(item);
              }}
              className="mt-2 inline-flex text-xs font-medium underline underline-offset-2 hover:opacity-80"
            >
              Show more
            </button>
          )}

          <div className="mt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onConfigure(item);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-primary text-primary-content hover:opacity-95 text-sm"
            >
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ---------- page ---------- */
const MainContent = () => {
  const navigate = useNavigate();
  const {
    characters,
    isCharactersLoading,
    getCharacter,
    setSelectedCharacter,
  } = useChatStore();

  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    getCharacter();
  }, [getCharacter]);

  // const handleConfigure = (item) => {
  //   // setSelectedCharacter(item); //
  //   navigate(`/characters/${item.id ?? item._id}`);
  // };


//new thing

const handleConfigure = (item) => {
   const cid = item.id ?? item._id;
   if (cid) localStorage.setItem("lastCharacterId", String(cid));
   // setSelectedCharacter(item);  // keep as you prefer
   navigate(`/characters/${cid}`);
 };


  return (
    <main className="container mx-auto px-4 py-6 mt-24">
    
      {/* Masonry columns: compact; no shuffling on “show more” because we don’t resize cards */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-5 [column-fill:_balance]">
        {isCharactersLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="mb-3 sm:mb-5 inline-block w-full"
                style={{ breakInside: "avoid" }}
              >
                <div className="animate-pulse aspect-square rounded-2xl bg-base-200" />
              </div>
            ))
          : characters.map((item) => (
              <Card
                key={item.id ?? item._id}
                item={item}
                // onSelect={setSelectedCharacter} old
                onSelect={(item) => {
                  setSelectedCharacter(item);
                  const cid = item._id ?? item.id;
                  if (cid) localStorage.setItem("lastCharacterId", String(cid));
                }}
                //..
                onConfigure={handleConfigure}
                onShowMore={(itm) => setPreviewItem(itm)}
              />
            ))}
      </div>

      <DescriptionDialog
        open={!!previewItem}
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </main>
  );
};

export default MainContent;









