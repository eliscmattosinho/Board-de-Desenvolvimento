const CARDS_STORAGE_KEY = "app_cards_data";

export function saveCards(cards) {
  // Salva todos os cards do sistema
  sessionStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
}

export function loadCardFromStorage() {
  const raw = sessionStorage.getItem(CARDS_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}