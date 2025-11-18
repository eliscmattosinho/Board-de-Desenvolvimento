import { createContext, useContext, useMemo, useCallback, useState } from "react";
import { useTasks } from "@board/context/TasksContext";
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

    // Lista de boards disponíveis
    const [boards, setBoards] = useState([
        { id: "kanban", title: "Kanban" },
        { id: "scrum", title: "Scrum" }
    ]);

    // Board ativo
    const [activeView, setActiveView] = useState("kanban");

    // Armazena colunas
    const [columns, addColumn, renameColumn, removeColumn] =
        useColumns(kanbanTemplate, scrumTemplate);

    // Cria um board novo
    const createBoard = useCallback((title) => {
        const id = title.toLowerCase().replace(/\s+/g, "-");
        if (boards.find((b) => b.id === id)) return;

        setBoards((prev) => [...prev, { id, title }]);
        columns[id] = []; // Inicializa colunas vazias
        setActiveView(id);
    }, [boards, columns]);

    // Drag & Drop
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

    const orderedTasks = useMemo(() => [...tasks].sort((a, b) => a.order - b.order), [tasks]);

    const handleAddTask = useCallback(
        (columnId = null) => {
            const newTask = addTask(columnId);

            openModal(CardModal, {
                task: { ...newTask, isNew: true },
                activeView,
                columns: columns[activeView],
                moveTask,
            });
        },
        [addTask, activeView, columns, moveTask, openModal]
    );

    const handleClearBoard = useCallback(() => {
        if (tasks.length === 0) {
            showWarning("Não há tarefas para remover — o board já está vazio!");
            return;
        }

        showCustom(({ closeToast }) => (
            <ClearBoardToast
                onConfirm={() => {
                    clearTasks();
                    closeToast();
                    showSuccess("Todas as tarefas foram removidas com sucesso!");
                }}
                onCancel={closeToast}
            />
        ));
    }, [tasks.length, clearTasks]);

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
