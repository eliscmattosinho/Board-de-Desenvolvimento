import { normalizeText } from "@utils/normalizeUtils";
import { boardTemplates } from "./boardTemplates";

const explicitColumnMirrorMap = {
  kanban: {
    "to-do": "backlog",
    "k-in-progress": "s-in-progress",
    "k-done": "s-done",
  },
  scrum: {
    backlog: "to-do",
    "s-in-progress": "k-in-progress",
    "s-done": "k-done",
  },
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
    const byStatus = toCols.find(
      (c) => normalizeText(c.status) === normalizeText(col.status)
    );
    if (byStatus) map[col.id] = byStatus.id;
  });

  columnMirrorCache[key] = map;
  return map;
}

export function projectCard(card, targetBoardId) {
  if (card.boardId === targetBoardId) return card.columnId;

  const sourceGroup = boardTemplates[card.boardId]?.groupId;
  const targetGroup = boardTemplates[targetBoardId]?.groupId;

  if (!sourceGroup || sourceGroup !== targetGroup) return null;

  return buildColumnMirror(card.boardId, targetBoardId)[card.columnId] || null;
}

/**
 * RESOLVE CARDS DO BOARD
 * @param {Array} cards - Lista bruta de cards
 * @param {String} boardId - Board atual
 * @param {Object} allColumns - Dicionário de colunas vindas do ColumnContext (Estado Vivo)
 */
export function resolveBoardCards({ cards, boardId, allColumns }) {
  // Pega as colunas reais que estão no sistema agora para este board
  const currentBoardColumns = allColumns[boardId] || [];

  if (currentBoardColumns.length === 0) return [];

  return cards
    .map((card) => {
      const displayColumnId = projectCard(card, boardId);
      if (!displayColumnId) return null;

      // Busca na lista dinâmica para evitar o "limbo"
      const column = currentBoardColumns.find(
        (c) => String(c.id) === String(displayColumnId)
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
