import { useMemo, useCallback } from "react";
import { showWarning, showCustom, showSuccess } from "@utils/toastUtils";
import ClearBoardToast from "@components/ToastProvider/toasts/ClearBoardToast";
import CardModal from "@card/components/CardModal/CardModal";
import { resolveBoardCards } from "@board/domain/boardProjection";

export function useBoardCards({
  cards,
  addCard,
  moveCard,
  columns,
  activeBoard,
  openModal,
  onClearRequest
}) {
  const viewColumns = columns?.[activeBoard] ?? [];

  const orderedCards = useMemo(
    () => resolveBoardCards({ cards, boardId: activeBoard }),
    [cards, activeBoard]
  );

  const handleAddCard = useCallback(
    (columnId = null) => {
      const targetColumnId = columnId || viewColumns[0]?.id;
      const targetColumn = viewColumns.find(c => c.id === targetColumnId);

      if (!targetColumn) {
        showWarning("Não há colunas disponíveis para criar um card!");
        return;
      }

      // O Board decide o status do novo card baseado na coluna escolhida
      const newCard = addCard(targetColumnId, {
        boardId: activeBoard,
        status: targetColumn.status 
      });

      openModal(CardModal, {
        card: newCard,
        activeBoard,
        columns: viewColumns,
        moveCard
      });
    },
    [addCard, activeBoard, viewColumns, moveCard, openModal]
  );

  const handleCardClick = useCallback(
    (card) => {
      // displayColumnId para o Modal saber em qual coluna visual o card está
      openModal(CardModal, {
        card: { ...card, columnId: card.displayColumnId },
        activeBoard,
        columns: viewColumns,
        moveCard
      });
    },
    [activeBoard, viewColumns, moveCard, openModal]
  );

  const handleClearBoard = useCallback(() => {
    if (orderedCards.length === 0) {
      showWarning("O board já está vazio!");
      return;
    }
    showCustom(({ closeToast }) => (
      <ClearBoardToast
        onConfirm={() => {
          onClearRequest();
          closeToast();
          showSuccess("Tarefas removidas.");
        }}
        onCancel={closeToast}
      />
    ));
  }, [orderedCards, onClearRequest]);

  return {
    orderedCards,
    activeBoardCardCount: orderedCards.length,
    handleAddCard,
    handleClearBoard,
    handleCardClick
  };
}