import { normalizeText } from "@utils/normalizeUtils";
import { boardTemplates } from "@board/domain/boardTemplates";

export function resolveInitialCardLocation(card) {
  const fallback = { boardId: "kanban", columnId: "to-do" };
  if (!card?.status) return fallback;

  const normalizedStatus = normalizeText(card.status);
  const boardsPriority = ["kanban", "scrum"];

  for (const bId of boardsPriority) {
    const template = boardTemplates[bId];
    if (!template) continue;

    const match = template.columns.find(
      (col) =>
        normalizeText(col.status) === normalizedStatus ||
        normalizeText(col.title) === normalizedStatus
    );

    if (match) return { boardId: bId, columnId: match.id };
  }
  return fallback;
}
