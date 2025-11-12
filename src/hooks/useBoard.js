import { useCallback, useMemo, useState } from "react";
import { useTasks } from "../context/TasksContext";
import { useModal } from "../context/ModalContext";
import useColumns from "./useColumns";
import { columnIdToCanonicalStatus } from "../utils/boardUtils";
import { showWarning, showCustom, showSuccess } from "../utils/toastUtils";
import CardModal from "../components/Card/CardModal/CardModal";
import ColumnModal from "../components/Column/ColumnModal/ColumnModal";
import ClearBoardToast from "../components/ToastProvider/toasts/ClearBoardToast";

export default function useBoard(kanbanTemplate, scrumTemplate) {
    const [activeView, setActiveView] = useState("kanban");
    const { openModal } = useModal();
    const { tasks, addTask, moveTask, clearTasks } = useTasks();

    // Inicializa colunas com os templates
    const [columns, addColumn, renameColumn, removeColumn] = useColumns(kanbanTemplate, scrumTemplate);

    const allowDrop = useCallback((e) => e.preventDefault(), []);
    const handleDragStart = useCallback((e, taskId) => e.dataTransfer.setData("text/plain", taskId), []);

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
                    if (column) {
                        renameColumn(activeView, column.id, data);
                    } else {
                        addColumn(activeView, index, data);
                    }
                },
            });
        },
        [activeView, renameColumn, addColumn, openModal]
    );

    return {
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
    };
}
