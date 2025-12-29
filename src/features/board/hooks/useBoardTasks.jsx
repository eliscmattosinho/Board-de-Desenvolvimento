import { useMemo, useCallback } from "react";
import { showWarning, showCustom, showSuccess } from "@utils/toastUtils";
import ClearBoardToast from "@components/ToastProvider/toasts/ClearBoardToast";
import CardModal from "@card/components/CardModal/CardModal";
import { syncedBoardsMap } from "@board/utils/boardSyncUtils";
import { getDisplayStatus } from "@board/components/templates/taskBoardResolver";

export function useBoardTasks({
  tasks,
  addTask,
  moveTask,
  clearTasks,
  columns,
  activeBoard,
  openModal,
}) {
  const activeGroupId = syncedBoardsMap[activeBoard] ?? null;
  const isSharedBoard = Boolean(activeGroupId);

  const orderedTasks = useMemo(() => {
    const visible = tasks.filter((t) => {
      if (isSharedBoard) {
        return (syncedBoardsMap[t.boardId] ?? null) === activeGroupId;
      }
      return t.boardId === activeBoard;
    });

    return visible
      .map((t) => {
        const displayColumnId =
          !isSharedBoard
            ? t.columnId
            : t.boardId === activeBoard
              ? t.columnId
              : t.mirrorColId;

        return {
          ...t,
          displayColumnId,
          displayStatus: getDisplayStatus(displayColumnId, activeBoard),
        };
      })
      .sort((a, b) => {
        if (a.displayColumnId < b.displayColumnId) return -1;
        if (a.displayColumnId > b.displayColumnId) return 1;
        return (a.order ?? 0) - (b.order ?? 0);
      });
  }, [tasks, activeBoard, isSharedBoard, activeGroupId]);

  const handleAddTask = useCallback(
    (columnId = null) => {
      const viewColumns = columns?.[activeBoard] ?? [];
      const fallbackColumnId = viewColumns[0]?.id ?? null;
      const chosenColumnId = columnId ?? fallbackColumnId;

      const newTask = addTask(chosenColumnId, {
        boardId: activeBoard,
      });

      openModal(CardModal, {
        task: { ...newTask, isNew: true },
        activeBoard,
        columns: viewColumns,
        moveTask,
      });
    },
    [addTask, activeBoard, columns, moveTask, openModal]
  );

  const handleClearBoard = useCallback(() => {
    const groupId = syncedBoardsMap[activeBoard] ?? null;
    const isShared = Boolean(groupId);

    const boardTasks = tasks.filter((t) =>
      isShared
        ? (syncedBoardsMap[t.boardId] ?? null) === groupId
        : t.boardId === activeBoard
    );

    if (boardTasks.length === 0) {
      showWarning("Não há tarefas para remover — o board já está vazio!");
      return;
    }

    showCustom(({ closeToast }) => (
      <ClearBoardToast
        onConfirm={() => {
          isShared
            ? clearTasks({ groupId })
            : clearTasks({ boardId: activeBoard });
          closeToast();
          showSuccess("Todas as tarefas foram removidas com sucesso!");
        }}
        onCancel={closeToast}
      />
    ));
  }, [tasks, activeBoard, clearTasks]);

  const handleTaskClick = useCallback(
    (task) => {
      openModal(CardModal, {
        task: {
          ...task,
          columnId: task.displayColumnId ?? task.columnId ?? null,
        },
        activeBoard,
        columns: columns?.[activeBoard] ?? [],
        moveTask,
      });
    },
    [activeBoard, columns, moveTask, openModal]
  );

  const activeBoardTaskCount = useMemo(() => {
    return orderedTasks.length;
  }, [orderedTasks]);

  return {
    orderedTasks,
    handleAddTask,
    handleClearBoard,
    handleTaskClick,
    activeBoardTaskCount,
  };
}
