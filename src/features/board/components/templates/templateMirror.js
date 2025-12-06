import { boardTemplates } from "@board/components/templates/boardTemplates";
import { getMirrorColumnIdSafe as _getMirrorColumnIdSafe } from "@board/utils/boardSyncUtils";

export function getMirrorColumnIdSafe(view, columnId) {
  return _getMirrorColumnIdSafe(view, columnId);
}

export function getTaskColumns(task) {
  const normalized = String(task.status || "").trim().toLowerCase();

  const findByTitle = (boardId) => {
    return (boardTemplates[boardId] || []).find(c => c.title.toLowerCase() === normalized) || null;
  };

  const findByStatus = (boardId) => {
    return (boardTemplates[boardId] || []).find(c => (c.status || "").toLowerCase() === normalized) || null;
  };

  const kanbanColByTitle = findByTitle("kanban");
  if (kanbanColByTitle) {
    return {
      boardId: "kanban",
      columnId: kanbanColByTitle.id,
      mirroredColumnId: getMirrorColumnIdSafe("kanban", kanbanColByTitle.id)
    };
  }

  const scrumColByTitle = findByTitle("scrum");
  if (scrumColByTitle) {
    return {
      boardId: "scrum",
      columnId: scrumColByTitle.id,
      mirroredColumnId: getMirrorColumnIdSafe("scrum", scrumColByTitle.id)
    };
  }

  const kanbanColByStatus = findByStatus("kanban");
  if (kanbanColByStatus) {
    return {
      boardId: "kanban",
      columnId: kanbanColByStatus.id,
      mirroredColumnId: getMirrorColumnIdSafe("kanban", kanbanColByStatus.id)
    };
  }

  const scrumColByStatus = findByStatus("scrum");
  if (scrumColByStatus) {
    return {
      boardId: "scrum",
      columnId: scrumColByStatus.id,
      mirroredColumnId: getMirrorColumnIdSafe("scrum", scrumColByStatus.id)
    };
  }

  const fallbackId = boardTemplates.kanban?.[0]?.id ?? null;
  return {
    boardId: "kanban",
    columnId: fallbackId,
    mirroredColumnId: getMirrorColumnIdSafe("kanban", fallbackId)
  };
}

/**
 * Retorna título de coluna para exibição na view
 */
export function getDisplayStatus(columnId, view = "kanban") {
  const col = (boardTemplates[view] || []).find(c => c.id === columnId);
  if (col) return col.title;
  const mirrored = getMirrorColumnIdSafe(view, columnId);
  return (boardTemplates[view] || []).find(c => c.id === mirrored)?.title || "";
}
