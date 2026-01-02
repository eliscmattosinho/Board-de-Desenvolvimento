const STORAGE_KEY = "app_boards_metadata";

export function saveBoards(boards) {
  if (!Array.isArray(boards)) return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
}

export function loadBoards() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Erro ao carregar boards do storage:", err);
    return [];
  }
}