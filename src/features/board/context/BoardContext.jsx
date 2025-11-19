import { createContext, useContext, useMemo, useCallback, useState } from "react";
import { useTasks } from "@task/context/TaskProvider";
import { useModal } from "@context/ModalContext";
import useColumns from "@board/hooks/useColumns";

import { columnIdToCanonicalStatus } from "@board/utils/boardUtils";
import { showWarning, showCustom, showSuccess } from "@utils/toastUtils";

import CardModal from "@card/components/CardModal/CardModal";
import ColumnModal from "@column/components/ColumnModal/ColumnModal";
import ClearBoardToast from "@components/ToastProvider/toasts/ClearBoardToast";

import kanbanTemplate from "@board/components/templates/kanbanTemplate";
import scrumTemplate from "@board/components/templates/scrumTemplate";

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
    const { openModal } = useModal();
    const { tasks, addTask, moveTask, clearTasks } = useTasks();

    const [boards, setBoards] = useState([
        { id: "kanban", title: "Kanban" },
        { id: "scrum", title: "Scrum" }
    ]);

    const [activeView, setActiveView] = useState("kanban");

    const [columns, addColumn, renameColumn, removeColumn] =
        useColumns(kanbanTemplate, scrumTemplate);

    // Mapeamento para boards sincronizados (contagem e limpeza compartilhada)
    const syncedBoardsMap = {
        kanban: "shared",
        scrum: "shared",
    };

    // Criar novo board
    const createBoard = useCallback((title) => {
        const id = title.toLowerCase().replace(/\s+/g, "-");
        if (boards.find((b) => b.id === id)) return;

        setBoards((prev) => [...prev, { id, title }]);
        columns[id] = []; // Inicializa colunas vazias
        setActiveView(id);
    }, [boards, columns]);

    const allowDrop = useCallback((e) => e.preventDefault(), []);

    const handleDragStart = useCallback(
        (e, taskId) => e.dataTransfer.setData("text/plain", taskId),
        []
    );

    const handleDrop = useCallback(
        (e, columnId, targetTaskId = null) => {
            e.preventDefault();
            const taskId = e.dataTransfer.getData("text/plain");
            if (!taskId) return;

            const canonicalStatus = columnIdToCanonicalStatus(columnId);
            moveTask(taskId, canonicalStatus, targetTaskId);
        },
        [moveTask]
    );

    // Ordena tasks
    const orderedTasks = useMemo(
        () => [...tasks].sort((a, b) => a.order - b.order),
        [tasks]
    );

    // Add task
    const handleAddTask = useCallback(
        (columnId = null) => {
            const newTask = addTask(columnId, { boardId: activeView });

            openModal(CardModal, {
                task: { ...newTask, isNew: true },
                activeView,
                columns: columns[activeView],
                moveTask,
            });
        },
        [addTask, activeView, columns, moveTask, openModal]
    );

    // Limpar board usando grupo sincronizado
    const handleClearBoard = useCallback(() => {
        const groupId = syncedBoardsMap[activeView] ?? activeView;

        const boardTasks = orderedTasks.filter(
            t => (syncedBoardsMap[t.boardId] ?? t.boardId) === groupId
        );

        if (boardTasks.length === 0) {
            showWarning("Não há tarefas para remover — o board já está vazio!");
            return;
        }

        showCustom(({ closeToast }) => (
            <ClearBoardToast
                onConfirm={() => {
                    clearTasks(groupId);
                    closeToast();
                    showSuccess("Todas as tarefas foram removidas com sucesso!");
                }}
                onCancel={closeToast}
            />
        ));
    }, [orderedTasks, activeView, clearTasks, syncedBoardsMap]);

    const handleTaskClick = useCallback(
        (task) => {
            openModal(CardModal, {
                task,
                activeView,
                columns: columns[activeView],
                moveTask,
            });
        },
        [activeView, columns, moveTask, openModal]
    );

    const handleAddColumn = useCallback(
        (index, column) => {
            openModal(ColumnModal, {
                mode: column ? "edit" : "create",
                columnData: column,
                onSave: (data) => {
                    if (column) renameColumn(activeView, column.id, data);
                    else addColumn(activeView, index, data);
                },
            });
        },
        [activeView, renameColumn, addColumn, openModal]
    );

    // Propriedades derivadas
    const activeBoardTitle = useMemo(() => {
        return columns[activeView]?.title
            ?? boards.find(b => b.id === activeView)?.title
            ?? activeView;
    }, [columns, boards, activeView]);

    const activeBoardTaskCount = useMemo(() => {
        const countBoardId = syncedBoardsMap[activeView] ?? activeView;

        return orderedTasks.filter(
            t => (syncedBoardsMap[t.boardId] ?? t.boardId) === countBoardId
        ).length;
    }, [orderedTasks, activeView, syncedBoardsMap]);

    return (
        <BoardContext.Provider
            value={{
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
            }}
        >
            {children}
        </BoardContext.Provider>
    );
}

export function useBoardContext() {
    const ctx = useContext(BoardContext);
    if (!ctx) throw new Error("useBoardContext must be used inside BoardProvider");
    return ctx;
}
