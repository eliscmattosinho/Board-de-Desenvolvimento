const STORAGE_KEY = "boards_by_group";

/**
 * Salva boards:
 * - Se tiver groupId → salva no group
 * - Se independentes → salva por boardId
 */
export function saveBoards(key, boards) {
  const all = loadBoardsRaw();
  const effectiveKey = resolveStorageKey(key, boards);

  all[effectiveKey] = boards;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function loadBoards(key) {
  const all = loadBoardsRaw();
  return all[key] || null;
}

function resolveStorageKey(groupId, boards) {
  if (groupId) return groupId;
  if (boards && boards.length > 0) return boards[0].id;
  return "ungrouped";
}

function loadBoardsRaw() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}
