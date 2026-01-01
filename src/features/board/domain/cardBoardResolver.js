import { normalizeText } from "@utils/normalizeUtils";
import { boardTemplates } from "@board/domain/boardTemplates";

/**
 * Resolve o boardId e columnId INICIAIS de um card carregado
 *
 * Usado apenas em:
 * - load inicial
 * - importação
 * - migração
 *
 */
export function resolveInitialCardLocation(card) {
  if (!card?.status) {
    return {
      boardId: "kanban",
      columnId: boardTemplates.kanban.columns[0]?.id ?? null,
    };
  }

  const normalizedStatus = normalizeText(card.status);
  const boardsPriority = ["kanban", "scrum"];

  for (const boardId of boardsPriority) {
    const match = boardTemplates[boardId].columns.find(
      (col) => normalizeText(col.title) === normalizedStatus
    );

    if (match) {
      return {
        boardId,
        columnId: match.id,
      };
    }
  }

  return {
    boardId: "kanban",
    columnId: boardTemplates.kanban.columns[0]?.id ?? null,
  };
}
