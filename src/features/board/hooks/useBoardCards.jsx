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
    [cards, activeBoard, viewColumns]
  );

  const handleAddCard = useCallback(
    (columnId = null) => {
      const fallbackColumnId = viewColumns[0]?.id ?? null;

      if (!columnId && !fallbackColumnId) {
        showWarning("Não há colunas disponíveis para criar um card!");
        return;
      }

      const newCard = addCard(columnId ?? fallbackColumnId, {
        boardId: activeBoard
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

  const handleClearBoard = useCallback(() => {
    if (orderedCards.length === 0) {
      showWarning("Não há tarefas para remover — o board já está vazio!");
      return;
    }

    showCustom(({ closeToast }) => (
      <ClearBoardToast
        onConfirm={() => {
          onClearRequest();
          closeToast();
          showSuccess("Tarefas removidas com sucesso.");
        }}
        onCancel={closeToast}
      />
    ));
  }, [orderedCards, onClearRequest]);

  const handleCardClick = useCallback(
    (card) => {
      openModal(CardModal, {
        card: { ...card, columnId: card.displayColumnId },
        activeBoard,
        columns: viewColumns,
        moveCard
      });
    },
    [activeBoard, viewColumns, moveCard, openModal]
  );

  return {
    orderedCards,
    activeBoardCardCount: orderedCards.length,
    handleAddCard,
    handleClearBoard,
    handleCardClick
  };
}
