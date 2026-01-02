import { useMemo, useCallback } from "react";
import { useCardsContext } from "@card/context/CardContext";
import { useColumnsContext } from "@column/context/ColumnContext";
import { showWarning } from "@utils/toastUtils";
import { resolveBoardCards } from "@board/domain/boardProjection";

export function useBoardCards({ activeBoard, columns }) {
  const { cards, addCard } = useCardsContext();
  const { columns: allColumns } = useColumnsContext();

  const orderedCards = useMemo(
    () => resolveBoardCards({ cards, boardId: activeBoard, allColumns }),
    [cards, activeBoard, allColumns]
  );

  const handleAddCard = useCallback(
    (columnId = null) => {
      const targetColumn = columnId
        ? columns.find((c) => c.id === columnId)
        : columns[0];

      if (!targetColumn) {
        showWarning("Crie uma coluna antes!");
        return null;
      }

      // Cria o card e retorna o novo objeto
      return addCard(targetColumn.id, {
        boardId: activeBoard,
        status: targetColumn.status,
      });
    },
    [addCard, activeBoard, columns]
  );

  return {
    orderedCards,
    activeBoardCardCount: orderedCards.length,
    handleAddCard,
  };
}
