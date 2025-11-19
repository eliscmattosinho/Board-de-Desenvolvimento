import { useMemo, useCallback } from "react";
import { showWarning, showCustom, showSuccess } from "@utils/toastUtils";
import ClearBoardToast from "@components/ToastProvider/toasts/ClearBoardToast";
import CardModal from "@card/components/CardModal/CardModal";

export function useBoardTasks({
    tasks,
    addTask,
    moveTask,
    clearTasks,
    columns,
    activeView,
    openModal,
    syncedBoardsMap
}) {
    const orderedTasks = useMemo(() => [...tasks].sort((a, b) => a.order - b.order), [tasks]);

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

    const activeBoardTaskCount = useMemo(() => {
        const countBoardId = syncedBoardsMap[activeView] ?? activeView;
        return orderedTasks.filter(
            t => (syncedBoardsMap[t.boardId] ?? t.boardId) === countBoardId
        ).length;
    }, [orderedTasks, activeView, syncedBoardsMap]);

    return { orderedTasks, handleAddTask, handleClearBoard, handleTaskClick, activeBoardTaskCount };
}
