const STORAGE_KEY = "cards_group_root";

export function saveCards(cards) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function loadCardFromStorage() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
