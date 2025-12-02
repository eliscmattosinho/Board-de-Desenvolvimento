import { createContext, useContext, useMemo } from "react";
import { useTasks } from "@task/context/TaskContext";
import { useModal } from "@context/ModalContext";
import { useBoardState } from "@board/hooks/useBoardState";
import { useBoardDrag } from "@board/hooks/useBoardDrag";
import { useBoardTasks } from "@board/hooks/useBoardTasks";
import { useColumnModal } from "@column/hooks/useColumnModal";
import { useColumnsContext } from "@column/context/ColumnContext";

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
    const { openModal } = useModal();
    const { tasks, addTask, moveTask, clearTasks } = useTasks();
    const { columns, addColumn, renameColumn, removeColumn } = useColumnsContext();

    const { boards, activeView, setActiveView, createBoard } = useBoardState(
        [
            { id: "kanban", title: "Kanban" },
            { id: "scrum", title: "Scrum" }
        ],
        columns
    );

    // Drag & Drop de tasks
    const { allowDrop, handleDragStart, handleDrop } = useBoardDrag(moveTask);

    // Tasks
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
        activeView,
        openModal,
        syncedBoardsMap: { kanban: "shared", scrum: "shared" }
    });

    // Colunas
    const { handleAddColumn, activeBoardTitle } = useColumnModal({
        columns,
        addColumn,
        renameColumn,
        openModal,
        activeView,
        boards
    });

    const contextValue = useMemo(() => ({
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
        activeBoardTaskCount
    }), [
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
        activeBoardTaskCount
    ]);

    return (
        <BoardContext.Provider value={contextValue}>
            {children}
        </BoardContext.Provider>
    );
}

export function useBoardContext() {
    const ctx = useContext(BoardContext);
    if (!ctx) throw new Error("useBoardContext must be used inside BoardProvider");
    return ctx;
}
