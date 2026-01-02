import { resolveBoardCards } from "@board/domain/boardProjection";

/**
 * Retorna o título do board ativo buscando no estado real.
 */
export function getActiveBoardTitle(boards, activeBoard) {
  const board = boards.find((b) => b.id === activeBoard);
  return board?.title || activeBoard;
}

/**
 * Agrupa cards por coluna VISÍVEL no board ativo.
 * * @param {Array} columns - Colunas do board ATIVO (activeBoardColumns)
 * @param {Array} cards - Lista bruta de cards do CardContext
 * @param {String} activeBoard - ID do board atual
 * @param {Object} allColumns - O dicionário completo { boardId: [columns] }
 */
export function groupCardsByColumn({
  columns,
  cards,
  activeBoard,
  allColumns,
}) {
  // Resolve a projeção usando o estado vivo das colunas
  const projectedCards = resolveBoardCards({
    cards,
    boardId: activeBoard,
    allColumns,
  });

  // Agrupa os cards projetados em suas respectivas colunas
  return columns.reduce((acc, col) => {
    acc[col.id] = projectedCards.filter(
      (card) => String(card.displayColumnId) === String(col.id)
    );
    return acc;
  }, {});
}
