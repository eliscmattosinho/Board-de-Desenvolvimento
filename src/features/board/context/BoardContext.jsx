import { createContext, useContext, useMemo } from "react";
import { useBoardState } from "@board/hooks/useBoardState";
import { useBoardCards } from "@board/hooks/useBoardCards";
import { useBoardActions } from "./boardActions";
import { getActiveBoardTitle } from "@board/utils/boardUtils";
import { useColumnsContext } from "@column/context/ColumnContext";

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  const { columns: allColumns } = useColumnsContext();

  const {
    state: boardsState,
    activeBoard,
    dispatch,
  } = useBoardState({ initialGroup: "shared" });

  const {
    createBoard,
    updateBoard,
    deleteBoard,
    setActiveBoard,
    getBoardsToClear,
  } = useBoardActions(boardsState, dispatch);

  const boardsObj = useMemo(
    () =>
      (boardsState.boards || []).reduce(
        (acc, b) => ({ ...acc, [b.id]: b }),
        {}
      ),
    [boardsState.boards]
  );

  const activeBoardColumns = useMemo(
    () => allColumns[activeBoard] || [],
    [allColumns, activeBoard]
  );

  const { orderedCards, handleAddCard, activeBoardCardCount } = useBoardCards({
    activeBoard,
    columns: activeBoardColumns,
  });

  const contextValue = useMemo(
    () => ({
      activeBoard,
      setActiveBoard,
      activeBoardColumns,
      orderedCards,
      handleAddCard,
      getBoardsToClear,
      boards: boardsObj,
      createBoard,
      updateBoard,
      deleteBoard,
      activeBoardTitle: getActiveBoardTitle(
        Object.values(boardsObj),
        activeBoard
      ),
      activeBoardCardCount,
    }),
    [
      activeBoard,
      setActiveBoard,
      activeBoardColumns,
      orderedCards,
      handleAddCard,
      getBoardsToClear,
      boardsObj,
      createBoard,
      updateBoard,
      deleteBoard,
      activeBoardCardCount,
    ]
  );

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  );
}

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context)
    throw new Error("useBoardContext deve ser usado dentro de BoardProvider");
  return context;
};
