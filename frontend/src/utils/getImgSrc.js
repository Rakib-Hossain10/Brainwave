// Works with your current data where image is { assetName } or a string
export const getImgSrc = (img) => {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (img?.src && typeof img.src === "string") return img.src;
  const first = Object.values(img).find((v) => typeof v === "string");
  return first || "";
};
