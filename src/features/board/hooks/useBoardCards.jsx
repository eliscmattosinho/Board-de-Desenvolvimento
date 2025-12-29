import { useMemo, useCallback } from "react";
import { showWarning, showCustom, showSuccess } from "@utils/toastUtils";
import ClearBoardToast from "@components/ToastProvider/toasts/ClearBoardToast";
import CardModal from "@card/components/CardModal/CardModal";
import { syncedBoardsMap } from "@board/utils/boardSyncUtils";
import { getDisplayStatus } from "@board/components/templates/cardBoardResolver";

export function useBoardCards({
  cards,
  addCard,
  moveCard,
  clearCards,
  columns,
  activeBoard,
  openModal,
}) {
  const activeGroupId = syncedBoardsMap[activeBoard] ?? null;
  const isSharedBoard = Boolean(activeGroupId);

  const orderedCards = useMemo(() => {
    const visible = cards.filter((t) => {
      if (isSharedBoard) {
        return (syncedBoardsMap[t.boardId] ?? null) === activeGroupId;
      }
      return t.boardId === activeBoard;
    });

    return visible
      .map((t) => {
        const displayColumnId =
          !isSharedBoard
            ? t.columnId
            : t.boardId === activeBoard
              ? t.columnId
              : t.mirrorColId;

        return {
          ...t,
          displayColumnId,
          displayStatus: getDisplayStatus(displayColumnId, activeBoard),
        };
      })
      .sort((a, b) => {
        if (a.displayColumnId < b.displayColumnId) return -1;
        if (a.displayColumnId > b.displayColumnId) return 1;
        return (a.order ?? 0) - (b.order ?? 0);
      });
  }, [cards, activeBoard, isSharedBoard, activeGroupId]);

  const handleAddCard = useCallback(
    (columnId = null) => {
      const viewColumns = columns?.[activeBoard] ?? [];
      const fallbackColumnId = viewColumns[0]?.id ?? null;
      const chosenColumnId = columnId ?? fallbackColumnId;

      const newCard = addCard(chosenColumnId, {
        boardId: activeBoard,
      });

      openModal(CardModal, {
        card: { ...newCard, isNew: true },
        activeBoard,
        columns: viewColumns,
        moveCard,
      });
    },
    [addCard, activeBoard, columns, moveCard, openModal]
  );

  const handleClearBoard = useCallback(() => {
    const groupId = syncedBoardsMap[activeBoard] ?? null;
    const isShared = Boolean(groupId);

    const boardCards = cards.filter((t) =>
      isShared
        ? (syncedBoardsMap[t.boardId] ?? null) === groupId
        : t.boardId === activeBoard
    );

    if (boardCards.length === 0) {
      showWarning("Não há tarefas para remover — o board já está vazio!");
      return;
    }

    showCustom(({ closeToast }) => (
      <ClearBoardToast
        onConfirm={() => {
          isShared
            ? clearCards({ groupId })
            : clearCards({ boardId: activeBoard });
          closeToast();
          showSuccess("Todas as tarefas foram removidas com sucesso!");
        }}
        onCancel={closeToast}
      />
    ));
  }, [cards, activeBoard, clearCards]);

  const handleCardClick = useCallback(
    (card) => {
      openModal(CardModal, {
        card: {
          ...card,
          columnId: card.displayColumnId ?? card.columnId ?? null,
        },
        activeBoard,
        columns: columns?.[activeBoard] ?? [],
        moveCard,
      });
    },
    [activeBoard, columns, moveCard, openModal]
  );

  const activeBoardCardCount = useMemo(() => {
    return orderedCards.length;
  }, [orderedCards]);

  return {
    orderedCards,
    handleAddCard,
    handleClearBoard,
    handleCardClick,
    activeBoardCardCount,
  };
}
