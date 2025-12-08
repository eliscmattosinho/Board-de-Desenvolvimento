import { useMemo, useCallback } from "react";
import { showWarning, showCustom, showSuccess } from "@utils/toastUtils";
import ClearBoardToast from "@components/ToastProvider/toasts/ClearBoardToast";
import CardModal from "@card/components/CardModal/CardModal";
import { syncedBoardsMap } from "@board/utils/boardSyncUtils";
import { getMirrorColumnIdSafe, getDisplayStatus } from "@board/components/templates/templateMirror";

export function useBoardTasks({
  tasks,
  addTask,
  moveTask,
  clearTasks,
  columns,
  activeBoard,
  openModal
}) {
  const orderedGlobal = useMemo(() => [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [tasks]);

  const activeGroupId = syncedBoardsMap[activeBoard] ?? activeBoard;
  const boardsInGroup = useMemo(() => {
    return Object.keys(syncedBoardsMap).filter(b => (syncedBoardsMap[b] ?? b) === activeGroupId);
  }, [activeGroupId]);

  const orderedTasks = useMemo(() => {
    return orderedGlobal
      .filter(t => {
        const tGroup = syncedBoardsMap[t.boardId] ?? t.boardId;
        return tGroup === activeGroupId;
      })
      .map(t => {
        const displayColumnId = t.boardId === activeBoard ? t.columnId : getMirrorColumnIdSafe(activeBoard, t.columnId);
        const displayStatus = getDisplayStatus(displayColumnId, activeBoard);
        return {
          ...t,
          displayColumnId,
          displayStatus,
        };
      });
  }, [orderedGlobal, activeBoard, activeGroupId]);

  // Adiciona nova task e abre modal
  const handleAddTask = useCallback((columnId = null) => {
    const viewColumns = columns?.[activeBoard] ?? [];
    const fallbackColumnId = viewColumns[0]?.id ?? null;
    const chosenColumnId = columnId ?? fallbackColumnId;

    const otherBoard = Object.keys(syncedBoardsMap).find(b => b !== activeBoard && (syncedBoardsMap[b] ?? b) === (syncedBoardsMap[activeBoard] ?? activeBoard));
    const mirroredColumnId = otherBoard ? getMirrorColumnIdSafe(otherBoard, chosenColumnId) : null;

    const newTask = addTask(chosenColumnId, { boardId: activeBoard, mirroredColumnId });
    openModal(CardModal, {
      task: { ...newTask, isNew: true },
      activeBoard,
      columns: columns[activeBoard],
      moveTask,
    });
  }, [addTask, activeBoard, columns, openModal, moveTask]);

  const handleClearBoard = useCallback(() => {
    const groupId = syncedBoardsMap[activeBoard] ?? activeBoard;

    const boardTasks = orderedGlobal.filter(
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
  }, [orderedGlobal, activeBoard, clearTasks]);

  const handleTaskClick = useCallback((task) => {
    openModal(CardModal, {
      task,
      activeBoard,
      columns: columns[activeBoard],
      moveTask,
    });
  }, [activeBoard, columns, moveTask, openModal]);

  const activeBoardTaskCount = useMemo(() => {
    const countBoardId = syncedBoardsMap[activeBoard] ?? activeBoard;
    return orderedGlobal.filter(
      t => (syncedBoardsMap[t.boardId] ?? t.boardId) === countBoardId
    ).length;
  }, [orderedGlobal, activeBoard]);

  return { orderedTasks, handleAddTask, handleClearBoard, handleTaskClick, activeBoardTaskCount };
}
