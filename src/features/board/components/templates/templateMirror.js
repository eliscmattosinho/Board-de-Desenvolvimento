import { boardTemplates } from "@board/components/templates/boardTemplates";
import { getMirrorColumnIdSafe as _getMirrorColumnIdSafe } from "@board/utils/boardSyncUtils";

function normalizeText(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function getMirrorColumnIdSafe(view, columnId) {
  return _getMirrorColumnIdSafe(view, columnId);
}

export function getTaskColumns(task) {
  const normalized = normalizeText(task.status);

  const findByTitle = (boardId) =>
    (boardTemplates[boardId] || []).find(
      c => normalizeText(c.title) === normalized
    ) || null;

  const findByStatus = (boardId) =>
    (boardTemplates[boardId] || []).find(
      c => normalizeText(c.status) === normalized
    ) || null;

  const kanbanTitle = findByTitle("kanban");
  if (kanbanTitle) {
    return {
      boardId: "kanban",
      columnId: kanbanTitle.id,
      mirroredColumnId: getMirrorColumnIdSafe("kanban", kanbanTitle.id)
    };
  }

  const scrumTitle = findByTitle("scrum");
  if (scrumTitle) {
    return {
      boardId: "scrum",
      columnId: scrumTitle.id,
      mirroredColumnId: getMirrorColumnIdSafe("scrum", scrumTitle.id)
    };
  }

  const kanbanStatus = findByStatus("kanban");
  if (kanbanStatus) {
    return {
      boardId: "kanban",
      columnId: kanbanStatus.id,
      mirroredColumnId: getMirrorColumnIdSafe("kanban", kanbanStatus.id)
    };
  }

  const scrumStatus = findByStatus("scrum");
  if (scrumStatus) {
    return {
      boardId: "scrum",
      columnId: scrumStatus.id,
      mirroredColumnId: getMirrorColumnIdSafe("scrum", scrumStatus.id)
    };
  }

  const fallbackId = boardTemplates.kanban?.[0]?.id ?? null;

  return {
    boardId: "kanban",
    columnId: fallbackId,
    mirroredColumnId: getMirrorColumnIdSafe("kanban", fallbackId)
  };
}

export function getDisplayStatus(columnId, view = "kanban") {
  const cols = boardTemplates[view] || [];
  const col = cols.find(c => c.id === columnId);
  if (col) return col.title;

  const mirrored = getMirrorColumnIdSafe(view, columnId);
  return cols.find(c => c.id === mirrored)?.title || "";
}
