import { createContext, useContext, useMemo, useCallback } from "react";
import { useCardsContext } from "@card/context/CardContext";
import { useColumnsContext } from "@column/context/ColumnContext";
import { useModal } from "@/context/ModalContext";

import { useBoardState } from "@board/hooks/useBoardState";
import { useBoardCards } from "@board/hooks/useBoardCards";
import { useColumnModal } from "@column/hooks/useColumnModal";
import { useBoardActions } from "./boardActions";

import { getActiveBoardTitle } from "@board/utils/boardUtils";

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  const { cards, addCard, moveCard, clearCards } = useCardsContext();

  const {
    columns,
    addColumn,
    removeColumn,
    updateColumnInfo,
    updateColumnStyle
  } = useColumnsContext();

  const { openModal } = useModal();

  const {
    state: boardsState,
    activeBoard,
    dispatch
  } = useBoardState({ initialGroup: "shared" });

  const boardsObj = useMemo(() => {
    return boardsState.boards.reduce((acc, b) => {
      acc[b.id] = b;
      return acc;
    }, {});
  }, [boardsState.boards]);

  const {
    createBoard,
    updateBoard,
    deleteBoard,
    setActiveBoard
  } = useBoardActions(boardsState, dispatch);

  /**
   * RESPONSABILIDADE CENTRAL
   * Board decide o escopo da limpeza
   */
  const handleClearBoardRequest = useCallback(() => {
    const board = boardsObj[activeBoard];
    if (!board) return;

    if (board.groupId) {
      const boardsInGroup = Object.values(boardsObj)
        .filter((b) => b.groupId === board.groupId)
        .map((b) => b.id);

      boardsInGroup.forEach((boardId) => {
        clearCards(boardId);
      });
    } else {
      clearCards(activeBoard);
    }
  }, [activeBoard, boardsObj, clearCards]);

  const {
    orderedCards,
    handleAddCard,
    handleClearBoard,
    handleCardClick,
    activeBoardCardCount
  } = useBoardCards({
    cards,
    addCard,
    moveCard,
    columns,
    activeBoard,
    openModal,
    onClearRequest: handleClearBoardRequest
  });

  const { handleAddColumn } = useColumnModal({
    columns,
    addColumn,
    updateColumnInfo,
    updateColumnStyle,
    openModal,
    activeBoard,
    boards: boardsObj
  });

  const activeBoardTitle = getActiveBoardTitle(
    Object.values(boardsObj),
    activeBoard
  );

  const handleDeleteBoard = (boardId) => {
    deleteBoard(boardId, () => {
      const boardColumns = columns?.[boardId] ?? [];
      boardColumns.forEach((col) => removeColumn(boardId, col.id));
      clearCards(boardId);
    });
  };

  const contextValue = useMemo(
    () => ({
      activeBoard,
      setActiveBoard,
      columns,
      orderedCards,
      handleAddCard,
      handleClearBoard,
      handleCardClick,
      handleAddColumn,
      removeColumn,
      boards: boardsObj,
      createBoard,
      updateBoard,
      deleteBoard: handleDeleteBoard,
      activeBoardTitle,
      activeBoardCardCount,
      openModal
    }),
    [
      activeBoard,
      columns,
      orderedCards,
      handleAddCard,
      handleClearBoard,
      handleCardClick,
      handleAddColumn,
      removeColumn,
      boardsObj,
      createBoard,
      updateBoard,
      activeBoardTitle,
      activeBoardCardCount,
      openModal
    ]
  );

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  );
}

export const useBoardContext = () => {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error("useBoardContext must be used inside BoardProvider");
  }
  return ctx;
};
