import { boardTemplates } from "@board/components/templates/boardTemplates";
import { getMirrorLocation } from "@board/utils/boardSyncUtils";
import { normalizeText } from "@utils/normalizeUtils";

/**
 * Decide o board e a coluna de origem de uma card carregada (load)
 *
 * Regras:
 * 1. Compara o status textual da card com o TÍTULO das colunas
 * 2. Prioridade: Kanban > Scrum
 * 3. Se não houver correspondência, cai no fallback absoluto do Kanban
 *
 * OBS:
 * - Não cria mirror
 * - Não sincroniza estado
 * - Apenas define pertencimento inicial
 */
export function getCardColumn(card) {
  const normalizedStatus = normalizeText(card.status);

  const findByTitle = (boardId) =>
    (boardTemplates[boardId] || []).find(
      (col) => normalizeText(col.title) === normalizedStatus
    ) || null;

  // Kanban por título
  const kanbanMatch = findByTitle("kanban");
  if (kanbanMatch) {
    return {
      boardId: "kanban",
      columnId: kanbanMatch.id,
    };
  }

  // Scrum por título
  const scrumMatch = findByTitle("scrum");
  if (scrumMatch) {
    return {
      boardId: "scrum",
      columnId: scrumMatch.id,
    };
  }

  // Fallback absoluto
  return {
    boardId: "kanban",
    columnId: boardTemplates.kanban?.[0]?.id ?? null,
  };
}

/**
 * Resolve o label de status APENAS para exibição
 * - null -> "não resolvido"
 */
export function getDisplayStatus(columnId, boardId) {
  if (!columnId || !boardId) return null;

  const cols = boardTemplates[boardId] || [];

  // Match direto
  const direct = cols.find((c) => c.id === columnId);
  if (direct) return direct.title;

  // Tentativa via mirror
  const mirroredColumnId = getMirrorLocation(boardId, columnId);
  if (!mirroredColumnId) return null;

  const mirrored = cols.find((c) => c.id === mirroredColumnId);
  return mirrored?.title ?? null;
}
