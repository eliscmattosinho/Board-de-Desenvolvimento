import { createContext, useContext, useMemo } from "react";
import { useTasks } from "@task/context/TaskProvider";
import { useModal } from "@context/ModalContext";
import useColumns from "@board/hooks/useColumns";

import { useBoardState } from "@board/hooks/useBoardState";
import { useBoardDrag } from "@board/hooks/useBoardDrag";
import { useBoardTasks } from "@board/hooks/useBoardTasks";
import { useColumnModal } from "@column/hooks/useColumnModal";

import boardTemplates from "@board/components/templates/boardTemplate";

const BoardContext = createContext(null);

/**
 * Context provider que centraliza toda a lógica do board:
 * - Gerenciamento de boards ativos
 * - Gestão de colunas e tasks
 * - Drag & drop
 * - Abertura de modais para tarefas e colunas
 * - Limpeza de boards sincronizados
 */
export function BoardProvider({ children }) {
    const { openModal } = useModal();
    const { tasks, addTask, moveTask, clearTasks } = useTasks();

    // Colunas do board
    const [columns, addColumn, renameColumn, removeColumn] =
        useColumns(boardTemplates.kanban, boardTemplates.scrum);

    // Boards sincronizados
    const syncedBoardsMap = useMemo(
        () => ({ kanban: "shared", scrum: "shared" }),
        []
    );

    // Boards e view ativa
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
        syncedBoardsMap
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

    // Memoriza o valor do contexto para evitar re-renderizações desnecessárias
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
            activeBoardTaskCount
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
            activeBoardTaskCount
        ]
    );

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
