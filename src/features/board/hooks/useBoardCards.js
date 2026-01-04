import { useMemo, useCallback } from "react";
import { useCardsContext } from "@card/context/CardContext";
import { useColumnsContext } from "@column/context/ColumnContext";
import { showWarning } from "@utils/toastUtils";
import { resolveBoardCards } from "@board/domain/boardProjection";

export function useBoardCards({ activeBoard, columns = [] }) {
  const { cards, addCard } = useCardsContext();
  const { columns: allColumns } = useColumnsContext();

  const orderedCards = useMemo(() => {
    if (!activeBoard) return [];
    return resolveBoardCards({ cards, boardId: activeBoard, allColumns });
  }, [cards, activeBoard, allColumns]);

  const activeBoardCardCount = orderedCards.length;

  const handleAddCard = useCallback(
    (columnId = null) => {
      if (!columns || columns.length === 0) {
        showWarning(
          "Não é possível criar um card: Nenhuma coluna encontrada.",
          {
            toastId: "no-columns-warning",
          }
        );
        return null;
      }

      const targetColumn = columnId
        ? columns.find((c) => c.id === columnId)
        : columns[0];

      if (!targetColumn) {
        showWarning("Coluna de destino não encontrada.");
        return null;
      }

      try {
        return addCard(targetColumn.id, {
          boardId: activeBoard,
          status: targetColumn.status || "default",
        });
      } catch (error) {
        console.error("Erro ao adicionar card:", error);
        return null;
      }
    },
    [addCard, activeBoard, columns]
  );

  return {
    orderedCards,
    activeBoardCardCount,
    handleAddCard,
  };
}
