const STORAGE_KEY = "boards_by_group";

/**
 * Salva boards:
 * - Se tiver groupId → salva todos os boards do grupo em uma única key
 * - Se independentes → salva por boardId
 */
export function saveBoards(key, boards) {
  const all = loadBoardsRaw();
  const effectiveKey = resolveStorageKey(key);
  all[effectiveKey] = boards;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

/**
 * Carrega todos boards de uma key
 */
export function loadBoards(key) {
  const all = loadBoardsRaw();
  const effectiveKey = resolveStorageKey(key);
  return all[effectiveKey] || [];
}

function resolveStorageKey(key) {
  if (!key) return "ungrouped";
  return key.toString().startsWith("group_") ? key : key.toString();
}

function loadBoardsRaw() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}
