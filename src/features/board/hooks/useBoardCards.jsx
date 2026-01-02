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
  allColumns,
  activeBoard,
  openModal,
  onClearRequest,
}) {
  const orderedCards = useMemo(
    () =>
      resolveBoardCards({
        cards,
        boardId: activeBoard,
        allColumns, // estado vivo @TODO: bloquear add em templates vinculados?
      }),
    [cards, activeBoard, allColumns]
  );

  const handleAddCard = useCallback(
    (columnId = null) => {
      const targetColumn = columnId
        ? columns.find((c) => c.id === columnId)
        : columns[0];
      if (!targetColumn) {
        showWarning("Crie uma coluna antes!");
        return;
      }

      const newCard = addCard(targetColumn.id, {
        boardId: activeBoard,
        status: targetColumn.status,
      });

      openModal(CardModal, { card: newCard, activeBoard, columns, moveCard });
    },
    [addCard, activeBoard, columns, openModal, moveCard]
  );

  const handleCardClick = useCallback(
    (card) => {
      openModal(CardModal, {
        card: { ...card, columnId: card.displayColumnId },
        activeBoard,
        columns,
        moveCard,
      });
    },
    [activeBoard, columns, moveCard, openModal]
  );

  const handleClearBoard = useCallback(() => {
    if (orderedCards.length === 0) return showWarning("O board já está vazio!");
    showCustom(({ closeToast }) => (
      <ClearBoardToast
        onConfirm={() => {
          onClearRequest();
          closeToast();
          showSuccess("Board limpo com sucesso!");
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
    handleCardClick,
  };
}
