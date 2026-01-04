export function normalizeText(value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\w\s]/gi, "");
}
