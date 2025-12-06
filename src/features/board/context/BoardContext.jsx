import { createContext, useContext, useMemo } from "react";
import { useTasks } from "@task/context/TaskContext";
import { useColumnsContext } from "@column/context/ColumnContext";
import { useModal } from "@context/ModalContext";
import { useBoardState } from "@board/hooks/useBoardState";
import { useBoardDrag } from "@board/hooks/useBoardDrag";
import { useBoardTasks } from "@board/hooks/useBoardTasks";
import { useColumnModal } from "@column/hooks/useColumnModal";
import { getActiveBoardTitle } from "@board/utils/boardUtils";
import { syncedBoardsMap } from "@board/utils/boardSyncUtils"

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
    const { tasks, addTask, moveTask, clearTasks } = useTasks();
    const { columns, addColumn, removeColumn, updateColumnInfo, updateColumnStyle } = useColumnsContext();
    const { openModal } = useModal();

    const { boards, activeView, setActiveView, createBoard } = useBoardState(
        [
            { id: "kanban", title: "Kanban" },
            { id: "scrum", title: "Scrum" },
        ],
        columns
    );

    // Drag & Drop
    const { allowDrop, handleDragStart, handleDrop } = useBoardDrag(moveTask);

    // Tasks
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
        activeView,
        openModal,
        syncedBoardsMap,
    });

    // Colunas e modal
    const { handleAddColumn } = useColumnModal({
        columns,
        addColumn,
        updateColumnInfo,
        updateColumnStyle,
        openModal,
        activeView,
        boards,
    });

    // Título do board ativo
    const activeBoardTitle = getActiveBoardTitle(boards, activeView);

    const contextValue = useMemo(
        () => ({
            activeView,
            setActiveView,
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
            activeBoardTitle,
            activeBoardTaskCount,
            openModal,
        }),
        [
            activeView,
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
            activeBoardTitle,
            activeBoardTaskCount,
            openModal,
        ]
    );

    return <BoardContext.Provider value={contextValue}>{children}</BoardContext.Provider>;
}

export const useBoardContext = () => {
    const ctx = useContext(BoardContext);
    if (!ctx) throw new Error("useBoardContext must be used inside BoardProvider");
    return ctx;
};
