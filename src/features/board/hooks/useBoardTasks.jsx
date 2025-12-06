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
  activeView,
  openModal
}) {
  const orderedGlobal = useMemo(() => [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [tasks]);

  const activeGroupId = syncedBoardsMap[activeView] ?? activeView;
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
        const displayColumnId = t.boardId === activeView ? t.columnId : getMirrorColumnIdSafe(activeView, t.columnId);
        const displayStatus = getDisplayStatus(displayColumnId, activeView);
        return {
          ...t,
          displayColumnId,
          displayStatus,
        };
      });
  }, [orderedGlobal, activeView, activeGroupId]);

  // Adiciona nova task e abre modal
  const handleAddTask = useCallback((columnId = null) => {
    const viewColumns = columns?.[activeView] ?? [];
    const fallbackColumnId = viewColumns[0]?.id ?? null;
    const chosenColumnId = columnId ?? fallbackColumnId;

    const otherBoard = Object.keys(syncedBoardsMap).find(b => b !== activeView && (syncedBoardsMap[b] ?? b) === (syncedBoardsMap[activeView] ?? activeView));
    const mirroredColumnId = otherBoard ? getMirrorColumnIdSafe(otherBoard, chosenColumnId) : null;

    const newTask = addTask(chosenColumnId, { boardId: activeView, mirroredColumnId });
    openModal(CardModal, {
      task: { ...newTask, isNew: true },
      activeView,
      columns: columns[activeView],
      moveTask,
    });
  }, [addTask, activeView, columns, openModal, moveTask]);

  const handleClearBoard = useCallback(() => {
    const groupId = syncedBoardsMap[activeView] ?? activeView;

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
  }, [orderedGlobal, activeView, clearTasks]);

  const handleTaskClick = useCallback((task) => {
    openModal(CardModal, {
      task,
      activeView,
      columns: columns[activeView],
      moveTask,
    });
  }, [activeView, columns, moveTask, openModal]);

  const activeBoardTaskCount = useMemo(() => {
    const countBoardId = syncedBoardsMap[activeView] ?? activeView;
    return orderedGlobal.filter(
      t => (syncedBoardsMap[t.boardId] ?? t.boardId) === countBoardId
    ).length;
  }, [orderedGlobal, activeView]);

  return { orderedTasks, handleAddTask, handleClearBoard, handleTaskClick, activeBoardTaskCount };
}
