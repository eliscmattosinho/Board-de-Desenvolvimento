import { createContext, useContext, useMemo } from "react";

import { useTasksContext } from "@task/context/TaskContext";
import { useColumnsContext } from "@column/context/ColumnContext";
import { useModal } from "@context/ModalContext";

import { useBoardState } from "@board/hooks/useBoardState";
import { useBoardDrag } from "@board/hooks/useBoardDrag";
import { useBoardTasks } from "@board/hooks/useBoardTasks";
import { useColumnModal } from "@column/hooks/useColumnModal";
import { useBoardActions } from "./boardActions";

import { getActiveBoardTitle } from "@board/utils/boardUtils";

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
    // Tasks
    const { tasks, addTask, moveTask, clearTasks } = useTasksContext();

    // Cols
    const {
        columns,
        addColumn,
        removeColumn,
        updateColumnInfo,
        updateColumnStyle,
    } = useColumnsContext();

    const { openModal } = useModal();

    // Estado dos boards
    const { state, dispatch, boards, activeBoard } =
        useBoardState({ initialGroup: "shared", columns });

    const {
        createBoard,
        updateBoard,
        deleteBoard,
        setActiveBoard,
    } = useBoardActions(state, dispatch);

    // Drag & Drop
    const { allowDrop, handleDragStart, handleDrop } = useBoardDrag({
        moveTask,
        activeBoard,
    });

    // Tasks visíveis no board ativo
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

    // Modal de colunas
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
     * Delete de board
     * - remove colunas do board
     * - limpa tasks do board
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

    // Context value
    const contextValue = useMemo(
        () => ({
            activeBoard,
            setActiveBoard,

            columns,
            orderedTasks,

            allowDrop,
            handleDragStart,
            handleDrop,

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
            allowDrop,
            handleDragStart,
            handleDrop,
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

// Hook público
export const useBoardContext = () => {
    const ctx = useContext(BoardContext);
    if (!ctx) {
        throw new Error("useBoardContext must be used inside BoardProvider");
    }
    return ctx;
};
