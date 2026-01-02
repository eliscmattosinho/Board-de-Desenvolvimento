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
  // Se o card não tem status, manda para o padrão
  if (!card?.status) {
    return {
      boardId: "kanban",
      columnId: boardTemplates.kanban.columns[0]?.id
    };
  }

  const normalizedStatus = normalizeText(card.status);

  // Prioridade de busca: se o status bater com o título de alguma coluna do Kanban ou Scrum
  const boardsPriority = ["kanban", "scrum"];

  for (const boardId of boardsPriority) {
    const board = boardTemplates[boardId];
    // Tenta achar por status ou por título da coluna
    const match = board.columns.find(
      (col) => normalizeText(col.status) === normalizedStatus || 
               normalizeText(col.title) === normalizedStatus
    );

    if (match) {
      return { boardId, columnId: match.id };
    }
  }

  // Fallback
  return {
    boardId: "kanban",
    columnId: boardTemplates.kanban.columns[0]?.id
  };
}