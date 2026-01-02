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
  const { openModal } = useModal();
  const {
    columns: allColumns,
    addColumn,
    removeColumn,
    updateColumnInfo,
    updateColumnStyle,
  } = useColumnsContext();

  const {
    state: boardsState,
    activeBoard,
    dispatch,
  } = useBoardState({ initialGroup: "shared" });

  const boardsObj = useMemo(() => {
    return (boardsState.boards || []).reduce((acc, b) => {
      acc[b.id] = b;
      return acc;
    }, {});
  }, [boardsState.boards]);

  const { createBoard, updateBoard, deleteBoard, setActiveBoard } =
    useBoardActions(boardsState, dispatch);

  const activeBoardColumns = useMemo(
    () => allColumns[activeBoard] || [],
    [allColumns, activeBoard]
  );

  const handleClearBoardRequest = useCallback(() => {
    const board = boardsObj[activeBoard];
    if (!board) return;
    if (board.groupId) {
      Object.values(boardsObj)
        .filter((b) => b.groupId === board.groupId)
        .forEach((b) => clearCards(b.id));
    } else {
      clearCards(activeBoard);
    }
  }, [activeBoard, boardsObj, clearCards]);

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
    columns: activeBoardColumns, // Colunas do board atual para a UI
    allColumns, // TODAS as colunas para a lógica de projeção
    activeBoard,
    openModal,
    onClearRequest: handleClearBoardRequest,
  });

  const { handleAddColumn } = useColumnModal({
    addColumn,
    updateColumnInfo,
    updateColumnStyle,
    openModal,
    activeBoard,
    boards: boardsObj,
  });

  const handleDeleteBoard = useCallback(
    (boardId) => {
      deleteBoard(boardId, () => {
        clearCards(boardId);
        (allColumns[boardId] || []).forEach((col) =>
          removeColumn(boardId, col.id)
        );
      });
    },
    [deleteBoard, clearCards, allColumns, removeColumn]
  );

  const contextValue = useMemo(
    () => ({
      activeBoard,
      setActiveBoard,
      columns: allColumns,
      activeBoardColumns,
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
      activeBoardTitle: getActiveBoardTitle(
        Object.values(boardsObj),
        activeBoard
      ),
      activeBoardCardCount,
      openModal,
    }),
    [
      activeBoard,
      setActiveBoard,
      allColumns,
      activeBoardColumns,
      orderedCards,
      handleAddCard,
      handleClearBoard,
      handleCardClick,
      handleAddColumn,
      removeColumn,
      boardsObj,
      createBoard,
      updateBoard,
      handleDeleteBoard,
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

export const useBoardContext = () => useContext(BoardContext);
