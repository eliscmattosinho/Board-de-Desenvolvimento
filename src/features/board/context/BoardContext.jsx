import { createContext, useContext, useMemo } from "react";

import { useTasks } from "@task/context/TaskContext";
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
    const { tasks, addTask, moveTask, clearTasks } = useTasks();
    const { columns, addColumn, removeColumn, updateColumnInfo, updateColumnStyle } =
        useColumnsContext();
    const { openModal } = useModal();

    const { state, dispatch, boards, activeBoard } =
        useBoardState({ initialGroup: "shared", columns });

    const {
        createBoard,
        updateBoard,
        deleteBoard,
        setActiveBoard
    } = useBoardActions(state, dispatch);

    const { allowDrop, handleDragStart, handleDrop } = useBoardDrag(moveTask);

    const {
        orderedTasks,
        handleAddTask,
        handleClearBoard,
        handleTaskClick,
        activeBoardTaskCount
    } = useBoardTasks({
        tasks,
        addTask,
        moveTask,
        clearTasks,
        columns,
        activeBoard,
        openModal
    });

    const { handleAddColumn } = useColumnModal({
        columns,
        addColumn,
        updateColumnInfo,
        updateColumnStyle,
        openModal,
        activeBoard,
        boards
    });

    const activeBoardTitle = getActiveBoardTitle(boards, activeBoard);

    // sincronização ao deletar board (colunas e tasks por board)
    const handleDeleteBoard = (boardId) => {
        deleteBoard(boardId, () => {
            removeColumn((col) => col.boardId === boardId);
            clearTasks({ boardId });
        });
    };

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
            openModal
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
            deleteBoard,
            activeBoardTitle,
            activeBoardTaskCount,
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
    if (!ctx) throw new Error("useBoardContext must be used inside BoardProvider");
    return ctx;
};
