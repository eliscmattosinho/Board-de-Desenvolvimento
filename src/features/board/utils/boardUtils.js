import { resolveBoardCards } from "@board/domain/boardProjection";

/**
 * Retorna o título do board ativo
 */
export function getActiveBoardTitle(boards, activeBoard) {
  const board = boards.find((b) => b.id === activeBoard);
  return board?.title || activeBoard;
}

/**
 * Agrupa cards por coluna VISÍVEL no board ativo
 *
 * - Usa projeção do domínio Board
 * - NÃO conhece mirror
 * - NÃO calcula pertencimento
 */
export function groupCardsByColumn({
  columns,
  cards,
  activeBoard,
}) {
  const projectedCards = resolveBoardCards({
    cards,
    boardId: activeBoard,
  });

  return columns.reduce((acc, col) => {
    acc[col.id] = projectedCards.filter(
      (card) => card.displayColumnId === col.id
    );
    return acc;
  }, {});
}
