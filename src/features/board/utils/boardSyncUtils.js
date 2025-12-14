// Responsável por sincronização e espelhamento estrutural entre boards

import { normalizeText } from "@utils/normalizeUtils";
import { boardTemplate } from "@board/components/templates/boardTemplates";

let _syncedBoardsMap;

/**
 * Retorna o mapa boardId -> groupId
 * Boards no mesmo groupId compartilham tasks
 */
export function getSyncedBoardsMap() {
  if (_syncedBoardsMap) return _syncedBoardsMap;

  _syncedBoardsMap = {};
  Object.entries(boardTemplate).forEach(([boardId, config]) => {
    if (config.groupId) {
      _syncedBoardsMap[boardId] = config.groupId;
    }
  });

  return _syncedBoardsMap;
}

/**
 * Mapeamento explícito e definitivo entre colunas
 * Sempre tem prioridade sobre qualquer fallback
 */
const explicitColumnMirrorMap = {
  kanban: {
    "to-do": "backlog",
    "k-in-progress": "s-in-progress",
    "k-done": "s-done",
  },
  scrum: {
    backlog: "to-do",
    "sprint-backlog": "to-do",
    "s-in-progress": "k-in-progress",
    review: "k-in-progress",
    "s-done": "k-done",
  },
};

const _columnMirrorCache = {};

/**
 * Gera (e cacheia) o mapa de colunas espelhadas entre dois boards
 *
 * Ordem de decisão:
 * 1. Mapeamento explícito
 * 2. Fallback por título normalizado
 * 3. Fallback por status normalizado
 */
export function generateColumnMirrorMap(fromBoard, toBoard) {
  const cacheKey = `${fromBoard}->${toBoard}`;
  if (_columnMirrorCache[cacheKey]) {
    return _columnMirrorCache[cacheKey];
  }

  const fromCols = boardTemplate[fromBoard]?.columns || [];
  const toCols = boardTemplate[toBoard]?.columns || [];

  const mirrorMap = {};

  fromCols.forEach((fromCol) => {
    // Explícito
    const explicit = explicitColumnMirrorMap[fromBoard]?.[fromCol.id];
    if (explicit) {
      mirrorMap[fromCol.id] = explicit;
      return;
    }

    // Por título
    const byTitle = toCols.find(
      c => normalizeText(c.title) === normalizeText(fromCol.title)
    );
    if (byTitle) {
      mirrorMap[fromCol.id] = byTitle.id;
      return;
    }

    // Por status
    const byStatus = toCols.find(
      c => normalizeText(c.status) === normalizeText(fromCol.status)
    );
    if (byStatus) {
      mirrorMap[fromCol.id] = byStatus.id;
    }
  });

  _columnMirrorCache[cacheKey] = mirrorMap;
  return mirrorMap;
}

/**
 * Mapa bidirecional de espelhamento
 */
export const columnMirrorMap = {
  kanban: generateColumnMirrorMap("kanban", "scrum"),
  scrum: generateColumnMirrorMap("scrum", "kanban"),
};

/**
 * Resolve a localização espelhada de uma task
 *
 * @param {string} boardId - board atual
 * @param {string} columnId - coluna atual
 * @returns {{ boardId: string|null, columnId: string|null }}
 */
export function getMirrorLocation(boardId, columnId) {
  if (!boardId || !columnId) {
    return { boardId: null, columnId: null };
  }

  const mirrorBoardId =
    boardId === "kanban"
      ? "scrum"
      : boardId === "scrum"
        ? "kanban"
        : null;

  if (!mirrorBoardId) {
    return { boardId: null, columnId: null };
  }

  const mirrorColId = columnMirrorMap[boardId]?.[columnId] ?? null;

  return {
    boardId: mirrorBoardId,
    columnId: mirrorColId,
  };
}

export const syncedBoardsMap = getSyncedBoardsMap();
