import { boardTemplate } from "@board/components/templates/boardTemplates";

let _syncedBoardsMap;

export function getSyncedBoardsMap() {
  if (_syncedBoardsMap) return _syncedBoardsMap;

  _syncedBoardsMap = {};
  Object.entries(boardTemplate).forEach(([boardId, config]) => {
    if (config.groupId) _syncedBoardsMap[boardId] = config.groupId;
  });

  return _syncedBoardsMap;
}

// para n quebrar pelo acento
function normalizeText(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export const explicitColumnMirrorMap = {
  kanban: {
    "to-do": "backlog",
    "k-in-progress": "s-in-progress",
    "k-done": "s-done"
  },
  scrum: {
    backlog: "to-do",
    "sprint-backlog": "to-do",
    "s-in-progress": "k-in-progress",
    review: "k-in-progress",
    "s-done": "k-done"
  }
};

const _columnMirrorCache = {};

export function generateColumnMirrorMap(boardAId, boardBId) {
  const cacheKey = `${boardAId}->${boardBId}`;
  if (_columnMirrorCache[cacheKey]) return _columnMirrorCache[cacheKey];

  const boardACols = boardTemplate[boardAId]?.columns || [];
  const boardBCols = boardTemplate[boardBId]?.columns || [];

  const mirrorMap = {};

  boardACols.forEach(colA => {
    const explicitForA = explicitColumnMirrorMap[boardAId];
    if (explicitForA && explicitForA[colA.id]) {
      mirrorMap[colA.id] = explicitForA[colA.id];
      return;
    }

    const normATitle = normalizeText(colA.title);
    const normAStatus = normalizeText(colA.status);

    const matchByTitle = boardBCols.find(
      colB => normalizeText(colB.title) === normATitle
    );

    if (matchByTitle) {
      mirrorMap[colA.id] = matchByTitle.id;
      return;
    }

    const matchByStatus = boardBCols.find(
      colB => normalizeText(colB.status) === normAStatus
    );

    if (matchByStatus) {
      mirrorMap[colA.id] = matchByStatus.id;
    }
  });

  _columnMirrorCache[cacheKey] = mirrorMap;
  return mirrorMap;
}

export function getMirrorColumnId(columnId, mirrorMap) {
  return mirrorMap[columnId] || columnId;
}

export const syncedBoardsMap = getSyncedBoardsMap();

export const columnMirrorMap = {
  kanban: generateColumnMirrorMap("kanban", "scrum"),
  scrum: generateColumnMirrorMap("scrum", "kanban")
};

export function getMirrorColumnIdSafe(view, columnId) {
  const mirrorMap = columnMirrorMap[view] || {};
  return getMirrorColumnId(columnId, mirrorMap);
}

export function getBoardsInSameGroup(view) {
  const map = syncedBoardsMap;
  const groupId = map[view] ?? view;
  return Object.keys(map).filter(b => (map[b] ?? b) === groupId);
}
