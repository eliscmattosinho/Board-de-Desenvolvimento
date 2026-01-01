import { normalizeText } from "@utils/normalizeUtils";
import { boardTemplates } from "./boardTemplates";

/* Boards sincronizados por groupId */

export function getSyncedBoardsMap() {
  const map = {};
  Object.entries(boardTemplates).forEach(([boardId, config]) => {
    if (config.groupId) {
      map[boardId] = config.groupId;
    }
  });
  return map;
}

/* Espelhamento de colunas */

const explicitColumnMirrorMap = {
  kanban: {
    "to-do": "backlog",
    "k-in-progress": "s-in-progress",
    "k-done": "s-done"
  },
  scrum: {
    backlog: "to-do",
    "s-in-progress": "k-in-progress",
    "s-done": "k-done"
  }
};

const columnMirrorCache = {};

function buildColumnMirror(fromBoard, toBoard) {
  const key = `${fromBoard}->${toBoard}`;
  if (columnMirrorCache[key]) return columnMirrorCache[key];

  const fromCols = boardTemplates[fromBoard]?.columns ?? [];
  const toCols = boardTemplates[toBoard]?.columns ?? [];

  const map = {};

  fromCols.forEach((col) => {
    const explicit = explicitColumnMirrorMap[fromBoard]?.[col.id];
    if (explicit) {
      map[col.id] = explicit;
      return;
    }

    const byTitle = toCols.find(
      (c) => normalizeText(c.title) === normalizeText(col.title)
    );
    if (byTitle) {
      map[col.id] = byTitle.id;
      return;
    }

    const byStatus = toCols.find(
      (c) => normalizeText(c.status) === normalizeText(col.status)
    );
    if (byStatus) {
      map[col.id] = byStatus.id;
    }
  });

  columnMirrorCache[key] = map;
  return map;
}

function getMirrorColumn(boardId, targetBoard, columnId) {
  return buildColumnMirror(boardId, targetBoard)?.[columnId] ?? null;
}

/* Projeção de card */

export function projectCard(card, targetBoardId) {
  if (card.boardId === targetBoardId) {
    return card.columnId;
  }

  const sourceGroup = boardTemplates[card.boardId]?.groupId;
  const targetGroup = boardTemplates[targetBoardId]?.groupId;

  if (!sourceGroup || sourceGroup !== targetGroup) {
    return null;
  }

  return getMirrorColumn(card.boardId, targetBoardId, card.columnId);
}

/* Resolução final */

export function resolveBoardCards({ cards, boardId }) {
  const boardConfig = boardTemplates[boardId];
  if (!boardConfig) return [];

  return cards
    .map((card) => {
      const displayColumnId = projectCard(card, boardId);
      if (!displayColumnId) return null;

      const column = boardConfig.columns.find(
        (c) => c.id === displayColumnId
      );

      if (!column) return null;

      return {
        ...card,
        displayColumnId,
        displayStatus: column.title,
      };
    })
    .filter(Boolean);
}
