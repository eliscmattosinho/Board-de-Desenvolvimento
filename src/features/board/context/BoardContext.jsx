import { createContext, useContext, useMemo, useCallback } from "react";

import { useCardsContext } from "@/features/card/context/CardContext";
import { useColumnsContext } from "@column/context/ColumnContext";
import { useModal } from "@context/ModalContext";

import { useBoardState } from "@board/hooks/useBoardState";
import { useBoardCards } from "@board/hooks/useBoardCards";
import { useColumnModal } from "@column/hooks/useColumnModal";
import { useBoardActions } from "./boardActions";

import { useCardDrag } from "@board/context/CardDragContext";

import { getActiveBoardTitle } from "@board/utils/boardUtils";

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  /**
   * Cards
   */
  const { cards, addCard, moveCard, clearCards } = useCardsContext();

  /**
   * Columns
   */
  const {
    columns,
    addColumn,
    removeColumn,
    updateColumnInfo,
    updateColumnStyle,
  } = useColumnsContext();

  const { openModal } = useModal();

  /**
   * Boards state
   */
  const { state, dispatch, boards, activeBoard } =
    useBoardState({ initialGroup: "shared", columns });

  const {
    createBoard,
    updateBoard,
    deleteBoard,
    setActiveBoard,
  } = useBoardActions(state, dispatch);

  /**
   * Pointer-based Drag & Drop
   */
  const { commitDrop } = useCardDrag();

  /**
   * Handler responsável por efetivar o drop
   */
  const handleCommitDrop = useCallback(() => {
    const result = commitDrop();
    if (!result) return;

    const { cardId, target } = result;
    moveCard(cardId, {
      boardId: activeBoard,
      ...target,
    });
  }, [commitDrop, moveCard, activeBoard]);

  const {
    orderedCards,
    handleAddCard,
    handleClearBoard,
    handleCardClick,
    activeBoardCardCount,
  } = useBoardCards({
    cards,
    addCard,
    moveCard,
    clearCards,
    columns,
    activeBoard,
    openModal,
  });

  /**
   * Column modal
   */
  const { handleAddColumn } = useColumnModal({
    columns,
    addColumn,
    updateColumnInfo,
    updateColumnStyle,
    openModal,
    activeBoard,
    boards,
  });

  const activeBoardTitle = getActiveBoardTitle(boards, activeBoard);

  /**
   * Delete board:
   * - remove columns
   * - clear cards
   */
  const handleDeleteBoard = (boardId) => {
    deleteBoard(boardId, () => {
      const boardColumns = columns?.[boardId] ?? [];
      boardColumns.forEach((col) => removeColumn(boardId, col.id));
      clearCards({ boardId });
    });
  };

  const contextValue = useMemo(
    () => ({
      activeBoard,
      setActiveBoard,

      columns,
      orderedCards,

      // Pointer-based drop commit (domain-aware)
      commitDrop: handleCommitDrop,

      handleAddCard,
      handleClearBoard,
      handleCardClick,

      handleAddColumn,
      removeColumn,

      boards,
      createBoard,
      updateBoard,
      deleteBoard: handleDeleteBoard,

      activeBoardTitle,
      activeBoardCardCount,
      openModal,
    }),
    [
      activeBoard,
      columns,
      orderedCards,
      handleCommitDrop,
      handleAddCard,
      handleClearBoard,
      handleCardClick,
      handleAddColumn,
      removeColumn,
      boards,
      createBoard,
      updateBoard,
      activeBoardTitle,
      activeBoardCardCount,
      openModal,
    ]
  );

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  );
}

/**
 * Public hook
 */
export const useBoardContext = () => {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error("useBoardContext must be used inside BoardProvider");
  }
  return ctx;
};
