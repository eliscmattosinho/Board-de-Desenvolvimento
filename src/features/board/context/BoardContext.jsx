import { createContext, useContext, useMemo, useCallback } from "react";

import { useTasksContext } from "@task/context/TaskContext";
import { useColumnsContext } from "@column/context/ColumnContext";
import { useModal } from "@context/ModalContext";

import { useBoardState } from "@board/hooks/useBoardState";
import { useBoardTasks } from "@board/hooks/useBoardTasks";
import { useColumnModal } from "@column/hooks/useColumnModal";
import { useBoardActions } from "./boardActions";

import { useCardDrag } from "@board/context/CardDragContext";

import { getActiveBoardTitle } from "@board/utils/boardUtils";

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  /**
   * Tasks
   */
  const { tasks, addTask, moveTask, clearTasks } = useTasksContext();

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

    const { taskId, target } = result;
    moveTask(taskId, target);
  }, [commitDrop, moveTask]);

  /**
   * Tasks visíveis no board ativo
   */
  const {
    orderedTasks,
    handleAddTask,
    handleClearBoard,
    handleTaskClick,
    activeBoardTaskCount,
  } = useBoardTasks({
    tasks,
    addTask,
    moveTask,
    clearTasks,
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
   * - clear tasks
   */
  const handleDeleteBoard = (boardId) => {
    deleteBoard(boardId, () => {
      const boardColumns = columns?.[boardId] ?? [];

      boardColumns.forEach((col) => {
        removeColumn(boardId, col.id);
      });

      clearTasks({ boardId });
    });
  };

  const contextValue = useMemo(
    () => ({
      activeBoard,
      setActiveBoard,

      columns,
      orderedTasks,

      // Pointer-based drop commit (domain-aware)
      commitDrop: handleCommitDrop,

      handleAddTask,
      handleClearBoard,
      handleTaskClick,

      handleAddColumn,
      removeColumn,

      boards,
      createBoard,
      updateBoard,
      deleteBoard: handleDeleteBoard,

      activeBoardTitle,
      activeBoardTaskCount,
      openModal,
    }),
    [
      activeBoard,
      columns,
      orderedTasks,
      handleCommitDrop,
      handleAddTask,
      handleClearBoard,
      handleTaskClick,
      handleAddColumn,
      removeColumn,
      boards,
      createBoard,
      updateBoard,
      activeBoardTitle,
      activeBoardTaskCount,
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
